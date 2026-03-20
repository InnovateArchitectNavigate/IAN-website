/**
 * ContactSection.tsx
 * IAN — Neural Cartography Design System
 * 
 * Premium contact form — cinematic arrival, minimal UI, refined motion
 * Underline-only fields, magnetic submit button, elegant validation
 */

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FormState {
  name: string;
  email: string;
  company: string;
  domain: string;
  message: string;
}

const DOMAINS = [
  "Software Architecture",
  "AI Systems & Intelligence",
  "Immersive XR & Creative Tech",
  "Digital Product & Web",
  "Multiple Domains",
  "Not Sure Yet",
];

export default function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    company: "",
    domain: "",
    message: "",
  });
  const [focused, setFocused] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!sectionRef.current || !formRef.current) return;

    const elements = formRef.current.querySelectorAll(".form-animate");
    gsap.fromTo(
      elements,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          once: true,
        },
      }
    );
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1800));
    setSubmitting(false);
    setSubmitted(true);
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "#050507" }}
      id="contact"
    >
      {/* Background: subtle grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(68,136,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(68,136,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow center */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(68,136,255,0.04) 0%, transparent 70%)",
        }}
      />

      {/* Horizontal accent lines */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(68,136,255,0.3), transparent)" }}
      />

      <div className="relative z-10 w-full max-w-2xl mx-auto px-8 py-24">
        <div ref={formRef}>
          {/* Header */}
          <div className="form-animate mb-16">
            <div className="section-label mb-4" style={{ color: "#4488ff" }}>
              BEGIN COLLABORATION
            </div>
            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
                fontWeight: 700,
                lineHeight: 1.0,
                letterSpacing: "-0.03em",
                color: "oklch(0.92 0.02 240)",
              }}
            >
              Let's build
              <br />
              <span style={{ color: "#4488ff" }}>something</span>
              <br />
              extraordinary.
            </h2>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-0">
              {/* Name */}
              <FormField
                label="Your Name"
                value={form.name}
                onChange={(v) => handleChange("name", v)}
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                isFocused={focused === "name"}
                required
                className="form-animate"
              />

              {/* Email */}
              <FormField
                label="Email Address"
                type="email"
                value={form.email}
                onChange={(v) => handleChange("email", v)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                isFocused={focused === "email"}
                required
                className="form-animate"
              />

              {/* Company */}
              <FormField
                label="Company / Organization"
                value={form.company}
                onChange={(v) => handleChange("company", v)}
                onFocus={() => setFocused("company")}
                onBlur={() => setFocused(null)}
                isFocused={focused === "company"}
                className="form-animate"
              />

              {/* Domain selector */}
              <div className="form-animate py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <label
                  className="block font-mono text-xs mb-4"
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.625rem",
                    letterSpacing: "0.2em",
                    color: "rgba(180,195,235,0.5)",
                  }}
                >
                  AREA OF INTEREST
                </label>
                <div className="flex flex-wrap gap-2">
                  {DOMAINS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleChange("domain", d)}
                      className="transition-all duration-300"
                      style={{
                        fontFamily: "Space Grotesk, sans-serif",
                        fontSize: "0.75rem",
                        letterSpacing: "0.05em",
                        padding: "0.5rem 1rem",
                        border: `1px solid ${form.domain === d ? "rgba(68,136,255,0.6)" : "rgba(255,255,255,0.1)"}`,
                        color: form.domain === d ? "rgba(68,136,255,1)" : "rgba(180,195,235,0.5)",
                        background: form.domain === d ? "rgba(68,136,255,0.08)" : "transparent",
                        boxShadow: form.domain === d ? "0 0 12px rgba(68,136,255,0.15)" : "none",
                      }}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="form-animate py-6 border-b" style={{ borderColor: focused === "message" ? "rgba(68,136,255,0.5)" : "rgba(255,255,255,0.08)" }}>
                <label
                  className="block font-mono text-xs mb-4"
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.625rem",
                    letterSpacing: "0.2em",
                    color: focused === "message" ? "rgba(68,136,255,0.8)" : "rgba(180,195,235,0.5)",
                    transition: "color 0.3s",
                  }}
                >
                  YOUR MESSAGE
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => handleChange("message", e.target.value)}
                  onFocus={() => setFocused("message")}
                  onBlur={() => setFocused(null)}
                  rows={4}
                  placeholder="Tell us about your project, vision, or challenge..."
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    outline: "none",
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "1rem",
                    color: "rgba(220,230,255,0.9)",
                    lineHeight: 1.7,
                    resize: "none",
                  }}
                  className="placeholder-opacity-30"
                />
              </div>

              {/* Submit */}
              <div className="form-animate pt-10 flex items-center justify-between">
                <p
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    fontSize: "0.625rem",
                    letterSpacing: "0.15em",
                    color: "rgba(180,195,235,0.3)",
                  }}
                >
                  WE RESPOND WITHIN 24 HOURS
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="ian-btn relative overflow-hidden"
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "0.8125rem",
                    fontWeight: 500,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "1rem 2.5rem",
                    border: "1px solid rgba(68,136,255,0.4)",
                    color: submitting ? "rgba(68,136,255,0.5)" : "rgba(220,230,255,0.9)",
                    background: "transparent",
                    transition: "all 0.4s",
                    minWidth: "180px",
                  }}
                >
                  {submitting ? (
                    <span className="flex items-center gap-3">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{
                          border: "1px solid rgba(68,136,255,0.6)",
                          borderTopColor: "rgba(68,136,255,1)",
                          animation: "rotate-slow 0.8s linear infinite",
                        }}
                      />
                      TRANSMITTING
                    </span>
                  ) : (
                    "INITIATE CONTACT"
                  )}
                </button>
              </div>
            </form>
          ) : (
            <SuccessState />
          )}
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  onFocus,
  onBlur,
  isFocused,
  type = "text",
  required = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  isFocused: boolean;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`py-6 border-b transition-all duration-300 ${className}`}
      style={{
        borderColor: isFocused ? "rgba(68,136,255,0.5)" : "rgba(255,255,255,0.08)",
      }}
    >
      <label
        className="block font-mono text-xs mb-2"
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.625rem",
          letterSpacing: "0.2em",
          color: isFocused ? "rgba(68,136,255,0.8)" : "rgba(180,195,235,0.5)",
          transition: "color 0.3s",
        }}
      >
        {label.toUpperCase()}
        {required && <span style={{ color: "#4488ff", marginLeft: "4px" }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        required={required}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          outline: "none",
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "1.125rem",
          color: "rgba(220,230,255,0.9)",
          letterSpacing: "0.01em",
        }}
      />
    </div>
  );
}

