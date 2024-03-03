export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/providers/next-theme-provider";
import { SupabaseUserProvider } from "@/lib/providers/supabase-user-provider";
import AppStateProvider from "@/lib/providers/state-provider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* the nexttheme creates the warning on the frontend */}
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <AppStateProvider>
              <SupabaseUserProvider>
                {children}
              </SupabaseUserProvider>
            </AppStateProvider>
          </ThemeProvider>
      </body>
    </html>
  );
}
