import "~/styles/globals.css";

import { type Metadata } from "next";
import localFont from "next/font/local";

import { TRPCReactProvider } from "~/trpc/react";
import { ThemeProvider } from "~/components/theme-provider";
import { SmoothScroll } from "~/components/SmoothScroll";
import { ScrollProgress } from "~/components/ScrollProgress";
import { ThreeBackground } from "~/components/ThreeBackground";
import { LoadingScreen } from "~/components/LoadingScreen";
import { FloatingSettings } from "~/components/FloatingSettings";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "The Incite Crew",
  description: "A clarity first ecosystem helping founders make better decisions and execute with intent.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const neueMontreal = localFont({
  src: "../../public/fonts/NeueMontreal-Medium.otf",
  variable: "--font-heading",
  weight: "500",
});

const nord = localFont({
  src: "../../public/fonts/Nord-Regular.woff2",
  variable: "--font-sans",
  weight: "400",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${neueMontreal.variable} ${nord.variable}`} suppressHydrationWarning>
      <body className="antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500 ease-in-out overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <LoadingScreen />
          <FloatingSettings />
          <ThreeBackground />
          <SmoothScroll>
            <ScrollProgress />
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </SmoothScroll>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
