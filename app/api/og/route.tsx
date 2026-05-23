import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Demystify";
  const category = searchParams.get("category") || "Post";
  const date = searchParams.get("date") || "";

  // Broadside Aesthetic colors
  const bg = "#faf8f5";
  const text = "#1a1a1a";
  const accent = "#c4553a";
  const muted = "#888888";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bg,
          padding: "60px",
          fontFamily: "'Playfair Display', 'Georgia', serif",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            backgroundColor: accent,
          }}
        />

        {/* Category tag */}
        <div
          style={{
            fontSize: "24px",
            color: accent,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            marginBottom: "40px",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          {category}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: 700,
            color: text,
            textAlign: "center",
            lineHeight: 1.2,
            maxWidth: "900px",
            fontFamily: "'Playfair Display', 'Georgia', serif",
          }}
        >
          {title}
        </div>

        {/* Bottom section */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "0 60px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              color: muted,
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {date}
          </div>
          <div
            style={{
              fontSize: "28px",
              color: text,
              fontWeight: 700,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Demystify
          </div>
        </div>

        {/* Bottom border line */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "60px",
            right: "60px",
            height: "2px",
            backgroundColor: "#e8e4de",
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
