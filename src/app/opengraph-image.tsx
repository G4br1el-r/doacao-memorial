import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.shareTitle} — ${SITE.description}`;

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

export default async function OpengraphImage() {
  const [background, priest] = await Promise.all([
    readFile(join(process.cwd(), "public/images/png/background.png")),
    readFile(join(process.cwd(), "public/images/png/padre.png")),
  ]);

  const backgroundSrc = `data:image/png;base64,${background.toString("base64")}`;
  const priestSrc = `data:image/png;base64,${priest.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: "#000000",
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: ImageResponse roda no satori, next/image nao existe aqui */}
      <img
        src={backgroundSrc}
        alt=""
        width={1200}
        height={630}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.78) 42%, rgba(0,0,0,0.28) 72%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* biome-ignore lint/performance/noImgElement: ImageResponse roda no satori, next/image nao existe aqui */}
      <img
        src={priestSrc}
        alt=""
        width={520}
        height={609}
        style={{
          position: "absolute",
          right: 40,
          bottom: 0,
          width: 520,
          height: 609,
          objectFit: "contain",
        }}
      />

      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 64px",
          width: 700,
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 22,
            letterSpacing: 8,
            color: "#d9c9a3",
          }}
        >
          FAÇA PARTE
          <div style={{ width: 90, height: 1, backgroundColor: "#d9c9a3" }} />
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 108,
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: -1,
            color: "#e8dcc0",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>DE ALGO</span>
          <span>MAIOR</span>
        </div>

        <div
          style={{
            marginTop: 30,
            fontSize: 27,
            lineHeight: 1.45,
            color: "rgba(255,255,255,0.88)",
            maxWidth: 560,
          }}
        >
          {SITE.description}
        </div>

        <div
          style={{
            marginTop: 38,
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 19,
            letterSpacing: 4,
            color: "#0b0b0b",
            backgroundColor: "#e8dcc0",
            padding: "16px 34px",
            borderRadius: 10,
            fontWeight: 600,
            alignSelf: "flex-start",
          }}
        >
          FAÇA SUA DOAÇÃO
        </div>
      </div>
    </div>,
    size,
  );
}
