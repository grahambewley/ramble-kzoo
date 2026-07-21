import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | The Ramble",
  manifest: "/admin.webmanifest",
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
