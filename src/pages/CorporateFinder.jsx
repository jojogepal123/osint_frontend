import React, { useState } from 'react';
import { Listbox } from '@headlessui/react';
import { ChevronDown } from 'lucide-react';
import UserCard from '../components/UserCard';
import instance from '../api/axios';
import { toast } from 'react-toastify';
import MainHeader from '../components/MainHeader';

const SEARCH_OPTIONS = [
    {
        key: "corporate_gstin",
        label: "Corporate GSTIN",
        fields: [
            { name: "id_number", label: "ID Number", type: "text" },
            { name: "year", label: "Financial year", type: "select", options: ["2024", "2023", "2022", "2021"] },
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
            { name: "mobile", label: "Mobile Number", type: "text", placeholder: "Enter your mobile no." },
            { name: "pan", label: "PAN Number", type: "text", placeholder: "Enter your pan number" },
            { name: "name", label: "Name", type: "text", placeholder: "Enter your name" },
            { name: "gender", label: "Gender", type: "radio", options: ["Male", "Female"] },
            { name: "consent", label: "By clicking the checkbox, I consent to the fetching of my credit report data.", type: "checkbox" },
        ],
    },
    {
        key: "corporate_cin",
        label: "Corporate CIN",
        fields: [
            { name: "id_number", label: "ID Number", type: "text" },
        ],
    },
    {
        key: "gst_intel",
        label: "GST INTEL",
        fields: [
            { name: "id_number", label: "ID Number", type: "text" },
            { name: "filing_status", label: "Filing Status", type: "checkbox" },
            { name: "hsn_info", label: "HSN Info", type: "checkbox" },
            { name: "filing_frequency", label: "Filing Frequency", type: "checkbox" },
        ],
    },
    {
        key: "employment_history",
        label: "Employment History UAN",
        fields: [
            { name: "id_number", label: "ID Number", type: "text" },
        ],
    },
    {
        key: "find_uan",
        label: "Find UAN",
        fields: [
            { name: "mobile_number", label: "Mobile Number", type: "text" },
        ],
    },
    {
        key: "pan_to_uan",
        label: "PAN to UAN",
        fields: [
            { name: "pan_number", label: "PAN Number", type: "text" },
        ],
    },
];

