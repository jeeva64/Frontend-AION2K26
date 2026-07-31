"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError, NetworkError } from "@/lib/api-client";
import { setAdminAuth } from "@/lib/auth";
import { adminLogin } from "@/services/admin";

const adminLoginSchema = z.object({
  adminId: z.string().trim().min(1, "Admin ID is required"),
  password: z.string().min(1, "Password is required"),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: { adminId: "", password: "" },
  });

  const onSubmit = async (values: AdminLoginFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await adminLogin({
        adminId: values.adminId,
        password: values.password,
      });
      if (!result.token || result.role == null) {
        toast.error(result.message || "Login failed. Please try again.");
        return;
      }
      setAdminAuth(result.token, String(result.role));
      toast.success(result.message || "Login Successful");
      router.push("/admin");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        toast.error("Invalid Admin ID or Password");
      } else if (error instanceof NetworkError) {
        toast.error(error.message);
      } else {
        toast.error(error instanceof Error ? error.message : "Login failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mt-2 text-gray-500">Manage AION 2K26 Registrations</p>
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
              placeholder="Enter your admin ID"
              autoComplete="username"
              aria-invalid={!!errors.adminId}
              {...register("adminId")}
            />
            {errors.adminId && <FieldError>{errors.adminId.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
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
            {isSubmitting ? "Logging in..." : "Login"}
          </Button>
        </form>
      </div>
    </div>
  );
}