function SuccessState() {
  return (
    <div
      className="py-16 text-center"
      style={{ animation: "fade-in-up 0.8s ease forwards" }}
    >
      {/* Success icon */}
      <div
        className="mx-auto mb-8 flex items-center justify-center"
        style={{
          width: "80px",
          height: "80px",
          border: "1px solid rgba(68,136,255,0.4)",
          borderRadius: "50%",
          boxShadow: "0 0 40px rgba(68,136,255,0.2)",
        }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d="M6 16L13 23L26 9"
            stroke="rgba(68,136,255,0.9)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <h3
        style={{
          fontFamily: "Syne, sans-serif",
          fontSize: "2rem",
          fontWeight: 700,
          color: "oklch(0.92 0.02 240)",
          marginBottom: "1rem",
        }}
      >
        Message Received
      </h3>

      <p
        style={{
          fontFamily: "Space Grotesk, sans-serif",
          fontSize: "1rem",
          color: "rgba(180,195,235,0.6)",
          lineHeight: 1.7,
          maxWidth: "400px",
          margin: "0 auto 2rem",
        }}
      >
        Your transmission has been received. We'll be in contact within 24 hours to begin the conversation.
      </p>

      <div
        className="font-mono text-xs"
        style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: "0.625rem",
          letterSpacing: "0.2em",
          color: "rgba(68,136,255,0.5)",
        }}
      >
        SIGNAL CONFIRMED — IAN SYSTEMS ONLINE
      </div>
    </div>
  );
}
