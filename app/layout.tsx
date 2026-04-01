import type { Metadata } from "next";
import { Inter, Noto_Sans_SC } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });
const notoSansSC = Noto_Sans_SC({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});

export const dynamic = "force-dynamic";
// export const dynamic = 'force-static'

export const metadata: Metadata = {
  title: "earthworm",
  description:
    "Practice Chinese: read 中文, type pinyin, and hear pronunciation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${notoSansSC.className}`}>
        {children}
        <Toaster></Toaster>
      </body>
    </html>
  );
}
