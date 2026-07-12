import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ian Huang's Portfolio",
  description:
    "个人作品集，展示设计与工程交叉领域的数字作品。",
};

export default function CnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}