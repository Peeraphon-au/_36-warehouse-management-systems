// const receivedlist = [
//     {
//       "userId": 1,
//       "id": 1,
//       "productname": "พัสดุแบบกล่องขนาดเล็ก",
//       "date": "11/11/2024",
//     },
//     {
//       "userId": 1,
//       "id": 2,
//       "productname": "พัสดุแบบกล่องขนาดเล็ก",
//       "date": "11/11/2024",
//     },
//     {
//       "userId": 1,
//       "id": 3,
//       "productname": "พัสดุแบบกล่องขนาดกลาง",
//       "date": "11/11/2024",
//     },
//     {
//       "userId": 1,
//       "id": 4,
//       "productname": "พัสดุแบบกล่องขนาดใหญ่",
//       "date": "11/11/2024",
//     },
//     {
//       "userId": 1,
//       "id": 5,
//       "productname": "พัสดุแบบกล่องขนาดเล็ก (แตกหักง่าย)",
//       "date": "11/11/2024",
//     },
//     {
//       "userId": 1,
//       "id": 6,
//       "productname": "พัสดุแบบกล่องขนาดใหญ่ (แตกหักง่าย)",
//       "date": "11/11/2024",
//     },
//     {
//       "userId": 1,
//       "id": 7,
//       "productname": "พัสดุแบบซองขนาดเล็ก",
//       "date": "11/11/2024",
//     },
//     {
//       "userId": 1,
//       "id": 8,
//       "productname": "พัสดุแบบกล่องขนาดกลาง",
//       "date": "11/11/2024",
//     },
//     {
//       "userId": 1,
//       "id": 9,
//       "productname": "พัสดุแบบกล่องขนาดใหญ่",
//       "date": "11/11/2024",
//     },
//     {
//       "userId": 1,
//       "id": 10,
//       "productname": "พัสดุแบบกล่องขนาดกลาง (แตกหักง่าย)",
//       "date": "11/11/2024",
//     }
//   ]

const receivedlist = [];

// ฟังก์ชันสุ่มเพิ่ม "(แตกหักง่าย)" แบบสุ่ม 30%
const shouldAddFragile = () => Math.random() < 0.3; // โอกาส 30%

// ฟังก์ชันสุ่มสถานะสินค้า
const getStatus = () => {
  const statuses = ["อนุมัติ", "ไม่อนุมัติ", "รอการอนุมัติ"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const generateTrackingNumber = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let trackingNumber = '';
  
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    trackingNumber += characters[randomIndex];
  }
  
  return trackingNumber;
};

// ฟังก์ชันเพื่อจัดรูปแบบวันที่ให้เป็น 'dd/mm/yyyy'
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// เริ่มต้นวันที่เริ่มต้น
const startDate = new Date("2024-01-01");

// สร้างรายการสินค้าจำนวน 200 รายการ
for (let i = 1; i <= 52; i++) {
  let type = i % 4 === 0 ? "ซอง" : "กล่อง"; // สลับระหว่าง "ซอง" และ "กล่อง"
  let size = i % 3 === 0
    ? "ใหญ่"
    : i % 2 === 0
      ? "กลาง"
      : "เล็ก"; // ขนาด: เล็ก, กลาง, ใหญ่

  let productname = `พัสดุแบบ${type}ขนาด${size}`;

  // เพิ่ม "(แตกหักง่าย)" แบบสุ่ม 30%
  if (shouldAddFragile()) {
    productname += " (แตกหักง่าย)";
  }

  // คำนวณวันที่ตามลำดับ id
  const currentDate = new Date(startDate);
  currentDate.setDate(startDate.getDate() + i - 1); // เพิ่มวันตาม id

  receivedlist.push({
    userId: 1,
    id: generateTrackingNumber(),  // id ให้เป็นหมายเลขพัสดุที่สุ่ม
    productname: productname,
    date: formatDate(currentDate),  // วันที่ที่คำนวณตามลำดับ
    status: getStatus(), 
  });
}

export default receivedlist;

export function fetchReceivedlist() {
  return receivedlist
}

