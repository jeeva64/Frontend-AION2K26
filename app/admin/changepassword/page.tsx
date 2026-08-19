"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError, NetworkError } from "@/lib/api-client";
import { clearAllAuth, getAdminToken } from "@/lib/auth";
import { adminChangePassword } from "@/services/admin";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .regex(/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/, "Password must contain at least one special character")
    .regex(/^\S*$/, "Password must not contain spaces"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New password and confirm password do not match",
  path: ["confirmPassword"],
}).refine((data) => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"],
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function AdminChangePasswordPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      clearAllAuth();
      router.replace("/admin/login");
      return;
    }
    setAuthed(true);
  }, [router]);

  const onSubmit = async (values: ChangePasswordFormValues) => {
    const token = getAdminToken();
    if (!token) {
      clearAllAuth();
      router.replace("/admin/login");
      return;
    }
    setIsSubmitting(true);
    try {
      await adminChangePassword(
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
        token
      );
      toast.success("Password updated successfully");
      router.push("/admin");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAllAuth();
        router.replace("/admin/login");
      } else if (error instanceof ApiError && error.status === 403) {
        toast.error("Access denied");
        router.replace("/admin");
      } else if (error instanceof ApiError) {
        toast.error(error.message || "Password change failed");
      } else if (error instanceof NetworkError) {
        toast.error(error.message);
      } else {
        toast.error(error instanceof Error ? error.message : "Password change failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authed) {
    return null;
  }

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-600">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Change Password</h2>
          <p className="mt-2 text-gray-500">
            Update your admin password
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <Field>
            <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
            <Input
              id="currentPassword"
              type="password"
              placeholder="Enter current password"
              autoComplete="current-password"
              aria-invalid={!!errors.currentPassword}
              {...register("currentPassword")}
            />
            {errors.currentPassword && <FieldError>{errors.currentPassword.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              autoComplete="new-password"
              aria-invalid={!!errors.newPassword}
              {...register("newPassword")}
            />
            {errors.newPassword && <FieldError>{errors.newPassword.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && <FieldError>{errors.confirmPassword.message}</FieldError>}
          </Field>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-base"
          >
            {isSubmitting ? "Updating..." : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}