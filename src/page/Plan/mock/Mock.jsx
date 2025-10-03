export const PlanMock = {
  id: "plan_001",
  title: "เที่ยวกรุงเทพ...แบบชิลๆ",
  category: ["ปีนผา", "ทะเล", "ธรรมชาติ"],
  budget: 500,
  transportation: "รถยนต์ส่วนตัว",
  people: 2,
  startDate: "2025-09-28",
  endDate: "2025-09-30",
  itinerary: {
    "2025-09-28": {
      dayName: "วันอาทิตย์",
      date: "28 กันยายน",
      description: "ช้อปปิ้งใจกลางเมือง",
      locations: [
        {
          id: "loc_001",
          name: "Siam Paragon",
          source: [13.7466, 100.5347],
          order: 1,
          startTime: "10:00",
          endTime: "12:00",
          openHours: "เปิด 10.00 - 22.00",
          image: "/public/img/pool.jpg",
          description: "ห้างสรรพสินค้าขนาดใหญ่ใจกลางเมือง"
        },
        {
          id: "loc_003",
          name: "CentralWorld",
          source: [13.7466, 100.5390],
          order: 2,
          startTime: "12:30",
          endTime: "15:00",
          stayMinutes: 150,
          openHours: "เปิด 10.00 - 22.00",
          image: "/public/img/pool.jpg",
          description: "ศูนย์การค้าขนาดใหญ่"
        },
        {
          id: "loc_006",
          name: "ลุมพินีปาร์ค",
          source: [13.7300, 100.5410],
          order: 3,
          startTime: "16:00",
          endTime: "17:30",
          stayMinutes: 90,
          openHours: "เปิด 04.30 - 21.00",
          image: "/public/img/pool.jpg",
          description: "สวนสาธารณะใจกลางกรุงเทพ"
        }
      ],
      travelTimes: []
    },
    "2025-09-29": {
      dayName: "วันจันทร์",
      date: "29 กันยายน",
      description: "ท่องเที่ยวเชิงวัฒนธรรม",
      locations: [
        {
          id: "loc_002",
          name: "วัดพระแก้ว",
          source: [13.7516, 100.4929],
          order: 4,
          startTime: "09:00",
          endTime: "10:30",
          stayMinutes: 90,
          openHours: "เปิด 08.30 - 15.30",
          image: "/public/img/pool.jpg",
          description: "วัดสำคัญของไทย"
        },
      ],
      travelTimes: []
    },
    "2025-09-30": {
      dayName: "วันอังคาร",
      date: "30 กันยายน",
      description: "ช้อปปิ้งตลาดและเที่ยวทะเล",
      locations: [
      ],
      travelTimes: []
    }
  }
};