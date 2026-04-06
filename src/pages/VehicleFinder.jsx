/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import UserCard from "../components/UserCard";
import instance from "../api/axios";
import { toast } from "react-toastify";
import MainHeader from "../components/MainHeader";
import FullScreenLoader from "../components/FullScreenLoader";
import useAuthContext from "../context/AuthContext";

const SEARCH_OPTIONS = [
  {
    key: "rc_full",
    label: "RC Full Details",
    endpoint: "/api/rcfull-details",
    reportEndpoint: "/api/generate-rc-report",
    reportFilename: "rc_details",
    isVerification: false,
    fields: [
      { name: "id_number", label: "Vehicle Registration Number", type: "text", placeholder: "Ex. GJ01AB1234" },
    ],
  },
  {
    key: "rc_challan",
    label: "RC Challan Details",
    endpoint: "/api/rc-challan-details",
    reportEndpoint: "/api/generate-challan-report",
    reportFilename: "rc_challan",
    isVerification: false,
    fields: [
      { name: "rc_number", label: "Vehicle Registration Number", type: "text", placeholder: "Ex. GJ01AB1234" },
    ],
  },
  {
    key: "vehicle_rc",
    label: "Verify Vehicle RC",
    endpoint: "/api/verification-id",
    reportEndpoint: "/api/generate-verification-report",
    reportFilename: "verify_vehicle_rc",
    isVerification: true,
    verType: "vehicle_rc",
    fields: [
      { name: "vehicle_number", label: "Vehicle Registration Number", type: "text", placeholder: "Ex. GJ01AB1234" },
    ],
  },
  {
    key: "driving_license",
    label: "Verify Driving License",
    endpoint: "/api/verification-id",
    reportEndpoint: "/api/generate-verification-report",
    reportFilename: "verify_driving_license",
    isVerification: true,
    verType: "driving_license",
    fields: [
      { name: "dl_number", label: "Driving License Number", type: "text", placeholder: "Ex. GJ0120210012345" },
      { name: "dob", label: "Date of Birth", type: "date", placeholder: "YYYY-MM-DD" },
    ],
  },
];

// ── flatten nested object to key/value pairs ──────────────────────────────────
function flattenObject(obj, parentKey = "", result = {}) {
  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    const value = obj[key];
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === "object") {
        value.forEach((item, i) => flattenObject(item, `${newKey}[${i}]`, result));
      } else {
        result[newKey] = value.length ? value.join(", ") : "N/A";
      }
    } else {
      result[newKey] = value === null || value === "1800-01-01" ? "N/A" : value;
    }
  }
  return result;
}

