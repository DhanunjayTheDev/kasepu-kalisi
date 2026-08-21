import type { ReactNode } from "react";

interface LegalLayoutProps {
  title: string;
  updated: string;
  children: ReactNode;
}

export function LegalLayout({ title, updated, children }: LegalLayoutProps) {
  return (
    <div className="container-kk py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl sm:text-5xl">{title}</h1>
        <p className="mt-3 text-sm text-slate">Last updated {updated}</p>
        <div className="prose-legal mt-10 flex flex-col gap-6 text-sm leading-relaxed text-slate sm:text-base [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-teal [&_h2]:sm:text-2xl [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2">
          {children}
        </div>
      </div>
    </div>
  );
}
