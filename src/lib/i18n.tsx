import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Lang = "kg" | "ru" | "en";

type Translations = Record<string, Record<Lang, string>>;

const t: Translations = {
  // Navbar
  "nav.home": { kg: "Башкы бет", ru: "Главная", en: "Home" },
  "nav.masters": { kg: "Мастерлер", ru: "Мастера", en: "Masters" },
  "nav.shop": { kg: "Дүкөн", ru: "Магазин", en: "Shop" },
  "nav.login": { kg: "Кирүү", ru: "Войти", en: "Sign in" },

  // Hero
  "hero.subtitle": { kg: "Премиум салондор тармагы", ru: "Сеть премиум-салонов", en: "Premium salon network" },
  "hero.title": { kg: "Ар бир сызыкта тактык", ru: "Точность в каждой линии", en: "Precision in every line" },
  "hero.desc": {
    kg: "Тажрыйбалуу мастерлер, премиум продукция жана кемчиликсиз сервис биздин ар бир салонубузда.",
    ru: "Опытные мастера, премиальная продукция и безупречный сервис в каждом из наших салонов.",
    en: "Experienced masters, premium products and impeccable service in each of our salons.",
  },
  "hero.book": { kg: "Жазылуу", ru: "Записаться", en: "Book now" },
  "hero.shop": { kg: "Дүкөн", ru: "Магазин", en: "Shop" },
  "hero.locations": { kg: "3 локация", ru: "3 локации", en: "3 locations" },

  // Masters section
  "masters.title": { kg: "Биздин мастерлер", ru: "Наши мастера", en: "Our masters" },
  "masters.subtitle": { kg: "Тастыкталган тажрыйбасы бар профессионалдар", ru: "Профессионалы с подтверждённым опытом", en: "Professionals with proven experience" },
  "masters.all": { kg: "Бардык мастерлер", ru: "Все мастера", en: "All masters" },
  "masters.page.title": { kg: "Мастерлер", ru: "Мастера", en: "Masters" },
  "masters.page.subtitle": { kg: "Мастерди тандап, ыңгайлуу убакытка жазылыңыз", ru: "Выберите мастера и запишитесь на удобное время", en: "Choose a master and book a convenient time" },
  "masters.specialty": { kg: "Адистик", ru: "Специализация", en: "Specialty" },
  "masters.location": { kg: "Локация", ru: "Локация", en: "Location" },
  "masters.notfound": { kg: "Берилген фильтрлер боюнча мастерлер табылган жок", ru: "Мастеров по заданным фильтрам не найдено", en: "No masters found for the given filters" },
  "masters.back": { kg: "Бардык мастерлер", ru: "Все мастера", en: "All masters" },
  "masters.notfound.single": { kg: "Мастер табылган жок", ru: "Мастер не найден", en: "Master not found" },
  "masters.backlink": { kg: "← Мастерлерге кайтуу", ru: "← Вернуться к мастерам", en: "← Back to masters" },

  // Filters
  "filter.all": { kg: "Баары", ru: "Все", en: "All" },
  "filter.barber": { kg: "Барбер", ru: "Барбер", en: "Barber" },
  "filter.stylist": { kg: "Стилист", ru: "Стилист", en: "Stylist" },
  "filter.colorist": { kg: "Колорист", ru: "Колорист", en: "Colorist" },
  "filter.center": { kg: "Центр", ru: "Центр", en: "Center" },
  "filter.north": { kg: "Север", ru: "Север", en: "North" },
  "filter.south": { kg: "Юг", ru: "Юг", en: "South" },

  // Master card / detail
  "master.available": { kg: "Бош", ru: "Свободен", en: "Available" },
  "master.book": { kg: "Жазылуу", ru: "Записаться", en: "Book" },
  "master.nobook": { kg: "Жазылуу жок", ru: "Нет записи", en: "Unavailable" },
  "master.reviews": { kg: "пикир", ru: "отзывов", en: "reviews" },
  "master.portfolio": { kg: "Портфолио", ru: "Портфолио", en: "Portfolio" },
  "master.portfolio.desc": { kg: "Мастердин иштеринен үлгүлөр", ru: "Примеры работ мастера", en: "Examples of the master's work" },
  "master.clientreviews": { kg: "Кардарлардын пикирлери", ru: "Отзывы клиентов", en: "Client reviews" },

  // Products section
  "products.title": { kg: "Продукция", ru: "Продукция", en: "Products" },
  "products.subtitle": { kg: "Чачыңыз үчүн профессионалдуу күтүм", ru: "Профессиональный уход для ваших волос", en: "Professional care for your hair" },
  "products.all": { kg: "Бардык каталог", ru: "Весь каталог", en: "Full catalog" },
  "products.addtocart": { kg: "Себетке", ru: "В корзину", en: "Add to cart" },

  // Shop page
  "shop.title": { kg: "Дүкөн", ru: "Магазин", en: "Shop" },
  "shop.subtitle": { kg: "Үйдө күтүм үчүн профессионалдуу продукция", ru: "Профессиональная продукция для домашнего ухода", en: "Professional products for home care" },
  "shop.all": { kg: "Баары", ru: "Все", en: "All" },
  "shop.men": { kg: "Эркектерге", ru: "Мужчинам", en: "For men" },
  "shop.women": { kg: "Аялдарга", ru: "Женщинам", en: "For women" },

  // Salons
  "salons.title": { kg: "Биздин салондор", ru: "Наши салоны", en: "Our salons" },
  "salons.subtitle": { kg: "Бишкектин ар кайсы районунда", ru: "Удобное расположение в каждом районе", en: "Convenient locations in every district" },

  // Booking dialog
  "booking.title": { kg: "Мастерге жазылуу", ru: "Запись к мастеру", en: "Book a master" },
  "booking.selectservice": { kg: "Кызматты тандаңыз", ru: "Выберите услугу", en: "Select a service" },
  "booking.selectdate": { kg: "Күндү тандаңыз", ru: "Выберите дату", en: "Select a date" },
  "booking.selecttime": { kg: "Убакытты тандаңыз", ru: "Выберите время", en: "Select a time" },
  "booking.confirm": { kg: "Ырастоо", ru: "Подтвердить", en: "Confirm" },
  "booking.back": { kg: "← Артка", ru: "← Назад", en: "← Back" },
  "booking.success": { kg: "Сиз жазылдыңыз!", ru: "Вы записаны!", en: "You're booked!" },
  "booking.successtoast": { kg: "Жазылуу ийгиликтүү!", ru: "Запись оформлена!", en: "Booking confirmed!" },
  "booking.close": { kg: "Жабуу", ru: "Закрыть", en: "Close" },
  "booking.pickdate": { kg: "Күндү тандаңыз", ru: "Выберите дату", en: "Pick a date" },

  // Footer
  "footer.desc": {
    kg: "Ар бир сызыкта тактык. Сапатты баалагандар үчүн премиум салондор тармагы.",
    ru: "Точность в каждой линии. Премиальная сеть салонов для тех, кто ценит качество.",
    en: "Precision in every line. A premium salon network for those who value quality.",
  },
  "footer.nav": { kg: "Навигация", ru: "Навигация", en: "Navigation" },
  "footer.locations": { kg: "Локациялар", ru: "Локации", en: "Locations" },
  "footer.contacts": { kg: "Байланыш", ru: "Контакты", en: "Contacts" },
  "footer.rights": { kg: "Бардык укуктар корголгон.", ru: "Все права защищены.", en: "All rights reserved." },

  // Currency
  "currency": { kg: "сом", ru: "сом", en: "KGS" },
};

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  tr: (key: string) => string;
  price: (amount: number) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem("hairline-lang");
    return (saved as Lang) || "kg";
  });

  const changeLang = useCallback((newLang: Lang) => {
    setLang(newLang);
    localStorage.setItem("hairline-lang", newLang);
  }, []);

  const tr = useCallback(
    (key: string) => {
      const entry = t[key];
      if (!entry) return key;
      return entry[lang] || entry["kg"] || key;
    },
    [lang],
  );

  const price = useCallback(
    (amount: number) => {
      return `${amount} ${t["currency"][lang]}`;
    },
    [lang],
  );

  return (
    <I18nContext.Provider value={{ lang, setLang: changeLang, tr, price }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
