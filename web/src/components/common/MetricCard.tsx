interface MetricCardProps {
  label: string;
  value: string;
  meta?: string;
}

export function MetricCard({ label, value, meta }: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-[#F0E6DD] bg-white p-5 shadow-warm">
      <div className="text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-[#1F1611]">{value}</div>
      {meta ? <div className="mt-2 text-sm text-[#6B5544]">{meta}</div> : null}
    </div>
  );
}
