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
import { clearAllAuth, getAdminRole, getAdminToken } from "@/lib/auth";
import { adminRegister } from "@/services/admin";

const adminRegSchema = z.object({
  adminId: z.string().trim().min(1, "Admin ID is required"),
  name: z.string().trim().min(1, "Name is required"),
  role: z.literal("2", { message: "Role must be Moderator" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password must be at most 128 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one digit")
    .regex(/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/, "Password must contain at least one special character")
    .regex(/^\S*$/, "Password must not contain spaces"),
});

type AdminRegFormValues = z.infer<typeof adminRegSchema>;

export default function AdminRegisterPage() {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminRegFormValues>({
    resolver: zodResolver(adminRegSchema),
    defaultValues: { adminId: "", name: "", role: "2", password: "" },
  });

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      clearAllAuth();
      router.replace("/admin/login");
      return;
    }
    if (getAdminRole() !== "1") {
      toast.error("Super Admin access required");
      router.replace("/admin");
      return;
    }
    setAuthed(true);
  }, [router]);

  const onSubmit = async (values: AdminRegFormValues) => {
    const token = getAdminToken();
    if (!token) {
      clearAllAuth();
      router.replace("/admin/login");
      return;
    }
    setIsSubmitting(true);
    try {
      await adminRegister(
        {
          adminId: values.adminId,
          name: values.name,
          role: 2,
          password: values.password,
        },
        token
      );
      toast.success("Moderator registered successfully");
      router.push("/admin");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearAllAuth();
        router.replace("/admin/login");
      } else if (error instanceof ApiError && error.status === 403) {
        toast.error("Super Admin access required");
        router.replace("/admin");
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
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Register Moderator</h2>
          <p className="mt-2 text-gray-500">
            Create a new moderator account
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="space-y-5"
        >
          <Field>
            <FieldLabel htmlFor="adminId">Admin ID</FieldLabel>
            <Input
              id="adminId"
              type="text"
              placeholder="e.g., MOD1"
              autoComplete="username"
              aria-invalid={!!errors.adminId}
              {...register("adminId")}
            />
            {errors.adminId && <FieldError>{errors.adminId.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Enter moderator name"
              autoComplete="name"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <select
              id="role"
              className="h-8 w-full rounded-lg border border-input bg-white px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-invalid={!!errors.role}
              {...register("role")}
              disabled
            >
              <option value="2">Moderator</option>
            </select>
            {errors.role && <FieldError>{errors.role.message}</FieldError>}
            <p className="mt-1 text-xs text-gray-500">Only Moderators can be created. Super Admin must be created via seeder.</p>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Set a password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-base"
          >
            {isSubmitting ? "Registering..." : "Register Moderator"}
          </Button>
        </form>
      </div>
    </div>
  );
}
