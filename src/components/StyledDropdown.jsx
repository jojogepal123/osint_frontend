import { Listbox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

const options = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "username", label: "Username" },
];

export default function StyledDropdown({ value, onChange }) {
    const selectedOption = options.find((opt) => opt.key === value);

    return (
        <div className="relative w-28 md:w-40">
            <Listbox value={value} onChange={onChange}>
                <Listbox.Button className="relative w-full rounded-md py-1.5 md:py-3 px-4 border text-gray-200 font-bold border-lime-200 hover:border-lime-200/80 transition-all text-left cursor-pointer hover:bg-lime-200/80 hover:text-black">
                    <span>{selectedOption?.label}</span>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 font-bold" />
                </Listbox.Button>

                <Listbox.Options className="absolute z-10 mt-1 w-full bg-[#0b0d1a] border border-lime-200 rounded-lg shadow-lg text-white">
                    {options.map((option) => (
                        <Listbox.Option
                            key={option.key}
                            value={option.key}
                            className={({ active }) =>
                                `px-4 py-2 cursor-pointer transition-all ${active
                                    ? "bg-lime-200 text-black"
                                    : "hover:bg-lime-300 hover:text-black"
                                }`
                            }
                        >
                            {({ selected }) => (
                                <div className="flex items-center justify-between">
                                    <span>{option.label}</span>
                                    {selected && <Check className="w-4 h-4" />}
                                </div>
                            )}
                        </Listbox.Option>
                    ))}
                </Listbox.Options>
            </Listbox>
        </div>
    );
}
