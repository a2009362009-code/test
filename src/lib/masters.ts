import type { Master } from "@/data/masters";
import type { ApiBarber } from "@/lib/api";
import master1 from "@/assets/master-1.jpg";
import master2 from "@/assets/master-2.jpg";
import master3 from "@/assets/master-3.jpg";
import master4 from "@/assets/master-4.jpg";

const imageMap: Record<string, string> = {
  "/assets/master-1.jpg": master1,
  "/assets/master-2.jpg": master2,
  "/assets/master-3.jpg": master3,
  "/assets/master-4.jpg": master4,
};

function resolveImage(imageUrl: string | undefined, index: number) {
  const fallback = [master1, master2, master3, master4][index % 4];
  if (!imageUrl) return fallback;
  return imageMap[imageUrl] || imageUrl;
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
    const location = barber.location || "";
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
      location,
      bio,
      image,
      portfolio: [],
      clientReviews: [],
    };
  });
}