// ── Results Modal ─────────────────────────────────────────────────────────────
const ResultsModal = ({ data, searchInput, type, reportEndpoint, reportFilename, onClose }) => {
  const [downloading, setDownloading] = useState(false);

  const flattenedData = data ? flattenObject(data) : {};
  const entries = Object.entries(flattenedData).filter(
    ([, v]) => v !== null && v !== "" && v !== "N/A" && v !== "-" && v !== undefined
  );

  const handleDownload = async () => {
    if (!data || !reportEndpoint) return;
    setDownloading(true);
    try {
      const response = await instance.post(
        reportEndpoint,
        { data, title: type, searchInput },
        { responseType: "blob" }
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${reportFilename}_${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Report downloaded successfully");
    } catch {
      toast.error("Failed to generate PDF report");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-2xl max-h-[88vh] bg-gray-950 border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-lime-400 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
            </svg>
            <div>
              <p className="text-white font-semibold text-sm">{type} Result</p>
              <p className="text-lime-400 text-xs">{searchInput}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {data && (
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-lime-200 to-teal-700 text-gray-900 text-xs font-bold hover:opacity-90 disabled:opacity-60 transition-opacity"
              >
                {downloading ? (
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                )}
                {downloading ? "Generating..." : "Download PDF"}
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg border border-white/15 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* body */}
        <div className="overflow-y-auto flex-1 p-5 custom-scrollbar">
          {entries.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {entries.map(([key, value]) => (
                <div key={key} className="flex flex-col gap-0.5">
                  <span className="text-gray-500 text-xs capitalize">
                    {key.split(".").pop().replace(/_/g, " ")}
                  </span>
                  <span className="text-white text-sm break-all">{String(value)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-yellow-400 mt-8">No data found for this search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const VehicleFinder = () => {
  const [selectedOption, setSelectedOption] = useState(SEARCH_OPTIONS[0]);
  const [inputValues, setInputValues]       = useState({});
  const [errors, setErrors]                 = useState({});
  const [loading, setLoading]               = useState(false);
  const [result, setResult]                 = useState(null); // { data, searchInput, type }
  const { hasSufficientCredits, updateUser } = useAuthContext();

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setInputValues({});
    setErrors({});
  };

  const handleInputChange = (name, value) => {
    setInputValues((prev) => ({ ...prev, [name]: value }));
  };

  const validateFields = () => {
    const errs = {};
    selectedOption.fields.forEach((field) => {
      const value = inputValues[field.name];
      if (!value || value.trim() === "") {
        errs[field.name] = `${field.label} is required.`;
      }
    });
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateFields();
    setErrors(errs);
    if (Object.keys(errs).length > 0) { toast.error(Object.values(errs)[0]); return; }
    if (!hasSufficientCredits()) { toast.warning("Insufficient credits. Please upgrade your plan."); return; }

    setLoading(true);
    try {
      // Verification endpoints expect { type, data: {...} }; others expect flat fields
      const payload = selectedOption.isVerification
        ? { type: selectedOption.verType, data: inputValues }
        : inputValues;

      const response = await instance.post(selectedOption.endpoint, payload);
      const credits = response?.data?.credits;
      if (credits !== undefined) updateUser({ credits });

      // Unwrap nested Surepass response: { data: { status_code, message, data: {...} }, credits }
      const outer = response.data.data ?? response.data;
      const innerData = outer?.data ?? outer;

      const searchInput =
        inputValues.id_number || inputValues.rc_number ||
        inputValues.vehicle_number || inputValues.dl_number || "";

      setResult({
        data: innerData,
        searchInput,
        type: selectedOption.label,
        reportEndpoint: selectedOption.reportEndpoint,
        reportFilename: selectedOption.reportFilename,
      });
      toast.success("Found data based on your search");
    } catch (error) {
      const status  = error?.response?.status;
      const message = error?.response?.data?.message || "Something went wrong. Please try again.";
      const credits = error?.response?.data?.credits;
      if (credits !== undefined) {
        toast.error(`${message} You have ${credits} credits remaining.`);
      } else if (status === 422) {
        setResult({ data: null, searchInput: Object.values(inputValues)[0] || "", type: selectedOption.label });
        toast.warn("No data found");
      } else if (status !== 402) {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { setInputValues({}); }, [selectedOption]);

  return (
    <>
      {loading && <FullScreenLoader text="Searching vehicle intelligence..." />}
      {result && (
        <ResultsModal
          data={result.data}
          searchInput={result.searchInput}
          type={result.type}
          reportEndpoint={result.reportEndpoint}
          reportFilename={result.reportFilename}
          onClose={() => setResult(null)}
        />
      )}
      <UserCard />
      <div className="flex-1 flex flex-col items-center justify-center z-10 text-white -mt-36 sm:-mt-20">
        <MainHeader header="Vehicle Intell" />
        <div className="w-auto sm:w-full max-w-full sm:max-w-3xl lg:max-w-4xl xl:max-w-7xl m-4 sm:mx-auto flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8 items-center md:items-start bg-gray-900/70 border border-lime-300/50 rounded-lg p-4 md:p-8">

          {/* Left: Dropdown */}
          <div className="w-full md:w-1/3 flex flex-col justify-start px-4 md:px-0">
            <label className="mb-1 font-semibold">Select Search Type</label>
            <Listbox value={selectedOption} onChange={handleOptionSelect}>
              <div className="relative">
                <Listbox.Button className="w-full py-2 px-4 rounded bg-custom-input-bg border border-lime-300 text-white font-semibold focus:outline-none flex justify-between items-center">
                  {selectedOption.label}
                  <ChevronDown className="w-5 h-5 text-lime-300" />
                </Listbox.Button>
                <Listbox.Options className="absolute mt-2 w-full bg-custom-input-bg border border-lime-300 rounded-md z-10">
                  {SEARCH_OPTIONS.map((option) => (
                    <Listbox.Option
                      key={option.key}
                      value={option}
                      className={({ active }) =>
                        `cursor-pointer select-none px-4 py-2 rounded ${active ? "bg-lime-300 text-black" : "text-white"}`
                      }
                    >
                      {option.label}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>

          <div className="w-px bg-lime-200/50 self-stretch" />

          {/* Right: Input Fields */}
          <div className="w-full md:w-2/3 px-4 md:px-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              {selectedOption.fields.map((field) => (
                <div key={field.name} className="flex flex-col">
                  <label className="mb-1">{field.label}</label>
                  <input
                    type={field.type === "date" ? "date" : "text"}
                    value={inputValues[field.name] || ""}
                    onChange={(e) => handleInputChange(field.name, e.target.value)}
                    placeholder={field.placeholder || `Enter ${field.label}`}
                    className={`p-2 rounded bg-custom-input-bg border ${
                      errors[field.name] ? "border-red-500" : "border-lime-300"
                    } text-white outline-none`}
                  />
                  {errors[field.name] && (
                    <span className="text-red-400 text-xs mt-1">{errors[field.name]}</span>
                  )}
                </div>
              ))}
              <button
                type="submit"
                className="self-center w-48 mt-4 px-4 py-1.5 bg-gradient-to-r from-lime-200 to-teal-800 text-black rounded font-bold hover:from-teal-800 hover:to-lime-200 shadow-lg text-lg"
              >
                Search
              </button>
            </form>
          </div>

        </div>
      </div>
    </>
  );
};

export default VehicleFinder;
