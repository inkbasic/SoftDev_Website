import {  CalendarDays } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import DateContainer from "./DateList";
export default function Itinerary() {
    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef(null);

    const [range, setRange] = useState({
        startDate: null,
        endDate: null,
        key: "selection",
    });

    useEffect(() => {
        if (range && range.startDate && range.endDate) {
            console.log("Selected range:", range);
            setShowPicker(false);
        }
    }, [range]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current) {
                if (!pickerRef.current.contains(event.target)) {
                    setShowPicker(false);
                }
            }
        };

        if (showPicker) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showPicker]);

    const safeRange = {
        startDate: range.startDate || new Date(),
        endDate: range.endDate || range.startDate || new Date(),
        key: "selection",
    };

    const handleRangeChange = ({ selection }) => {
        console.log(range);
        setRange(prev => {
            if (selection.startDate !== selection.endDate) {
                return { startDate: selection.startDate, endDate: selection.endDate, key: "selection" };
            }

            if (!prev.startDate && !prev.endDate) {
                return { startDate: selection.startDate, endDate: null, key: "selection" };
            }
            if (prev.startDate && !prev.endDate) {
                let start = selection.startDate;
                let end = selection.endDate;
                if (end < start) [start, end] = [end, start];
                return { startDate: prev.startDate, endDate: end, key: "selection" };
            }

            return { startDate: selection.startDate, endDate: null, key: "selection" };
        });
    };
    const formatDate = (date) =>
        date ? date.toLocaleDateString("th-TH", { day: "numeric", month: "numeric" }) : "";
    return (
        <div className="w-full flex flex-col gap-5">
            <div className="flex justify-between items-center w-full">
                <h3>แผนการท่องเที่ยว</h3>
                <div className="flex gap-3">
                    <div
                        className="relative flex px-3 py-2 justify-between items-center gap-3 w-full bg-neutral-100 border border-neutral-200 rounded-xl cursor-pointer"
                        onClick={() => setShowPicker(true)}
                        ref={pickerRef}
                    >
                        <CalendarDays className="w-5 h-5" />
                        <div>

                            <span className="text-gray-700 text-base font-bold">{formatDate(range.startDate)}-</span>

                            <span className="text-gray-700 text-base font-bold">{formatDate(range.endDate)}</span>
                        </div>
                        {showPicker && (
                            <div className="absolute right-0 top-[100%] z-50">
                                <DateRange
                                    editableDateInputs={true}
                                    moveRangeOnFirstSelection={false}
                                    minDate={new Date()}
                                    ranges={[safeRange]}
                                    onChange={handleRangeChange}
                                    months={2}
                                    direction="horizontal"
                                />
                            </div>
                        )}
                    </div>


                </div>
            </div>

            <DateContainer />
            <DateContainer />
        </div>
    );
}
