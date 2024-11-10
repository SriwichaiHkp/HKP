window.onload = function() {
    openPrivacyPopup(); // แสดง Popup นโยบายคุ้มครองข้อมูลส่วนบุคคลทันทีที่โหลดหน้าเว็บ
};

function search() {
    openModal(); // เปิด pop-up รอสักครู่
    var term = document.getElementById("searchTerm").value.trim(); // แปลงคำค้นหาเป็นตัวพิมพ์เล็ก

    // ดึงข้อมูลจากชีท 1 (ข้อมูลนักเรียน)
    fetch(`https://api.sheety.co/5cb2ec12524c134a0474c157793aaa3b/data/data`, {
        method: 'GET', // ระบุว่าเป็นการดึงข้อมูล (GET)
        headers: {
            'Content-Type': 'application/json', // กำหนดรูปแบบข้อมูลที่ส่งและรับ
            'Authorization': 'Bearer hkp13198913' // ใช้ Bearer Token ในการยืนยันตัวตน
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data from API');
        }
        return response.json(); // แปลงข้อมูลที่ได้มาเป็น JSON
    })
    .then(studentData => {
        // ดึงข้อมูลจากชีท 2 (ข้อมูลเหตุผลการหักคะแนน)
        return fetch(`https://api.sheety.co/5cb2ec12524c134a0474c157793aaa3b/data/ชีต8`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer hkp13198913'
            }
        }).then(response => response.json())
        .then(penaltyData => {
            displayResults(studentData, penaltyData, term); // ส่งข้อมูลทั้งสองมารวมกัน
            closeModal(); // ปิด pop-up เมื่อการค้นหาสำเร็จ
        });
    })
    .catch(error => {
        console.error('Error:', error);
        closeModal(); // ปิด pop-up หากเกิดข้อผิดพลาด
    });
}

function displayResults(studentData, penaltyData, term) {
    var infoTable = document.getElementById("infoTable");
    infoTable.innerHTML = ""; // ลบข้อมูลเดิมในตาราง

    // ค้นหานักเรียนตามเลขประจำตัวนักเรียน
    var student = studentData.data.find(item => item["เลขประจำตัวนักเรียน"] == term);
    var penalties = penaltyData.ชีต8.filter(item => item["เลขประจำตัวนักเรียน"] == term);

    if (student) {
        var infoHtml = `
            <div class="result-item">
                <span>ชั้น</span>
                <span>${student["ชั้น"] || ''}</span>
            </div>
            <div class="result-item">
                <span>เลขที่</span>
                <span>${student["เลขที่"] || ''}</span>
            </div>
            <div class="result-item">
                <span>เลขประจำตัวนักเรียน</span>
                <span>${student["เลขประจำตัวนักเรียน"] || ''}</span>
            </div>
            <div class="result-item">
                <span>ชื่อ</span>
                <span>${student["ชื่อ"] || ''}</span>
            </div>
            <div class="result-item">
                <span>นามสกุล</span>
                <span>${student["นามสกุล"] || ''}</span>
            </div>
            <div class="result-item">
                <span>แต้มตลอดทั้งปีการศึกษา</span>
                <span>${student["แต้มตลอดทั้งปีการศึกษา"] || ''}</span>
            </div>
            <div class="result-item">
                <button id="showMoreBtn" class="btn btn-link" onclick="toggleDetails()">แสดงเพิ่มเติม</button>
                <div id="extraDetails" style="display:none;">
                    <div class="result-item">
                        <span style="font-size: 14px;">เหตุผลการหักคะแนน (3 รายการล่าสุด)</span>
                        <ul>
                            ${getLatestReasons(penalties[0]?.["เหตุผลการหักคะแนน"], penalties[0]?.["คะแนนที่หัก"]).map((reason, index) => 
                                `<li>${reason[0]} - หัก ${reason[1]} คะแนน</li>`
                            ).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
        infoTable.innerHTML = infoHtml;
    } else {
        infoTable.innerHTML = "<p>ไม่พบข้อมูลที่ค้นหา</p>";
    }
}

function getLatestReasons(reasons, points) {
    if (!reasons || !points) return [];
    
    // แปลงข้อมูลที่เก็บในรูปแบบ string เป็น array
    const reasonArray = JSON.parse(reasons); // แปลงเหตุผลจาก string เป็น array
    const pointsArray = JSON.parse(points); // แปลงคะแนนจาก string เป็น array
    
    // สร้างอาเรย์ของเหตุผลและคะแนนที่หัก
    const reasonList = reasonArray.map((reason, index) => [reason, pointsArray[index]]);
    
    // คืนค่าจาก 3 รายการล่าสุด
    return reasonList.slice(-3); // เลือกเอา 3 รายการล่าสุด
}

function toggleDetails() {
    var extraDetails = document.getElementById("extraDetails");
    var showMoreBtn = document.getElementById("showMoreBtn");

    // Toggle the visibility of the extra details
    if (extraDetails.style.display === "none") {
        extraDetails.style.display = "block"; // Show details
        showMoreBtn.textContent = "ซ่อนข้อมูล"; // Change button text to "Hide"
    } else {
        extraDetails.style.display = "none"; // Hide details
        showMoreBtn.textContent = "แสดงเพิ่มเติม"; // Change button text back to "Show More"
    }
}

function openModal() {
    document.getElementById("loadingModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("loadingModal").style.display = "none";
}

function openPrivacyPopup() {
    document.getElementById("privacyPopup").style.display = "block";
}

function closePrivacyPopup() {
    document.getElementById("privacyPopup").style.display = "none";
}
