window.onload = function() {
    openPrivacyPopup(); // แสดง Popup นโยบายคุ้มครองข้อมูลส่วนบุคคลทันทีที่โหลดหน้าเว็บ
};

function search() {
    openModal(); // เปิด pop-up รอสักครู่
    var term = document.getElementById("searchTerm").value.trim(); // แปลงคำค้นหาเป็นตัวพิมพ์เล็ก

    fetch(`https://api.sheety.co/5cb2ec12524c134a0474c157793aaa3b/แต้ม/data`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer hkp13198913'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data from API');
        }
        return response.json();
    })
    .then(data => {
        displayResults(data, term); // แสดงผลลัพธ์ในตาราง
        closeModal(); // ปิด pop-up เมื่อการค้นหาสำเร็จ
    })
    .catch(error => {
        console.error('Error:', error);
        closeModal(); // ปิด pop-up หากเกิดข้อผิดพลาด
    });
}

function displayResults(data, term) {
    var infoTable = document.getElementById("infoTable");
    infoTable.innerHTML = ""; // ลบข้อมูลเดิมในตาราง

    var results = data.data || []; // ตรวจสอบว่า data.data มีค่าหรือไม่
    if (results.length === 0) {
        infoTable.innerHTML = "<p>ไม่พบข้อมูลในฐานข้อมูล</p>";
        return;
    }

    var found = results.find(item => item["เลขประจำตัวนักเรียน"] == term);

    if (found) {
        var infoHtml = `
            <div class="result-item">
                <span>ชั้น</span>
                <span>${found["ชั้น"] || ''}</span>
            </div>
            <div class="result-item">
                <span>เลขที่</span>
                <span>${found["เลขที่"] || ''}</span>
            </div>
            <div class="result-item">
                <span>เลขประจำตัวนักเรียน</span>
                <span>${found["เลขประจำตัวนักเรียน"] || ''}</span>
            </div>
            <div class="result-item">
                <span>ชื่อ</span>
                <span>${found["ชื่อ"] || ''}</span>
            </div>
            <div class="result-item">
                <span>นามสกุล</span>
                <span>${found["นามสกุล"] || ''}</span>
            </div>
            <div class="result-item">
                <span>แต้มตลอดทั้งปีการศึกษา</span>
                <span>${found["สรุปทั้งปี"] || ''}</span>
            </div>
        `;
        infoTable.innerHTML = infoHtml;

        // แสดง Privacy Policy Popup
        document.getElementById("studentName").textContent = found["ชื่อ"] || '';
        document.getElementById("studentClass").textContent = found["ชั้น"] || '';
        document.getElementById("studentId").textContent = found["เลขประจำตัวนักเรียน"] || '';
    } else {
        infoTable.innerHTML = "<p>ไม่พบข้อมูลที่ค้นหา</p>";
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
