import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  company: z.string().min(1, "Company is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  date: z.string().optional(),
  time: z.string().optional(),
});
export type ContactFormData = z.infer<typeof contactSchema>;

const todayISO = () => new Date().toISOString().slice(0, 10);

/** Modal variant books an appointment: date + time slot are required. */
const appointmentSchema = contactSchema.extend({
  date: z
    .string()
    .min(1, "Pick a date")
    .refine((d) => d >= todayISO(), "Choose today or a future date"),
  time: z.string().min(1, "Pick a time slot"),
});

const TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
];

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#aab8e0] mb-1.5">{label} *</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

const cls = (hasError: boolean) => `dark-input${hasError ? " dark-input-error" : ""}`;

export default function ContactForm({
  variant,
  onSuccess,
}: {
  variant: "section" | "modal";
  onSuccess?: () => void;
}) {
  const isAppointment = variant === "modal";
  const contactMutation = trpc.contact.submit.useMutation();
  const form = useForm<ContactFormData>({
    resolver: zodResolver(isAppointment ? appointmentSchema : contactSchema),
    defaultValues: { name: "", email: "", company: "", message: "", date: "", time: "" },
  });
  const { errors, isSubmitting } = form.formState;
  const busy = isSubmitting || contactMutation.isPending;

  const onSubmit = async (data: ContactFormData) => {
    try {
      const message =
        isAppointment && data.date
          ? `[Appointment requested: ${data.date} at ${data.time}] ${data.message}`
          : data.message;
      await contactMutation.mutateAsync({
        name: data.name,
        email: data.email,
        company: data.company,
        message,
      });
      toast.success(
        isAppointment
          ? "Appointment requested! We'll confirm your slot within 24 hours."
          : "Message sent! We'll be in touch soon.",
      );
      form.reset();
      onSuccess?.();
    } catch {
      toast.error("Failed to send. Please try again.");
    }
  };

  const nameEmail = (
    <>
      <Field label="Name" error={errors.name?.message}>
        <input {...form.register("name")} type="text" placeholder="Your name" className={cls(!!errors.name)} />
      </Field>
      <Field label="Email" error={errors.email?.message}>
        <input {...form.register("email")} type="email" placeholder="you@company.com" className={cls(!!errors.email)} />
      </Field>
    </>
  );

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className={variant === "section" ? "space-y-5" : "space-y-4"}
      noValidate
    >
      {variant === "section" ? <div className="grid sm:grid-cols-2 gap-5">{nameEmail}</div> : nameEmail}
      <Field label="Company" error={errors.company?.message}>
        <input {...form.register("company")} type="text" placeholder="Your company name" className={cls(!!errors.company)} />
      </Field>
      {isAppointment && (
        <div className="grid grid-cols-2 gap-4">
          <Field label="Preferred date" error={errors.date?.message}>
            <input
              {...form.register("date")}
              type="date"
              min={todayISO()}
              className={`${cls(!!errors.date)} [color-scheme:dark]`}
            />
          </Field>
          <Field label="Time slot" error={errors.time?.message}>
            <select {...form.register("time")} className={`${cls(!!errors.time)} [color-scheme:dark]`}>
              <option value="">Select a slot</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </Field>
        </div>
      )}
      <Field label="Message" error={errors.message?.message}>
        <textarea
          {...form.register("message")}
          rows={variant === "section" ? 5 : 3}
          placeholder={
            isAppointment
              ? "What would you like to discuss in the consultation?"
              : "Tell us about your project and goals..."
          }
          className={`${cls(!!errors.message)} resize-none`}
        />
      </Field>
      <Button
        type="submit"
        size="lg"
        className="w-full brand-gradient text-white border-0 hover:opacity-90 glow-blue"
        disabled={busy}
      >
        {busy ? "Sending..." : isAppointment ? "Book Appointment" : "Send Message"}
      </Button>
    </form>
  );
}
