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
});
export type ContactFormData = z.infer<typeof contactSchema>;

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
  const contactMutation = trpc.contact.submit.useMutation();
  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", company: "", message: "" },
  });
  const { errors, isSubmitting } = form.formState;
  const busy = isSubmitting || contactMutation.isPending;

  const onSubmit = async (data: ContactFormData) => {
    try {
      await contactMutation.mutateAsync(data);
      toast.success("Message sent! We'll be in touch soon.");
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
      <Field label="Message" error={errors.message?.message}>
        <textarea
          {...form.register("message")}
          rows={variant === "section" ? 5 : 4}
          placeholder="Tell us about your project and goals..."
          className={`${cls(!!errors.message)} resize-none`}
        />
      </Field>
      <Button
        type="submit"
        size="lg"
        className="w-full brand-gradient text-white border-0 hover:opacity-90 glow-blue"
        disabled={busy}
      >
        {busy ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
