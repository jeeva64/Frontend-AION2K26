"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { selectClass } from "@/components/ui/select-classes";
import { FoodBadge } from "@/components/dashboard/food-badge";
import {
  DEGREES,
  EVENT_CONFIG,
  FOOD_PREFERENCES,
  SLOT_1_EVENTS,
  SLOT_2_EVENTS,
  type Degree,
  type EventName,
} from "@/lib/constants";
import { ApiError, NetworkError } from "@/lib/api-client";
import {
  checkParticipantConflict,
  getTeamLimitExceededMessage,
} from "@/lib/candidate";
import type { RegisteredStudent, Student } from "@/lib/types";
import { registerTeam } from "@/services/team";

const SLOT_1_TIME =
  EVENT_CONFIG[SLOT_1_EVENTS.find((e) => EVENT_CONFIG[e].slot === "1")!].time;
const SLOT_2_TIME =
  EVENT_CONFIG[SLOT_2_EVENTS.find((e) => EVENT_CONFIG[e].slot === "2")!].time;

const memberSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  registerNumber: z.string().trim().min(1, "Register number is required"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Valid 10-digit number starting with 6, 7, 8 or 9"),
  degree: z.enum(DEGREES, { message: "Select a degree" }),
  foodPreference: z.enum(FOOD_PREFERENCES).optional(),
});

const teamFormSchema = z.object({
  members: z.array(memberSchema),
});

type TeamFormValues = z.infer<typeof teamFormSchema>;

interface TeamRegistrationFormProps {
  leaderId: string;
  token: string;
  studentMap: Record<string, RegisteredStudent>;
  registeredEvents: EventName[];
  totalStudents: number;
  registrationDeadline?: string | null;
  onRegistered: () => void;
  onUnauthorized: () => void;
}

function deadlinePassed(deadline: string | undefined | null): boolean {
  if (!deadline) return false;
  return Date.now() > new Date(deadline).getTime();
}

function emptyMembers(count: number): TeamFormValues["members"] {
  return Array.from({ length: count }, () => ({
    name: "",
    registerNumber: "",
    mobile: "",
    degree: "" as Degree,
    foodPreference: undefined,
  }));
}

function eventOption(event: EventName, registered: boolean) {
  const config = EVENT_CONFIG[event];
  const label = `${event} (${config.participants} ${
    config.participants === 1 ? "participant" : "participants"
  })${registered ? " ✓ Registered" : ""}`;
  return (
    <option key={event} value={event} disabled={registered}>
      {label}
    </option>
  );
}

