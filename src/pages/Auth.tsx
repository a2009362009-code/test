import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, ArrowRight } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useAuth();
  const { tr } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = useMemo(() => {
    const query = new URLSearchParams(location.search);
    return query.get("redirect") || "/profile";
  }, [location.search]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await register({
          fullName: fullName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          password,
        });
      }
      toast({
        title: isLogin ? tr("auth.toast.login.title") : tr("auth.toast.register.title"),
        description: tr("auth.toast.success.desc"),
      });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      const description =
        error instanceof ApiError ? error.message : tr("auth.toast.error.desc");
      toast({
        variant: "destructive",
        title: tr("auth.toast.error.title"),
        description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {isLogin ? tr("auth.login.title") : tr("auth.register.title")}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin
              ? tr("auth.login.subtitle")
              : tr("auth.register.subtitle")}
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                  type="text"
                  placeholder={tr("auth.field.fullName")}
                  className="w-full rounded-lg border-0 bg-secondary py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-foreground transition-shadow"
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  type="tel"
                  placeholder="+996700000000"
                  className="w-full rounded-lg border-0 bg-secondary py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-foreground transition-shadow"
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              placeholder={tr("auth.field.email")}
              className="w-full rounded-lg border-0 bg-secondary py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-foreground transition-shadow"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
              type="password"
              placeholder={tr("auth.field.password")}
              className="w-full rounded-lg border-0 bg-secondary py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground outline-none ring-1 ring-border focus:ring-2 focus:ring-foreground transition-shadow"
            />
          </div>

          <button
            disabled={isSubmitting}
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting
              ? tr("auth.submit.wait")
              : isLogin
                ? tr("auth.submit.login")
                : tr("auth.submit.register")}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isLogin ? tr("auth.toggle.noAccount") : tr("auth.toggle.haveAccount")}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-foreground underline underline-offset-4 hover:no-underline"
          >
            {isLogin ? tr("auth.toggle.create") : tr("auth.toggle.login")}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
