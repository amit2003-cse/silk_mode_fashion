import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Sarees & Ethnic Collections | Silk Mode Fashion Surat",
  description: "Explore handcrafted Banarasi, Kanjivaram, Organza sarees and designer suit sets from Surat manufacturer Silk Mode Fashion.",
  alternates: {
    canonical: "/collections",
  },
};

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
