import React, { useRef, useState, useEffect } from "react";
import instance from "../api/axios";
import FullScreenLoader from "./FullScreenLoader";

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
          className={`font-semibold ${
            value ? "text-green-400" : "text-red-400"
          }`}
        >
          {value ? "Yes" : "No"}
        </span>
      );
    }

    if (typeof value === "object" && value !== null) {
      // Don't render this value — it should have been flattened already
      return null;
    }

    return (
      <span className="text-gray-300 max-w-[60%] text-right break-words">
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

      // console.log("Download data:", data); // ✅ Log data being sent
      // console.log("Download response:", response); // ✅ Log full response
      // console.log("response data", response.data); // ✅ Log response data
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

      <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center px-4 animate-fadeIn custom-scrollbar">
        <div className="bg-gradient-to-br from-[#1e293b] to-[#111827] border border-gray-700 max-h-[80vh] overflow-y-auto w-full max-w-2xl rounded-xl shadow-2xl p-6 text-white relative">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
            <h2 className="text-xl font-semibold text-white tracking-wide">
              {type === "upi"
                ? "UPI Details"
                : type === "challan"
                ? "Challan Details"
                : "RC Details"}
              : <span className="text-lime-200">{id}</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 text-2xl font-bold transition"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div ref={contentRef}>
            {data && Object.keys(data).length > 0 ? (
              <div className="space-y-3 pr-1 scroll-smooth">
                {/* Render top-level fields except 'challans' */}
                {Object.entries(data)
                  .filter(
                    ([key, value]) =>
                      !isSkippable(key, value) &&
                      key.toLowerCase() !== "challans"
                  )
                  .map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between border-b border-gray-700 py-1 text-sm"
                    >
                      <span className="text-gray-400 font-medium capitalize">
                        {key.replace(/_/g, " ")}:
                      </span>
                      {formatValue(value)}
                    </div>
                  ))}

                {/* Render Challans */}
                {/* Render Challans */}
                {type === "challan" &&
                  Array.isArray(data.challan_details) &&
                  data.challan_details.map((challan, index) => {
                    const flattened = flattenObject(challan);
                    return (
                      <div key={index} className=" p-3 rounded-md space-y-2">
                        <h3 className="text-lime-300 font-semibold">
                          Challan {index + 1}
                        </h3>
                        {flattened.map(({ label, value }, i) => (
                          <div
                            key={i}
                            className="flex justify-between text-sm border-b border-gray-700 py-1"
                          >
                            <span className="text-gray-400 font-medium capitalize">
                              {label.replace(/_/g, " ")}:
                            </span>
                            {formatValue(value)}
                          </div>
                        ))}
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-gray-400 text-center">
                ⚠ No {type?.toUpperCase()} data available.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-between items-center">
            {!(
              type === "challan" &&
              (!data?.challan_details || data.challan_details.length === 0)
            ) && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className={`${
                  downloading
                    ? "bg-lime-200 cursor-not-allowed"
                    : "bg-lime-200 hover:bg-lime-300"
                } px-4 py-2 rounded-md text-black font-medium transition duration-200`}
              >
                Download pdf
              </button>
            )}
            <button
              onClick={onClose}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-white font-medium transition duration-200"
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
