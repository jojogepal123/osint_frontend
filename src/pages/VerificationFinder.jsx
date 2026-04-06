import { useState } from "react";
import { Search } from "lucide-react";
import UserCard from "../components/UserCard";
import instance from "../api/axios";
import { useAlert } from "../components/Alert";
import MainHeader from "../components/MainHeader";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../components/FullScreenLoader";
import useAuthContext from "../context/AuthContext";

const SEARCH_OPTIONS = [
  {
    key: "pan",
    label: "Verify PAN",
    fields: [
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
        optional: true,
      },
    ],
  },
  {
    key: "driving_license",
    label: "Verify Driving License",
    fields: [
      {
        name: "dl_number",
        label: "License Number",
        placeholder: "Ex. JK08XXXXXXXXXX",
        type: "text",
      },
      {
        name: "dob",
        label: "Date of Birth",
        type: "date",
        placeholder: "Ex. Yunas Khan",
      },
    ],
  },
  {
    key: "voter_id",
    label: "Verify Voter ID",
    fields: [
      {
        name: "epic_number",
        label: "Voter ID Number",
        type: "text",
        placeholder: "Ex. 124xxxxxxx",
      },
      {
        name: "name",
        label: "Name on Voter ID",
        type: "text",
        placeholder: "Ex. Yunas Khan",
        optional: true,
      },
    ],
  },
  {
    key: "passport",
    label: "Verify Passport",
    fields: [
      {
        name: "file_number",
        label: "File Number",
        type: "text",
        placeholder: "Ex. PA094044",
      },
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Ex. Jane",
        optional: true,
      },
      { name: "dob", label: "Date of Birth", type: "date" },
    ],
  },
  {
    key: "bank_account",
    label: "Verify Bank Account",
    fields: [
      {
        name: "account_number",
        label: "Account Number",
        placeholder: "Ex. 123456789012",
        type: "text",
      },
      {
        name: "ifsc",
        label: "IFSC",
        type: "text",
        placeholder: "Ex. SBIN0001234",
      },
      {
        name: "name",
        label: "Account Holder Name",
        type: "text",
        placeholder: "Ex. Ramesh Kumar",
        optional: true,
      },
      {
        name: "phone",
        label: "Mobile Number",
        type: "text",
        placeholder: "Ex. 9876543210",
        optional: true,
      },
    ],
  },
  {
    key: "ifsc",
    label: "Verify IFSC",
    fields: [
      {
        name: "ifsc",
        label: "IFSC",
        type: "text",
        placeholder: "Ex. HDFC0009876",
      },
    ],
  },
  {
    key: "vehicle_rc",
    label: "Verify Vehicle RC",
    fields: [
      {
        name: "vehicle_number",
        label: "Vehicle Number",
        type: "text",
        placeholder: "Ex. MH12AB1234",
      },
    ],
  },
  {
    key: "employment",
    label: "Employment Verification",
    fields: [
      {
        name: "phone",
        label: "Mobile Number",
        type: "text",
        placeholder: "Ex. 9876543210",
      },
      {
        name: "pan",
        label: "PAN",
        type: "text",
        placeholder: "Ex. ABCDE1234F",
      },
      {
        name: "uan",
        label: "UAN",
        type: "text",
        placeholder: "Ex. 100123456789",
      },
      {
        name: "dob",
        label: "Date of Birth",
        type: "date",
        placeholder: "Ex. 1990-05-15",
      },
      {
        name: "employee_name",
        label: "Employee Name",
        type: "text",
        placeholder: "Ex. Rajat Sharma",
      },
      {
        name: "employer_name",
        label: "Employer Name",
        type: "text",
        placeholder: "Ex. Infosys Ltd.",
      },
    ],
  },
];

