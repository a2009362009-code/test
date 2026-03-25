import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "men" | "women" | "unisex";
  type: string;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Volume shampoo",
    description: "Professional shampoo for thin hair. Adds volume and shine.",
    price: 650,
    image: product1,
    category: "unisex",
    type: "Care",
  },
  {
    id: "2",
    name: "Styling cream",
    description: "Light hold with matte finish for natural texture.",
    price: 850,
    image: product2,
    category: "men",
    type: "Styling",
  },
  {
    id: "3",
    name: "Hair oil",
    description: "Nourishing argan oil that restores and protects hair.",
    price: 1100,
    image: product3,
    category: "women",
    type: "Care",
  },
  {
    id: "4",
    name: "Scalp detox shampoo",
    description: "Detox formula for oily scalp and deep cleansing.",
    price: 550,
    image: product4,
    category: "men",
    type: "Care",
  },
  {
    id: "5",
    name: "Heat protection spray",
    description: "Protects hair up to 230C and keeps smooth finish.",
    price: 750,
    image: product1,
    category: "women",
    type: "Protection",
  },
  {
    id: "6",
    name: "Beard wax",
    description: "Medium hold wax for beard shape and hydration.",
    price: 480,
    image: product2,
    category: "men",
    type: "Styling",
  },
];

