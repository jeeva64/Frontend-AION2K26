"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DEPARTMENTS, SHIFTS, type Department, type Shift } from "@/lib/constants";
import { ApiError, NetworkError } from "@/lib/api-client";
import { registerLeader } from "@/services/auth";
import { getColleges } from "@/services/college";

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name is required"),
    mobile: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Mobile must be a valid 10-digit number starting with 6-9"),
    email: z.email("Please enter a valid email address"),
    department: z.enum(DEPARTMENTS, { message: "Please select a department" }),
    shift: z.enum(SHIFTS, { message: "Please select a shift" }),
    college: z.string().trim().min(1, "Please select or enter your college"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password must be at most 128 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one digit")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
      .regex(/^\S+$/, "Password must not contain spaces"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const DEPT_LABELS: Record<Department, string> = {
  cs: "Computer Science",
  it: "Information Technology",
  ai: "Artificial Intelligence",
  ds: "Data Science",
  ca: "Computer Applications",
};

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [colleges, setColleges] = useState<string[]>([]);
  const [collegeLoadFailed, setCollegeLoadFailed] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      department: "" as Department,
      shift: "" as Shift,
      college: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await getColleges();
        if (!active) return;
        setColleges(list.map((c) => c.name));
      } catch {
        if (!active) return;
        setCollegeLoadFailed(true);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      await registerLeader({
        name: values.name,
        mobile: values.mobile,
        email: values.email,
        department: values.department,
        shift: values.shift,
        college: values.college,
        password: values.password,
      });
      toast.success("Registration Successful! Please login to continue.");
      router.push("/login");
    } catch (error) {
      if (error instanceof ApiError && error.status === 400) {
        toast.error(error.message || "Registration failed. Please check your details.");
      } else if (error instanceof NetworkError) {
        toast.error(error.message);
      } else {
        toast.error(error instanceof Error ? error.message : "Registration failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell>
      <h2 className="mb-4 text-2xl font-bold">Student Leader Registration</h2>
      <p className="mb-4 text-gray-500">
        Register to lead your team at AION 2K26
      </p>
      <hr className="mb-6" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-5 text-left"
      >
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            autoComplete="name"
            aria-invalid={!!errors.name}
            {...register("name")}
          />
          {errors.name && <FieldError>{errors.name.message}</FieldError>}
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="mobile">Mobile Number</FieldLabel>
            <Input
              id="mobile"
              type="tel"
              inputMode="numeric"
              placeholder="e.g., 9876543210"
              maxLength={10}
              autoComplete="tel"
              aria-invalid={!!errors.mobile}
              {...register("mobile")}
            />
            {errors.mobile && <FieldError>{errors.mobile.message}</FieldError>}
          </Field>

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
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="department">Department</FieldLabel>
            <select
              id="department"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-invalid={!!errors.department}
              {...register("department")}
            >
              <option value="">Select Department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {DEPT_LABELS[dept]}
                </option>
              ))}
            </select>
            {errors.department && (
              <FieldError>{errors.department.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="shift">Shift</FieldLabel>
            <select
              id="shift"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-invalid={!!errors.shift}
              {...register("shift")}
            >
              <option value="">Select Shift</option>
              {SHIFTS.map((shift) => (
                <option key={shift} value={shift}>
                  {shift === "1" ? "Shift 1 (Morning)" : "Shift 2 (Afternoon)"}
                </option>
              ))}
            </select>
            {errors.shift && <FieldError>{errors.shift.message}</FieldError>}
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="college">College</FieldLabel>
          {collegeLoadFailed ? (
            <>
              <Input
                id="college"
                type="text"
                placeholder="Enter your college name"
                aria-invalid={!!errors.college}
                {...register("college")}
              />
              <FieldDescription>
                Could not load college list — please type your college name.
              </FieldDescription>
            </>
          ) : colleges.length > 0 ? (
            <select
              id="college"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-invalid={!!errors.college}
              {...register("college")}
            >
              <option value="">Select College</option>
              {colleges.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          ) : (
            <Input
              id="college"
              type="text"
              placeholder="Loading colleges... or type your college name"
              aria-invalid={!!errors.college}
              {...register("college")}
            />
          )}
          {errors.college && <FieldError>{errors.college.message}</FieldError>}
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <FieldDescription>
              8–128 chars with uppercase, lowercase, digit &amp; special character.
            </FieldDescription>
            {errors.password && (
              <FieldError>{errors.password.message}</FieldError>
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <FieldError>{errors.confirmPassword.message}</FieldError>
            )}
          </Field>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 text-base"
        >
          {isSubmitting ? "Please wait..." : "Register"}
        </Button>

        <p className="mt-2 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-blue-600 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
