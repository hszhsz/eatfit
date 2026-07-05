import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  body: string;
  cta?: string;
  to?: string;
}

export function EmptyState({ title, body, cta, to }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/15 bg-black/20 p-8 text-zinc-300">
      <h3 className="font-serif text-3xl text-white">{title}</h3>
      <p className="mt-4 max-w-2xl leading-7 text-zinc-400">{body}</p>
      {cta && to ? (
        <Link
          to={to}
          className="mt-6 inline-flex rounded-full bg-[#8cffb0] px-5 py-3 text-sm font-semibold text-[#04120a]"
        >
          {cta}
        </Link>
      ) : null}
    </div>
  );
}
