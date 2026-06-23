"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import confetti from "canvas-confetti";
import {
  User,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  ChevronRight,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// Schema for form validation
const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  contactNumber: z
    .string()
    .regex(/^\d+$/, "Contact number must contain only numbers")
    .startsWith("0", "Contact number must start with 0")
    .max(10, "Contact number must be at most 10 digits")
    .min(9, "Contact number must be at least 9 digits"),
  isWhatsAppSame: z.boolean(),
  whatsAppNumber: z
    .string()
    .regex(/^\d+$/, "WhatsApp number must contain only numbers")
    .startsWith("07", "WhatsApp number must start with 07")
    .max(10, "WhatsApp number must be at most 10 digits")
    .min(9, "WhatsApp number must be at least 9 digits"),
  requirement: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function LeadKioskPage() {
  const insertLead = useMutation(api.leads.insertLead);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isPending, setIsPending] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      contactNumber: "",
      isWhatsAppSame: false,
      whatsAppNumber: "",
      requirement: "",
    },
  });

  const watchContactNumber = watch("contactNumber");
  const watchIsWhatsAppSame = watch("isWhatsAppSame");

  // Sync WhatsApp number when "Same as contact number" is checked
  useEffect(() => {
    if (watchIsWhatsAppSame) {
      setValue("whatsAppNumber", watchContactNumber, { shouldValidate: true });
    }
  }, [watchIsWhatsAppSame, watchContactNumber, setValue]);

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSubmitted && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isSubmitted && countdown === 0) {
      handleReset();
    }
    return () => clearTimeout(timer);
  }, [isSubmitted, countdown]);

  const onSubmit = async (data: FormData) => {
    setIsPending(true);
    try {
      // In Convex, mutation is secure and saves state
      await insertLead({
        fullName: data.fullName,
        email: data.email,
        contactNumber: data.contactNumber,
        whatsAppNumber: data.whatsAppNumber,
        requirement: data.requirement,
      });

      // Celebrate!
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });

      setIsSubmitted(true);
      setCountdown(5);
    } catch (error) {
      console.error("Failed to submit lead:", error);
      alert("Submission failed. Please check your connection and try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleReset = () => {
    reset();
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-zinc-950 text-white min-h-screen px-4 overflow-hidden relative">
        {/* Decorative background grid and glow */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f0f11_1px,transparent_1px),linear-gradient(to_bottom,#0f0f11_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-xl w-full text-center z-10 flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md scale-110 animate-pulse"></div>
            <CheckCircle className="h-24 w-24 text-emerald-400 relative z-10 animate-bounce" />
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight mb-4 sm:text-5xl bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
            Thank You!
          </h1>
          <p className="text-lg text-zinc-400 mb-8 max-w-md">
            Your details have been successfully recorded. One of our specialists
            will be in touch shortly to assist you.
          </p>

          <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 mb-8 w-full max-w-sm">
            <span className="text-sm font-medium text-zinc-500 uppercase tracking-wider block mb-2">
              Next Visitor
            </span>
            <div className="text-3xl font-bold font-mono tracking-tight text-emerald-400">
              Form resets in{" "}
              <span className="text-white text-4xl">{countdown}</span>s
            </div>
            <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-4">
              <div
                className="bg-emerald-500 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 5) * 100}%` }}
              ></div>
            </div>
          </div>

          <Button
            onClick={handleReset}
            size="lg"
            className="bg-white hover:bg-zinc-200 text-black px-8 py-6 rounded-full text-lg font-semibold shadow-lg shadow-white/5 group transition-transform hover:scale-105 active:scale-95"
          >
            Reset Form Now
            <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-center min-h-screen relative py-8 px-4 bg-zinc-50 sm:px-6 lg:px-8">
      {/* Decorative gradients */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vh] bg-zinc-200/50 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[40vw] h-[40vh] bg-zinc-200/50 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
        {/* Left Column - Kiosk Branding */}
        <div className="lg:col-span-5 flex flex-col space-y-6 text-left p-4 lg:p-0">
          <div className="relative w-36 h-12 mb-2 select-none pointer-events-none">
            <Image
              src="/logo.png"
              alt="Evoto Logo"
              fill
              className="object-contain object-left"
              priority
            />
          </div>
          <div className="inline-flex items-center space-x-2 bg-zinc-900 text-white rounded-full px-4 py-1.5 text-xs font-semibold w-fit tracking-wider uppercase">
            <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400 mr-1 animate-pulse" />
            Exhibition Kiosk
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
            Let's build <br />
            <span className="bg-gradient-to-r from-zinc-950 via-zinc-800 to-zinc-600 bg-clip-text text-transparent">
              something great.
            </span>
          </h1>
          <p className="text-lg text-zinc-600 max-w-md">
            Leave your contact information and requirement description, and our
            consultants will coordinate with you.
          </p>
          <div className="hidden lg:flex flex-col space-y-4 pt-4 border-t border-zinc-200">
            <div className="flex items-center space-x-3 text-zinc-500">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-medium">
                Secured Lead Processing
              </span>
            </div>
            <div className="flex items-center space-x-3 text-zinc-500">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-sm font-medium">
                Real-time Admin Synchronized
              </span>
            </div>
          </div>
        </div>

        {/* Right Column - Form Card */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-zinc-200 shadow-2xl rounded-3xl p-6 sm:p-10 transition-shadow">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-semibold text-zinc-700 flex items-center"
                >
                  <User className="h-4 w-4 text-zinc-400 mr-2" />
                  Full Name <span className="text-destructive ml-0.5">*</span>
                </Label>
                <Input
                  id="fullName"
                  placeholder="e.g. Jane Doe"
                  className={`h-14 text-base px-4 rounded-xl border-zinc-200 focus-visible:ring-zinc-900 ${errors.fullName ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("fullName")}
                />
                {errors.fullName && (
                  <p className="text-xs font-semibold text-destructive mt-1">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-semibold text-zinc-700 flex items-center"
                >
                  <Mail className="h-4 w-4 text-zinc-400 mr-2" />
                  Email Address{" "}
                  <span className="text-destructive ml-0.5">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g. jane.doe@example.com"
                  className={`h-14 text-base px-4 rounded-xl border-zinc-200 focus-visible:ring-zinc-900 ${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs font-semibold text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <Label
                  htmlFor="contactNumber"
                  className="text-sm font-semibold text-zinc-700 flex items-center"
                >
                  <Phone className="h-4 w-4 text-zinc-400 mr-2" />
                  Contact Number{" "}
                  <span className="text-destructive ml-0.5">*</span>
                </Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  placeholder="e.g. 0771234567"
                  className={`h-14 text-base px-4 rounded-xl border-zinc-200 focus-visible:ring-zinc-900 ${errors.contactNumber ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("contactNumber")}
                />
                {errors.contactNumber && (
                  <p className="text-xs font-semibold text-destructive mt-1">
                    {errors.contactNumber.message}
                  </p>
                )}
              </div>

              {/* WhatsApp Number */}
              <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="whatsAppNumber"
                    className="text-sm font-semibold text-zinc-700 flex items-center"
                  >
                    <Phone className="h-4 w-4 text-zinc-400 mr-2" />
                    WhatsApp Number{" "}
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>

                  {/* Touch friendly same checkbox overlayed in label */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isWhatsAppSame"
                      className="h-5 w-5 border-zinc-300 rounded"
                      checked={watchIsWhatsAppSame}
                      onCheckedChange={(checked) =>
                        setValue("isWhatsAppSame", checked === true)
                      }
                    />
                    <Label
                      htmlFor="isWhatsAppSame"
                      className="text-xs text-zinc-500 font-medium cursor-pointer select-none py-1"
                    >
                      Same as contact
                    </Label>
                  </div>
                </div>
                <Input
                  id="whatsAppNumber"
                  type="tel"
                  placeholder={
                    watchIsWhatsAppSame
                      ? "Same as Contact Number"
                      : "e.g. 0771234567"
                  }
                  readOnly={watchIsWhatsAppSame}
                  className={`h-14 text-base px-4 rounded-xl border-zinc-200 focus-visible:ring-zinc-900 ${watchIsWhatsAppSame ? "bg-zinc-50 text-zinc-500 border-zinc-200 cursor-not-allowed select-none" : ""} ${errors.whatsAppNumber && !watchIsWhatsAppSame ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("whatsAppNumber")}
                />
                {errors.whatsAppNumber && !watchIsWhatsAppSame && (
                  <p className="text-xs font-semibold text-destructive mt-1">
                    {errors.whatsAppNumber.message}
                  </p>
                )}
              </div>

              {/* Requirement Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="requirement"
                  className="text-sm font-semibold text-zinc-700 flex items-center"
                >
                  <MessageSquare className="h-4 w-4 text-zinc-400 mr-2" />
                  Requirement Description{" "}
                  <span className="text-zinc-400 font-normal ml-1">
                    (Optional)
                  </span>
                </Label>
                <Textarea
                  id="requirement"
                  placeholder="How can we assist you? Tell us about your project or requests..."
                  rows={4}
                  className="text-base p-4 rounded-xl border-zinc-200 focus-visible:ring-zinc-900 resize-none"
                  {...register("requirement")}
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-14 bg-zinc-950 hover:bg-zinc-800 text-white text-lg font-semibold rounded-xl transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Recording Details...
                  </>
                ) : (
                  "Submit Lead Details"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
