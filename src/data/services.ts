export interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
  category: "men" | "women" | "unisex";
}

export const services: Service[] = [
  { id: "s1", name: "Men haircut", duration: "45 min", price: 500, category: "men" },
  { id: "s2", name: "Haircut and styling", duration: "60 min", price: 700, category: "men" },
  { id: "s3", name: "Straight razor shave", duration: "30 min", price: 400, category: "men" },
  { id: "s4", name: "Beard design", duration: "30 min", price: 350, category: "men" },
  { id: "s5", name: "Women haircut", duration: "60 min", price: 800, category: "women" },
  { id: "s6", name: "Styling", duration: "45 min", price: 600, category: "unisex" },
  { id: "s7", name: "Coloring", duration: "120 min", price: 2500, category: "women" },
  { id: "s8", name: "Highlights", duration: "90 min", price: 2000, category: "women" },
  { id: "s9", name: "Balayage", duration: "120 min", price: 3000, category: "women" },
  { id: "s10", name: "Hair treatment", duration: "60 min", price: 700, category: "unisex" },
];

