import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VIRALCUT - AI ตัดคลิป YouTube TikTok อัตโนมัติ",
  description: "AI ตัดคลิปไวรัลอัตโนมัติ จาก YouTube, TikTok เป็นคลิปสั้น พร้อมซับไตเติ้ล จัดหน้า 9:16 อัตโนมัติ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased bg-[#050505] text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
