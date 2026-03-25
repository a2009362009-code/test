import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-barber.jpg";
import MasterCard from "@/components/MasterCard";
import ProductCard from "@/components/ProductCard";
import { useI18n } from "@/lib/i18n";
import { useMasters } from "@/hooks/useMasters";
import { useProducts } from "@/hooks/useProducts";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

const Index = () => {
  const { tr } = useI18n();
  const { masters } = useMasters();
  const { products } = useProducts();

  return (
    <div>
      <section className="relative flex min-h-[85vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="HairLine salon" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6">
          <motion.div initial="hidden" animate="visible" className="max-w-xl">
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-sm font-medium tracking-widest uppercase text-muted-foreground"
            >
              {tr("hero.subtitle")}
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="mt-4 text-hero font-semibold text-foreground"
            >
              {tr("hero.title")}
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-4 text-lg leading-relaxed text-muted-foreground"
            >
              {tr("hero.desc")}
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/masters"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.97]"
              >
                {tr("hero.book")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/80"
              >
                {tr("hero.shop")}
              </Link>
            </motion.div>
            <motion.div
              variants={fadeUp}
              custom={4}
              className="mt-8 flex gap-6 text-sm text-muted-foreground"
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {tr("hero.locations")}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {tr("hero.hours")}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{tr("masters.title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{tr("masters.subtitle")}</p>
          </div>
          <Link
            to="/masters"
            className="hidden items-center gap-1 text-sm font-medium text-foreground hover:underline sm:flex"
          >
            {tr("masters.all")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {masters.map((master, index) => (
            <motion.div
              key={master.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <MasterCard master={master} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{tr("products.title")}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{tr("products.subtitle")}</p>
            </div>
            <Link
              to="/shop"
              className="hidden items-center gap-1 text-sm font-medium text-foreground hover:underline sm:flex"
            >
              {tr("products.all")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="text-2xl font-semibold">{tr("salons.title")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{tr("salons.subtitle")}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            {
              key: "center",
              name: tr("salon.center.name"),
              address: tr("salon.center.address"),
              hours: "9:00 - 21:00",
            },
            {
              key: "north",
              name: tr("salon.north.name"),
              address: tr("salon.north.address"),
              hours: "10:00 - 20:00",
            },
            {
              key: "south",
              name: tr("salon.south.name"),
              address: tr("salon.south.address"),
              hours: "9:00 - 21:00",
            },
          ].map((location) => (
            <div key={location.key} className="rounded-2xl bg-card p-6 card-shadow">
              <h3 className="font-semibold">{location.name}</h3>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {location.address}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> {location.hours}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
