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
    <div className="space-y-6">
      <div className="rounded-2xl bg-card p-6 card-shadow">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-muted-foreground">{tr("profile.info.title")}</p>
            <h2 className="text-2xl font-semibold">{tr("profile.info.subtitle")}</h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              to="/profile/orders"
              className="rounded-2xl bg-secondary p-4 text-sm font-medium text-foreground transition hover:bg-secondary/80"
            >
              <div className="flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-muted-foreground" />
                {tr("profile.orders.title")}
              </div>
            </Link>
            <Link
              to="/profile/settings"
              className="rounded-2xl bg-secondary p-4 text-sm font-medium text-foreground transition hover:bg-secondary/80"
            >
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-muted-foreground" />
                {tr("profile.settings.title")}
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl bg-card p-6 card-shadow">
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

        <div className="rounded-2xl bg-card p-6 card-shadow">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {tr("profile.field.email")}
              </p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-card p-6 card-shadow">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {tr("profile.field.phone")}
              </p>
              <p className="text-sm font-medium">{user.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
