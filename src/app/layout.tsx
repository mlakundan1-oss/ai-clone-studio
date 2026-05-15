import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "@/styles/globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Ai Clone Studio — Create Videos at the Speed of AI",
  description: "Edit, Generate, Dub, Animate, Caption, and Render with AI. The future of AI video editing.",
  keywords: "AI video editing, AI avatars, voice cloning, video generator, AI captions",
  authors: [{ name: "Ai Clone Studio" }],
  openGraph: {
    title: "Ai Clone Studio",
    description: "Create Viral AI Videos in Minutes",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.variable} antialiased bg-background text-white`}>
        {children}
      </body>
    </html>
  );
}
