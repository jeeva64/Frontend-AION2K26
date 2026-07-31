"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError, NetworkError } from "@/lib/api-client";
import { setLeaderAuth } from "@/lib/auth";
import { loginLeader } from "@/services/auth";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await loginLeader({
        userid: values.email,
        password: values.password,
      });
      const userid = result.userid ?? result.id;
      const token = result.token;
      if (!userid || !token) {
        toast.error(result.message || "Login failed. Please try again.");
        return;
      }
      setLeaderAuth(token, userid);
      toast.success("Login Successful");
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        toast.error("Invalid Email or Password");
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
    <AuthShell>
      <h2 className="mb-4 text-2xl font-bold">Student Leader Login</h2>
      <p className="mb-4 text-gray-500">
        Login to manage your team and registrations
      </p>
      <hr className="mb-6" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5 text-left"
      >
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && <FieldError>{errors.email.message}</FieldError>}
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
          {isSubmitting ? "Please wait..." : "Login"}
        </Button>

        <p className="mt-2 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
