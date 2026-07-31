"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FoodBadge } from "@/components/dashboard/food-badge";
import {
  EVENT_CONFIG,
  SLOT_1_EVENTS,
  SLOT_2_EVENTS,
  type Degree,
  type EventName,
  type FoodPreference,
} from "@/lib/constants";
import { ApiError, NetworkError } from "@/lib/api-client";
import {
  checkParticipantConflict,
  getTeamLimitExceededMessage,
  isMobileValid,
} from "@/lib/candidate";
import type { RegisteredStudent, Student } from "@/lib/types";
import { registerTeam } from "@/services/team";

interface MemberField {
  name: string;
  registerNumber: string;
  mobile: string;
  degree: "" | Degree;
  foodPreference: "" | FoodPreference;
  existing: RegisteredStudent | null;
  conflictWarning: string | null;
  mobileWarning: string | null;
}

interface TeamRegistrationFormProps {
  leaderId: string;
  token: string;
  studentMap: Record<string, RegisteredStudent>;
  registeredEvents: EventName[];
  totalStudents: number;
  onRegistered: () => void;
  onUnauthorized: () => void;
}

function emptyMembers(count: number): MemberField[] {
  return Array.from({ length: count }, () => ({
    name: "",
    registerNumber: "",
    mobile: "",
    degree: "",
    foodPreference: "",
    existing: null,
    conflictWarning: null,
    mobileWarning: null,
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
  onRegistered,
  onUnauthorized,
}: TeamRegistrationFormProps) {
  const [selectedEvent, setSelectedEvent] = useState<"" | EventName>("");
  const [members, setMembers] = useState<MemberField[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEventChange = (value: string) => {
    if (!value) {
      setSelectedEvent("");
      setMembers([]);
      return;
    }
    const event = value as EventName;
    setSelectedEvent(event);
    setMembers(emptyMembers(EVENT_CONFIG[event].participants));
  };

  const updateMember = (index: number, patch: Partial<MemberField>) => {
    setMembers((prev) =>
      prev.map((member, i) => (i === index ? { ...member, ...patch } : member))
    );
  };

  const handleRegNumberChange = (index: number, value: string) => {
    updateMember(index, {
      registerNumber: value.toUpperCase(),
      conflictWarning: null,
    });
  };

  const handleRegNumberBlur = (index: number) => {
    const member = members[index];
    const reg = member.registerNumber.trim();
    if (!reg || !selectedEvent) return;

    const student = studentMap[reg] ?? null;
    const conflict = checkParticipantConflict(student, selectedEvent);

    updateMember(index, {
      existing: student,
      conflictWarning: conflict.hasConflict ? conflict.message : null,
    });
  };

  const handleMobileChange = (index: number, value: string) => {
    updateMember(index, {
      mobile: value.replace(/\D/g, "").slice(0, 10),
      mobileWarning: null,
    });
  };

  const handleMobileBlur = (index: number) => {
    const member = members[index];
    const valid = isMobileValid(member.mobile.trim());
    updateMember(index, {
      mobileWarning: valid ? null : "Valid 10-digit number starting with 6, 7, 8 or 9",
    });
  };

  const handleSubmit = async () => {
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

    const cleanMembers = [];
    const regNumbers: string[] = [];
    let newStudents = 0;

    for (let i = 0; i < members.length; i++) {
      const member = members[i];
      const name = member.name.trim();
      const registerNumber = member.registerNumber.trim();
      const mobile = member.mobile.trim();
      const degree = member.degree;

      if (!name || !registerNumber || !mobile || !degree) {
        toast.error(
          `Please fill all details for Member ${i + 1} (name, register number, mobile, degree).`
        );
        return;
      }
      if (!isMobileValid(mobile)) {
        toast.error(
          `Member ${i + 1}: Invalid mobile. Must be 10 digits starting with 6, 7, 8 or 9.`
        );
        return;
      }

      const conflict = checkParticipantConflict(member.existing ?? undefined, selectedEvent);
      if (conflict.hasConflict) {
        toast.error(`${name} (${registerNumber}): ${conflict.message}`);
        return;
      }

      let foodPreference: FoodPreference | undefined;
      if (!member.existing) {
        if (!member.foodPreference) {
          toast.error(`Please select a food preference for Member ${i + 1} (${name}).`);
          return;
        }
        foodPreference = member.foodPreference;
        newStudents++;
      }

      regNumbers.push(registerNumber);
      cleanMembers.push({
        name,
        registerNumber,
        mobile,
        degree,
        foodPreference,
      });
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

    const participants: Student[] = cleanMembers.map((p) => {
      const participant: Student = {
        name: p.name,
        registerNumber: p.registerNumber,
        mobile: p.mobile,
        degree: p.degree,
      };
      if (p.foodPreference) {
        participant.foodPreference = p.foodPreference;
      }
      return participant;
    });

    setIsSubmitting(true);
    try {
      await registerTeam({ leaderId, event: selectedEvent, participants }, token);
      toast.success(`Team registered for ${selectedEvent}`);
      setSelectedEvent("");
      setMembers([]);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  const config = selectedEvent ? EVENT_CONFIG[selectedEvent] : null;

  return (
    <div className="rounded-2xl border-2 border-[#e0e7ff] bg-[linear-gradient(135deg,rgba(102,126,234,0.05)_0%,rgba(118,75,162,0.05)_100%)] p-6 shadow-lg backdrop-blur">
      <h2 className="mb-6 text-center text-3xl font-bold">
        Register New Team
      </h2>

      <Field>
        <FieldLabel htmlFor="eventSelect">Select Event</FieldLabel>
        <select
          id="eventSelect"
          value={selectedEvent}
          onChange={(e) => handleEventChange(e.target.value)}
          className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">-- Choose Event --</option>
          <optgroup label="Slot 1 (11:00 AM - 1:00 PM)">
            {SLOT_1_EVENTS.map((event) =>
              eventOption(event, registeredEvents.includes(event))
            )}
          </optgroup>
          <optgroup label="Slot 2 (2:00 PM - 4:00 PM)">
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
            <h3 className="text-lg font-bold">
              Team Members for {selectedEvent}
            </h3>
            <span className="text-sm font-normal text-slate-600">
              ({config.participants}{" "}
              {config.participants === 1 ? "participant" : "participants"})
            </span>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {members.map((member, index) => {
              const isExisting = member.existing !== null;
              return (
                <div
                  key={index}
                  className="space-y-2 rounded-xl border border-slate-200 bg-white/60 p-4"
                >
                  <Field>
                    <FieldLabel htmlFor={`participant_name_${index}`}>
                      {members.length === 1 ? "Participant" : `Member ${index + 1}`} Name *
                    </FieldLabel>
                    <Input
                      id={`participant_name_${index}`}
                      type="text"
                      placeholder="Enter full name"
                      value={member.name}
                      onChange={(e) => updateMember(index, { name: e.target.value })}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor={`participant_reg_${index}`}>
                      Register Number *
                    </FieldLabel>
                    <Input
                      id={`participant_reg_${index}`}
                      type="text"
                      placeholder="e.g., 21MSC001"
                      value={member.registerNumber}
                      onChange={(e) => handleRegNumberChange(index, e.target.value)}
                      onBlur={() => handleRegNumberBlur(index)}
                      className={member.conflictWarning ? "border-red-500" : undefined}
                    />
                    {member.conflictWarning && (
                      <FieldError>⚠️ {member.conflictWarning}</FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor={`participant_mobile_${index}`}>
                      Mobile Number *
                    </FieldLabel>
                    <Input
                      id={`participant_mobile_${index}`}
                      type="tel"
                      inputMode="numeric"
                      placeholder="e.g., 9876543210"
                      value={member.mobile}
                      onChange={(e) => handleMobileChange(index, e.target.value)}
                      onBlur={() => handleMobileBlur(index)}
                      className={member.mobileWarning ? "border-red-500" : undefined}
                    />
                    {member.mobileWarning && (
                      <FieldError>{member.mobileWarning}</FieldError>
                    )}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor={`participant_degree_${index}`}>
                      Degree *
                    </FieldLabel>
                    <select
                      id={`participant_degree_${index}`}
                      value={member.degree}
                      onChange={(e) =>
                        updateMember(index, { degree: e.target.value as "" | Degree })
                      }
                      className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <option value="">Select Degree</option>
                      <option value="ug">UG</option>
                      <option value="pg">PG</option>
                    </select>
                  </Field>

                  <Field>
                    {isExisting ? (
                      <>
                        <FieldLabel>Food Preference</FieldLabel>
                        <div className="mt-1 flex items-center gap-2">
                          <FoodBadge preference={member.existing?.foodPreference} />
                          <span className="text-xs text-slate-500">
                            (already saved)
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <FieldLabel htmlFor={`participant_food_${index}`}>
                          Food Preference *
                        </FieldLabel>
                        <select
                          id={`participant_food_${index}`}
                          value={member.foodPreference}
                          onChange={(e) =>
                            updateMember(index, {
                              foodPreference: e.target.value as "" | FoodPreference,
                            })
                          }
                          className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                        >
                          <option value="">Select Preference</option>
                          <option value="vegetarian">🥬 Vegetarian</option>
                          <option value="non-vegetarian">🍗 Non-Vegetarian</option>
                        </select>
                      </>
                    )}
                  </Field>
                </div>
              );
            })}
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-6 w-full py-3 text-base"
          >
            {isSubmitting ? "Registering..." : "Register Team"}
          </Button>
        </div>
      )}

      {!config && (
        <FieldDescription className="mt-4 text-center">
          Select an event above to add team members.
        </FieldDescription>
      )}
    </div>
  );
}
