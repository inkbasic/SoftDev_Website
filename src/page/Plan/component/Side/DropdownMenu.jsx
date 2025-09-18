import { useState } from "react";
import { ChevronDown } from "lucide-react";
import '../../css/dropdown-menu.css';
import '@/page/Plan/css/plan.css';
export default function DropdownMenu({ title, items }) {
    const [showOverviewMenu, setOverviewMenu] = useState(false);
    return (
        <div className="category whitespace-nowrap">
            <div
                className={`button 
                                        ${showOverviewMenu
                        ? "active btnBackground"
                        : "hover:text-neutral-700"
                    }
                                    `}
            >
                <ChevronDown onClick={() => setOverviewMenu(!showOverviewMenu)}
                    className={`w-6 h-6 transition-transform duration-200 ${showOverviewMenu ? 'brightness-0 invert' : '-rotate-90'
                        }`}
                />
                <p className="">{title}</p>
            </div>

            <div className={`list ${showOverviewMenu ? "max-h-80" : "max-h-0 pointer-events-none"}`}>
                {items.map((item, index) => (
                    <a key={index}>{item}</a>
                ))}
            </div>
        </div>
    );
}
