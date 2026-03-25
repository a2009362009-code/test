import { client, HttpApiError, unwrapOpenApiResponse } from "@/api/client";
import type { components } from "@/api/generated/openapi";
import { masters } from "@/data/masters";
import { products as seedProducts } from "@/data/products";
import { services as seedServices } from "@/data/services";
import { USE_MOCK_API } from "@/lib/config";

export type ApiBarber = components["schemas"]["Barber"];
export type ApiService = components["schemas"]["Service"];
export type ApiProduct = components["schemas"]["Product"];
export type ApiSlot = components["schemas"]["Slot"];
export type ApiUser = components["schemas"]["UserPublic"];
export type ApiBookingResponse = components["schemas"]["BookingCreatedResponse"];
type RegisterResponse = components["schemas"]["RegisterResponse"];
type LoginResponse = components["schemas"]["UserLoginResponse"];
type RegisterRequest = components["schemas"]["RegisterRequest"];
type LoginRequest = components["schemas"]["UserLoginRequest"];
type BookingRequest = components["schemas"]["BookingRequest"];

interface MockUserRecord {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

interface MockBookingRecord {
  id: number;
  userId: number;
  serviceId: number;
  barberId: number;
  date: string;
  time: string;
  createdAt: string;
}

const MOCK_USERS_KEY = "hairline-mock-users";
const MOCK_BOOKINGS_KEY = "hairline-mock-bookings";
const MOCK_SLOT_TIMES = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function toApiError(error: unknown): never {
  if (error instanceof ApiError) {
    throw error;
  }
  if (error instanceof HttpApiError) {
    throw new ApiError(error.message, error.status);
  }
  throw error;
}

const wait = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

function parseMinutes(duration: string): number {
  const match = duration.match(/\d+/);
  if (!match) return 30;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 30;
}

function parseYears(value: string): number {
  const match = value.match(/\d+/);
  if (!match) return 1;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function loadMockUsers(): MockUserRecord[] {
  const raw = localStorage.getItem(MOCK_USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as MockUserRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMockUsers(users: MockUserRecord[]) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

function loadMockBookings(): MockBookingRecord[] {
  const raw = localStorage.getItem(MOCK_BOOKINGS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as MockBookingRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveMockBookings(bookings: MockBookingRecord[]) {
  localStorage.setItem(MOCK_BOOKINGS_KEY, JSON.stringify(bookings));
}

function toMockToken(userId: number) {
  return `mock-token-${userId}`;
}

function fromMockToken(token: string): number | null {
  if (!token.startsWith("mock-token-")) return null;
  const value = Number(token.replace("mock-token-", ""));
  if (!Number.isInteger(value) || value <= 0) return null;
  return value;
}

const mockApi = {
  getBarbers: async (): Promise<ApiBarber[]> => {
    await wait();
    return masters.map((master, index) => ({
      id: Number(master.id) || index + 1,
      name: master.name,
      role: master.role,
      experience_years: parseYears(master.experience),
      rating: master.rating,
      reviews_count: master.reviews,
      image_url: master.image,
      is_available: master.available,
      specialties: master.specialties,
      location: master.location,
      bio: master.bio,
      is_active: true,
      created_at: new Date().toISOString(),
    }));
  },
  getServices: async (): Promise<ApiService[]> => {
    await wait();
    return seedServices.map((service, index) => ({
      id: index + 1,
      name: service.name,
      duration_minutes: parseMinutes(service.duration),
      price: String(service.price),
    }));
  },
  getProducts: async (): Promise<ApiProduct[]> => {
    await wait();
    return seedProducts.map((product, index) => ({
      id: Number(product.id) || index + 1,
      name: product.name,
      description: product.description,
      price: String(product.price),
      image_url: product.image,
      category: product.category,
      type: product.type,
      stock_qty: 100,
    }));
  },
  getSlots: async (date: string, barberId: number): Promise<ApiSlot[]> => {
    await wait();
    const booked = new Set(
      loadMockBookings()
        .filter((booking) => booking.date === date && booking.barberId === barberId)
        .map((booking) => booking.time.slice(0, 5)),
    );

    return MOCK_SLOT_TIMES.filter((time) => !booked.has(time)).map((time, index) => ({
      id: barberId * 1000 + index + 1,
      barber_id: barberId,
      date,
      time,
      status: "available",
    }));
  },
  register: async (body: RegisterRequest): Promise<RegisterResponse> => {
    await wait();
    const users = loadMockUsers();
    const email = body.email.trim().toLowerCase();
    const phone = body.phone.trim();

    const exists = users.some(
      (user) => user.email.toLowerCase() === email || user.phone === phone,
    );
    if (exists) {
      throw new ApiError("User already exists", 409);
    }

    const nextId = users.reduce((max, user) => Math.max(max, user.id), 0) + 1;
    const created: MockUserRecord = {
      id: nextId,
      fullName: body.fullName.trim(),
      email,
      phone,
      password: body.password,
    };
    users.push(created);
    saveMockUsers(users);

    return {
      user: {
        id: created.id,
        full_name: created.fullName,
        email: created.email,
        phone: created.phone,
        created_at: new Date().toISOString(),
      },
    };
  },
  login: async (body: LoginRequest): Promise<LoginResponse> => {
    await wait();
    const users = loadMockUsers();
    const email = body.email.trim().toLowerCase();
    const found = users.find((user) => user.email.toLowerCase() === email);

    if (!found || found.password !== body.password) {
      throw new ApiError("Invalid credentials", 401);
    }

    return {
      token: toMockToken(found.id),
      user: {
        id: found.id,
        fullName: found.fullName,
        email: found.email,
        phone: found.phone,
      },
    };
  },
  createBooking: async (
    token: string,
    body: BookingRequest,
  ): Promise<ApiBookingResponse> => {
    await wait();
    const userId = fromMockToken(token);
    if (!userId) {
      throw new ApiError("Invalid token", 401);
    }

    const bookings = loadMockBookings();
    const conflict = bookings.some(
      (booking) =>
        booking.barberId === body.barberId &&
        booking.date === body.date &&
        booking.time.slice(0, 5) === body.time.slice(0, 5),
    );

    if (conflict) {
      throw new ApiError("Selected time slot is not available", 409);
    }

    const nextId = bookings.reduce((max, booking) => Math.max(max, booking.id), 0) + 1;
    const createdAt = new Date().toISOString();
    bookings.push({
      id: nextId,
      userId,
      serviceId: body.serviceId,
      barberId: body.barberId,
      date: body.date,
      time: body.time.slice(0, 5),
      createdAt,
    });
    saveMockBookings(bookings);

    return { id: nextId, createdAt };
  },
};

const realApi = {
  getBarbers: async (): Promise<ApiBarber[]> => {
    try {
      return await unwrapOpenApiResponse(client.GET("/api/barbers"));
    } catch (error) {
      return toApiError(error);
    }
  },
  getServices: async (): Promise<ApiService[]> => {
    try {
      return await unwrapOpenApiResponse(client.GET("/api/services"));
    } catch (error) {
      return toApiError(error);
    }
  },
  getProducts: async (): Promise<ApiProduct[]> => {
    try {
      return await unwrapOpenApiResponse(client.GET("/api/products"));
    } catch (error) {
      return toApiError(error);
    }
  },
  getSlots: async (date: string, barberId: number): Promise<ApiSlot[]> => {
    try {
      return await unwrapOpenApiResponse(
        client.GET("/api/slots", {
          params: {
            query: {
              date,
              barberId,
            },
          },
        }),
      );
    } catch (error) {
      return toApiError(error);
    }
  },
  register: async (body: RegisterRequest): Promise<RegisterResponse> => {
    try {
      return await unwrapOpenApiResponse(
        client.POST("/api/auth/register", {
          body,
        }),
      );
    } catch (error) {
      return toApiError(error);
    }
  },
  login: async (body: LoginRequest): Promise<LoginResponse> => {
    try {
      return await unwrapOpenApiResponse(
        client.POST("/api/auth/login", {
          body,
        }),
      );
    } catch (error) {
      return toApiError(error);
    }
  },
  createBooking: async (
    token: string,
    body: BookingRequest,
  ): Promise<ApiBookingResponse> => {
    try {
      return await unwrapOpenApiResponse(
        client.POST("/api/bookings", {
          body,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
    } catch (error) {
      return toApiError(error);
    }
  },
};

export const api = USE_MOCK_API ? mockApi : realApi;
