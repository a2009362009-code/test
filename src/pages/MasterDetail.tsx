import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ArrowLeft, MapPin, Clock, Award } from "lucide-react";
import BookingDialog from "@/components/BookingDialog";
import { useI18n } from "@/lib/i18n";
import { useMasters } from "@/hooks/useMasters";

const MasterDetail = () => {
  const { id } = useParams();
  const { masters } = useMasters();
  const master = masters.find((item) => item.id === id);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const { tr, tv, formatDate, formatYears } = useI18n();

  if (!master) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20 text-center">
        <p className="text-muted-foreground">{tr("masters.notfound.single")}</p>
        <Link
          to="/masters"
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          {tr("masters.backlink")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <Link
        to="/masters"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> {tr("masters.back")}
      </Link>

      <div className="grid gap-10 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1"
        >
          <div className="overflow-hidden rounded-2xl">
            <img
              src={master.image}
              alt={master.name}
              className="h-full w-full aspect-[3/4] object-cover"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 flex flex-col justify-center"
        >
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-semibold">{master.name}</h1>
            {master.available && (
              <span className="inline-flex items-center rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent ring-1 ring-inset ring-accent/20">
                {tr("master.available")}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Award className="h-4 w-4" /> {tv("role", master.role)}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {formatYears(master.experience)}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {tv("location", master.location)}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-4 w-4 ${
                    index < Math.round(master.rating)
                      ? "fill-foreground text-foreground"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm font-medium">{master.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({master.reviews} {tr("master.reviews")})
            </span>
          </div>

          {master.bio && (
            <p className="mt-6 text-muted-foreground leading-relaxed">{master.bio}</p>
          )}

          {master.specialties.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {master.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="rounded-lg bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground"
                >
                  {tv("specialty", specialty)}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={() => setBookingOpen(true)}
            disabled={!master.available}
            className="mt-8 inline-flex w-fit items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none"
          >
            {master.available ? tr("master.book") : tr("master.nobook")}
          </button>
        </motion.div>
      </div>

      {master.portfolio.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-semibold">{tr("master.portfolio")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{tr("master.portfolio.desc")}</p>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
            {master.portfolio.map((image, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="cursor-pointer overflow-hidden rounded-2xl"
                onClick={() => setLightboxImg(image)}
              >
                <img
                  src={image}
                  alt={`${master.name} portfolio ${index + 1}`}
                  className="aspect-square w-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {master.clientReviews.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-16 mb-8"
        >
          <h2 className="text-2xl font-semibold">{tr("master.clientreviews")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {master.clientReviews.length} {tr("master.reviews")}
          </p>
          <div className="mt-6 space-y-4">
            {master.clientReviews.map((review) => (
              <div key={review.id} className="rounded-2xl bg-card p-5 card-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
                      {review.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{review.author}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(new Date(review.date), {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className={`h-3.5 w-3.5 ${
                          index < review.rating
                            ? "fill-foreground text-foreground"
                            : "text-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {review.text}
                </p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-6"
          onClick={() => setLightboxImg(null)}
        >
          <motion.img
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            src={lightboxImg}
            alt="Portfolio"
            className="max-h-[85vh] max-w-full rounded-2xl object-contain"
          />
        </div>
      )}

      <BookingDialog master={master} open={bookingOpen} onOpenChange={setBookingOpen} />
    </div>
  );
};

export default MasterDetail;
