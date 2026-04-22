import { X } from "lucide-react";
import SalonsMap from "@/components/SalonsMap";
import type { Salon } from "@/data/salons";
import { useI18n } from "@/lib/i18n";

interface MapModalProps {
  onClose: () => void;
  salons: Salon[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

const MapModal = ({ onClose, salons, isLoading, isError, onRetry }: MapModalProps) => {
  const { tr } = useI18n();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={tr("salons.map.modalTitle")}
        className="w-full max-w-4xl rounded-2xl border border-border bg-background p-4 shadow-xl sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-foreground">{tr("salons.map.modalTitle")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            aria-label={tr("common.close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4 sm:mt-6">
          {isLoading ? (
            <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-border bg-card text-sm text-muted-foreground sm:h-[420px]">
              {tr("salons.map.loading")}
            </div>
          ) : isError ? (
            <div className="flex h-[320px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-4 text-center sm:h-[420px]">
              <p className="text-sm text-muted-foreground">{tr("salons.map.error")}</p>
              <button
                type="button"
                onClick={onRetry}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
              >
                {tr("common.retry")}
              </button>
            </div>
          ) : salons.length === 0 ? (
            <div className="flex h-[320px] items-center justify-center rounded-2xl border border-dashed border-border bg-card text-sm text-muted-foreground sm:h-[420px]">
              {tr("salons.map.empty")}
            </div>
          ) : (
            <SalonsMap locations={salons} />
          )}
        </div>

        <div className="mt-4 flex justify-end sm:mt-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary/80"
          >
            {tr("common.close")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapModal;