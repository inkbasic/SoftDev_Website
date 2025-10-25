import { ChevronDown } from "lucide-react";
import { useState } from "react";
import "../../Home/css/dropdowninput.css";

export default function DropDownInput({ placeholder, value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative flex px-5 justify-between items-center gap-3 w-full py-5 bg-white border border-gray-300 rounded-xl cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
            <p className="font-bold whitespace-nowrap ">{value || placeholder}</p>
            <ChevronDown className={`w-6 h-6 transition-all ${isOpen ? "rotate-180" : ""}`} />
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full left-0 top-full bg-white border border-gray-300 rounded-md overflow-hidden shadow-lg">
          <ul className="overflow-auto">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}