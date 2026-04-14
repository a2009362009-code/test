import { Link, NavLink, Outlet } from "react-router-dom";
import { LogOut, User, ListChecks, FileText, Settings } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { tr } = useI18n();

  if (!isAuthenticated || !user) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl items-center justify-center px-6 py-12">
        <div className="w-full rounded-2xl bg-card p-8 text-center card-shadow">
          <h1 className="text-2xl font-semibold">{tr("profile.title")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{tr("profile.guest.desc")}</p>
          <Link
            to="/auth?redirect=%2Fprofile"
            className="mt-6 inline-flex rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
          >
            {tr("auth.submit.login")}
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    {
      to: "/profile",
      label: tr("profile.tab.info"),
      icon: User,
      end: true,
    },
    {
      to: "/profile/orders",
      label: tr("profile.tab.orders"),
      icon: ListChecks,
    },
    {
      to: "/profile/records",
      label: tr("profile.tab.records"),
      icon: FileText,
    },
    {
      to: "/profile/settings",
      label: tr("profile.tab.settings"),
      icon: Settings,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6 rounded-3xl border border-border bg-card/80 p-5 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {tr("profile.title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{tr("profile.subtitle")}</p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <Link
            to="/shop"
            className="inline-flex items-center justify-center rounded-2xl bg-secondary px-4 py-3 text-sm font-medium text-secondary-foreground transition hover:bg-secondary/80"
          >
            {tr("nav.shop")}
          </Link>

          <button
            onClick={logout}
            className="inline-flex items-center justify-center rounded-2xl bg-destructive px-4 py-3 text-sm font-medium text-destructive-foreground transition hover:bg-destructive/90"
          >
            <LogOut className="h-4 w-4" />
            {tr("nav.logout")}
          </button>
        </aside>

        <main className="space-y-8">
          <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-semibold">{tr("profile.title")}</h1>
                <p className="mt-1 text-muted-foreground">{tr("profile.subtitle")}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/cart"
                  className="rounded-2xl bg-secondary px-4 py-3 text-sm font-medium text-foreground transition hover:bg-secondary/80"
                >
                  {tr("nav.cart")}
                </Link>
              </div>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Profile;
