import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-barber.jpg";
import MasterCard from "@/components/MasterCard";
import ProductCard from "@/components/ProductCard";
import SalonsMap from "@/components/SalonsMap";
import { useMasters } from "@/hooks/useMasters";
import { useProducts } from "@/hooks/useProducts";
import { useSalons } from "@/hooks/useSalons";
import { useI18n } from "@/lib/i18n";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: index * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

const Index = () => {
  const { tr } = useI18n();
  const {
    masters,
    isLoading: mastersLoading,
    isError: mastersError,
    refetch: refetchMasters,
  } = useMasters();
  const {
    products,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
  } = useProducts();
  const {
    salons,
    isLoading: salonsLoading,
    isError: salonsError,
    refetch: refetchSalons,
  } = useSalons();

  const heroSalonsLabel = useMemo(
    () => `${salons.length} ${tr("hero.locations").toLowerCase()}`,
    [salons.length, tr],
  );

  return (
    <div>
      <section className="relative flex min-h-[72vh] items-center overflow-hidden sm:min-h-[85vh]">
        <div className="absolute inset-0">
          <img src={heroImage} alt="HairLine salon" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/20 sm:from-background sm:via-background/80 sm:to-transparent" />
        </div>

        <div className="page-shell relative z-10">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl py-8">
            <motion.p
              variants={fadeUp}
              custom={0}
              className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-sm"
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
              className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
            >
              {tr("hero.desc")}
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                to="/masters"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.97]"
              >
                {tr("hero.book")}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-secondary px-6 text-sm font-medium text-secondary-foreground transition-all hover:bg-secondary/80"
              >
                {tr("hero.shop")}
              </Link>
            </motion.div>

            <motion.div
              variants={fadeUp}
              custom={4}
              className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-6"
            >
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" /> {heroSalonsLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> {tr("hero.hours")}
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="page-shell page-section">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="section-title">{tr("masters.title")}</h2>
            <p className="section-subtitle">{tr("masters.subtitle")}</p>
          </div>
          <Link
            to="/masters"
            className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline sm:self-end"
          >
            {tr("masters.all")} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {mastersLoading &&
            masters.length === 0 &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`master-skeleton-${index}`}
                className="h-[360px] animate-pulse rounded-2xl bg-secondary/60"
              />
            ))}

          {!mastersLoading && mastersError && (
            <div className="col-span-full rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground">Could not load masters.</p>
              <button
                className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
                onClick={() => refetchMasters()}
              >
                Retry
              </button>
            </div>
          )}

          {!mastersLoading && !mastersError && masters.length === 0 && (
            <div className="col-span-full rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground">{tr("masters.notfound")}</p>
            </div>
          )}

          {!mastersLoading &&
            !mastersError &&
            masters.map((master, index) => (
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
        <div className="page-shell page-section">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="section-title">{tr("products.title")}</h2>
              <p className="section-subtitle">{tr("products.subtitle")}</p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1 text-sm font-medium text-foreground hover:underline sm:self-end"
            >
              {tr("products.all")} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {productsLoading &&
              products.length === 0 &&
              Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={`product-skeleton-${index}`}
                  className="h-[340px] animate-pulse rounded-2xl bg-card/70"
                />
              ))}

            {!productsLoading && productsError && (
              <div className="col-span-full rounded-2xl border border-border bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground">Could not load products.</p>
                <button
                  className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
                  onClick={() => refetchProducts()}
                >
                  Retry
                </button>
              </div>
            )}

            {!productsLoading && !productsError && products.length === 0 && (
              <div className="col-span-full rounded-2xl border border-border bg-card p-6 text-center">
                <p className="text-sm text-muted-foreground">No products available.</p>
              </div>
            )}

            {!productsLoading &&
              !productsError &&
              products.slice(0, 4).map((product, index) => (
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

      <section className="page-shell page-section">
        <h2 className="section-title">{tr("salons.title")}</h2>
        <p className="section-subtitle">{tr("salons.subtitle")}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {salonsLoading &&
            salons.length === 0 &&
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`salon-skeleton-${index}`}
                className="h-[148px] animate-pulse rounded-2xl bg-secondary/60"
              />
            ))}

          {!salonsLoading && salonsError && (
            <div className="col-span-full rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground">Could not load salons.</p>
              <button
                className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground"
                onClick={() => refetchSalons()}
              >
                Retry
              </button>
            </div>
          )}

          {!salonsLoading && !salonsError && salons.length === 0 && (
            <div className="col-span-full rounded-2xl border border-border bg-card p-6 text-center">
              <p className="text-sm text-muted-foreground">No salons available.</p>
            </div>
          )}

          {!salonsLoading &&
            !salonsError &&
            salons.map((salon) => (
              <div key={salon.id} className="rounded-2xl bg-card p-5 card-shadow sm:p-6">
                <h3 className="font-semibold">{salon.name}</h3>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {salon.address}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> {salon.workHours}
                </p>
              </div>
            ))}
        </div>
        <div className="mt-8">
          <SalonsMap locations={salons} />
        </div>
      </section>
    </div>
  );
};

export default Index;
