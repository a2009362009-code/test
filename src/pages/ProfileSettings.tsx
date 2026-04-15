import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { KeyRound, Save } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { ApiError, api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";

const ProfileSettings = () => {
  const { user, token, syncUser } = useAuth();
  const { tr } = useI18n();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  useEffect(() => {
    if (!user) return;
    setFullName(user.fullName);
    setEmail(user.email);
    setPhone(user.phone);
  }, [user]);

  const hasChanges = useMemo(() => {
    if (!user) return false;
    return (
      fullName.trim() !== user.fullName ||
      email.trim().toLowerCase() !== user.email.toLowerCase() ||
      phone.trim() !== user.phone
    );
  }, [user, fullName, email, phone]);

  const currentPasswordValue = currentPassword.trim();
  const passwordTooShort = newPassword.length > 0 && newPassword.length < 6;
  const passwordMismatch = repeatPassword.length > 0 && newPassword !== repeatPassword;
  const canSubmitPassword = Boolean(
    currentPasswordValue &&
      newPassword.length >= 6 &&
      repeatPassword &&
      newPassword === repeatPassword,
  );

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!token || !user) {
        throw new ApiError("Sign in required", 401);
      }

      const payload: { fullName?: string; email?: string; phone?: string } = {};
      const fullNameValue = fullName.trim();
      const emailValue = email.trim().toLowerCase();
      const phoneValue = phone.trim();

      if (fullNameValue !== user.fullName) {
        payload.fullName = fullNameValue;
      }
      if (emailValue !== user.email.toLowerCase()) {
        payload.email = emailValue;
      }
      if (phoneValue !== user.phone) {
        payload.phone = phoneValue;
      }

      return api.updateProfile(token, payload);
    },
    onSuccess: (response) => {
      syncUser({
        id: response.user.id,
        fullName: response.user.full_name,
        email: response.user.email,
        phone: response.user.phone,
      });
      toast({
        title: tr("profile.settings.save.success.title"),
        description: tr("profile.settings.save.success.desc"),
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: tr("profile.settings.save.error.title"),
        description:
          error instanceof ApiError
            ? error.message
            : tr("profile.settings.save.error.desc"),
      });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new ApiError("Sign in required", 401);
      }

      return api.updatePassword(token, {
        currentPassword: currentPasswordValue,
        newPassword,
      });
    },
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setRepeatPassword("");
      toast({
        title: tr("profile.settings.password.success.title"),
        description: tr("profile.settings.password.success.desc"),
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: tr("profile.settings.password.error.title"),
        description:
          error instanceof ApiError
            ? error.message
            : tr("profile.settings.password.error.desc"),
      });
    },
  });

  if (!user || !token) {
    return null;
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">{tr("profile.settings.title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
          {tr("profile.settings.subtitle")}
        </p>
      </div>

      <div className="space-y-5">
        <form
          className="surface-card space-y-4 p-5 card-shadow sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (hasChanges) {
              saveMutation.mutate();
            }
          }}
        >
          <div>
            <label
              htmlFor="profile-fullname"
              className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground"
            >
              {tr("profile.field.fullName")}
            </label>
            <input
              id="profile-fullname"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="h-11 w-full rounded-lg border-0 bg-secondary px-4 text-sm text-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-foreground"
              minLength={2}
              maxLength={120}
              required
            />
          </div>

          <div>
            <label
              htmlFor="profile-email"
              className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground"
            >
              {tr("profile.field.email")}
            </label>
            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 w-full rounded-lg border-0 bg-secondary px-4 text-sm text-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-foreground"
              required
            />
          </div>

          <div>
            <label
              htmlFor="profile-phone"
              className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground"
            >
              {tr("profile.field.phone")}
            </label>
            <input
              id="profile-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="h-11 w-full rounded-lg border-0 bg-secondary px-4 text-sm text-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-foreground"
              required
            />
          </div>

          <button
            type="submit"
            disabled={!hasChanges || saveMutation.isPending}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saveMutation.isPending ? tr("auth.submit.wait") : tr("profile.settings.save.action")}
          </button>
        </form>

        <form
          className="surface-card space-y-4 p-5 card-shadow sm:p-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (canSubmitPassword) {
              passwordMutation.mutate();
            }
          }}
        >
          <div>
            <h2 className="text-lg font-semibold">{tr("profile.settings.password.title")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {tr("profile.settings.password.subtitle")}
            </p>
          </div>

          <div>
            <label
              htmlFor="profile-password-current"
              className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground"
            >
              {tr("profile.settings.password.current")}
            </label>
            <input
              id="profile-password-current"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="h-11 w-full rounded-lg border-0 bg-secondary px-4 text-sm text-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-foreground"
              autoComplete="current-password"
              required
            />
          </div>

          <div>
            <label
              htmlFor="profile-password-new"
              className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground"
            >
              {tr("profile.settings.password.new")}
            </label>
            <input
              id="profile-password-new"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="h-11 w-full rounded-lg border-0 bg-secondary px-4 text-sm text-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-foreground"
              minLength={6}
              autoComplete="new-password"
              required
            />
            {passwordTooShort && (
              <p className="mt-1 text-xs text-destructive">
                {tr("profile.settings.password.error.minLength")}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="profile-password-repeat"
              className="mb-2 block text-xs uppercase tracking-wide text-muted-foreground"
            >
              {tr("profile.settings.password.repeat")}
            </label>
            <input
              id="profile-password-repeat"
              type="password"
              value={repeatPassword}
              onChange={(event) => setRepeatPassword(event.target.value)}
              className="h-11 w-full rounded-lg border-0 bg-secondary px-4 text-sm text-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-foreground"
              minLength={6}
              autoComplete="new-password"
              required
            />
            {passwordMismatch && (
              <p className="mt-1 text-xs text-destructive">
                {tr("profile.settings.password.error.mismatch")}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!canSubmitPassword || passwordMutation.isPending}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50"
          >
            <KeyRound className="h-4 w-4" />
            {passwordMutation.isPending
              ? tr("auth.submit.wait")
              : tr("profile.settings.password.action")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
