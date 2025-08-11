import React, { useState } from "react";
import { Listbox } from "@headlessui/react";
import { ChevronDown } from "lucide-react";
import UserCard from "../components/UserCard";
import instance from "../api/axios";
import { toast } from "react-toastify";
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
          (field) => inputValues[field] && inputValues[field].trim() !== ""
        )
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
      toast.error(Object.values(errors)[0]);
      return;
    }

    const payload = {
      type: selectedOption.key,
      data: { ...inputValues },
    };
    // console.log("Payload:", payload);
    if (!hasSufficientCredits()) {
      toast.warning("Insufficient credits. Please upgrade your plan.");
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

      toast.success("Found data based on your search");
    } catch (error) {
      toast.error("Verification error:", error);

      if (error.response) {
        // console.error("Status:", error.response.status);
        // console.error("Data:", error.response.data);
        toast.error("internal server error");
      }

      if (error.response && error.response.status === 422) {
        navigate("/verification-results", {
          state: { data: null },
        });
        toast.warn("No data found");
      } else if (error.response && error.response.status === 402) {
        toast.warning("Insufficient credits.");
      } else if (error.response && error.response.status === 400) {
        toast.error(error.response.data?.error || "Bad request.");
      } else {
        toast.error(error.response?.data?.message || "Something went wrong");
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
      <div className="w-full flex flex-col items-center z-10 text-white mt-10 sm:mt-20">
        <MainHeader header="Identity Intelligence" />
        <div className="min-h-auto max-w-full sm:max-w-3xl lg:max-w-4xl xl:max-w-7xl md:min-h-[450px] w-auto sm:w-full m-4 sm:mx-auto flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8 items-center md:items-start bg-gray-900/70 border border-lime-300/50 rounded-lg p-4 md:p-8">
          {/* Left: Dropdown */}
          <div className="w-full md:w-1/3 flex flex-col justify-start px-4 md:px-0">
            <label className="mb-1 font-semibold">Select Search Type</label>
            <Listbox value={selectedOption} onChange={handleOptionSelect}>
              <div className="relative">
                <Listbox.Button className="w-full py-2 px-4 rounded bg-gray-800 border border-lime-300 text-white font-semibold focus:outline-none flex justify-between items-center">
                  {selectedOption.label}
                  <ChevronDown className="w-5 h-5 text-lime-300" />
                </Listbox.Button>
                <Listbox.Options className="absolute mt-2 w-full bg-gray-800 border border-lime-300 rounded-md z-10">
                  {SEARCH_OPTIONS.map((option) => (
                    <Listbox.Option
                      key={option.key}
                      value={option}
                      className={({ active }) =>
                        `cursor-pointer select-none px-4 py-2 rounded ${
                          active ? "bg-lime-300 text-black" : "text-white"
                        }`
                      }
                    >
                      {option.label}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </div>
            </Listbox>
          </div>
          <div className="w-px bg-lime-200/50 self-stretch"></div>
          {/* Right: Input Fields */}
          <div className="w-full md:w-2/3 px-4 md:px-0">
            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              {selectedOption.fields.map((field) => {
                if (field.type === "text" || field.type === "date") {
                  return (
                    <div key={field.name} className="flex flex-col">
                      <label className="mb-1 flex items-center gap-2">
                        {field.label}
                        {field.optional && (
                          <span className="text-xs px-1 py-0.5 rounded bg-gray-200 text-gray-800 font-medium">
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
                        className={`p-2 rounded bg-gray-800 border ${
                          errors[field.name] || errors._employment
                            ? "border-red-500"
                            : "border-lime-300"
                        } text-white outline-none`}
                      />
                    </div>
                  );
                }
              })}

              <button
                type="submit"
                className="self-center w-48 mt-4 px-4 py-1.5 bg-gradient-to-r from-lime-200 to-teal-800 text-black rounded font-bold hover:bg-gradient-to-r hover:from-teal-800 hover:to-lime-200 shadow-lg text-lg"
              >
                Verify
              </button>
            </form>
            {/* {resultData && <CorporateResults data={resultData} />} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationFinder;
