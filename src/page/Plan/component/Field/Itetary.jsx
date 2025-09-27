import { CalendarDays } from "lucide-react";
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { DateRange } from "react-date-range";
import DateContainer from "./DateList";

const Itinerary = forwardRef((props, ref) => {
    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef(null);

    const mondayRef = useRef(null);
    const tuesdayRef = useRef(null);

    const [range, setRange] = useState({
        startDate: null,
        endDate: null,
        key: "selection",
    });

    useImperativeHandle(ref, () => ({
        scrollToDate: (dateString) => {
            let targetRef = null;
            console.log("Scrolling to date:", dateString);

            // แปลงข้อความวันที่ใน sidebar ให้ตรงกับ component
            switch (dateString) {
                case 'วันจันทร์ 25/8':
                    targetRef = mondayRef;
                    break;
                case 'วันอังคาร 26/8':
                    targetRef = tuesdayRef;
                    break;
            }

            if (targetRef && targetRef.current) {
                targetRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    }));

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
        <div className="flex flex-col w-full gap-5">
            <div className="flex items-center justify-between w-full">
                <h3>แผนการท่องเที่ยว</h3>
                <div className="flex gap-3">
                    <div
                        className="relative flex items-center justify-between w-full gap-3 px-3 py-2 border cursor-pointer bg-neutral-100 border-neutral-200 rounded-xl"
                        onClick={() => setShowPicker(true)}
                        ref={pickerRef}
                    >
                        <CalendarDays className="w-5 h-5" />
                        <div>

                            <span className="text-base font-bold text-gray-700">{formatDate(range.startDate)}-</span>

                            <span className="text-base font-bold text-gray-700">{formatDate(range.endDate)}</span>
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

            <div ref={mondayRef}>
                <DateContainer title="วันจันทร์, 25 สิงหาคม" />
            </div>
            <div ref={tuesdayRef}>
                <DateContainer title="วันอังคาร, 26 สิงหาคม" />
            </div>
            <DateContainer title="วันอังคาร, 26 สิงหาคม" />
            <DateContainer title="วันอังคาร, 26 สิงหาคม" />
            <DateContainer title="วันอังคาร, 26 สิงหาคม" />
            <DateContainer title="วันอังคาร, 26 สิงหาคม" />
            <DateContainer title="วันอังคาร, 26 สิงหาคม" />
        </div>
    );
});

Itinerary.displayName = 'Itinerary';

export default Itinerary;