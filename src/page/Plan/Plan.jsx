import Field from "./component/Field/Field.jsx";
import Map from "./component/Map/Map.jsx";
import Side from "./component/Side/Side.jsx";
export default function Plan() {
    return (
        <div className="w-full h-full flex justify-center">
            <div className="flex w-full">
                <Side />
                <Field />
            </div>

            <div className="w-full h-full">
                <Map />
            </div>
        </div>
    );
}