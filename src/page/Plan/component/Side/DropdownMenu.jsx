import { useState } from "react";
import { ChevronDown } from "lucide-react";
import '../../css/dropdown-menu.css';
import '@/page/Plan/css/plan.css';
export default function DropdownMenu({ title, items, onItemClick }) {
    const [showOverviewMenu, setOverviewMenu] = useState(false);
    const handleItemClick = (item) => {
        if (onItemClick) {
            onItemClick(item);
        }
    };
    return (
        <div className="category whitespace-nowrap">
            <div
                className={`button
                                        ${showOverviewMenu
                        ? "active btnHighlight"
                        : "hover:text-neutral-700 bg-paper"
                    }
                                    `}
            >
                <ChevronDown onClick={() => setOverviewMenu(!showOverviewMenu)}
                    className={`w-5 h-5 absolute left-1 top-[25%] transition-transform durat ion-200 cursor-pointer ${showOverviewMenu ? 'brightness-0 invert' : '-rotate-90'
                        }`}
                />
                <p onClick={() => handleItemClick(title)} className="cursor-pointer">{title}</p>
            </div>

            <div className={`list bg-paper ${showOverviewMenu ? "max-h-[70vh]" : "max-h-0 pointer-events-none"}`}>
                {items.map((item, index) => (
                    <p className="cursor-pointer py-2" key={index} onClick={() => handleItemClick(item)} >{item}</p>
                ))}
            </div>
        </div>
    );
}
