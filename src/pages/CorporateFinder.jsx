import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown, Search } from "lucide-react";
import UserCard from "../components/UserCard";
import instance from "../api/axios";
import { useAlert } from "../components/Alert";
import MainHeader from "../components/MainHeader";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../components/FullScreenLoader";
import useAuthContext from "../context/AuthContext";

const SEARCH_OPTIONS = [
  {
    key: "corporate_gstin",
    label: "Corporate GSTIN",
    fields: [
      {
        name: "id_number",
        label: "ID Number",
        type: "text",
        placeholder: "Ex. 08AKWPJ1234H1ZN",
      },
      {
        name: "year",
        label: "Financial year",
        type: "select",
        options: ["2024", "2023", "2022", "2021"],
      },
      { name: "filing_status", label: "Filing Status", type: "checkbox" },
      { name: "hsn_info", label: "HSN Info", type: "checkbox" },
      { name: "filing_frequency", label: "Filing Frequency", type: "checkbox" },
      { name: "address", label: "Split Address", type: "checkbox" },
    ],
  },
  {
    key: "credit_report",
    label: "Credit Report",
    fields: [
      {
        name: "mobile",
        label: "Mobile Number",
        type: "text",
        placeholder: "Ex. 9966887744",
      },
      {
        name: "pan",
        label: "PAN Number",
        type: "text",
        placeholder: "Ex. EKRPR1234F",
      },
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Ex. Vishal Rathore",
      },
      {
        name: "gender",
        label: "Gender",
        type: "radio",
        options: ["male", "female"],
      },
      {
        name: "consent",
        label:
          "By clicking the checkbox, I consent to the fetching of my credit report data.",
        type: "checkbox",
      },
    ],
  },
  {
    key: "corporate_cin",
    label: "Corporate CIN",
    fields: [
      {
        name: "id_number",
        label: "ID Number",
        type: "text",
        placeholder: "Ex. U65999MH1995PLC123456",
      },
    ],
  },
  {
    key: "gst_intel",
    label: "GST INTEL",
    fields: [
      {
        name: "id_number",
        label: "ID Number",
        type: "text",
        placeholder: "Ex. 08AKWPJ1234H1ZN",
      },
      { name: "filing_status", label: "Filing Status", type: "checkbox" },
      { name: "hsn_info", label: "HSN Info", type: "checkbox" },
      { name: "filing_frequency", label: "Filing Frequency", type: "checkbox" },
    ],
  },
  {
    key: "employment_history",
    label: "Employment History UAN",
    fields: [
      {
        name: "id_number",
        label: "ID Number",
        type: "text",
        placeholder: "Ex. 111779821234",
      },
    ],
  },
  {
    key: "find_uan",
    label: "Find UAN",
    fields: [
      {
        name: "mobile_number",
        label: "Mobile Number",
        type: "text",
        placeholder: "Ex. 8076027829",
      },
    ],
  },
  {
    key: "pan_to_uan",
    label: "PAN to UAN",
    fields: [
      {
        name: "pan_number",
        label: "PAN Number",
        type: "text",
        placeholder: "Ex. xxxx1234xxxx",
      },
    ],
  },
];

