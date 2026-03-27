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

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export interface Master {
  id: string;
  name: string;
  role: string;
  experience: string;
  rating: number;
  reviews: number;
  image: string;
  available: boolean;
  specialties: string[];
  salonId: string;
  salonCode: string;
  salonName: string;
  salonAddress: string;
  location?: string;
  bio: string;
  portfolio: string[];
  clientReviews: Review[];
}

export const masters: Master[] = [
  {
    id: "1",
    name: "Azamat Jusupov",
    role: "Barber",
    experience: "8 years",
    rating: 4.9,
    reviews: 342,
    image: master1,
    available: true,
    specialties: ["Men haircut", "Shave", "Styling"],
    salonId: "1",
    salonCode: "center",
    salonName: "HairLine Center",
    salonAddress: "Chuy Ave, 150",
    bio: "Senior barber focused on clean fades, shape, and natural styling.",
    portfolio: [portfolio1, portfolio3, portfolio6],
    clientReviews: [
      { id: "r1", author: "Bekzat M.", rating: 5, text: "Always precise and professional.", date: "2024-12-15" },
      { id: "r2", author: "Nurlan K.", rating: 5, text: "Best beard shaping in town.", date: "2024-11-28" },
      { id: "r3", author: "Aibek T.", rating: 4, text: "Great result, slightly long wait.", date: "2024-11-10" },
    ],
  },
  {
    id: "2",
    name: "Aigul Satybaldieva",
    role: "Stylist",
    experience: "12 years",
    rating: 5.0,
    reviews: 518,
    image: master2,
    available: true,
    specialties: ["Women haircut", "Styling", "Care"],
    salonId: "1",
    salonCode: "center",
    salonName: "HairLine Center",
    salonAddress: "Chuy Ave, 150",
    bio: "Lead stylist for event looks and premium haircare routines.",
    portfolio: [portfolio2, portfolio4, portfolio5],
    clientReviews: [
      { id: "r4", author: "Zhibek A.", rating: 5, text: "Perfect look for special events.", date: "2024-12-20" },
      { id: "r5", author: "Nazgul B.", rating: 5, text: "Consistently high quality work.", date: "2024-12-05" },
      { id: "r6", author: "Altynai S.", rating: 5, text: "Exactly what I asked for.", date: "2024-11-22" },
    ],
  },
  {
    id: "3",
    name: "Daniyar Kasymov",
    role: "Barber",
    experience: "5 years",
    rating: 4.8,
    reviews: 189,
    image: master3,
    available: false,
    specialties: ["Men haircut", "Beard design"],
    salonId: "2",
    salonCode: "north",
    salonName: "HairLine North",
    salonAddress: "Jibek Jolu, 42",
    bio: "Modern cuts specialist with strong attention to detail.",
    portfolio: [portfolio1, portfolio6, portfolio3],
    clientReviews: [
      { id: "r7", author: "Erlan D.", rating: 5, text: "Great fade and clean finishing.", date: "2024-12-01" },
      { id: "r8", author: "Timur O.", rating: 4, text: "Good style and communication.", date: "2024-11-15" },
    ],
  },
  {
    id: "4",
    name: "Elnura Toktosunova",
    role: "Colorist",
    experience: "10 years",
    rating: 4.9,
    reviews: 427,
    image: master4,
    available: true,
    specialties: ["Coloring", "Highlights", "Balayage"],
    salonId: "3",
    salonCode: "south",
    salonName: "HairLine South",
    salonAddress: "Akhunbaev St, 98",
    bio: "Certified colorist focused on natural tones and healthy shine.",
    portfolio: [portfolio2, portfolio5, portfolio4],
    clientReviews: [
      { id: "r9", author: "Mirgul K.", rating: 5, text: "Excellent balayage result.", date: "2024-12-18" },
      { id: "r10", author: "Begimai N.", rating: 5, text: "Color is rich and long lasting.", date: "2024-12-10" },
      { id: "r11", author: "Aizhamal R.", rating: 4, text: "Strong quality overall.", date: "2024-11-30" },
    ],
  },
];
