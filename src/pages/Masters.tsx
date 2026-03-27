import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import MasterCard from "@/components/MasterCard";
import { useI18n } from "@/lib/i18n";
import { useMasters } from "@/hooks/useMasters";
import { useSalons } from "@/hooks/useSalons";

function normalizeRole(value: string) {
  const source = value.trim().toLowerCase();
  if (source.includes("barber")) return "barber";
  if (source.includes("stylist")) return "stylist";
  if (source.includes("color")) return "colorist";
  return source;
}

const Masters = () => {
  const { tr } = useI18n();
  const { masters, isLoading, isError, refetch } = useMasters();
  const { salons } = useSalons();

  const filters = [
    { key: "all", label: tr("filter.all"), value: "all" },
    { key: "barber", label: tr("filter.barber"), value: "barber" },
    { key: "stylist", label: tr("filter.stylist"), value: "stylist" },
    { key: "colorist", label: tr("filter.colorist"), value: "colorist" },
  ];

  const salonFilters = useMemo(
    () => [
      { key: "all", label: tr("filter.all"), value: "all" },
      ...salons.map((salon) => ({
        key: salon.id,
        label: salon.name,
        value: salon.id,
      })),
    ],
    [salons, tr],
  );

  const [activeFilter, setActiveFilter] = useState("all");
  const [activeSalon, setActiveSalon] = useState("all");

  const filtered = masters.filter((master) => {
    const roleMatch =
      activeFilter === "all" || normalizeRole(master.role) === activeFilter;
    const salonMatch = activeSalon === "all" || master.salonId === activeSalon;
    return roleMatch && salonMatch;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-semibold">{tr("masters.page.title")}</h1>
        <p className="mt-2 text-muted-foreground">{tr("masters.page.subtitle")}</p>
      </motion.div>

      <div className="mt-8 flex flex-wrap gap-6">
        <div className="flex flex-wrap gap-2">
          <span className="mr-1 self-center text-xs text-muted-foreground uppercase tracking-wider">
            {tr("masters.specialty")}
          </span>
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                activeFilter === filter.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="mr-1 self-center text-xs text-muted-foreground uppercase tracking-wider">
            {tr("masters.location")}
          </span>
          {salonFilters.map((salonFilter) => (
            <button
              key={salonFilter.key}
              onClick={() => setActiveSalon(salonFilter.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                activeSalon === salonFilter.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              }`}
            >
              {salonFilter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading && masters.length === 0 &&
          Array.from({ length: 8 }).map((_, index) => (
            <div key={`masters-skeleton-${index}`} className="h-[360px] animate-pulse rounded-2xl bg-secondary/60" />
          ))}

        {!isLoading && isError && (
          <div className="col-span-full rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">Could not load masters.</p>
            <button
              className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
              onClick={() => refetch()}
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-border bg-card p-6 text-center">
            <p className="text-sm text-muted-foreground">{tr("masters.notfound")}</p>
          </div>
        )}

        {!isLoading && !isError && filtered.map((master, index) => (
          <motion.div
            key={master.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            <MasterCard master={master} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Masters;
