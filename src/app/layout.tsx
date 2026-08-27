import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Memory.exe - Back when moments were saved, not posted",
  description: "An early-2000s computer desktop experience dedicated to classic Bollywood hits from the 1990s and 2000s.",
  keywords: ["Memory.exe", "Bollywood music", "Win98", "WinXP", "2000s desktop", "retro web app"],
  verification: {
    google: "e6D6akUBgVOu1U7T-RElprGJ84nYrh5UGaTWWftArHA",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="google-site-verification" content="e6D6akUBgVOu1U7T-RElprGJ84nYrh5UGaTWWftArHA" />
      </head>
      <body className="antialiased select-none bg-black">
        {children}
      </body>
    </html>
  );
}
