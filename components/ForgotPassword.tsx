"use client";

import { useState } from "react";
import { toast } from "sonner";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/components/FormField";

interface ForgotPasswordProps {
  onBack: () => void;
}

type Step = "email" | "success";

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type EmailFormData = z.infer<typeof emailSchema>;

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onBack }) => {
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const emailForm = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  const onEmailSubmit = async (data: EmailFormData) => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, data.email, {
        url: `${window.location.origin}/sign-in`,
        handleCodeInApp: false,
      });
      setUserEmail(data.email);
      setStep("success");
      toast.success("Password reset link sent to your email!");
    } catch (error: unknown) {
      let message = "Failed to send reset email. Please try again.";

      if (error && typeof error === "object" && "code" in error) {
        const authError = error as { code: string };
        if (authError.code === "auth/user-not-found") {
          message = "No account found with this email address.";
        } else if (authError.code === "auth/too-many-requests") {
          message = "Too many attempts. Please try again later.";
        } else if (authError.code === "auth/invalid-email") {
          message = "Please enter a valid email address.";
        }
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const resendEmail = async () => {
    if (!userEmail) return;

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, userEmail, {
        url: `${window.location.origin}/sign-in`,
        handleCodeInApp: false,
      });
      toast.success("Password reset link sent again!");
    } catch {
      toast.error("Failed to resend email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep("email");
    setUserEmail("");
    emailForm.reset();
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
              Enter your email address and we&apos;ll send you a password reset
              link.
            </p>
          )}

          {step === "success" && (
            <div className="text-center">
              <p className="text-gray-600">
                Password reset link sent successfully!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Check your email inbox and spam for{" "}
                <span className="font-semibold text-primary-100">
                  {userEmail}
                </span>
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
                  {loading ? "Sending Reset Link..." : "Send Reset Link"}
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
                Please check your email spam and follow the instructions to
                reset your password
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button className="btn" onClick={onBack}>
                Back to Sign In
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resendEmail}
                  disabled={loading}
                  className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50">
                  {loading ? "Sending..." : "Resend Link"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToEmail}
                  className="flex-1 border-primary-100 text-primary-100 hover:bg-primary-100 hover:text-white">
                  Try Different Email
                </Button>
              </div>
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
