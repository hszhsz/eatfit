import { Link } from "react-router-dom";

interface EmptyStateProps {
  title: string;
  body: string;
  cta?: string;
  to?: string;
}

export function EmptyState({ title, body, cta, to }: EmptyStateProps) {
  return (
    <div className="rounded-[24px] border border-dashed border-[#E8DDD3] bg-white p-8 text-[#6B5544]">
      <h3 className="font-serif text-3xl text-[#1F1611]">{title}</h3>
      <p className="mt-4 max-w-2xl leading-7 text-[#6B5544]">{body}</p>
      {cta && to ? (
        <Link
          to={to}
          className="mt-6 inline-flex rounded-full bg-[#FF6B35] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#E55329]"
        >
          {cta}
        </Link>
      ) : null}
    </div>
  );
}
