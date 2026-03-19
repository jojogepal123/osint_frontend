import React, { useRef, useState, useEffect } from "react";
import instance from "../api/axios";
import FullScreenLoader from "./FullScreenLoader";
import { X, Download, AlertCircle, Car, CreditCard, FileText } from "lucide-react";

const RcPopup = ({ id, type, data, loading, onClose }) => {
  const contentRef = useRef();
  const [downloading, setDownloading] = useState(false);
  const [loadingData, setLoadingData] = useState(loading);

  useEffect(() => {
    setLoadingData(loading);
  }, [loading]);

  const isSkippable = (key, value) => {
    if (!key) return true;
    const lowerKey = key.toLowerCase();
    if (["client_id", "clientid"].includes(lowerKey)) return true;
    if (value === null || value === undefined || value === "") return true;
    const str = value.toString().toLowerCase();
    return ["n/a", "na", "n.a"].includes(str);
  };

  const flattenObject = (obj, parentKey = "") => {
    let items = [];
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = parentKey ? `${parentKey} → ${key}` : key;

      if (
        value === null ||
        value === undefined ||
        typeof value === "function"
      ) {
        continue;
      }

      if (Array.isArray(value)) {
        if (value.length === 0) continue;
        value.forEach((item, index) => {
          if (typeof item === "object") {
            items = items.concat(
              flattenObject(item, `${fullKey} [${index + 1}]`)
            );
          } else {
            items.push({ label: `${fullKey} [${index + 1}]`, value: item });
          }
        });
      } else if (typeof value === "object") {
        items = items.concat(flattenObject(value, fullKey));
      } else {
        items.push({ label: fullKey, value });
      }
    }
    return items;
  };

  const formatValue = (value) => {
    if (typeof value === "boolean") {
      return (
        <span
          className={`font-semibold px-3 py-1 rounded-full text-sm ${
            value ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      );
    }

    if (typeof value === "object" && value !== null) {
      return null;
    }

    return (
      <span className="text-slate-300 max-w-[60%] text-right break-words font-medium">
        {String(value)}
      </span>
    );
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      let endpoint = "/api/generate-rc-report";
      if (type === "upi") endpoint = "/api/generate-upi-report";
      else if (type === "challan") endpoint = "/api/generate-challan-report";
      const response = await instance.post(
        endpoint,
        { data },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}-details-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // Handle error if needed
    } finally {
      setDownloading(false);
    }
  };

  const getIcon = () => {
    switch (type) {
      case "upi":
        return <CreditCard className="w-5 h-5" />;
      case "challan":
        return <FileText className="w-5 h-5" />;
      default:
        return <Car className="w-5 h-5" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "upi":
        return "UPI Details";
      case "challan":
        return "Challan Details";
      default:
        return "RC Details";
    }
  };

  if (!id) return null;

  return (
    <>
      {(loadingData || downloading) && (
        <FullScreenLoader
          text={
            downloading
              ? "Generating PDF..."
              : `Loading ${type?.toUpperCase()} details...`
          }
        />
      )}

      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center px-4 animate-fadeIn">
        <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 max-h-[85vh] overflow-y-auto w-full max-w-2xl rounded-2xl shadow-2xl p-6 md:p-8 text-white relative">
          {/* Header */}
          <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                {getIcon()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {getTitle()}
                </h2>
                <p className="text-sm text-cyan-400 font-mono">{id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-red-400 hover:border-red-500/30 transition-all flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div ref={contentRef}>
            {data && Object.keys(data).length > 0 ? (
              <div className="space-y-3 pr-2">
                {Object.entries(data)
                  .filter(
                    ([key, value]) =>
                      !isSkippable(key, value) &&
                      key.toLowerCase() !== "challans"
                  )
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all"
                    >
                      <span className="text-slate-400 font-medium capitalize text-sm">
                        {key.replace(/_/g, " ")}
                      </span>
                      {formatValue(value)}
                    </div>
                  ))}

                {type === "challan" &&
                  Array.isArray(data.challan_details) &&
                  data.challan_details.map((challan, index) => {
                    const flattened = flattenObject(challan);
                    return (
                      <div key={index} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 space-y-3">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-700/50">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-sm font-bold">
                            {index + 1}
                          </div>
                          <h3 className="text-emerald-400 font-semibold">
                            Challan {index + 1}
                          </h3>
                        </div>
                        {flattened.map(({ label, value }, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0"
                          >
                            <span className="text-slate-500 text-sm capitalize">
                              {label.replace(/_/g, " ")}
                            </span>
                            {formatValue(value)}
                          </div>
                        ))}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-slate-400 text-lg">
                  No {type?.toUpperCase()} data available
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end items-center gap-3 pt-4 border-t border-slate-700/50">
            {!(
              type === "challan" &&
              (!data?.challan_details || data.challan_details.length === 0)
            ) && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black rounded-xl font-bold shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            )}
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-800/50 border border-slate-700/50 hover:border-red-500/30 hover:text-red-400 rounded-xl text-slate-300 font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.96);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default RcPopup;
