import type { Master } from "@/data/masters";
import type { ApiBarber, ApiReview } from "@/lib/api";
import master1 from "@/assets/master-1.jpg";
import master2 from "@/assets/master-2.jpg";
import master3 from "@/assets/master-3.jpg";
import master4 from "@/assets/master-4.jpg";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";
import portfolio4 from "@/assets/portfolio-4.jpg";
import portfolio5 from "@/assets/portfolio-5.jpg";
import portfolio6 from "@/assets/portfolio-6.jpg";

const imageMap: Record<string, string> = {
  "/assets/master-1.jpg": master1,
  "/assets/master-2.jpg": master2,
  "/assets/master-3.jpg": master3,
  "/assets/master-4.jpg": master4,
};

const fallbackMasterImages = [master1, master2, master3, master4];

const portfolioPresets: string[][] = [
  [portfolio1, portfolio2, portfolio3],
  [portfolio2, portfolio4, portfolio5, portfolio6],
  [portfolio3, portfolio1, portfolio5, portfolio2, portfolio6],
  [portfolio4, portfolio5, portfolio6],
];

function resolveImage(imageUrl: string | undefined, index: number) {
  const fallback = fallbackMasterImages[index % fallbackMasterImages.length];
  if (!imageUrl) return fallback;

  if (imageMap[imageUrl]) {
    return imageMap[imageUrl];
  }

  const normalizedUrl = imageUrl.toLowerCase();
  if (normalizedUrl.includes("placehold.co") || normalizedUrl.includes("placeholder")) {
    return fallback;
  }

  return imageUrl;
}

function resolvePortfolio(index: number) {
  return portfolioPresets[index % portfolioPresets.length];
}

export function mapBarbersToMasters(barbers: ApiBarber[]): Master[] {
  if (!barbers.length) return [];

  return barbers.map((barber, index) => {
    const years = barber.experience_years ?? 1;
    const rating = barber.rating ?? 0;
    const reviews = barber.reviews_count ?? 0;
    const specialties = barber.specialties || [];
    const available = barber.is_available ?? true;
    const role = barber.role || "Barber";
    const salon = barber.salon;
    const salonId =
      typeof barber.salon_id === "number"
        ? String(barber.salon_id)
        : typeof salon?.id === "number"
          ? String(salon.id)
          : "0";
    const salonCode = salon?.code || "unassigned";
    const salonName = salon?.name || "";
    const salonAddress = salon?.address || "";
    const bio = barber.bio || "";
    const image = resolveImage(barber.image_url, index);

    return {
      id: String(barber.id),
      name: barber.name,
      role,
      experience: `${years} years`,
      rating: Number(rating),
      reviews: Number(reviews),
      specialties,
      available,
      salonId,
      salonCode,
      salonName,
      salonAddress,
      location: salonAddress,
      bio,
      image,
      portfolio: resolvePortfolio(index),
      clientReviews: [],
    };
  });
}

export function mapApiReviewsToMasterReviews(reviews: ApiReview[]): Master["clientReviews"] {
  return reviews.map((review) => ({
    id: String(review.id),
    author: review.author_name,
    rating: Math.max(1, Math.min(5, Math.round(Number(review.rating)))),
    text: review.comment,
    date: review.created_at,
  }));
}
