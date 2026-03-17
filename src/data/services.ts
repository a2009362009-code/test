export interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
  category: "men" | "women" | "unisex";
}

export const services: Service[] = [
  { id: "s1", name: "Мужская стрижка", duration: "45 мин", price: 1500, category: "men" },
  { id: "s2", name: "Стрижка + укладка", duration: "60 мин", price: 2000, category: "men" },
  { id: "s3", name: "Бритьё опасной бритвой", duration: "30 мин", price: 1200, category: "men" },
  { id: "s4", name: "Дизайн бороды", duration: "30 мин", price: 1000, category: "men" },
  { id: "s5", name: "Женская стрижка", duration: "60 мин", price: 2500, category: "women" },
  { id: "s6", name: "Укладка", duration: "45 мин", price: 1800, category: "unisex" },
  { id: "s7", name: "Окрашивание", duration: "120 мин", price: 5000, category: "women" },
  { id: "s8", name: "Мелирование", duration: "90 мин", price: 4500, category: "women" },
  { id: "s9", name: "Балаяж", duration: "120 мин", price: 6000, category: "women" },
  { id: "s10", name: "Уход за волосами", duration: "60 мин", price: 2000, category: "unisex" },
];
