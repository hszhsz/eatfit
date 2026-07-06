import type { PropsWithChildren, ReactNode } from "react";

interface SectionCardProps extends PropsWithChildren {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionCard({
  title,
  eyebrow,
  action,
  className = "",
  children,
}: SectionCardProps) {
  return (
    <section
      className={`rounded-[24px] border border-[#F0E6DD] bg-white p-6 shadow-warm ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
              {eyebrow}
            </div>
          ) : null}
          <h2 className="mt-2 font-serif text-2xl text-[#1F1611]">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
