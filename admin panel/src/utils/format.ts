import type { ColumnDataType } from "../types";

export function formatCellValue(value: unknown, dataType: ColumnDataType = "text") {
  if (value === null || typeof value === "undefined" || value === "") return "-";

  if (dataType === "boolean") return value ? "Да" : "Нет";

  if (dataType === "array") {
    if (Array.isArray(value)) {
      if (!value.length) return "-";
      return value.join(", ");
    }
    return String(value);
  }

  if (dataType === "date") {
    const raw = String(value);
    if (!raw) return "-";
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
    const date = new Date(raw);
    return Number.isNaN(date.getTime()) ? raw : date.toISOString().slice(0, 10);
  }

  if (dataType === "datetime") {
    const date = new Date(String(value));
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString("ru-RU", { hour12: false });
  }

  if (dataType === "time") {
    const raw = String(value);
    return raw.length >= 5 ? raw.slice(0, 5) : raw;
  }

  return String(value);
}

export function toInputDate(value: unknown) {
  if (!value) return "";
  const raw = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().slice(0, 10);
}

export function toInputTime(value: unknown) {
  if (!value) return "";
  const raw = String(value);
  if (/^\d{2}:\d{2}$/.test(raw)) return raw;
  if (/^\d{2}:\d{2}:\d{2}$/.test(raw)) return raw.slice(0, 5);
  return raw;
}

export function compactJson(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

