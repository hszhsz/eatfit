import { EmptyState } from "@/components/common/EmptyState";
import { SectionCard } from "@/components/common/SectionCard";
import { useCurrentProfile } from "@/hooks/useCurrentProfile";
import { useGrocery } from "@/hooks/useDashboardData";
import { formatNumber } from "@/lib/format";
import { useDashboardStore } from "@/store/dashboardStore";

export function GroceryPage() {
  const { data: profile } = useCurrentProfile();
  const selectedDate = useDashboardStore((state) => state.selectedDate);
  const { data: grocery, isLoading, error } = useGrocery(profile, selectedDate);

  if (!profile) {
    return (
      <EmptyState
        title="No grocery output without a profile"
        body="Save your profile and daily plan inputs first. EatFit uses them to aggregate ingredients into a shopping list."
        cta="Go to Profile"
        to="/app/profile"
      />
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard title="Grocery list" eyebrow="Shopping">
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-48 animate-pulse rounded-3xl bg-[#FFF5EE]" />
            ))}
          </div>
        ) : error ? (
          <div className="text-red-500">{String(error.message)}</div>
        ) : grocery ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(grocery.grouped).map(([category, items]) => (
              <article
                key={category}
                className="rounded-[24px] border border-[#F0E6DD] bg-white p-5 shadow-warm"
              >
                <div className="mb-4 text-xs uppercase tracking-[0.24em] text-[#9C8B7A]">
                  {category}
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <label
                      key={`${category}-${item.name}`}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-[#F0E6DD] bg-[#FFF5EE] px-4 py-3"
                    >
                      <span className="flex items-center gap-3 text-[#3D2817]">
                        <input type="checkbox" className="h-4 w-4 rounded border-[#E8DDD3] bg-transparent" />
                        {item.name}
                      </span>
                      <span className="text-sm text-[#6B5544]">
                        {formatNumber(item.totalAmountG, 1)} g
                      </span>
                    </label>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-[#6B5544]">Generate a plan first.</div>
        )}
      </SectionCard>
    </div>
  );
}
