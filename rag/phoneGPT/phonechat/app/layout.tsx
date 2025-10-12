import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PhoneGPT",
  description: "PhoneGPT, a chatbot that demonstrates  the basics of RAG with PhoneGPT",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
