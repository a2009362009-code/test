import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

const Footer = () => {
  const { tr } = useI18n();

  return (
    <footer className="border-t border-border bg-secondary/50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-lg font-semibold tracking-tighter">HairLine</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {tr("footer.desc")}
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">{tr("footer.nav")}</h4>
            <div className="mt-3 flex flex-col gap-2">
              <Link
                to="/masters"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {tr("nav.masters")}
              </Link>
              <Link
                to="/shop"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {tr("nav.shop")}
              </Link>
              <Link
                to="/profile"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {tr("nav.profile")}
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold">{tr("footer.contacts")}</h4>
            <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
              <span>+996 (555) 12-34-56</span>
              <span>info@hairline.kg</span>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          {tr("common.copyright")} 2026 HairLine. {tr("footer.rights")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
