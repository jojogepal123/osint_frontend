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
        <Listbox.Button className="relative w-full rounded-xl py-2 md:py-2.5 px-4 border text-slate-300 font-medium border-slate-700/50 hover:border-cyan-500/50 transition-all text-left cursor-pointer bg-slate-800/50 hover:bg-slate-700/50">
          <span className="pr-6">{selectedOption?.label}</span>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-400" />
        </Listbox.Button>

        <Listbox.Options className="absolute z-10 mt-1 w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl overflow-hidden">
          {options.map((option) => (
            <Listbox.Option
              key={option.key}
              value={option.key}
              className={({ active }) =>
                `px-4 py-3 cursor-pointer transition-all ${
                  active
                    ? "bg-cyan-500/20 text-cyan-400"
                    : "hover:bg-slate-800/50 text-slate-300 hover:text-white"
                }`
              }
            >
              {({ selected }) => (
                <div className="flex items-center justify-between">
                  <span className="font-medium">{option.label}</span>
                  {selected && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
              )}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
}
