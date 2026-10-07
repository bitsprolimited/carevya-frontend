"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const contactMessageSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(1, "Subject is required"),
  message: z.string().trim().min(1, "Message is required"),
});

type ContactMessageInput = z.infer<typeof contactMessageSchema>;

const defaults: ContactMessageInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

/** Figma: text inputs 24px radius / 40px height; message textarea 20px radius. */
const fieldClassName = "h-10 rounded-3xl px-4";
const messageClassName = cn(
  "flex min-h-[8.5rem] w-full resize-y rounded-[1.25rem] border border-border bg-white px-4 py-2.5 text-sm text-navy",
  "placeholder:text-muted",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

function FieldLabel({
  htmlFor,
  children,
  required,
  optional,
}: {
  htmlFor: string;
  children: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-navy"
    >
      {children}
      {required ? (
        <span className="text-danger" aria-hidden>
          {" "}
          *
        </span>
      ) : null}
      {optional ? (
        <span className="font-normal italic text-muted"> (Optional)</span>
      ) : null}
    </label>
  );
}

export function ContactFormSection() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: defaults,
  });

  function onSubmit(_data: ContactMessageInput) {
    setSubmitted(true);
    reset(defaults);
  }

  return (
    <section className="bg-surface-soft">
      <div className="mx-auto w-full max-w-7xl px-5 py-14 md:px-6 md:py-20 lg:px-8 lg:py-24 xl:px-10">
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-bold tracking-tight text-brand-blue sm:text-4xl lg:text-[2.5rem] lg:leading-[1.15]">
              Get in Touch
            </h2>
            <p className="mt-4 max-w-sm text-base leading-relaxed text-muted md:text-lg">
              If you have any questions or need assistance, simply fill the form
              and our team will get back to you as soon as possible
            </p>
          </div>

          <div className="rounded-3xl bg-background p-6 shadow-sm sm:p-8 lg:col-span-8 lg:p-10">
            <h3 className="text-xl font-semibold text-navy sm:text-2xl">
              Send a message
            </h3>

            <form
              className="mt-6 space-y-5"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="contact-first-name" required>
                    First Name
                  </FieldLabel>
                  <Input
                    id="contact-first-name"
                    autoComplete="given-name"
                    placeholder="John"
                    aria-invalid={Boolean(errors.firstName)}
                    className={fieldClassName}
                    {...register("firstName")}
                  />
                  {errors.firstName ? (
                    <p className="mt-1.5 text-xs text-danger">
                      {errors.firstName.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <FieldLabel htmlFor="contact-last-name" required>
                    Last Name
                  </FieldLabel>
                  <Input
                    id="contact-last-name"
                    autoComplete="family-name"
                    placeholder="Doe"
                    aria-invalid={Boolean(errors.lastName)}
                    className={fieldClassName}
                    {...register("lastName")}
                  />
                  {errors.lastName ? (
                    <p className="mt-1.5 text-xs text-danger">
                      {errors.lastName.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <FieldLabel htmlFor="contact-email" required>
                    Email address
                  </FieldLabel>
                  <Input
                    id="contact-email"
                    type="email"
                    autoComplete="email"
                    placeholder="johndoe@gmail.com"
                    aria-invalid={Boolean(errors.email)}
                    className={fieldClassName}
                    {...register("email")}
                  />
                  {errors.email ? (
                    <p className="mt-1.5 text-xs text-danger">
                      {errors.email.message}
                    </p>
                  ) : null}
                </div>
                <div>
                  <FieldLabel htmlFor="contact-phone" optional>
                    Phone number
                  </FieldLabel>
                  <Input
                    id="contact-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="9037239782"
                    className={fieldClassName}
                    {...register("phone")}
                  />
                </div>
              </div>

              <div>
                <FieldLabel htmlFor="contact-subject" required>
                  Subject matter
                </FieldLabel>
                <Input
                  id="contact-subject"
                  placeholder="Caregiver Enquiry"
                  aria-invalid={Boolean(errors.subject)}
                  className={fieldClassName}
                  {...register("subject")}
                />
                {errors.subject ? (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.subject.message}
                  </p>
                ) : null}
              </div>

              <div>
                <FieldLabel htmlFor="contact-message" required>
                  Message
                </FieldLabel>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Your message"
                  aria-invalid={Boolean(errors.message)}
                  className={messageClassName}
                  {...register("message")}
                />
                {errors.message ? (
                  <p className="mt-1.5 text-xs text-danger">
                    {errors.message.message}
                  </p>
                ) : null}
              </div>

              {submitted ? (
                <p
                  role="status"
                  className="rounded-2xl bg-emerald/10 px-4 py-3 text-sm font-medium text-emerald-dark"
                >
                  Thanks — your message has been noted. Our team will get back
                  to you soon.
                </p>
              ) : null}

              <div className="pt-1 text-center sm:pt-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="h-12 w-full max-w-md rounded-full px-8 text-base sm:h-14 sm:text-lg"
                >
                  Send message
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