const VerificationFinder = () => {
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

  const employmentRequiredCombos = [
    ["phone"],
    ["uan"],
    ["phone", "pan"],
    ["phone", "dob", "employer_name"],
    ["phone", "employee_name", "employer_name"],
    ["phone", "dob", "employee_name", "employer_name"],
    ["phone", "pan", "employee_name", "employer_name"],
    ["phone", "dob", "pan", "employee_name", "employer_name"],
    ["uan", "employee_name", "employer_name"],
    ["uan", "employee_name"],
    ["dob", "employee_name"],
    ["dob", "employee_name", "employer_name"],
  ];

  const validateFields = () => {
    const errors = {};

    if (selectedOption.key === "employment") {
      const isAnyComboValid = employmentRequiredCombos.some((combo) =>
        combo.every(
          (field) => inputValues[field] && inputValues[field].trim() !== "",
        ),
      );
      if (!isAnyComboValid) {
        errors._employment =
          "Please fill all fields for at least one valid combination (e.g. phone + pan, uan + name, etc).";
      }
    } else {
      selectedOption.fields.forEach((field) => {
        const value = inputValues[field.name];

        // Required field validation (for text, select, radio)

        if (
          !field.optional &&
          (field.type === "text" ||
            field.type === "select" ||
            field.type === "date" ||
            field.type === "radio") &&
          (!value || value === "")
        ) {
          errors[field.name] = `${field.label} is required.`;
        }

        // Example: Mobile number validation
        if (field.name === "phone" && value) {
          if (!/^\d+$/.test(value)) {
            errors[field.name] = "Mobile number must contain only digits.";
          } else if (value.length < 7 || value.length > 12) {
            errors[field.name] =
              "Mobile number must be between 7 and 12 digits.";
          }
        }

        // Example: PAN validation
        if (
          field.name === "pan" &&
          value &&
          !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)
        ) {
          errors[field.name] = "Invalid PAN format.";
        }

        // Example: Consent checkbox must be checked
        if (field.name === "consent" && !value) {
          errors[field.name] = "You must consent to fetch your credit report.";
        }
      });
    }

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
      data: { ...inputValues },
    };
    // console.log("Payload:", payload);
    if (!hasSufficientCredits()) {
      showAlert.warning("Insufficient credits. Please upgrade your plan.");
      return;
    }
    setLoading(true);
    try {
      const response = await instance.post("/api/verification-id", payload);
      const searchInput =
        inputValues.phone ||
        inputValues.pan ||
        inputValues.account_number ||
        inputValues.vehicle_number ||
        inputValues.ifsc ||
        inputValues.epic_number ||
        inputValues.dl_number ||
        inputValues.file_number ||
        inputValues.uan ||
        inputValues.dob ||
        inputValues.employee_name ||
        inputValues.employer_name ||
        "";
      const credits = response?.data?.credits;
      if (credits !== undefined) {
        updateUser({ credits });
      }
      navigate("/verification-results", {
        state: { data: response.data, searchInput },
      });

      // console.log("Verification data:", response.data);

      // toast.success("Found data based on your search");
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 400:
            showAlert.error(data?.error || "Bad request");
            break;

          case 401:
            showAlert.error("Session expired. Please login again.");
            break;

          case 403:
            showAlert.error("You are not authorized to perform this action.");
            break;

          case 404:
            showAlert.error("Service not found.");
            break;

          case 422:
            showAlert.warning(data?.error || "No data found");
            navigate("/verification-results", { state: { data: null } });
            break;

          case 402:
            showAlert.warning("Insufficient credits.");
            break;

          case 500:
            showAlert.error("Server error. Please try again later.");
            break;

          default:
            showAlert.error(data?.message || "Something went wrong.");
        }
      } else if (error.request) {
        // Request sent but no response (network issue)
        showAlert.error("Network error. Please check your connection.");
      } else {
        // Axios setup error
        showAlert.error("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
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
        <MainHeader header="Identity Intelligence" />
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
                if (field.type === "text" || field.type === "date") {
                  return (
                    <div key={field.name} className="flex flex-col">
                      <label className="mb-2 flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-300">{field.label}</span>
                        {field.optional && (
                          <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-medium">
                            Optional
                          </span>
                        )}
                      </label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder || ""}
                        value={inputValues[field.name] || ""}
                        onChange={(e) =>
                          handleInputChange(field.name, e.target.value)
                        }
                        className={`p-3 rounded-xl bg-slate-800/60 border ${
                          errors[field.name] || errors._employment
                            ? "border-red-500/50 bg-red-500/10"
                            : "border-slate-700/50 focus:border-cyan-500/60"
                        } text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all focus:bg-slate-800/80`}
                      />
                    </div>
                  );
                }
              })}

              <button
                type="submit"
                className="self-start mt-4 px-5 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black rounded-lg text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 disabled:opacity-50"
                disabled={loading}
              >
                <Search size={20} />
                Verify
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};


export default VerificationFinder;
