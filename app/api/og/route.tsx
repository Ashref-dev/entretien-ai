import { ImageResponse } from "@vercel/og";

import { ogImageSchema } from "@/lib/validations/og";

export const runtime = "edge";

const interRegular = fetch(
  new URL("../../../assets/fonts/Inter-Regular.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

const interBold = fetch(
  new URL("../../../assets/fonts/CalSans-SemiBold.ttf", import.meta.url),
).then((res) => res.arrayBuffer());

export async function GET(req: Request) {
  try {
    const fontRegular = await interRegular;
    const fontBold = await interBold;

    const url = new URL(req.url);
    const values = ogImageSchema.parse(Object.fromEntries(url.searchParams));
    const heading =
      values.heading.length > 80
        ? `${values.heading.substring(0, 100)}...`
        : values.heading;

    const { mode } = values;
    const paint = mode === "dark" ? "#fff" : "#000";

    const fontSize = heading.length > 80 ? "60px" : "80px";

    return new ImageResponse(
      (
        <div
          tw="flex relative flex-col p-12 w-full h-full items-start"
          style={{
            color: paint,
            background:
              mode === "dark"
                ? "linear-gradient(90deg, #000 0%, #111 100%)"
                : "white",
          }}
        >
          <div
            tw="text-5xl"
            style={{
              fontFamily: "Cal Sans",
              fontWeight: "normal",
              position: "relative",
              background: "linear-gradient(90deg, #6366f1, #a855f7 80%)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Entretien AI
          </div>

          <div tw="flex flex-col flex-1 py-16">
            {/* Type : Blog or Doc */}
            <div
              tw="flex text-xl uppercase font-bold tracking-tight"
              style={{ fontFamily: "Inter", fontWeight: "normal" }}
            >
              {values.type}
            </div>
            {/* Title */}
            <div
              tw="flex leading-[1.15] text-[80px] font-bold"
              style={{
                fontFamily: "Cal Sans",
                fontWeight: "bold",
                marginLeft: "-3px",
                fontSize,
              }}
            >
              {heading}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: fontRegular,
            weight: 400,
            style: "normal",
          },
          {
            name: "Cal Sans",
            data: fontBold,
            weight: 700,
            style: "normal",
          },
        ],
      },
    );
  } catch (error) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
