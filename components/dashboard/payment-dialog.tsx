"use client";

import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ApiError, NetworkError } from "@/lib/api-client";
import { MAX_PROOF_MB, UTR_PATTERN } from "@/lib/constants";
import { formatRupees } from "@/lib/utils";
import { submitPaymentProof } from "@/services/payment";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token: string;
  leaderId: string;
  amountDuePaises: number | null | undefined;
  upiUri: string | null;
  onSubmitted: () => void;
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function PaymentDialog({
  open,
  onOpenChange,
  token,
  leaderId,
  amountDuePaises,
  upiUri,
  onSubmitted,
}: PaymentDialogProps) {
  const [step, setStep] = useState<"pay" | "proof" | "done">("pay");
  const [utr, setUtr] = useState("");
  const [utrError, setUtrError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const amount = amountDuePaises ?? 0;

  const resetAndClose = () => {
    setStep("pay");
    setUtr("");
    setUtrError(null);
    setFile(null);
    setFileError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onOpenChange(false);
  };

  const validateProof = (): boolean => {
    let ok = true;
    setUtrError(null);
    setFileError(null);

    if (!UTR_PATTERN.test(utr.trim())) {
      setUtrError("Enter the 8-22 character UPI reference / UTR number");
      ok = false;
    }
    if (!file) {
      setFileError("Attach the payment screenshot");
      ok = false;
    } else if (!ACCEPTED_TYPES.includes(file.type)) {
      setFileError("Only JPG, PNG or WebP screenshots are allowed");
      ok = false;
    } else if (file.size > MAX_PROOF_MB * 1024 * 1024) {
      setFileError(`Screenshot must be ${MAX_PROOF_MB} MB or smaller`);
      ok = false;
    }
    return ok;
  };

  const handleSubmitProof = async () => {
    if (!validateProof()) return;
    setSubmitting(true);
    try {
      await submitPaymentProof(token, {
        utr: utr.trim(),
        amountPaises: amount,
        screenshot: file as File,
      });
      setStep("done");
      onSubmitted();
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (error instanceof ApiError || error instanceof NetworkError) {
        toast.error(error.message);
      } else {
        toast.error("Failed to submit payment proof");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) resetAndClose();
        else onOpenChange(true);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Complete Your Registration Payment</DialogTitle>
          <DialogDescription>
            Registration ID: <span className="font-mono font-semibold">{leaderId}</span>
          </DialogDescription>
        </DialogHeader>

        {step === "pay" && (
          <div className="space-y-4">
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 text-center">
              <p className="text-sm text-slate-600">Amount to Pay</p>
              <p className="text-3xl font-bold text-blue-700">{formatRupees(amount)}</p>
              {upiUri && (
                <div className="mt-3 flex justify-center rounded-xl bg-white p-3">
                  <QRCodeSVG value={upiUri} size={168} />
                </div>
              )}
            </div>

            <ol className="list-decimal space-y-1 pl-5 text-sm text-slate-700">
              <li>Open any UPI app (GPay / PhonePe / Paytm / BHIM).</li>
              <li>
                Pay exactly <strong>{formatRupees(amount)}</strong> to the UPI ID below.
                {upiUri && " You can also scan the QR code."}
              </li>
              <li>Take a screenshot of the success receipt.</li>
            </ol>

            <div className="flex items-center justify-between rounded-xl bg-slate-100 px-4 py-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500">UPI ID</p>
                <p className="font-mono text-sm font-semibold break-all">
                  {upiUri ? decodeURIComponent(upiUri.split("pa=")[1]?.split("&")[0] ?? "") : "Will be shown here"}
                </p>
              </div>
              {upiUri && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    void navigator.clipboard.writeText(
                      decodeURIComponent(upiUri.split("pa=")[1]?.split("&")[0] ?? "")
                    );
                    toast.success("UPI ID copied");
                  }}
                >
                  Copy
                </Button>
              )}
            </div>

            <DialogFooter>
              <Button type="button" onClick={() => setStep("proof")} className="w-full py-3">
                I Have Paid — Continue
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "proof" && (
          <div className="space-y-4">
            <Field>
              <FieldLabel htmlFor="payment_utr">UTR / Transaction Reference *</FieldLabel>
              <Input
                id="payment_utr"
                value={utr}
                onChange={(e) => setUtr(e.target.value.trim())}
                placeholder="e.g., 123456789012"
                aria-invalid={!!utrError}
              />
              <FieldDescription>12-digit number shown in your UPI app receipt.</FieldDescription>
              {utrError && <FieldError>{utrError}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="payment_screenshot">Payment Screenshot *</FieldLabel>
              <Input
                ref={fileInputRef}
                id="payment_screenshot"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                aria-invalid={!!fileError}
              />
              <FieldDescription>JPG, PNG or WebP, max {MAX_PROOF_MB} MB.</FieldDescription>
              {fileError && <FieldError>{fileError}</FieldError>}
            </Field>

            <div className="rounded-lg border-l-4 border-yellow-400 bg-yellow-50 p-3 text-xs text-yellow-800">
              Your registration is confirmed only after an organizer verifies the
              payment. Keep the receipt until then.
            </div>

            <DialogFooter className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep("pay")}>
                Back
              </Button>
              <Button
                type="button"
                onClick={() => void handleSubmitProof()}
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? "Submitting..." : "Submit for Verification"}
              </Button>
            </DialogFooter>
          </div>
        )}

        {step === "done" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-3xl">
              ⏳
            </div>
            <h3 className="text-xl font-bold">Payment Submitted for Verification</h3>
            <div className="space-y-1 rounded-xl bg-slate-100 p-4 text-sm">
              <p>
                Registration ID:{" "}
                <span className="font-mono font-semibold">{leaderId}</span>
              </p>
              <p>
                Payment Status:{" "}
                <span className="font-semibold text-blue-700">Verification Pending</span>
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Do not pay again. Track the status from your dashboard.
            </p>
            <DialogFooter>
              <Button type="button" onClick={resetAndClose} className="w-full">
                Done
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
