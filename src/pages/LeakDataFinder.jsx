import { useState } from 'react'
import { Plus, Minus } from "lucide-react";
import { toast } from "react-toastify";
import StyledDropdown from '../components/StyledDropdown';
import { OsintCard } from '../components/cards/OsintCard';
import instance from "../api/axios";
import FullScreenLoader from '../components/FullScreenLoader';
import UserCard from '../components/UserCard';
import MainHeader from '../components/MainHeader';


const FIELD_TYPES = {
    name: { label: "Name", type: "text", placeholder: "Enter Name" },
    email: { label: "Email", type: "email", placeholder: "Enter Email" },
    phone: { label: "Phone", type: "tel", placeholder: "Enter Phone Number" },
    username: { label: "Username", type: "text", placeholder: "Enter Username" },
};
const LeakDataFinder = () => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [emptyResults, setEmptyResults] = useState(false);

    const [fields, setFields] = useState([
        { id: Date.now(), type: "name", value: "", isValid: true, error: "" },
    ]);

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

    const handleAddField = () => {
        if (fields.length >= 4) {
            toast.warning("You can only add 4 fields");
        } else {
            setFields([...fields, { id: Date.now(), type: "name", value: "" }]);
        }
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

        if (!allValid) {
            toast.error(firstInvalidError || "Please enter a valid input.");
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
                setResults(results.data || []);
                setTotalResults(results.total || 0);
                setCurrentPage(results.page || 1);
                setEmptyResults(!results.data || results.data.length === 0);
                // console.log(res.data);
            } else {
                toast.error("Something went wrong. Please try again.");
            }
        } catch (err) {
            console.log(err);
            const message =
                err.response?.data?.error ||
                err.response?.data?.details ||
                "Something went wrong. Please try again.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            {loading && <FullScreenLoader text="Searching..." />}
            <UserCard />
            <div className='w-full max-h-full flex flex-col items-center z-10 mt-32 sm:mt-20'>
                <MainHeader header="Leak Data Finder" />
                <div className="space-y-2 w-full max-w-5xl text-white px-4 md:px-0">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center space-x-3 rounded">
                            {index === 0 ? (
                                <button
                                    onClick={handleAddField}
                                    className="p-1.5 md:p-3 border rounded-md font-bold text-gray-200 hover:bg-lime-300 hover:text-black border-lime-300"
                                >
                                    <Plus size={24} />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleRemoveField(field.id)}
                                    className="p-1.5 md:p-3 border rounded-md font-bold text-gray-200 border-red-400 hover:bg-red-400 hover:text-black"
                                >
                                    <Minus size={24} />
                                </button>
                            )}

                            <StyledDropdown
                                value={field.type}
                                onChange={(val) => handleChange(field.id, "type", val)}
                            />

                            <input
                                type={FIELD_TYPES[field.type].type}
                                placeholder={FIELD_TYPES[field.type].placeholder}
                                value={field.value}
                                onChange={(e) =>
                                    handleChange(field.id, "value", e.target.value)
                                }
                                className={`relative w-full flex-1 py-2 md:py-2.5 px-4 border rounded-md ${field.isValid === false ? "border-red-500" : "border-lime-300"
                                    } bg-transparent text-gray-200 placeholder:text-gray-200 focus:outline-none transition-all text-sm md:text-lg`}
                                maxLength={50}
                            />
                        </div>
                    ))}
                    <div className="flex justify-center items-center">
                        <button
                            type="submit"
                            onClick={() => handleSearch(1)}
                            disabled={loading}
                            className="bg-gradient-to-r text-gray-900 rounded-md font-bold border-none px-4 md:px-8 py-2 md:py-3 hover:bg-gradient-to-l from-lime-200 to-teal-800 text-sm md:text-lg flex items-center justify-center gap-2 mt-2"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                                />
                            </svg>Search
                        </button>
                    </div>
                </div>
                <div className='w-full max-w-5xl my-8 px-4 md:px-0'>
                    {results && results.length > 0 ? (
                        <>
                            {totalResults < 10 && (
                                <div className="mt-4">
                                    <h1 className="text-2xl font-bold text-start text-lime-300">{totalResults} Results Found</h1>
                                </div>
                            )}
                            {totalResults > 10 && (
                                <p className="text-center text-sm text-gray-400 mt-6">
                                    Page {currentPage} of {Math.ceil(totalResults / perPage)}{" "}
                                    pages.
                                </p>
                            )}

                            <div className="mt-4">
                                {results !== null && <OsintCard data={results} type="leak-data-finder" />}
                            </div>
                            {totalResults > perPage && (
                                <div className="flex flex-wrap justify-center items-center mt-6 gap-2">
                                    {(() => {
                                        const totalPages = Math.ceil(totalResults / perPage);
                                        const delta = 3;
                                        const range = [];
                                        const left = Math.max(2, currentPage - delta);
                                        const right = Math.min(totalPages - 1, currentPage + delta);

                                        range.push(1); // Always show first page

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
                                            range.push(totalPages); // Always show last page
                                        }

                                        return (
                                            <>
                                                {/* Previous Button */}
                                                <button
                                                    onClick={() => handleSearch(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="px-4 py-1 border rounded text-white border-lime-300 hover:bg-lime-400 hover:text-black disabled:opacity-40"
                                                >
                                                    Previous
                                                </button>

                                                {/* Page Buttons */}
                                                {range.map((page, index) =>
                                                    page === "left-ellipsis" ||
                                                        page === "right-ellipsis" ? (
                                                        <span
                                                            key={`ellipsis-${index}`}
                                                            className="px-3 py-1 text-gray-400"
                                                        >
                                                            ...
                                                        </span>
                                                    ) : (
                                                        <button
                                                            key={`page-${page}`}
                                                            onClick={() => handleSearch(page)}
                                                            className={`px-3 py-1 rounded border ${page === currentPage
                                                                ? "bg-lime-400 text-black"
                                                                : "border-lime-300 text-white hover:bg-lime-400 hover:text-black"
                                                                }`}
                                                        >
                                                            {page}
                                                        </button>
                                                    )
                                                )}

                                                {/* Next Button */}
                                                <button
                                                    onClick={() => handleSearch(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="px-4 py-1 border rounded text-white border-lime-300 hover:bg-lime-400 hover:text-black disabled:opacity-40"
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
                            <div className="mt-6 text-4xl text-center text-lime-400 font-bold">
                                No results found.
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    )
}

export default LeakDataFinder