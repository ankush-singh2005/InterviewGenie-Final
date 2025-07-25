"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/client";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FormField from "./FormField";

// Email verification schema
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

// OTP verification schema
const otpSchema = z.object({
  otp: z
    .string()
    .min(6, "Please enter the 6-digit code")
    .max(6, "Code must be 6 digits"),
});

type EmailFormData = z.infer<typeof emailSchema>;
type OtpFormData = z.infer<typeof otpSchema>;

interface ForgotPasswordProps {
  onBack: () => void;
}

const ForgotPassword = ({ onBack }: ForgotPasswordProps) => {
  const [step, setStep] = useState<"email" | "otp" | "success">("email");
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [otpExpiry, setOtpExpiry] = useState<number>(0);

  // Email form
  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  // OTP form
  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Generate a 6-digit OTP
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  // Send OTP via email simulation (for testing purposes)
  const sendOtpEmail = async (email: string, otp: string) => {
    // In production, you would call your backend API to send email
    console.log(`OTP for ${email}: ${otp}`);

    // Show OTP in toast for testing purposes
    toast.success(`OTP sent to ${email}. For testing: ${otp}`, {
      duration: 10000, // Show for 10 seconds
    });

    return true;
  };

  const onEmailSubmit = async (data: EmailFormData) => {
    setLoading(true);
    try {
      // Generate OTP and set expiry (5 minutes)
      const otp = generateOtp();
      setGeneratedOtp(otp);
      setOtpExpiry(Date.now() + 5 * 60 * 1000); // 5 minutes from now
      setUserEmail(data.email);

      // Send OTP email
      await sendOtpEmail(data.email, otp);

      setStep("otp");
      toast.success("Verification code sent to your email!");
    } catch (error) {
      console.error("Error sending verification code:", error);
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onOtpSubmit = async (data: OtpFormData) => {
    setLoading(true);
    try {
      // Check if OTP has expired
      if (Date.now() > otpExpiry) {
        toast.error("Verification code has expired. Please request a new one.");
        setStep("email");
        setLoading(false);
        return;
      }

      // Verify OTP
      if (data.otp !== generatedOtp) {
        toast.error("Invalid verification code. Please try again.");
        setLoading(false);
        return;
      }

      // OTP verified, now send Firebase password reset email
      await sendPasswordResetEmail(auth, userEmail);

      setStep("success");
      toast.success(
        "Verification successful! Password reset link sent to your email."
      );
    } catch (error) {
      console.error("Error sending reset email:", error);
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setUserEmail("");
    setGeneratedOtp("");
    setOtpExpiry(0);
    otpForm.reset();
  };

  const resendOtp = async () => {
    if (userEmail) {
      setLoading(true);
      const otp = generateOtp();
      setGeneratedOtp(otp);
      setOtpExpiry(Date.now() + 5 * 60 * 1000);

      await sendOtpEmail(userEmail, otp);
      toast.success("New verification code sent!");
      setLoading(false);
    }
  };

  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10">
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-bold text-primary-100">
            Reset Password
          </h2>

          {step === "email" && (
            <p className="text-center text-gray-600">
              Enter your email address and we&apos;ll send you a verification
              code to reset your password.
            </p>
          )}

          {step === "otp" && (
            <div className="text-center">
              <p className="text-gray-600">
                We&apos;ve sent a verification code to{" "}
                <span className="font-semibold text-primary-100">
                  {userEmail}
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Enter the 6-digit code from your email below.
              </p>
            </div>
          )}

          {step === "success" && (
            <div className="text-center">
              <p className="text-gray-600">
                Password reset link sent successfully!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please check your email and follow the link to reset your
                password.
              </p>
            </div>
          )}
        </div>

        {/* Email Step */}
        {step === "email" && (
          <Form {...emailForm}>
            <form
              onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              className="w-full space-y-6 mt-4 form">
              <FormField
                control={emailForm.control}
                name="email"
                label="Email Address"
                placeholder="Enter your email address"
                type="email"
              />

              <div className="flex flex-col gap-3">
                <Button className="btn" type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Verification Code"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="w-full border-primary-100 text-primary-100 hover:bg-primary-100 hover:text-white">
                  Back to Sign In
                </Button>
              </div>
            </form>
          </Form>
        )}

        {/* OTP Step */}
        {step === "otp" && (
          <Form {...otpForm}>
            <form
              onSubmit={otpForm.handleSubmit(onOtpSubmit)}
              className="w-full space-y-6 mt-4 form">
              <FormField
                control={otpForm.control}
                name="otp"
                label="Verification Code"
                placeholder="Enter 6-digit code"
                type="text"
              />

              <div className="flex flex-col gap-3">
                <Button className="btn" type="submit" disabled={loading}>
                  {loading ? "Verifying..." : "Verify Code"}
                </Button>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resendOtp}
                    disabled={loading}
                    className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50">
                    Resend Code
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBackToEmail}
                    className="flex-1 border-primary-100 text-primary-100 hover:bg-primary-100 hover:text-white">
                    Change Email
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        )}

        {/* Success Step */}
        {step === "success" && (
          <div className="w-full space-y-6 mt-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-green-800 font-medium">Reset Link Sent!</p>
              <p className="text-green-600 text-sm mt-1">
                Check your email inbox and click the reset link
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button className="btn" onClick={onBack}>
                Back to Sign In
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleBackToEmail}
                className="w-full border-primary-100 text-primary-100 hover:bg-primary-100 hover:text-white">
                Try Different Email
              </Button>
            </div>
          </div>
        )}

        {/* Footer Links */}
        {step === "email" && (
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Remember your password?{" "}
              <button
                onClick={onBack}
                className="font-medium text-primary-100 hover:underline">
                Back to Sign In
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