export function TeamRegistrationForm({
  leaderId,
  token,
  studentMap,
  registeredEvents,
  totalStudents,
  registrationDeadline,
  onRegistered,
  onUnauthorized,
}: TeamRegistrationFormProps) {
  const [selectedEvent, setSelectedEvent] = useState<"" | EventName>("");
  const [conflictWarnings, setConflictWarnings] = useState<
    Record<number, string | null>
  >({});
  const [existingByIndex, setExistingByIndex] = useState<
    Record<number, RegisteredStudent | null>
  >({});

  const [isClosed, setIsClosed] = useState(() =>
    deadlinePassed(registrationDeadline)
  );

  useEffect(() => {
    setIsClosed(deadlinePassed(registrationDeadline));
    if (!registrationDeadline) return;
    const interval = setInterval(() => {
      setIsClosed(deadlinePassed(registrationDeadline));
    }, 60000);
    return () => clearInterval(interval);
  }, [registrationDeadline]);

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: { members: [] },
  });

  const handleEventChange = (value: string) => {
    if (!value) {
      setSelectedEvent("");
      reset({ members: [] });
      return;
    }
    const event = value as EventName;
    setSelectedEvent(event);
    setConflictWarnings({});
    setExistingByIndex({});
    reset({ members: emptyMembers(EVENT_CONFIG[event].participants) });
  };

  const handleRegNumberBlur = (index: number) => {
    if (!selectedEvent) return;
    const reg = getValues(`members.${index}.registerNumber`)?.trim();
    if (!reg) return;

    const student = studentMap[reg] ?? null;
    const conflict = checkParticipantConflict(student ?? undefined, selectedEvent);
    setExistingByIndex((prev) => ({ ...prev, [index]: student }));
    setConflictWarnings((prev) => ({
      ...prev,
      [index]: conflict.hasConflict ? conflict.message : null,
    }));
  };

  const onSubmit = async (values: TeamFormValues) => {
    if (isClosed) {
      toast.error("Registrations are closed — the deadline has passed.");
      return;
    }
    if (!selectedEvent) {
      toast.error("Please select an event!");
      return;
    }
    if (registeredEvents.includes(selectedEvent)) {
      toast.error(
        `Your team is already registered for ${selectedEvent}. Only one team per event is allowed.`
      );
      return;
    }

    const cleanMembers: Student[] = [];
    const regNumbers: string[] = [];
    let newStudents = 0;

    for (let i = 0; i < values.members.length; i++) {
      const member = values.members[i];
      const name = member.name.trim();
      const registerNumber = member.registerNumber.trim();

      const conflict = checkParticipantConflict(
        existingByIndex[i] ?? undefined,
        selectedEvent
      );
      if (conflict.hasConflict) {
        toast.error(
          `${name || `Member ${i + 1}`} (${registerNumber}): ${conflict.message}`
        );
        return;
      }

      let foodPreference: Student["foodPreference"];
      if (!existingByIndex[i]) {
        if (!member.foodPreference) {
          toast.error(`Please select a food preference for Member ${i + 1} (${name}).`);
          return;
        }
        foodPreference = member.foodPreference;
        newStudents++;
      }

      regNumbers.push(registerNumber);
      const participant: Student = {
        name,
        registerNumber,
        mobile: member.mobile.trim(),
        degree: member.degree,
      };
      if (foodPreference) {
        participant.foodPreference = foodPreference;
      }
      cleanMembers.push(participant);
    }

    const dups = regNumbers.filter((r, i) => regNumbers.indexOf(r) !== i);
    if (dups.length) {
      toast.error(`Duplicate register numbers in the form: ${[...new Set(dups)].join(", ")}`);
      return;
    }

    const limitMessage = getTeamLimitExceededMessage(totalStudents, newStudents);
    if (limitMessage) {
      toast.error(limitMessage);
      return;
    }

    try {
      await registerTeam(
        { leaderId, event: selectedEvent, participants: cleanMembers },
        token
      );
      toast.success(
        `Team registered for ${selectedEvent}. Click "Pay Now" on the dashboard to complete your payment.`
      );
      setSelectedEvent("");
      setConflictWarnings({});
      setExistingByIndex({});
      reset({ members: [] });
      onRegistered();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        onUnauthorized();
      } else if (error instanceof ApiError) {
        toast.error(error.message || "Registration failed");
      } else if (error instanceof NetworkError) {
        toast.error(error.message);
      } else {
        toast.error(error instanceof Error ? error.message : "Registration failed");
      }
    }
  };

  const config = selectedEvent ? EVENT_CONFIG[selectedEvent] : null;

  return (
    <div className="rounded-2xl border-2 border-[#e0e7ff] bg-[linear-gradient(135deg,rgba(102,126,234,0.05)_0%,rgba(118,75,162,0.05)_100%)] p-6 shadow-lg backdrop-blur">
      <h2 className="mb-6 text-center text-3xl font-bold">Register New Team</h2>

      {isClosed && (
        <div
          role="alert"
          className="mb-6 rounded-lg border-l-4 border-red-400 bg-red-50 p-4 text-sm text-red-800"
        >
          <strong>Registration Closed</strong> — the registration deadline has
          passed. Contact an organizer to register your team.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Field>
          <FieldLabel htmlFor="eventSelect">Select Event</FieldLabel>
          <select
            id="eventSelect"
            value={selectedEvent}
            onChange={(e) => handleEventChange(e.target.value)}
            disabled={isClosed}
            className={selectClass}
          >
            <option value="">-- Choose Event --</option>
            <optgroup label={`Slot 1 (${SLOT_1_TIME})`}>
              {SLOT_1_EVENTS.map((event) =>
                eventOption(event, registeredEvents.includes(event))
              )}
            </optgroup>
            <optgroup label={`Slot 2 (${SLOT_2_TIME})`}>
              {SLOT_2_EVENTS.map((event) =>
                eventOption(event, registeredEvents.includes(event))
              )}
            </optgroup>
          </select>
        </Field>

        {config && (
          <div className="mt-6">
            <div className="mb-4 flex items-center gap-2 rounded-xl border-2 border-[#e0e7ff] bg-[linear-gradient(135deg,#667eea15_0%,#764ba215_100%)] p-4">
              <span className="text-2xl">👥</span>
              <h3 className="text-lg font-bold">Team Members for {selectedEvent}</h3>
              <span className="text-sm font-normal text-slate-600">
                ({config.participants}{" "}
                {config.participants === 1 ? "participant" : "participants"})
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: config.participants }).map((_, index) => {
                const existingStudent = existingByIndex[index] ?? null;
                const isExisting = existingStudent !== null;
                const conflictWarning = conflictWarnings[index] ?? null;
                const memberError = errors.members?.[index];
                return (
                  <div
                    key={index}
                    className="space-y-2 rounded-xl border border-slate-200 bg-white/60 p-4"
                  >
                    <Field>
                      <FieldLabel htmlFor={`participant_name_${index}`}>
                        {config.participants === 1 ? "Participant" : `Member ${index + 1}`} Name *
                      </FieldLabel>
                      <Controller
                        control={control}
                        name={`members.${index}.name`}
                        render={({ field }) => (
                          <Input
                            id={`participant_name_${index}`}
                            type="text"
                            placeholder="Enter full name"
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            aria-invalid={!!memberError?.name}
                          />
                        )}
                      />
                      {memberError?.name && (
                        <FieldError>{memberError.name.message}</FieldError>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor={`participant_reg_${index}`}>
                        Register Number *
                      </FieldLabel>
                      <Controller
                        control={control}
                        name={`members.${index}.registerNumber`}
                        render={({ field }) => (
                          <Input
                            id={`participant_reg_${index}`}
                            type="text"
                            placeholder="e.g., 21MSC001"
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(e.target.value.toUpperCase());
                              setConflictWarnings((prev) => ({
                                ...prev,
                                [index]: null,
                              }));
                            }}
                            onBlur={() => {
                              field.onBlur();
                              handleRegNumberBlur(index);
                            }}
                            aria-invalid={!!memberError?.registerNumber || !!conflictWarning}
                            className={conflictWarning ? "border-red-500" : undefined}
                          />
                        )}
                      />
                      {conflictWarning && <FieldError>⚠️ {conflictWarning}</FieldError>}
                      {!conflictWarning && memberError?.registerNumber && (
                        <FieldError>{memberError.registerNumber.message}</FieldError>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor={`participant_mobile_${index}`}>
                        Mobile Number *
                      </FieldLabel>
                      <Controller
                        control={control}
                        name={`members.${index}.mobile`}
                        render={({ field }) => (
                          <Input
                            id={`participant_mobile_${index}`}
                            type="tel"
                            inputMode="numeric"
                            placeholder="e.g., 9876543210"
                            value={field.value}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value.replace(/\D/g, "").slice(0, 10)
                              )
                            }
                            onBlur={() => {
                              field.onBlur();
                              void trigger(`members.${index}.mobile`);
                            }}
                            aria-invalid={!!memberError?.mobile}
                          />
                        )}
                      />
                      {memberError?.mobile && (
                        <FieldError>{memberError.mobile.message}</FieldError>
                      )}
                    </Field>

                    <Field>
                      <FieldLabel htmlFor={`participant_degree_${index}`}>
                        Degree *
                      </FieldLabel>
                      <Controller
                        control={control}
                        name={`members.${index}.degree`}
                        render={({ field }) => (
                          <select
                            id={`participant_degree_${index}`}
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(e.target.value as Degree)}
                            onBlur={field.onBlur}
                            className={selectClass}
                            aria-invalid={!!memberError?.degree}
                          >
                            <option value="">Select Degree</option>
                            <option value="ug">UG</option>
                            <option value="pg">PG</option>
                          </select>
                        )}
                      />
                      {memberError?.degree && (
                        <FieldError>{memberError.degree.message}</FieldError>
                      )}
                    </Field>

                    <Field>
                      {isExisting ? (
                        <>
                          <FieldLabel>Food Preference</FieldLabel>
                          <div className="mt-1 flex items-center gap-2">
                            <FoodBadge preference={existingStudent.foodPreference} />
                            <span className="text-xs text-slate-500">(already saved)</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <FieldLabel htmlFor={`participant_food_${index}`}>
                            Food Preference *
                          </FieldLabel>
                          <Controller
                            control={control}
                            name={`members.${index}.foodPreference`}
                            render={({ field }) => (
                              <select
                                id={`participant_food_${index}`}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                  field.onChange(
                                    e.target.value === ""
                                      ? undefined
                                      : (e.target.value as "vegetarian" | "non-vegetarian")
                                  )
                                }
                                onBlur={field.onBlur}
                                className={selectClass}
                              >
                                <option value="">Select Preference</option>
                                <option value="vegetarian">🥬 Vegetarian</option>
                                <option value="non-vegetarian">🍗 Non-Vegetarian</option>
                              </select>
                            )}
                          />
                          {memberError?.foodPreference && (
                            <FieldError>{memberError.foodPreference.message}</FieldError>
                          )}
                        </>
                      )}
                    </Field>
                  </div>
                );
              })}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || isClosed}
              className="mt-6 w-full py-3 text-base"
            >
              {isClosed
                ? "Registration Closed"
                : isSubmitting
                  ? "Registering..."
                  : "Register Team"}
            </Button>
          </div>
        )}

        {!config && (
          <FieldDescription className="mt-4 text-center">
            Select an event above to add team members.
          </FieldDescription>
        )}
      </form>
    </div>
  );
}
