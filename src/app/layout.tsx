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
