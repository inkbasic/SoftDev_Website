import "../global.css";
import "./css/Home.css";
import { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { CalendarDays, PlusIcon, MinusIcon } from "lucide-react";
import DropDownInput from "./component/DropDownInput";
import { ACTIVITY, TRAVEL } from "@/const/userPick";

export default function Home() {
    const [showPicker, setShowPicker] = useState(false);
    const [selectedActivities, setSelectedActivities] = useState(null);
    const [selectedTravel, setSelectedTravel] = useState(null);

    // จำนวนคน
    const [people, setPeople] = useState(1);
    const MIN_PEOPLE = 1;
    const MAX_PEOPLE = 20;

    const clamp = (n, min = MIN_PEOPLE, max = MAX_PEOPLE) => Math.max(min, Math.min(max, n));
    const incPeople = () => setPeople(p => clamp(p + 1));
    const decPeople = () => setPeople(p => clamp(p - 1));
    const handlePeopleChange = (e) => {
        const n = parseInt(e.target.value, 10);
        setPeople(isNaN(n) ? MIN_PEOPLE : clamp(n));
    };

    const [range, setRange] = useState({
        startDate: null,
        endDate: null,
        key: "selection",
    });



    useEffect(() => {
        if (range.startDate && range.endDate) {
            setShowPicker(false);
        }
    }, [range.startDate, range.endDate]);

    const safeRange = {
        startDate: range.startDate || new Date(),
        endDate: range.endDate || range.startDate || new Date(),
        key: "selection",
    };

    const handleRangeChange = ({ selection }) => {
        setRange(prev => {
            if (!prev.startDate && !prev.endDate) {
                return { startDate: selection.startDate, endDate: null, key: "selection" };
            }
            if (prev.startDate && !prev.endDate) {
                let start = selection.startDate;
                let end = selection.endDate;
                if (end < start) [start, end] = [end, start];
                return { startDate: start, endDate: end, key: "selection" };
            }
        });
    };

    const formatDate = (date) =>
        date ? date.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" }) : "";

    return (
        <div className="w-full h-full flex justify-center py-28 background">
            <div className="bg-paper-white w-[800px] h-fit flex flex-col justify-center items-center gap-5 rounded-[20px] px-7 py-10 ">
                <h1 className="font-krub text-[56px] font-bold">WannoGo!</h1>
                <div className="flex justify-center gap-3">
                    <h2 className="text-[32px] font-bold">วางแผนการท่องเที่ยวของคุณ</h2>
                    <h2 className="text-[32px] font-bold highlight">เพียงแค่คลิกเดียว</h2>
                </div>

                <form action="" className="flex flex-col gap-5 w-full">
                    <div className="flex px-5 items-center gap-3 w-full bg-white border border-gray-300 rounded-xl">
                        <p className="font-bold whitespace-nowrap ">ไปที่ไหน</p>
                        <input type="text" placeholder="พัทยา เขาใหญ่ กรุงเทพ หัวหิน" className="w-full h-full py-5 focus:outline-none" />
                    </div>

                    <div className="flex gap-3">
                        <div
                            className="relative flex px-5 justify-between items-center gap-3 w-full py-5 bg-white border border-gray-300 rounded-xl cursor-pointer"
                            onClick={() => setShowPicker(!showPicker)}
                        >
                            {/* Start Date */}
                            <div className="flex items-center gap-1">
                                <CalendarDays className="w-6 h-6" />
                                {range.startDate ? (
                                    <span className="text-gray-700 text-base">{formatDate(range.startDate)}</span>
                                ) : (
                                    <span className="text-gray-400 text-base">วันที่เริ่ม</span>
                                )}
                            </div>
                            {/* End Date */}
                            <div className="flex items-center gap-1">
                                <CalendarDays className="w-6 h-6" />
                                {range.endDate ? (
                                    <span className="text-gray-700 text-base">{formatDate(range.endDate)}</span>
                                ) : (
                                    <span className="text-gray-400 text-base">วันที่กลับ</span>
                                )}
                            </div>
                        {showPicker && (
                            <div className="absolute left-0 top-[100%] z-50">
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

                        <div className="relative flex px-5 justify-between items-center gap-3 w-full py-5 bg-white border border-gray-300 rounded-xl">
                            <p className="font-bold whitespace-nowrap">จำนวนคน</p>
                            <div className="flex items-center gap-3">
                                <MinusIcon className="w-6 h-6 cursor-pointer" onClick={decPeople} />
                                <input
                                    type="number"
                                    className="w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    min={MIN_PEOPLE}
                                    max={MAX_PEOPLE}
                                    step={1}
                                    value={people}
                                    onChange={handlePeopleChange}
                                />
                                <PlusIcon className="w-6 h-6 cursor-pointer" onClick={incPeople} />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <DropDownInput placeholder="กิจกรรมที่สนใจ" value={selectedActivities} onChange={setSelectedActivities} options={ACTIVITY} />
                        <DropDownInput placeholder="วิธีการเดินทาง" value={selectedTravel} onChange={setSelectedTravel} options={TRAVEL} />
                    </div>
                    <div className="flex justify-center">
                        <button className="submitBtn" type="submit">
                            เริ่มวางแผนเลย!
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}