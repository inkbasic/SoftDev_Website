// src/page/Plan/MockLocations.js
export const MockLocations = [
    {
        id: "loc_001",
        name: "Siam Paragon",
        source: [13.7466, 100.5347],
        openHours: "เปิด 10.00 - 22.00",
        description: "ห้างสรรพสินค้าขนาดใหญ่ที่มีร้านบูติกระดับไฮเอนด์และร้านทั่วไป",
        image: "/public/img/pool.jpg",
        category: "ช้อปปิ้ง",
        rating: 4.5
    },
    {
        id: "loc_002",
        name: "วัดพระแก้ว",
        source: [13.7516, 100.4929],
        openHours: "เปิด 08.30 - 15.30",
        description: "วัดที่สำคัญที่สุดของประเทศไทย ประดิษฐานพระพุทธมหามณีรัตนปฏิมากร",
        image: "/public/img/pool.jpg",
        category: "ท่องเที่ยว",
        rating: 4.8
    },
    {
        id: "loc_003",
        name: "CentralWorld",
        source: [13.7466, 100.5390],
        openHours: "เปิด 10.00 - 22.00",
        description: "ศูนย์การค้าขนาดใหญ่ใจกลางกรุงเทพ มีร้านค้า ร้านอาหาร",
        image: "/public/img/pool.jpg",
        category: "ช้อปปิ้ง",
        rating: 4.3
    },
    {
        id: "loc_004",
        name: "จตุจักร วีคเอนด์ มาร์เก็ต",
        source: [13.7995, 100.5506],
        openHours: "เปิด 09.00 - 18.00 (เสาร์-อาทิตย์)",
        description: "ตลาดนัดใหญ่ที่มีสินค้าหลากหลาย อาหาร เสื้อผ้า ของที่ระลึก",
        image: "/public/img/pool.jpg",
        category: "ตลาด",
        rating: 4.2
    },
    {
        id: "loc_005",
        name: "ไอคอนสยาม",
        source: [13.7266, 100.5100],
        openHours: "เปิด 10.00 - 22.00",
        description: "ห้างสรรพสินค้าริมแม่น้ำเจ้าพระยา สถาปัตยกรรมไทยร่วมสมัย",
        image: "/public/img/pool.jpg",
        category: "ช้อปปิ้ง",
        rating: 4.6
    },
    {
        id: "loc_006",
        name: "ลุมพินีปาร์ค",
        source: [13.7300, 100.5410],
        openHours: "เปิด 04.30 - 21.00",
        description: "สวนสาธารณะใจกลางกรุงเทพ เหมาะสำหรับออกกำลังกาย",
        image: "/public/img/pool.jpg",
        category: "ธรรมชาติ",
        rating: 4.1
    },
    {
        id: "loc_007",
        name: "ตลาดนัดรถไฟศรีนครินทร์",
        source: [13.6943, 100.6476],
        openHours: "เปิด 18.00 - 24.00 (พฤ-อา)",
        description: "ตลาดนัดกลางคืนที่มีอาหารสตรีทฟู้ด และของใช้ราคาถูก",
        image: "/public/img/pool.jpg",
        category: "ตลาด",
        rating: 4.0
    },
    {
        id: "loc_008",
        name: "วัดอรุณราชวราราม",
        source: [13.7436, 100.4889],
        openHours: "เปิด 08.30 - 17.30",
        description: "วัดแห่งยอดแก้วที่มีพระปรางค์สูงเป็นสัญลักษณ์",
        image: "/public/img/pool.jpg",
        category: "ท่องเที่ยว",
        rating: 4.7
    }
];

// ฟังก์ชันค้นหาสถานที่
export const searchLocations = (query, category = null) => {
    return MockLocations.filter(location => {
        const matchesQuery = location.name.toLowerCase().includes(query.toLowerCase()) ||
                           location.description.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category ? location.category === category : true;
        
        return matchesQuery && matchesCategory;
    });
};

// ฟังก์ชันสร้าง ID ใหม่
export const generateLocationId = () => {
    return `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};