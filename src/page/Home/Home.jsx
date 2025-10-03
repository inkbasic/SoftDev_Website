import "../global.css";
import "./css/Home.css";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { CalendarDays, PlusIcon, MinusIcon } from "lucide-react";
import DropDownInput from "./component/DropDownInput.jsx";
import DropDownMulti from "./component/DropDownMulti.jsx";
import { ACTIVITY, TRAVEL } from "@/const/userPick";

export default function Home() {
    const navigate = useNavigate();
    const [selectedActivities, setSelectedActivities] = useState(null);
    const [selectedTravel, setSelectedTravel] = useState(null);
    const [destination, setDestination] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [people, setPeople] = useState(1);
    const MIN_PEOPLE = 1;
    const MAX_PEOPLE = 100;

    const clamp = (n, min = MIN_PEOPLE, max = MAX_PEOPLE) => Math.max(min, Math.min(max, n));
    const incPeople = () => setPeople(p => clamp(p + 1));
    const decPeople = () => setPeople(p => clamp(p - 1));

    const handlePeopleChange = (e) => {
        const n = parseInt(e.target.value, 10);
        setPeople(isNaN(n) ? MIN_PEOPLE : clamp(n));
    };

    const [budget, setBudget] = useState(0);
    const handleBudgetChange = (e) => {
        const n = parseInt(e.target.value, 10);
        setBudget(isNaN(n) ? 0 : n);
    };

    const [showPicker, setShowPicker] = useState(false);
    const pickerRef = useRef(null);

    const [range, setRange] = useState({
        startDate: null,
        endDate: null,
        key: "selection",
    });

    useEffect(() => {
        if (range && range.startDate && range.endDate) {
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
        date ? date.toLocaleDateString("th-TH", { year: "numeric", month: "short", day: "numeric" }) : "";

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        if (!destination.trim()) {
            newErrors.destination = "กรุณาระบุจุดหมายปลายทาง";
        }

        if (!range.startDate) {
            newErrors.startDate = "กรุณาเลือกวันที่เริ่มต้น";
        }

        if (!range.endDate) {
            newErrors.endDate = "กรุณาเลือกวันที่สิ้นสุด";
        }

        if (range.startDate && range.endDate && range.startDate >= range.endDate) {
            newErrors.dateRange = "วันที่กลับต้องหลังจากวันที่ไป";
        }

        if (people < MIN_PEOPLE || people > MAX_PEOPLE) {
            newErrors.people = `จำนวนคนต้องอยู่ระหว่าง ${MIN_PEOPLE}-${MAX_PEOPLE} คน`;
        }

        if (!selectedActivities || selectedActivities.length === 0) {
            newErrors.activities = "กรุณาเลือกกิจกรรมที่สนใจ";
        }

        if (!selectedTravel) {
            newErrors.travel = "กรุณาเลือกวิธีการเดินทาง";
        }

        if (budget <= 0) {
            newErrors.budget = "กรุณาระบุงบประมาณ";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Prepare API payload
    const prepareApiPayload = () => {
        return {
            destination: destination.trim(),
            startDate: range.startDate ? range.startDate.toISOString().split('T')[0] : null,
            endDate: range.endDate ? range.endDate.toISOString().split('T')[0] : null,
            people: people,
            activities: selectedActivities || [],
            transportation: selectedTravel,
            budget: budget,
            createdAt: new Date().toISOString(),
            userId: null // จะได้จาก auth system ในอนาคต
        };
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Clear previous errors
        setErrors({});

        // Validate form
        // if (!validateForm()) {
        //     console.log("Form validation failed:", errors);
        //     return;
        // }

        // Prepare API payload
        const payload = prepareApiPayload();
        console.log("API Payload:", payload);

        try {
            setIsLoading(true);

            // TODO: Replace with actual API call
            // const response = await fetch('/api/travel-plans', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(payload)
            // });

            // if (!response.ok) {
            //     throw new Error('Failed to create travel plan');
            // }

            // const result = await response.json();

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Navigate to plan page with data
            navigate("/plan", {
                state: {
                    planData: payload,
                    isNew: true
                }
            });

        } catch (error) {
            console.error("Error creating plan:", error);
            setErrors({
                general: "เกิดข้อผิดพลาดในการสร้างแผนการท่องเที่ยว กรุณาลองใหม่อีกครั้ง"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex justify-center background">
            <div className="bg-paper w-[800px] h-fit flex flex-col mt-20 justify-center items-center gap-5 rounded-[20px] px-7 py-10">
                <h1 className="font-krub text-[56px] font-bold">WannoGo!</h1>
                <div className="flex justify-center gap-3">
                    <h2 className="text-[32px] font-bold">วางแผนการท่องเที่ยวของคุณ</h2>
                    <h2 className="text-[32px] font-bold highlight">เพียงแค่คลิกเดียว</h2>
                </div>

                {/* แสดง Error ทั่วไป */}
                {errors.general && (
                    <div className="w-full p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                        {errors.general}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full">
                    {/* Destination Input */}
                    <div className="flex flex-col gap-1">
                        <div className={`flex px-5 items-center gap-3 w-full bg-white border rounded-xl ${errors.destination ? 'border-red-300' : 'border-gray-300'
                            }`}>
                            <p className="font-bold whitespace-nowrap">ไปที่ไหน</p>
                            <input
                                type="text"
                                placeholder="พัทยา เขาใหญ่ กรุงเทพ หัวหิน"
                                className="w-full h-full py-5 focus:outline-none"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                            />
                        </div>
                        {errors.destination && (
                            <span className="text-red-500 text-sm px-2">{errors.destination}</span>
                        )}
                    </div>

                    <div className="flex gap-3">
                        {/* Date Range Input */}
                        <div className="flex flex-col gap-1 w-full">
                            <div
                                className={`relative flex px-5 items-center gap-3 w-full bg-white border rounded-xl cursor-pointer ${errors.startDate || errors.endDate || errors.dateRange ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                onClick={() => setShowPicker(true)}
                                ref={pickerRef}
                            >
                                <div className="flex items-center gap-1 py-5 w-1/2">
                                    <CalendarDays className="w-6 h-6" />
                                    {range.startDate ? (
                                        <span className="text-gray-700 text-base">{formatDate(range.startDate)}</span>
                                    ) : (
                                        <span className="text-gray-400 text-base">วันที่เริ่ม</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 py-5 w-1/2">
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
                            {(errors.startDate || errors.endDate || errors.dateRange) && (
                                <span className="text-red-500 text-sm px-2">
                                    {errors.startDate || errors.endDate || errors.dateRange}
                                </span>
                            )}
                        </div>

                        {/* People Input */}
                        <div className="flex flex-col gap-1 w-full">
                            <div className={`relative flex px-5 justify-between items-center gap-3 w-full py-5 bg-white border rounded-xl ${errors.people ? 'border-red-300' : 'border-gray-300'
                                }`}>
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
                            {errors.people && (
                                <span className="text-red-500 text-sm px-2">{errors.people}</span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        {/* Activities Dropdown (multi) */}
                        <div className="flex flex-col gap-1 w-full">
                            <DropDownMulti
                                placeholder="กิจกรรมที่สนใจ"
                                value={selectedActivities || []}
                                onChange={setSelectedActivities}
                                options={ACTIVITY}
                            />
                            {errors.activities && (
                                <span className="text-red-500 text-sm px-2">{errors.activities}</span>
                            )}
                        </div>
                    </div>

                    {/* Budget Input */}
                    <div className="flex gap-3">
                        {/* Travel Dropdown */}
                        <div className="flex flex-col gap-1 w-full">
                            <DropDownInput
                                placeholder="วิธีการเดินทาง"
                                value={selectedTravel}
                                onChange={setSelectedTravel}
                                options={TRAVEL}
                                error={errors.travel}
                            />
                            {errors.travel && (
                                <span className="text-red-500 text-sm px-2">{errors.travel}</span>
                            )}
                        </div>
                        <div className={`relative flex px-5 justify-between self-center gap-3 w-full py-5 bg-white border rounded-xl ${errors.budget ? 'border-red-300' : 'border-gray-300'
                            }`}>
                            <p className="font-bold whitespace-nowrap">ค่าใช้จ่าย</p>
                            <div className="flex items-center gap-3">
                                <input
                                    type="number"
                                    className="text-right outline-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    value={budget ? budget : ''}
                                    placeholder="จำนวนเงิน"
                                    onChange={handleBudgetChange}
                                />
                                <p>฿</p>
                            </div>
                        </div>
                        {errors.budget && (
                            <span className="text-red-500 text-sm text-center">{errors.budget}</span>
                        )}
                    </div>

                    <div className="flex justify-center">
                        <button
                            className={`submitBtn ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'กำลังสร้างแผน...' : 'เริ่มวางแผนเลย!'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}