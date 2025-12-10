let activeButton = null;
const modal = document.getElementById("calculatorModal");
const display = document.getElementById("calcDisplay");

// เปิด modal
document.querySelectorAll(".canvas-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    activeButton = btn;
    display.textContent = "";
    modal.style.display = "flex";
  });
});

// ปุ่มตัวเลข
document.querySelectorAll(".key").forEach(key => {
  key.addEventListener("click", () => {
    const val = key.textContent;

    // ส่ง
    if (key.classList.contains("send")) {

      if (display.textContent.trim() === "") {
        activeButton.textContent = "";     // ← ทำให้ปุ่มกลับเป็นว่าง
      } else {
        activeButton.textContent = display.textContent;
      }

      modal.style.display = "none";
      return;
    }

    // ลบทีละตัว
    if (key.classList.contains("del")) {
      display.textContent = display.textContent.slice(0, -1);
      return;
    }

    // เพิ่มตัวเลข
    display.textContent += val;
  });
});

// ปิด modal เมื่อคลิกด้านนอก
modal.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});

// ปุ่มโปร่งใส (3 ปุ่ม)
const canvasButtons = document.querySelectorAll(".canvas-btn");

// ปุ่มนำเสิร์ฟ
const serveBtn = document.getElementById("serveBtn");

serveBtn.addEventListener("click", () => {
  let targetTable = null;
  let targetButton = null;
  canvasButtons.forEach(btn => {
    if (btn.textContent.trim() !== "") {
      targetTable = btn.textContent.trim();
      targetButton = btn.id;
    }
  });
  if (!targetTable) {
    alert("กรุณาเลือกหมายเลขก่อนทำการนำเสิร์ฟ");
    return;
  }
  const url = `loading.html?table=${targetTable}&button=${targetButton}`;
  window.location.href = url;
});

