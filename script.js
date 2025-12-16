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

 button = document.getElementById("AiBtn");
  button.addEventListener("click", () => {
    window.location.href = "file:///C:/Users/sopha/OneDrive/Desktop/project/agv_ui/ai_chat.html";
  });

 button = document.getElementById("Leave");
  button.addEventListener("click", () => {
    window.location.href = "file:///C:/Users/sopha/OneDrive/Desktop/project/agv_ui/index.html";
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

serveBtn.addEventListener("click", ()=>{
  const btn1 = document.getElementById("btn1").textContent.trim();
  const btn2 = document.getElementById("btn2").textContent.trim();
  const btn3 = document.getElementById("btn3").textContent.trim();

  const queueMap = {};

  if(btn1) queueMap[btn1] = queueMap[btn1] ? queueMap[btn1].concat("btn1") : ["btn1"];
  if(btn2) queueMap[btn2] = queueMap[btn2] ? queueMap[btn2].concat("btn2") : ["btn2"];
  if(btn3) queueMap[btn3] = queueMap[btn3] ? queueMap[btn3].concat("btn3") : ["btn3"];

  const queue = Object.keys(queueMap).map(table => ({
    table,
    buttons: queueMap[table]
  }));

  if(queue.length === 0){
    alert("กรุณาเลือกหมายเลขก่อนทำการนำเสิร์ฟ");
    return;
  }

  window.location.href = `loading.html?queue=${encodeURIComponent(JSON.stringify(queue))}`;
});
