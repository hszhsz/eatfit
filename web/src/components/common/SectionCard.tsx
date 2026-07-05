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
      className={`rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] ${className}`}
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">
              {eyebrow}
            </div>
          ) : null}
          <h2 className="mt-2 font-serif text-2xl text-white">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