const CorporateFinder = () => {
    const [selectedOption, setSelectedOption] = useState(SEARCH_OPTIONS[0]);
    const [inputValues, setInputValues] = useState({});
    const [errors, setErrors] = useState({});

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

        selectedOption.fields.forEach(field => {
            const value = inputValues[field.name];

            // Required field validation (for text, select, radio)
            if ((field.type === "text" || field.type === "select" || field.type === "radio") && (!value || value === "")) {
                errors[field.name] = `${field.label} is required.`;
            }

            // Example: Mobile number validation
            if (field.name === "mobile" && value) {
                if (!/^\d+$/.test(value)) {
                    errors[field.name] = "Mobile number must contain only digits.";
                } else if (value.length < 7 || value.length > 12) {
                    errors[field.name] = "Mobile number must be between 7 and 12 digits.";
                }
            }

            // Example: PAN validation
            if (field.name === "pan" && value && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(value)) {
                errors[field.name] = "Invalid PAN format.";
            }

            // Example: Consent checkbox must be checked
            if (field.name === "consent" && !value) {
                errors[field.name] = "You must consent to fetch your credit report.";
            }
        });
        console.log(errors);
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateFields();
        setErrors(errors);
        if (Object.keys(errors).length > 0) {
            toast.error(Object.values(errors)[0].charAt(0).toUpperCase() + Object.values(errors)[0].slice(1));
            return;
        }
        const payload = {
            type: selectedOption.key,
            data: inputValues
        };

        try {
            // const response = await instance.post("/api/corporate-intelligence", {
            //     headers: {
            //         "Content-Type": "application/json",
            //     },
            //     body: JSON.stringify(payload)
            // });
            console.log(payload);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <UserCard />
            <div className="w-full flex flex-col items-center z-10 text-white mt-10 sm:mt-20">
                <MainHeader header="Corporate Intelligence" />
                <div className="min-h-auto max-w-full sm:max-w-3xl lg:max-w-4xl xl:max-w-7xl md:min-h-[450px] w-auto sm:w-full m-4 sm:mx-auto flex flex-col md:flex-row gap-4 sm:gap-6 lg:gap-8 items-center md:items-start bg-gray-900/70 border border-lime-300/50 rounded-lg p-4 md:p-8">
                    {/* Left: Dropdown */}
                    <div className="w-full md:w-1/3 flex flex-col justify-start px-4 md:px-0">
                        <label className="mb-1 font-semibold">Select Search Type</label>
                        <Listbox value={selectedOption} onChange={handleOptionSelect}>
                            <div className="relative">
                                <Listbox.Button className="w-full py-2 px-4 rounded bg-gray-800 border border-lime-300 text-white font-semibold focus:outline-none flex justify-between items-center">
                                    {selectedOption.label}
                                    <ChevronDown className="w-5 h-5 text-lime-200" />
                                </Listbox.Button>
                                <Listbox.Options className="absolute mt-2 w-full bg-gray-800 border border-lime-300 rounded-md z-10">
                                    {SEARCH_OPTIONS.map(option => (
                                        <Listbox.Option
                                            key={option.key}
                                            value={option}
                                            className={({ active }) =>
                                                `cursor-pointer select-none px-4 py-2 rounded ${active ? 'bg-lime-300 text-black' : 'text-white'
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
                    <div className='w-px bg-lime-200/50 self-stretch'>
                    </div>
                    {/* Right: Input Fields */}
                    <div className="w-full md:w-2/3 px-4 md:px-0">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                            {selectedOption.fields.map((field) => {
                                if (field.type === "text") {
                                    return (
                                        <div key={field.name} className="flex flex-col">
                                            <label className="mb-1">{field.label}</label>
                                            <input
                                                type="text"
                                                value={inputValues[field.name] || ""}
                                                onChange={(e) => handleInputChange(field.name, e.target.value)}
                                                className={`p-2 rounded bg-gray-800 border ${errors[field.name]
                                                    ? "border-red-500"
                                                    : "border-lime-300"
                                                    } text-white outline-none`}
                                            />
                                        </div>
                                    );
                                }
                                if (field.type === "select") {
                                    return (
                                        <div key={field.name} className="flex flex-col">
                                            <label className="mb-1">{field.label}</label>
                                            <Listbox
                                                value={inputValues[field.name] || field.options[0]}
                                                onChange={value => handleInputChange(field.name, value)}
                                            >
                                                <div className="relative">
                                                    <Listbox.Button className={`w-full py-2 px-4 rounded bg-gray-800 border ${errors[field.name] ? "border-red-500" : "border-lime-300"} text-white outline-none flex justify-between items-center`}>
                                                        {inputValues[field.name] || field.options[0]}
                                                        <ChevronDown className="w-5 h-5 text-lime-200" />
                                                    </Listbox.Button>
                                                    <Listbox.Options className="absolute mt-1 w-full bg-gray-800 border border-lime-300 rounded z-10">
                                                        {field.options.map(opt => (
                                                            <Listbox.Option
                                                                key={opt}
                                                                value={opt}
                                                                className={({ active, selected }) =>
                                                                    `cursor-pointer select-none px-4 py-2 rounded ${active ? 'bg-lime-200 text-black' : 'text-white'
                                                                    } ${selected ? 'font-bold' : ''}`
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
                                            <label className="mb-1">{field.label}</label>
                                            <div className="flex gap-6">
                                                {field.options.map(option => (
                                                    <label key={option} className="inline-flex items-center gap-2 cursor-pointer text-black text-sm">
                                                        <input
                                                            type="radio"
                                                            name={field.name}
                                                            value={option}
                                                            checked={inputValues[field.name] === option}
                                                            onChange={e => handleInputChange(field.name, e.target.value)}
                                                            className={`form-radio h-4 w-4 accent-lime-600 ${errors[field.name] ? "border-red-500" : "border-lime-300"}`}
                                                        />
                                                        <span className='text-white'>{option}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                }
                            })}
                            {/* Render all checkboxes together in a grid */}
                            {selectedOption.fields.filter(f => f.type === "checkbox").length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                    {selectedOption.fields.filter(f => f.type === "checkbox").map(field => (
                                        <label key={field.name} className="inline-flex items-center gap-2 cursor-pointer text-white text-sm">
                                            <input
                                                type="checkbox"
                                                checked={!!inputValues[field.name]}
                                                onChange={e => handleInputChange(field.name, e.target.checked)}
                                                className={`form-checkbox h-4 w-4 rounded-md border-lime-400 text-lime-600 focus:ring-2 focus:ring-lime-400 accent-lime-200 transition ${errors[field.name] ? "border-red-500" : "border-lime-300"}`}
                                            />
                                            <span>{field.label}</span>
                                        </label>
                                    ))}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="self-center w-48 mt-4 px-4 py-1.5 bg-gradient-to-r from-lime-200 to-teal-800 text-black rounded font-bold hover:bg-gradient-to-r hover:from-teal-800 hover:to-lime-200 shadow-lg text-lg"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                </div >
            </div >
        </>
    );
};

export default CorporateFinder;