import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { api } from "@/lib/api";

const ProfileRecords = () => {
  const { token } = useAuth();
  const { tr, formatDate } = useI18n();

  const recordsQuery = useQuery({
    queryKey: ["my-reviews", token],
    queryFn: () => api.getMyReviews(token as string),
    enabled: Boolean(token),
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold">{tr("profile.records.title")}</h1>
        <p className="text-sm text-muted-foreground">{tr("profile.records.subtitle")}</p>
      </div>

      {recordsQuery.isLoading && (
        <p className="text-sm text-muted-foreground">{tr("profile.orders.loading")}</p>
      )}

      {recordsQuery.isError && (
        <p className="text-sm text-destructive">{tr("profile.records.error")}</p>
      )}

      {!recordsQuery.isLoading && !recordsQuery.isError && recordsQuery.data?.length === 0 && (
        <div className="rounded-2xl bg-card p-6 card-shadow">
          <p className="text-sm text-muted-foreground">{tr("profile.records.empty")}</p>
        </div>
      )}

      <div className="space-y-4">
        {recordsQuery.data?.map((record) => (
          <div key={record.id} className="rounded-2xl bg-card p-6 card-shadow">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {tr("profile.records.barber")}
                </p>
                <p className="text-base font-semibold">#{record.barber_id}</p>
              </div>

              <div className="space-y-1 text-right">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {tr("profile.records.date")}
                </p>
                <p className="text-sm">
                  {formatDate(new Date(record.created_at), {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">
                {tr("profile.records.rating")} {record.rating}
              </p>
              <p className="text-sm text-muted-foreground">{record.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileRecords;
