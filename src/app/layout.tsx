import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionAuthProvider } from "@/components/session-auth";
import { Toaster } from "sonner";
import { QueryClientContext } from "@/providers/queryclient";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OdontoPro - Encontre os melhores profissionais de odontologia",
  description: "Nós somos uma plataforma que conecta pacientes a dentistas qualificados, oferecendo serviços odontológicos de alta qualidade e confiança.",
  robots: {
    index: true,
    nocache: true,
    follow: true,
  },
  openGraph: {
    title: "OdontoPro - Encontre os melhores profissionais de odontologia",
    description: "Nós somos uma plataforma que conecta pacientes a dentistas qualificados, oferecendo serviços odontológicos de alta qualidade e confiança.",
    images:[`${process.env.NEXT_PUBLIC_URL}/doctor-hero.png`],
  }
  };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

        <SessionAuthProvider>
          <QueryClientContext>
            <Toaster duration={2500} richColors position="top-right" />
           {children}
          </QueryClientContext>
        </SessionAuthProvider>
       
        </body>
    </html>
  );
}
