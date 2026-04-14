import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Clock3, MapPin, Scissors, UserRound, XCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { ApiError, api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

function parseDate(value: string) {
  if (!value) return null;
  const dateOnly = value.slice(0, 10);
  const parsed = new Date(`${dateOnly}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

const ProfileOrders = () => {
  const { token } = useAuth();
  const { tr, formatDate } = useI18n();
  const queryClient = useQueryClient();

  const bookingsQuery = useQuery({
    queryKey: ["my-bookings", token],
    queryFn: () => api.getMyBookings(token as string),
    enabled: Boolean(token),
  });

  const cancelMutation = useMutation({
    mutationFn: (bookingId: number) => api.cancelBooking(token as string, bookingId),
    onSuccess: () => {
      toast({
        title: tr("profile.orders.cancel.success.title"),
        description: tr("profile.orders.cancel.success.desc"),
      });
      queryClient.invalidateQueries({ queryKey: ["my-bookings", token] });
      queryClient.invalidateQueries({ queryKey: ["barber-reviews"] });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: tr("profile.orders.cancel.error.title"),
        description:
          error instanceof ApiError ? error.message : tr("profile.orders.cancel.error.desc"),
      });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{tr("profile.orders.title")}</h1>
          <p className="mt-1 text-muted-foreground">{tr("profile.orders.subtitle")}</p>
        </div>
      </div>

      {bookingsQuery.isLoading && (
        <p className="text-sm text-muted-foreground">{tr("profile.orders.loading")}</p>
      )}

      {bookingsQuery.isError && (
        <p className="text-sm text-destructive">{tr("profile.orders.error")}</p>
      )}

      {!bookingsQuery.isLoading && !bookingsQuery.isError && bookingsQuery.data?.length === 0 && (
        <div className="rounded-2xl bg-card p-6 card-shadow">
          <p className="text-sm text-muted-foreground">{tr("profile.orders.empty")}</p>
        </div>
      )}

      <div className="space-y-4">
        {bookingsQuery.data?.map((booking) => {
          const bookingDate = parseDate(booking.date);
          return (
            <div key={booking.id} className="rounded-2xl bg-card p-6 card-shadow">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-2">
                  <p className="text-base font-semibold">#{booking.id}</p>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Scissors className="h-4 w-4" />
                    {booking.service_name}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <UserRound className="h-4 w-4" />
                    {booking.barber_name}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {tr("profile.orders.salon")}: {booking.salon_name}
                    {booking.salon_address ? ` - ${booking.salon_address}` : ""}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4" />
                    {bookingDate
                      ? formatDate(bookingDate, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : booking.date}
                  </p>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock3 className="h-4 w-4" />
                    {booking.time.slice(0, 5)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => cancelMutation.mutate(booking.id)}
                  disabled={cancelMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground transition-colors hover:bg-destructive/90 disabled:pointer-events-none disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" />
                  {tr("profile.orders.cancel.action")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProfileOrders;
