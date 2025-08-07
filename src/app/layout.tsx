import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Tus fuentes, ¡mantenlas!
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- SEO: palabras clave, OG, etc ---
export const metadata: Metadata = {
  title: "Verificador de Noticias Falsas IA | Detector de Bulos y Fake News en Español",
  description:
    "Comprueba la veracidad de noticias, enlaces y titulares online. Detector de bulos y noticias falsas con inteligencia artificial y fuentes científicas. Fact-checking rápido, fiable y en español.",
  keywords:
    "verificador de noticias falsas, detector de bulos, comprobar noticias, fact-checking, analizar fake news, inteligencia artificial, verificar enlaces, noticias fiables, IA noticias, desmentir bulos",
  authors: [{ name: "Sara Hidalgo Caro", url: "https://noticiasfalsas-frontend.vercel.app" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Verificador de Noticias Falsas IA",
    description: "Detecta y desmiente noticias falsas, bulos y fake news online con IA y fuentes fiables. Proyecto hecho por Sara Hidalgo Caro.",
    url: "https://noticiasfalsas-frontend.vercel.app",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Verificador de Noticias Falsas con IA",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable}`}
        style={{
          minHeight: "100vh",
          margin: 0,
          padding: 0,
          background: "#f6f9fa",
        }}
      >
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            flexDirection: "column",
          }}
        >
          <main style={{ flex: "1 0 auto" }}>{children}</main>
          <footer
            style={{
              width: "100%",
              textAlign: "center",
              padding: "24px 0 18px 0",
              background: "#1976d2",
              color: "white",
              fontWeight: 400,
              letterSpacing: 1,
              fontSize: 16,
              borderTopLeftRadius: 32,
              borderTopRightRadius: 32,
              boxShadow: "0 0 14px #1976d2aa",
              flexShrink: 0,
            }}
          >
            Hecho por Sara Hidalgo Caro 2025
          </footer>
        </div>
      </body>
    </html>
  );
}