const CorporateFinder = () => {
  const [selectedOption, setSelectedOption] = useState(SEARCH_OPTIONS[0]);
  const [inputValues, setInputValues] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { hasSufficientCredits, updateUser } = useAuthContext();
  const showAlert = useAlert();

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setInputValues({});
  };

  const handleInputChange = (name, value) => {
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateFields = () => {
    const errors = {};

    selectedOption.fields.forEach((field) => {
      const value = inputValues[field.name];

      if (
        (field.type === "text" ||
          field.type === "select" ||
          field.type === "radio") &&
        (!value || value === "")
      ) {
        errors[field.name] = `${field.label} is required.`;
      }

      if (field.name === "mobile" && value) {
        if (!/^\d+$/.test(value)) {
          errors[field.name] = "Mobile number must contain only digits.";
        } else if (value.length < 7 || value.length > 12) {
          errors[field.name] = "Mobile number must be between 7 and 12 digits.";
        }
      }

      if (
        field.name === "pan" &&
        value &&
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)
      ) {
        errors[field.name] = "Invalid PAN format.";
      }

      if (field.name === "consent" && !value) {
        errors[field.name] = "You must consent to fetch your credit report.";
      }
    });
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateFields();
    setErrors(errors);
    if (Object.keys(errors).length > 0) {
      showAlert.error(Object.values(errors)[0]);
      return;
    }

    const payload = {
      type: selectedOption.key,
      data: inputValues,
    };
    if (!hasSufficientCredits()) {
      showAlert.warning("Insufficient credits. Please upgrade your plan.");
      return;
    }
    setLoading(true);
    try {
      const response = await instance.post(
        "/api/corporate-intelligence",
        payload,
        {
          responseType:
            selectedOption.key === "credit_report" ? "blob" : "json",
        }
      );
      const searchInput =
        inputValues.id_number ||
        inputValues.mobile ||
        inputValues.pan ||
        inputValues.mobile_number ||
        "";
      const credits = response?.data?.credits;
      if (credits !== undefined) {
        updateUser({ credits });
      }
      if (
        selectedOption.key === "credit_report" &&
        response.headers["content-type"] === "application/pdf"
      ) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `credit_report_${Date.now()}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        showAlert.success("Report downloaded successfully");
        setInputValues({});
        setLoading(false);
        return;
      } else {
        navigate("/corporate-results", {
          state: { data: response.data.data, searchInput },
        });
        showAlert.success("Found data based on your search");
      }
    } catch (error) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      const credits = error?.response?.data?.credits;

      if (credits !== undefined) {
        showAlert.error(`${message} You have ${credits} credits remaining.`);
      } else {
        showAlert.error(message);
      }

      if (selectedOption.key === "credit_report") {
        showAlert.error("Error occurred. Please check your data and try again.");
        return;
      }

      if (error.response && status === 422) {
        navigate("/corporate-results", {
          state: { data: null },
        });
        showAlert.warning("No data found");
      } else if (status !== 402) {
        showAlert.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialValues = {};
    selectedOption.fields.forEach((field) => {
      if (field.type === "select") {
        initialValues[field.name] = field.options[0];
      }
    });
    setInputValues((prev) => ({ ...initialValues, ...prev }));
  }, [selectedOption.fields]);

  return (
    <>
      {loading && (
        <FullScreenLoader
          text={`${
            selectedOption.key === "credit_report"
              ? "Generating PDF..."
              : "Searching..."
          }`}
        />
      )}
      <UserCard />
      <div className="w-full flex flex-col items-center justify-center z-10 mt-16 pl-4 md:pl-64 text-white">
        <MainHeader header="Corporate Intelligence" />
        <div className="min-h-auto max-w-full sm:max-w-3xl lg:max-w-4xl xl:max-w-7xl w-auto sm:w-full m-4 sm:mx-auto flex flex-col gap-6 bg-transparent backdrop-blur-none border border-transparent rounded-xl p-4 md:p-8 shadow-none">
          {/* type buttons */}
          <div>
            <p className="mb-3 text-xs font-semibold text-slate-500 tracking-widest uppercase">Search Type</p>
            <div className="flex flex-wrap gap-2">
              {SEARCH_OPTIONS.map((option) => {
                const isActive = selectedOption.key === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => handleOptionSelect(option)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-400"
                        : "bg-slate-800/40 border border-slate-700/40 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 hover:border-slate-600/60"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full h-px bg-slate-700/50" />

          <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {selectedOption.fields.map((field) => {
                if (field.type === "text") {
                  return (
                    <div key={field.name} className="flex flex-col">
                      <label className="mb-2 text-sm font-medium text-slate-300">{field.label}</label>
                      <input
                        type="text"
                        value={inputValues[field.name] || ""}
                        onChange={(e) =>
                          handleInputChange(field.name, e.target.value)
                        }
                        placeholder={
                          field.placeholder || `Enter ${field.label}`
                        }
                        className={`p-3 rounded-xl bg-slate-800/60 border ${
                          errors[field.name]
                            ? "border-red-500/50 bg-red-500/10"
                            : "border-slate-700/50 focus:border-cyan-500/60"
                        } text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all focus:bg-slate-800/80`}
                      />
                    </div>
                  );
                }
                if (field.type === "select") {
                  return (
                    <div key={field.name} className="flex flex-col">
                      <label className="mb-2 text-sm font-medium text-slate-300">{field.label}</label>
                      <Listbox
                        value={inputValues[field.name] || field.options[0]}
                        onChange={(value) =>
                          handleInputChange(field.name, value)
                        }
                      >
                        <div className="relative">
                          <Listbox.Button
                            className={`w-full py-3 px-4 rounded-xl bg-slate-800/60 border ${
                              errors[field.name]
                                ? "border-red-500/50"
                                : "border-slate-700/50 focus:border-cyan-500/60"
                            } text-white outline-none focus:ring-2 focus:ring-cyan-500/20 flex justify-between items-center hover:border-cyan-500/50 transition-all`}
                          >
                            {inputValues[field.name] || field.options[0]}
                            <ChevronDown className="w-5 h-5 text-cyan-400" />
                          </Listbox.Button>
                          <Listbox.Options className="absolute mt-2 w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-10 overflow-hidden">
                            {field.options.map((opt) => (
                              <Listbox.Option
                                key={opt}
                                value={opt}
                                className={({ active, selected }) =>
                                  `cursor-pointer select-none px-4 py-3 transition-all ${
                                    active
                                      ? "bg-cyan-500/20 text-cyan-400"
                                      : "text-slate-300 hover:bg-slate-800/50"
                                  } ${selected ? "font-bold" : ""}`
                                }
                              >
                                {opt}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </div>
                      </Listbox>
                    </div>
                  );
                }
                if (field.type === "radio") {
                  return (
                    <div key={field.name} className="flex flex-col mt-2">
                      <label className="mb-2 text-sm font-medium text-slate-300">{field.label}</label>
                      <div className="flex gap-6">
                        {field.options.map((option) => (
                          <label
                            key={option}
                            className="inline-flex items-center gap-2 cursor-pointer text-sm"
                          >
                            <input
                              type="radio"
                              name={field.name}
                              value={option}
                              checked={inputValues[field.name] === option}
                              onChange={(e) =>
                                handleInputChange(field.name, e.target.value)
                              }
                              className={`h-4 w-4 rounded-full border-2 ${
                                errors[field.name]
                                  ? "border-red-500"
                                  : "border-slate-600"
                              } text-cyan-500 focus:ring-cyan-500/50`}
                            />
                            <span className="text-slate-300 capitalize">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                }
              })}
              {selectedOption.fields.filter((f) => f.type === "checkbox")
                .length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {selectedOption.fields
                    .filter((f) => f.type === "checkbox")
                    .map((field) => (
                      <label
                        key={field.name}
                        className="inline-flex items-center gap-3 cursor-pointer text-slate-300 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={!!inputValues[field.name]}
                          onChange={(e) =>
                            handleInputChange(
                              field.name,
                              selectedOption.key === "credit_report"
                                ? e.target.checked
                                  ? "Y"
                                  : "N"
                                : e.target.checked
                            )
                          }
                          className={`h-4 w-4 rounded border-2 ${
                            errors[field.name]
                              ? "border-red-500"
                              : "border-slate-600"
                          } text-cyan-500 focus:ring-cyan-500/50`}
                        />
                        <span>{field.label}</span>
                      </label>
                    ))}
                </div>
              )}

              <button
                type="submit"
                className="self-start mt-4 px-5 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black rounded-lg text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                disabled={loading}
              >
                <Search size={20} />
                {selectedOption.key === "credit_report"
                  ? "Download Report"
                  : "Search"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CorporateFinder;
