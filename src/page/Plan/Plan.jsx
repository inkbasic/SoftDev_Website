import { useRef } from "react";
import Field from "./component/Field/Field.jsx";
import Map from "./component/Map/Map.jsx";
import Side from "./component/Side/Side.jsx";
export default function Plan() {
    const fieldRef = useRef(null);

    const handleSidebarItemClick = (item) => {
        if (fieldRef.current && fieldRef.current.scrollToSection) {
            fieldRef.current.scrollToSection(item);
        }
    };
    return (
        <div className="w-full h-full flex justify-center">
            <div className="flex w-full">
                <Side onItemClick={handleSidebarItemClick} />
                <Field ref={fieldRef} />
            </div>

            <div className="w-full h-full">
                <Map />
            </div>
        </div>
    );
}