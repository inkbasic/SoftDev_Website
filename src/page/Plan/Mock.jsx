// src/page/Plan/Mock.jsx
export const PlanMock = {
    "id": "plan_001",
    "title": "เที่ยวกรุงเทพ...แบบชิลๆ",
    "category": ["ปีนผา", "ทะเล", "ธรรมชาติ"],
    "budget": 5000,
    "transportation": "รถยนต์ส่วนตัว",
    "accommodation": "โรงแรม 3 ดาว",
    "people": 2,
    "startDate": "2025-09-28",
    "endDate": "2025-09-30",
    "lastModified": "28 กันยายน 2568",
    
    // เพิ่ม itinerary data
    "itinerary": {
        "2025-09-28": {
            "dayName": "วันอาทิตย์",
            "date": "28 กันยายน",
            "description": "เริ่มต้นการเดินทาง",
            "locations": [
                {
                    "id": "loc_001",
                    "name": "Siam Paragon",
                    "openHours": "เปิด 10.00 - 22.00",
                    "description": "ห้างสรรพสินค้าขนาดใหญ่ที่มีร้านบูติกระดับไฮเอนด์และร้านทั่วไป ร้านอาหาร โบว์ลิ่ง และโรงภาพยนตร์มัลติเพล็กซ์",
                    "image": "/public/img/pool.jpg",
                    "order": 1
                },
                {
                    "id": "loc_002", 
                    "name": "CentralWorld",
                    "openHours": "เปิด 10.00 - 22.00",
                    "description": "ศูนย์การค้าขนาดใหญ่ใจกลางกรุงเทพ มีร้านค้า ร้านอาหาร และกิจกรรมมากมาย",
                    "image": "/public/img/pool.jpg",
                    "order": 2
                }
            ],
            "travelTimes": [
                {
                    "from": "loc_001",
                    "to": "loc_002",
                    "duration": "7 นาที",
                    "distance": "5 กม.",
                    "method": "รถยนต์"
                }
            ]
        },
        "2025-09-29": {
            "dayName": "วันจันทร์",
            "date": "29 กันยายน",
            "description": "วันสำรวจวัฒนธรรม",
            "locations": [
                {
                    "id": "loc_003",
                    "name": "วัดพระแก้ว",
                    "openHours": "เปิด 08.30 - 15.30",
                    "description": "วัดที่สำคัญที่สุดของประเทศไทย ประดิษฐานพระพุทธมหามณีรัตนปฏิมากร",
                    "image": "/public/img/pool.jpg",
                    "order": 1
                }
            ],
            "travelTimes": []
        },
        "2025-08-27": {
            "dayName": "วันพุธ",
            "date": "27 สิงหาคม",
            "description": "วันพักผ่อน",
            "locations": [],
            "travelTimes": []
        },
    },

    // เพิ่ม hotels และ cars data
    "hotels": [
        {
            "id": "hotel_001",
            "name": "โรงแรมพูลแมน",
            "distance": "14 กม. จากตัวเมือง",
            "rating": 4.8,
            "image": "/public/img/pool.jpg"
        },
        {
            "id": "hotel_002", 
            "name": "แกรนด์ ไฮแอท",
            "distance": "8 กม. จากตัวเมือง",
            "rating": 4.9,
            "image": "/public/img/pool.jpg"
        }
    ],

    "cars": [
        {
            "id": "car_001",
            "name": "Toyota Camry",
            "type": "รถเช่า",
            "image": "/public/img/pool.jpg"
        }
    ]
};