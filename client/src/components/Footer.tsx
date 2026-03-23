/**
 * Footer.tsx
 * IAN — Neural Cartography Design System
 * 
 * Minimal footer: IAN wordmark, tagline, social links
 */

export default function Footer() {
  return (
    <footer
      className="relative py-16 px-8 lg:px-16"
      style={{
        background: "#050507",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      {/* Top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(68,136,255,0.2), transparent)",
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "3rem",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                color: "oklch(0.92 0.02 240)",
                lineHeight: 1,
                marginBottom: "0.75rem",
              }}
            >
              [IAN]
            </div>
            <p
              style={{
                fontFamily: "Space Grotesk, sans-serif",
                fontSize: "0.8125rem",
                color: "rgba(180,195,235,0.4)",
                letterSpacing: "0.05em",
                maxWidth: "280px",
                lineHeight: 1.6,
              }}
            >
              Innovate. Architect. Navigate.
              <br />
              A creative technology studio.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col sm:flex-row gap-12">
            <div>
              <div
                className="font-mono text-xs mb-4"
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.2em",
                  color: "rgba(68,136,255,0.5)",
                  marginBottom: "1rem",
                }}
              >
                DOMAINS
              </div>
              {["Software Architecture", "AI Systems", "Immersive XR", "Digital Products"].map((item) => (
                <div
                  key={item}
                  className="mb-2"
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "0.8125rem",
                    color: "rgba(180,195,235,0.4)",
                    cursor: "default",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            <div>
              <div
                className="font-mono text-xs mb-4"
                style={{
                  fontFamily: "JetBrains Mono, monospace",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.2em",
                  color: "rgba(68,136,255,0.5)",
                  marginBottom: "1rem",
                }}
              >
                CONNECT
              </div>
              {["hello@ian.studio", "LinkedIn", "GitHub", "Dribbble"].map((item) => (
                <div
                  key={item}
                  className="mb-2"
                  style={{
                    fontFamily: "Space Grotesk, sans-serif",
                    fontSize: "0.8125rem",
                    color: "rgba(180,195,235,0.4)",
                    cursor: "default",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
        >
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.5625rem",
              letterSpacing: "0.15em",
              color: "rgba(180,195,235,0.2)",
            }}
          >
            © {new Date().getFullYear()} IAN STUDIO. ALL SYSTEMS OPERATIONAL.
          </span>
          <span
            style={{
              fontFamily: "JetBrains Mono, monospace",
              fontSize: "0.5625rem",
              letterSpacing: "0.15em",
              color: "rgba(68,136,255,0.25)",
            }}
          >
            NEURAL CARTOGRAPHY v1.0
          </span>
        </div>
      </div>
    </footer>
  );
}
