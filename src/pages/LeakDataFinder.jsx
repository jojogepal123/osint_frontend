import { useState } from "react";
import { Plus, Minus, Search, User, Mail, Phone, AtSign } from "lucide-react";
import { useAlert } from "../components/Alert";
import { OsintCard } from "../components/cards/OsintCard";
import instance from "../api/axios";
import FullScreenLoader from "../components/FullScreenLoader";
import UserCard from "../components/UserCard";
import MainHeader from "../components/MainHeader";
import useAuthContext from "../context/AuthContext";

const FIELD_TYPES = {
  name: { label: "Name", type: "text", placeholder: "Enter Name", icon: User },
  email: { label: "Email", type: "email", placeholder: "Enter Email", icon: Mail },
  phone: { label: "Phone", type: "tel", placeholder: "Enter Phone Number", icon: Phone },
  username: { label: "Username", type: "text", placeholder: "Enter Username", icon: AtSign },
};

const FIELD_OPTIONS = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "username", label: "Username" },
];
const LeakDataFinder = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [emptyResults, setEmptyResults] = useState(false);
  const { updateUser, hasSufficientCredits } = useAuthContext();
  const [fields, setFields] = useState([
    { id: Date.now(), type: "name", value: "", isValid: true, error: "" },
  ]);
  const showAlert = useAlert();

  const handleAddField = (type) => {
    if (fields.length >= 4) {
      showAlert.warning("You can only add 4 fields");
    } else {
      setFields([...fields, { id: Date.now(), type, value: "", isValid: true, error: "" }]);
    }
  };

  const validateField = (type, value) => {
    if (!value.trim()) {
      return { isValid: false, error: "This field is required!" };
    }
    if (type === "name") {
      const nameRegex = /^[A-Za-z\s]+$/;
      if (!nameRegex.test(value)) {
        return { isValid: false, error: "Name must contain only letters." };
      }
    }
    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return { isValid: false, error: "Invalid email format" };
      }
    }
    if (type === "phone") {
      const phoneRegex = /^[0-9]{10,15}$/;
      if (!phoneRegex.test(value)) {
        return { isValid: false, error: "Invalid phone number" };
      }
    }
    if (type === "username") {
      const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
      if (!usernameRegex.test(value)) {
        return { isValid: false, error: "Invalid username format" };
      }
    }
    return { isValid: true, error: "" };
  };

  const handleRemoveField = (id) => {
    setFields(fields.filter((field) => field.id !== id));
  };

  const handleChange = (id, key, newValue) => {
    setFields(
      fields.map((field) =>
        field.id === id ? { ...field, [key]: newValue } : field
      )
    );
  };

  const handleSearch = async (page = 1) => {
    let allValid = true;
    let firstInvalidError = "";
    const validatedFields = fields.map((field) => {
      let { isValid, error } = validateField(field.type, field.value);
      if (!isValid && allValid) {
        allValid = false;
        firstInvalidError = error;
      }
      return { ...field, isValid, error };
    });
    setFields(validatedFields);
    if (!hasSufficientCredits()) {
      showAlert.warning("Insufficient credits. Please upgrade your plan.");
      return;
    }
    if (!allValid) {
      showAlert.error(firstInvalidError || "Please enter a valid input.");
      return;
    }
    setCurrentPage(page);
    setLoading(true);

    try {
      const res = await instance.post(
        `/api/leak-data-finder/?page=${page}&per_page=${perPage}`,
        { fields: validatedFields }
      );
      if (res.status === 200) {
        const results = res.data;
        const credits = results.credits ?? "";
        if (credits !== undefined) {
          updateUser({ credits: credits });
        }
        setResults(results.data || []);
        setTotalResults(results.total || 0);
        setCurrentPage(results.page || 1);
        setEmptyResults(!results.data || results.data.length === 0);
      } else {
        showAlert.error("Something went wrong. Please try again.");
      }
    } catch (err) {
      if (err.response?.status === 402) {
        const message = err.response?.data?.message || "Insufficient credits.";
        showAlert.warning(message);
      } else {
        const message =
          err.response?.data?.error ||
          err.response?.data?.details ||
          "Something went wrong. Please try again.";
        showAlert.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <FullScreenLoader text="Searching..." />}
      <UserCard />
      <div className="w-full flex flex-col items-center justify-center z-10 mt-16 pl-4 md:pl-64 text-white">
        <MainHeader header="Leak Data Finder" />
        <div className="min-h-auto max-w-full sm:max-w-3xl lg:max-w-4xl xl:max-w-7xl w-auto sm:w-full m-4 sm:mx-auto flex flex-col gap-6 bg-transparent backdrop-blur-none border border-transparent rounded-xl p-4 md:p-8 shadow-none">
          {/* type buttons */}
          <div>
            <p className="mb-3 text-xs font-semibold text-slate-500 tracking-widest uppercase">Field Type</p>
            <div className="flex flex-wrap gap-2">
              {FIELD_OPTIONS.map((option) => {
                const isAdded = fields.some((f) => f.type === option.key);
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => handleAddField(option.key)}
                    disabled={isAdded}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                      isAdded
                        ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 cursor-not-allowed opacity-50"
                        : "bg-slate-800/40 border border-slate-700/40 text-slate-400 hover:bg-slate-800/70 hover:text-slate-200 hover:border-slate-600/60"
                    }`}
                  >
                    <Plus size={14} className="inline mr-1" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full h-px bg-slate-700/50" />

          {/* input fields */}
          <div className="w-full flex flex-col gap-4">
            {fields.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 mb-3">
                  <Plus className="w-5 h-5 text-slate-500" />
                </div>
                <p className="text-slate-500 text-sm">
                  Click a field type above to add search criteria
                </p>
              </div>
            ) : (
              fields.map((field) => {
                const FieldTypeIcon = FIELD_TYPES[field.type].icon;
                return (
                  <div key={field.id} className="flex items-end gap-3">
                    <div className="flex-1 flex flex-col">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-2">
                        {FieldTypeIcon && <FieldTypeIcon className="w-3.5 h-3.5 text-cyan-400/70" />}
                        {FIELD_TYPES[field.type].label}
                      </label>
                      <input
                        type={FIELD_TYPES[field.type].type}
                        placeholder={FIELD_TYPES[field.type].placeholder}
                        value={field.value}
                        onChange={(e) =>
                          handleChange(field.id, "value", e.target.value)
                        }
                        className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-300 outline-none ${
                          field.isValid === false
                            ? "border-red-500/50 bg-red-500/10 text-white placeholder:text-red-400/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                            : "border-slate-700/50 bg-slate-800/60 text-white placeholder:text-slate-500 focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 focus:bg-slate-800/80 hover:border-slate-600/60"
                        } shadow-lg shadow-black/10 focus:shadow-xl focus:shadow-black/20`}
                        maxLength={50}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveField(field.id)}
                      className="mb-0.5 p-2.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400/70 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 shadow-lg shadow-black/10"
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <button
            type="submit"
            onClick={() => handleSearch(1)}
            disabled={loading || fields.length === 0}
            className="self-start mt-4 px-6 py-3 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black rounded-xl text-sm font-bold shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <Search size={18} />
            Search
          </button>
        </div>
        <div className="w-full max-w-7xl my-8 px-4 md:px-0">
          {results && results.length > 0 ? (
            <>
              {totalResults < 10 && (
                <div className="mt-4">
                  <h1 className="text-2xl font-bold text-start text-cyan-400">
                    {totalResults} Results Found
                  </h1>
                </div>
              )}
              {totalResults > 10 && (
                <p className="text-center text-sm text-slate-400 mt-6">
                  Page {currentPage} of {Math.ceil(totalResults / perPage)}{" "}
                  pages.
                </p>
              )}

              <div className="mt-4">
                {results !== null && (
                  <OsintCard data={results} type="leak-data-finder" />
                )}
              </div>
              {totalResults > perPage && (
                <div className="flex flex-wrap justify-center items-center mt-6 gap-2">
                  {(() => {
                    const totalPages = Math.ceil(totalResults / perPage);
                    const delta = 3;
                    const range = [];
                    const left = Math.max(2, currentPage - delta);
                    const right = Math.min(totalPages - 1, currentPage + delta);

                    range.push(1);

                    if (left > 2) {
                      range.push("left-ellipsis");
                    }

                    for (let i = left; i <= right; i++) {
                      range.push(i);
                    }

                    if (right < totalPages - 1) {
                      range.push("right-ellipsis");
                    }

                    if (totalPages > 1) {
                      range.push(totalPages);
                    }

                    return (
                      <>
                        <button
                          onClick={() => handleSearch(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="px-4 py-2 rounded-xl border border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:border-cyan-500/50 hover:text-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          Previous
                        </button>

                        {range.map((page, index) =>
                          page === "left-ellipsis" ||
                          page === "right-ellipsis" ? (
                            <span
                              key={`ellipsis-${index}`}
                              className="px-3 py-2 text-slate-500"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={`page-${page}`}
                              onClick={() => handleSearch(page)}
                              className={`px-4 py-2 rounded-xl border transition-all ${
                                page === currentPage
                                  ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-black border-cyan-500"
                                  : "border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:border-cyan-500/50 hover:text-cyan-400"
                              }`}
                            >
                              {page}
                            </button>
                          )
                        )}

                        <button
                          onClick={() => handleSearch(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 rounded-xl border border-slate-700/50 text-slate-300 hover:bg-slate-800/50 hover:border-cyan-500/50 hover:text-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          Next
                        </button>
                      </>
                    );
                  })()}
                </div>
              )}
            </>
          ) : (
            emptyResults && (
              <div className="mt-6 text-4xl text-center text-cyan-400 font-bold">
                No results found.
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default LeakDataFinder;
