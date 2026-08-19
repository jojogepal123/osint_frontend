import { useEffect, useRef } from "react";

function ImpactRow({ tone = "gray", icon, children }) {
  const tones = {
    gray: "text-gray-500",
    lime: "text-lime-400",
    amber: "text-amber-400",
    red: "text-red-400",
  };

  return (
    <li className="flex items-start gap-2.5 text-xs leading-relaxed">
      <span className={`shrink-0 mt-0.5 ${tones[tone]}`}>{icon}</span>
      <span className="text-gray-400">{children}</span>
    </li>
  );
}

const iconProps = {
  className: "w-3.5 h-3.5",
  fill: "none",
  stroke: "currentColor",
  viewBox: "0 0 24 24",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

/**
 * Confirmation dialog for deleting a logged search query.
 *
 * Deleting purges every log entry for the same value, so the dialog spells out
 * the blast radius (entry count, cache reset, credit cost, attached cases)
 * before the admin commits.
 */
export default function DeleteQueryModal({
  open,
  typeLabel,
  typeColor,
  displayValue,
  impact,
  impactLoading,
  deleting,
  onCancel,
  onConfirm,
}) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape" && !deleting) onCancel();
    };

    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    cancelRef.current?.focus();

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, deleting, onCancel]);

  if (!open) return null;

  const entryCount = impact?.total_count ?? 1;
  const caseCount = impact?.case_count ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={() => !deleting && onCancel()}
      role="presentation"
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-query-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-scale-in"
      >
        <div className="flex items-start gap-3 p-5 border-b border-white/5">
          <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2
              id="delete-query-title"
              className="text-white font-semibold text-base"
            >
              Delete search query?
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              This cannot be undone.
            </p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-lg border border-white/10 bg-black/30 p-3">
            <span
              className={`inline-block text-[10px] px-2 py-0.5 rounded-full border mb-2 ${typeColor}`}
            >
              {typeLabel}
            </span>
            <p className="text-gray-200 text-sm font-mono break-all max-h-24 overflow-y-auto custom-scrollbar">
              {displayValue}
            </p>
          </div>

          <ul className="space-y-2.5">
            <ImpactRow
              icon={
                <svg {...iconProps}>
                  <path d="M12 3l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 17l9 5 9-5" />
                </svg>
              }
            >
              {impactLoading ? (
                <span className="text-gray-600">Checking log entries…</span>
              ) : entryCount > 1 ? (
                <>
                  Removes{" "}
                  <span className="text-white font-medium">
                    all {entryCount} log entries
                  </span>{" "}
                  recorded for this value.
                </>
              ) : (
                <>
                  Removes{" "}
                  <span className="text-white font-medium">1 log entry</span>{" "}
                  and its saved result.
                </>
              )}
            </ImpactRow>

            <ImpactRow
              tone="lime"
              icon={
                <svg {...iconProps}>
                  <path d="M4 4v5h5M20 20v-5h-5" />
                  <path d="M20 9a8 8 0 00-14.9-2M4 15a8 8 0 0014.9 2" />
                </svg>
              }
            >
              The cached result is cleared — the next search of this value
              fetches fresh data from the source.
            </ImpactRow>

            <ImpactRow
              tone="amber"
              icon={
                <svg {...iconProps}>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v10M9.5 9.5h3.5a1.5 1.5 0 010 3h-2a1.5 1.5 0 000 3H15" />
                </svg>
              }
            >
              That user will be charged credits for the fresh lookup.
            </ImpactRow>

            {caseCount > 0 && (
              <ImpactRow
                tone="red"
                icon={
                  <svg {...iconProps}>
                    <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                }
              >
                Attached to{" "}
                <span className="text-white font-medium">
                  {caseCount} case{caseCount > 1 ? "s" : ""}
                </span>
                {" — "}
                will also disappear from that case&apos;s search list.
              </ImpactRow>
            )}
          </ul>
        </div>

        <div className="flex gap-3 px-5 pb-5">
          <button
            ref={cancelRef}
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 text-sm transition-colors disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting || impactLoading}
            className="flex-1 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {deleting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-transparent rounded-full animate-spin" />
                Deleting…
              </>
            ) : entryCount > 1 ? (
              `Delete ${entryCount} entries`
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
