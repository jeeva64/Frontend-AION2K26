import { api } from "@/lib/api-client";
import type {
  Leader,
  LeaderLoginInput,
  LeaderRegistrationInput,
} from "@/lib/types";

export interface LeaderLoginResponse extends Leader {
  token?: string;
  userid?: string;
  message?: string;
}

export async function registerLeader(
  input: LeaderRegistrationInput
): Promise<{ userid?: string; message?: string }> {
  const body = await api<unknown>("/regleader", {
    method: "POST",
    body: {
      name: input.name,
      mobilenumber: input.mobile,
      email: input.email,
      department: input.department,
      shift: input.shift,
      college: input.college,
      password: input.password,
      confirmpassword: input.password,
    },
  });
  const raw = body as unknown as { userid?: string };
  return { userid: raw.userid, message: body.message };
}

export async function loginLeader(
  input: LeaderLoginInput
): Promise<LeaderLoginResponse> {
  const body = await api<unknown>("/loginleader", {
    method: "POST",
    body: { email: input.userid.trim().toLowerCase(), password: input.password },
  });
  const raw = body as unknown as { token?: string; userid?: string; name?: string };
  return { token: raw.token, userid: raw.userid, name: raw.name, message: body.message };
}
