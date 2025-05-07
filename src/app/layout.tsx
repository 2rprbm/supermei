import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import ThemeRegistry from "@/components/providers/ThemeRegistry";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/styles/globals.scss";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SuperMEI",
  description: "Sistema de gestão para MEIs",
  keywords: "MEI, gestão, empreendedor, contabilidade",
  authors: [{ name: "SuperMEI Team" }],
  robots: "index, follow",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AppRouterCacheProvider>
          <ThemeRegistry>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
