import React, { useRef, useState, useEffect } from "react";
import instance from "../api/axios";
import FullScreenLoader from "./FullScreenLoader"; // Make sure this import path is correct

const RcPopup = ({ rc, data, loading, onClose }) => {
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
    return (
      <span className="text-gray-300 max-w-[60%] text-right break-words">
        {value}
      </span>
    );
  };

  const downloadRCReport = async () => {
    setDownloading(true);
    try {
      const response = await instance.post(
        "/api/generate-rc-report",
        { data },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `rc-details-${rc}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      // console.error("Failed to generate RC report", err);
    } finally {
      setDownloading(false);
    }
  };

  if (!rc) return null;

  return (
    <>
      {/* Show FullScreenLoader during RC data loading or PDF download */}
      {(loadingData || downloading) && (
        <FullScreenLoader
          text={downloading ? "Generating PDF..." : "Loading RC details..."}
        />
      )}

      <div className="fixed inset-0 z-50 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center px-4 animate-fadeIn custom-scrollbar">
        <div className="bg-gradient-to-br from-[#1e293b] to-[#111827] border border-gray-700 max-h-[80vh] overflow-y-auto w-full max-w-2xl rounded-xl shadow-2xl p-6 text-white relative">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
            <h2 className="text-xl font-semibold text-white tracking-wide">
              RC Details: <span className="text-lime-200">{rc}</span>
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-red-500 text-2xl font-bold transition"
            >
              ×
            </button>
          </div>

          {/* RC Content */}
          <div ref={contentRef}>
            {data && Object.keys(data).length > 0 ? (
              <div className="space-y-3 pr-1 scroll-smooth">
                {Object.entries(data)
                  .filter(([key, value]) => !isSkippable(key, value))
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
              </div>
            ) : (
              <p className="text-gray-400 text-center">
                ⚠ No RC data available.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={downloadRCReport}
              disabled={downloading}
              className={`${
                downloading
                  ? "bg-lime-200 cursor-not-allowed"
                  : "bg-lime-200 hover:bg-lime-300"
              } px-4 py-2 rounded-md text-black font-medium transition duration-200`}
            >
              Download pdf
            </button>
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
