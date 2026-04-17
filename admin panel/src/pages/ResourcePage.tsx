import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import type { FormFieldConfig, FormValues, ResourceConfig, SortDirection, EntityRecord } from "../types";
import { useAuth } from "../auth";
import { ApiError } from "../api";
import { EntityGrid } from "../components/EntityGrid";
import { EntityDrawer } from "../components/EntityDrawer";
import { buildListCacheKey, invalidateResourceCache, readListCache, writeListCache } from "../utils/query-cache";
import { sanitizePayload, toIdRecord } from "../config/resources";
import { isValidKyrgyzPhone, KYRGYZ_PHONE_PREFIX } from "../utils/phone";

type ResourcePageProps = {
  config: ResourceConfig;
  staticQuery?: Record<string, string | number | boolean | undefined>;
  beforeGrid?: (context: { reload: () => Promise<void> }) => ReactNode;
};

type DrawerState = {
  open: boolean;
  mode: "create" | "edit" | "view";
  values: FormValues;
  ids: Record<string, string | number>;
};

const DEFAULT_LIMIT = 50;

function snakeCase(value: string) {
  return value.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`);
}

function comparePrimitive(a: unknown, b: unknown) {
  if (typeof a === "number" && typeof b === "number") return a - b;
  const left = String(a ?? "").toLowerCase();
  const right = String(b ?? "").toLowerCase();
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function formatApiError(error: unknown) {
  if (error instanceof ApiError) return `${error.message} (HTTP ${error.status})`;
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

function defaultFieldValue(field: FormFieldConfig) {
  if (field.kind === "boolean") return false;
  if (field.kind === "phone") return KYRGYZ_PHONE_PREFIX;
  if (field.kind === "tags") return [];
  return "";
}

function buildInitialValues(config: ResourceConfig) {
  const values: FormValues = {};
  for (const field of config.fields) {
    values[field.key] = defaultFieldValue(field);
  }
  return values;
}

function extractValue(row: EntityRecord, field: FormFieldConfig) {
  if (typeof row[field.key] !== "undefined") return row[field.key];
  const entityKey = field.entityKey || snakeCase(field.key);
  if (typeof row[entityKey] !== "undefined") return row[entityKey];
  return defaultFieldValue(field);
}

function normalizeForForm(config: ResourceConfig, row: EntityRecord) {
  const custom = config.normalizeForForm ? config.normalizeForForm(row) : row;
  const values: FormValues = {};
  for (const field of config.fields) {
    values[field.key] = extractValue(custom, field);
  }
  return values;
}

function validateForm(config: ResourceConfig, values: FormValues, mode: "create" | "edit") {
  for (const field of config.fields) {
    if (mode === "create" && field.hiddenOnCreate) continue;
    if (mode === "edit" && field.hiddenOnEdit) continue;

    const value = values[field.key];
    const asString = typeof value === "string" ? value.trim() : String(value ?? "").trim();

    const enforceRequired = field.required && !(mode === "edit" && field.kind === "password");
    if (enforceRequired) {
      if (field.kind === "boolean") {
        // checkbox always has a value
      } else if (field.kind === "tags") {
        const tags = Array.isArray(value) ? value : [];
        if (!tags.length) return `Поле "${field.label}" обязательно.`;
      } else if (!asString) {
        return `Поле "${field.label}" обязательно.`;
      }
    }

    if (field.kind === "phone" && asString && !isValidKyrgyzPhone(asString)) {
      return "Телефон должен быть в формате +996XXXXXXXXX.";
    }

    if (typeof field.minLength === "number" && asString && asString.length < field.minLength) {
      return `Поле "${field.label}" должно содержать минимум ${field.minLength} символов.`;
    }

    if (typeof field.maxLength === "number" && asString.length > field.maxLength) {
      return `Поле "${field.label}" должно содержать максимум ${field.maxLength} символов.`;
    }

    if (field.kind === "number" && asString) {
      const n = Number(asString);
      if (!Number.isFinite(n)) return `Поле "${field.label}" должно быть числом.`;
      if (typeof field.min === "number" && n < field.min) {
        return `Поле "${field.label}" должно быть не меньше ${field.min}.`;
      }
      if (typeof field.max === "number" && n > field.max) {
        return `Поле "${field.label}" должно быть не больше ${field.max}.`;
      }
    }
  }

  return "";
}

export function ResourcePage({ config, staticQuery = {}, beforeGrid }: ResourcePageProps) {
  const { token } = useAuth();
  const [rows, setRows] = useState<EntityRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState(config.defaultSort.key);
  const [sortDirection, setSortDirection] = useState<SortDirection>(config.defaultSort.direction);
  const [drawerSubmitting, setDrawerSubmitting] = useState(false);
  const [drawerError, setDrawerError] = useState("");
  const [drawerState, setDrawerState] = useState<DrawerState>({
    open: false,
    mode: "create",
    values: buildInitialValues(config),
    ids: {},
  });

  const query = useMemo(
    () => ({
      ...(config.staticQuery || {}),
      ...staticQuery,
    }),
    [config.staticQuery, staticQuery],
  );

  const cacheKey = useMemo(() => buildListCacheKey(config.key, limit, offset, query), [config.key, limit, offset, query]);

  const reload = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setLoadError("");
    setActionMessage("");

    const cached = readListCache(cacheKey);
    if (cached) {
      setRows(cached.items);
      setTotal(cached.total);
      setHasMore(cached.hasMore);
      setLoading(false);
      return;
    }

    try {
      const listPayload = await config.adapter.list(token, {
        limit,
        offset,
        query,
      });
      setRows(listPayload.items);
      setTotal(listPayload.total);
      setHasMore(listPayload.hasMore);
      writeListCache(cacheKey, listPayload);
    } catch (error) {
      setLoadError(formatApiError(error));
      setRows([]);
      setTotal(0);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [token, cacheKey, config.adapter, limit, offset, query]);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    setSortKey(config.defaultSort.key);
    setSortDirection(config.defaultSort.direction);
    setSearch("");
    setOffset(0);
  }, [config.key, config.defaultSort.direction, config.defaultSort.key]);

  const sortedRows = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const filtered = needle
      ? rows.filter((row) =>
          config.searchKeys.some((key) => {
            const value = row[key];
            if (Array.isArray(value)) {
              return value.join(" ").toLowerCase().includes(needle);
            }
            return String(value ?? "").toLowerCase().includes(needle);
          }),
        )
      : rows;

    const clone = [...filtered];
    clone.sort((left, right) => {
      const result = comparePrimitive(left[sortKey], right[sortKey]);
      return sortDirection === "asc" ? result : -result;
    });
    return clone;
  }, [config.searchKeys, rows, search, sortDirection, sortKey]);

  const openCreate = () => {
    setDrawerError("");
    setActionError("");
    setDrawerState({
      open: true,
      mode: "create",
      values: buildInitialValues(config),
      ids: {},
    });
  };

  const openView = (row: EntityRecord) => {
    setDrawerError("");
    setDrawerState({
      open: true,
      mode: "view",
      values: normalizeForForm(config, row),
      ids: toIdRecord(config, row),
    });
  };

  const openEdit = (row: EntityRecord) => {
    setDrawerError("");
    setDrawerState({
      open: true,
      mode: "edit",
      values: normalizeForForm(config, row),
      ids: toIdRecord(config, row),
    });
  };

  const closeDrawer = () => {
    setDrawerState((prev) => ({ ...prev, open: false }));
    setDrawerError("");
  };

  const onDelete = async (row: EntityRecord) => {
    if (!token) return;
    setActionError("");
    setActionMessage("");

    const ids = toIdRecord(config, row);
    const signature = Object.entries(ids)
      .map(([key, value]) => `${key}=${value}`)
      .join(", ");

    if (!window.confirm(`Удалить запись (${signature})?`)) return;

    try {
      await config.adapter.remove(token, ids);
      invalidateResourceCache(config.key);
      setActionMessage("Запись удалена");
      await reload();
    } catch (error) {
      setActionError(formatApiError(error));
    }
  };

  const submitDrawer = async () => {
    if (!token) return;
    if (drawerState.mode === "view") {
      closeDrawer();
      return;
    }

    const validationError = validateForm(config, drawerState.values, drawerState.mode);
    if (validationError) {
      setDrawerError(validationError);
      return;
    }

    setDrawerSubmitting(true);
    setDrawerError("");
    setActionError("");
    setActionMessage("");

    try {
      const payloadBase =
        drawerState.mode === "create"
          ? config.createPayload
            ? config.createPayload(drawerState.values)
            : drawerState.values
          : config.updatePayload
            ? config.updatePayload(drawerState.values)
            : drawerState.values;
      const payload = sanitizePayload(payloadBase);

      if (drawerState.mode === "create") {
        await config.adapter.create(token, payload);
      } else {
        await config.adapter.update(token, drawerState.ids, payload);
      }

      invalidateResourceCache(config.key);
      setActionMessage(drawerState.mode === "create" ? "Создано" : "Сохранено");
      closeDrawer();
      await reload();
    } catch (error) {
      setDrawerError(formatApiError(error));
    } finally {
      setDrawerSubmitting(false);
    }
  };

  const headerTitle = `${config.title}`;

  return (
    <section className="resource-page">
      <div className="resource-header">
        <div>
          <h2>{headerTitle}</h2>
          <p>{config.description}</p>
        </div>
      </div>

      {actionMessage ? <div className="panel-success">{actionMessage}</div> : null}
      {actionError ? <div className="panel-error">{actionError}</div> : null}

      {beforeGrid ? beforeGrid({ reload }) : null}

      <EntityGrid
        columns={config.columns}
        rows={sortedRows}
        loading={loading}
        error={loadError}
        search={search}
        onSearchChange={setSearch}
        sortKey={sortKey}
        sortDirection={sortDirection}
        onSort={(key) => {
          if (sortKey === key) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
            return;
          }
          setSortKey(key);
          setSortDirection("asc");
        }}
        limit={limit}
        offset={offset}
        total={total}
        hasMore={hasMore}
        onLimitChange={(nextLimit) => {
          setLimit(nextLimit);
          setOffset(0);
        }}
        onOffsetChange={setOffset}
        onRefresh={() => void reload()}
        onCreate={openCreate}
        onView={openView}
        onEdit={openEdit}
        onDelete={(row) => void onDelete(row)}
        getRowKey={(row) =>
          config.adapter.idKeys
            .map((idKey) => {
              const snake = snakeCase(idKey);
              const value = row[idKey] ?? row[snake];
              return String(value ?? "");
            })
            .join("-")
        }
      />

      <EntityDrawer
        open={drawerState.open}
        mode={drawerState.mode}
        title={
          drawerState.mode === "create"
            ? `Создать: ${config.title}`
            : drawerState.mode === "edit"
              ? `Редактировать: ${config.title}`
              : `Просмотр: ${config.title}`
        }
        fields={config.fields}
        values={drawerState.values}
        submitting={drawerSubmitting}
        error={drawerError}
        onClose={closeDrawer}
        onChange={(key, value) =>
          setDrawerState((prev) => ({
            ...prev,
            values: {
              ...prev.values,
              [key]: value,
            },
          }))
        }
        onSubmit={() => void submitDrawer()}
      />
    </section>
  );
}


