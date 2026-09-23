'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { selectClass } from '@/components/ui/select-classes';
import { getAdminToken } from '@/lib/auth';
import { EVENT_NAMES } from '@/lib/constants';
import { EVENT_SLOT_MAP } from '@/lib/constants/admin';
import { updateRegistration, type UpdateRegistrationInput } from '@/services/admin';
import type { RegisteredStudent } from '@/lib/types';

interface EditMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: RegisteredStudent | null;
  onUpdated: () => void;
}

export function EditMemberModal({
  open,
  onOpenChange,
  member,
  onUpdated,
}: EditMemberModalProps) {
  const [name, setName] = useState('');
  const [registerNumber, setRegisterNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [degree, setDegree] = useState('');
  const [foodPreference, setFoodPreference] = useState('');
  const [event1, setEvent1] = useState('');
  const [event2, setEvent2] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (member && open) {
      setName(member.name || '');
      setRegisterNumber(member.registerNumber || '');
      setMobile(member.mobile || '');
      setDegree(member.degree || '');
      setFoodPreference(member.foodPreference || '');
      setEvent1(member.event1 || '');
      setEvent2(member.event2 || '');
      setErrors({});
    }
  }, [member, open]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!registerNumber.trim()) errs.registerNumber = 'Register number is required';
    if (!mobile.trim()) errs.mobile = 'Mobile is required';
    if (!degree) errs.degree = 'Degree is required';
    if (!foodPreference) errs.foodPreference = 'Food preference is required';
    if (!event1) errs.event1 = 'Event 1 is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const regId = member ? (typeof member._id === 'string' ? parseInt(member._id, 10) : member._id) : undefined;

  const handleSubmit = async () => {
    if (!validate() || !regId) return;

    const token = getAdminToken();
    if (!token) {
      toast.error('Session expired');
      return;
    }

    setSubmitting(true);
    try {
      const payload: UpdateRegistrationInput = {
        name: name.trim(),
        registerNumber: registerNumber.trim().toUpperCase(),
        mobile: mobile.trim(),
        degree: degree,
        foodPreference: foodPreference,
        event1: event1,
      };
      if (event2) {
        payload.event2 = event2;
      } else {
        payload.event2 = null;
      }

      await updateRegistration(regId, payload, token);
      toast.success('Member updated successfully');
      onUpdated();
      onOpenChange(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update member';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Member</DialogTitle>
          <DialogDescription>
            Update registration details for {member.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Student name"
            />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Register Number</FieldLabel>
            <Input
              value={registerNumber}
              onChange={(e) => setRegisterNumber(e.target.value)}
              placeholder="Register number"
              className="font-mono"
            />
            {errors.registerNumber && <FieldError>{errors.registerNumber}</FieldError>}
          </Field>

          <Field>
            <FieldLabel>Mobile</FieldLabel>
            <Input
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="10-digit mobile"
            />
            {errors.mobile && <FieldError>{errors.mobile}</FieldError>}
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Degree</FieldLabel>
              <select
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className={selectClass}
              >
                <option value="">Select</option>
                <option value="ug">UG</option>
                <option value="pg">PG</option>
              </select>
              {errors.degree && <FieldError>{errors.degree}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Food Preference</FieldLabel>
              <select
                value={foodPreference}
                onChange={(e) => setFoodPreference(e.target.value)}
                className={selectClass}
              >
                <option value="">Select</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
              </select>
              {errors.foodPreference && <FieldError>{errors.foodPreference}</FieldError>}
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel>Event 1</FieldLabel>
              <select
                value={event1}
                onChange={(e) => setEvent1(e.target.value)}
                className={selectClass}
              >
                <option value="">Select</option>
                {EVENT_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name} ({EVENT_SLOT_MAP[name]})
                  </option>
                ))}
              </select>
              {errors.event1 && <FieldError>{errors.event1}</FieldError>}
            </Field>

            <Field>
              <FieldLabel>Event 2</FieldLabel>
              <select
                value={event2}
                onChange={(e) => setEvent2(e.target.value)}
                className={selectClass}
              >
                <option value="">None</option>
                {EVENT_NAMES.map((name) => (
                  <option key={name} value={name}>
                    {name} ({EVENT_SLOT_MAP[name]})
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
