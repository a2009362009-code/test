import { useState } from "react";
import { motion } from "framer-motion";
import { masters } from "@/data/masters";
import MasterCard from "@/components/MasterCard";
import { useI18n } from "@/lib/i18n";

const Masters = () => {
  const { tr } = useI18n();

  const filters = [
    { key: "all", label: tr("filter.all"), value: "Все" },
    { key: "barber", label: tr("filter.barber"), value: "Барбер" },
    { key: "stylist", label: tr("filter.stylist"), value: "Стилист" },
    { key: "colorist", label: tr("filter.colorist"), value: "Колорист" },
  ];
  const locations = [
    { key: "all", label: tr("filter.all"), value: "Все" },
    { key: "center", label: tr("filter.center"), value: "Центр" },
    { key: "north", label: tr("filter.north"), value: "Север" },
    { key: "south", label: tr("filter.south"), value: "Юг" },
  ];

  const [activeFilter, setActiveFilter] = useState("Все");
  const [activeLocation, setActiveLocation] = useState("Все");

  const filtered = masters.filter((m) => {
    const roleMatch = activeFilter === "Все" || m.role === activeFilter;
    const locMatch = activeLocation === "Все" || m.location === activeLocation;
    return roleMatch && locMatch;
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl font-semibold">{tr("masters.page.title")}</h1>
        <p className="mt-2 text-muted-foreground">{tr("masters.page.subtitle")}</p>
      </motion.div>

      <div className="mt-8 flex flex-wrap gap-6">
        <div className="flex flex-wrap gap-2">
          <span className="mr-1 self-center text-xs text-muted-foreground uppercase tracking-wider">{tr("masters.specialty")}</span>
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                activeFilter === f.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="mr-1 self-center text-xs text-muted-foreground uppercase tracking-wider">{tr("masters.location")}</span>
          {locations.map((l) => (
            <button
              key={l.key}
              onClick={() => setActiveLocation(l.value)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-150 ${
                activeLocation === l.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/70"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((m, i) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
          >
            <MasterCard master={m} />
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">{tr("masters.notfound")}</p>
        </div>
      )}
    </div>
  );
};

export default Masters;
