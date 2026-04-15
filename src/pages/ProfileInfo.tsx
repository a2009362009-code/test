import { Link } from "react-router-dom";
import { ListChecks, Settings, User } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

const ProfileInfo = () => {
  const { user } = useAuth();
  const { tr } = useI18n();

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-5">
      <div className="surface-card p-5 card-shadow sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">{tr("profile.info.title")}</p>
            <h2 className="mt-1 text-xl font-semibold sm:text-2xl">{tr("profile.info.subtitle")}</h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link
              to="/profile/orders"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-sm font-medium text-foreground transition hover:bg-secondary/80"
            >
              <ListChecks className="h-4 w-4 text-muted-foreground" />
              {tr("profile.orders.title")}
            </Link>
            <Link
              to="/profile/settings"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-secondary px-4 text-sm font-medium text-foreground transition hover:bg-secondary/80"
            >
              <Settings className="h-4 w-4 text-muted-foreground" />
              {tr("profile.settings.title")}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="surface-card p-5 card-shadow">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {tr("profile.field.fullName")}
              </p>
              <p className="text-sm font-medium">{user.fullName}</p>
            </div>
          </div>
        </div>

        <div className="surface-card p-5 card-shadow">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {tr("profile.field.email")}
          </p>
          <p className="mt-1 text-sm font-medium break-all">{user.email}</p>
        </div>

        <div className="surface-card p-5 card-shadow sm:col-span-2">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {tr("profile.field.phone")}
          </p>
          <p className="mt-1 text-sm font-medium">{user.phone}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
