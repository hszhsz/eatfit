interface MetricCardProps {
  label: string;
  value: string;
  meta?: string;
}

export function MetricCard({ label, value, meta }: MetricCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
      <div className="text-xs uppercase tracking-[0.24em] text-zinc-500">{label}</div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
      {meta ? <div className="mt-2 text-sm text-zinc-400">{meta}</div> : null}
    </div>
  );
}
