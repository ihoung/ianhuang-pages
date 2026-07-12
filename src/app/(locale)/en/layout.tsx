import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ian Huang's Portfolio",
  description:
    "Personal portfolio showcasing digital work at the intersection of design and engineering.",
};

export default function EnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}