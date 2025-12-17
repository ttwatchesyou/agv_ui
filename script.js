// ==========================================
// 1. ส่วนตั้งค่า MQTT
// ==========================================
const MQTT_HOST = "192.168.0.177";
const MQTT_PORT = 9001;
const MQTT_TOPIC = "queue";
const MQTT_TOPIC_LISTEN = "food";

const clientID = "client_" + parseInt(Math.random() * 100000);
let client = new Paho.MQTT.Client(MQTT_HOST, MQTT_PORT, clientID);
const alertSound = new Audio("https://www.soundjay.com/buttons/sounds/button-10.mp3");


// --- [สำคัญ 1] ผูกฟังก์ชัน Callback ก่อน Connect ---
client.onConnectionLost = onConnectionLost;
client.onMessageArrived = onMessageArrived;

// เริ่มการเชื่อมต่อ
connectMQTT();

function connectMQTT() {
  client.connect({
    onSuccess: onConnect,
    onFailure: onFailure,
    // useSSL: true // ใช้เมื่อเป็น wss://
  });
}

function onConnect() {
  console.log("MQTT Connected to " + MQTT_HOST);
  // --- [สำคัญ 2] ต้อง Subscribe Topic "food" ---
  client.subscribe(MQTT_TOPIC_LISTEN);
  console.log("Subscribed to: " + MQTT_TOPIC_LISTEN);
}

function onFailure(responseObject) {
  console.log("MQTT Connection Failed: " + responseObject.errorMessage);
  setTimeout(connectMQTT, 5000);
}

function onConnectionLost(responseObject) {
  if (responseObject.errorCode !== 0) {
    console.log("Connection Lost: " + responseObject.errorMessage);
  }
}

// ==========================================
// ส่วนรับข้อมูลและแสดงผล
// ==========================================
var strMQTT

function onMessageArrived(message) {
  const topic = message.destinationName;
  const payload = message.payloadString;
  strMQTT = payload
  console.log("Received form " + topic + " : " + payload);

  if (topic === MQTT_TOPIC_LISTEN) {
    try {
      // แปลง Text ที่ได้เป็น JSON Array
      const foodList = JSON.parse(payload);
      updateFoodUI(foodList);
    } catch (e) {
      console.error("ข้อมูลไม่ใช่ JSON ที่ถูกต้อง:", e);
    }
  }
}

// ฟังก์ชันสร้าง HTML รายการอาหาร (ฉบับสมบูรณ์)
function updateFoodUI(foodList) {
  const row1 = document.getElementById("foodRow1");
  const row2 = document.getElementById("foodRow2");
  const row3 = document.getElementById("foodRow3");

  if (row1) row1.innerHTML = "";
  if (row2) row2.innerHTML = "";
  if (row3) row3.innerHTML = "";

  foodList.forEach((food, index) => {
    let displayName = "";
    let displayPrice = "";

    if (typeof food === 'object' && food !== null) {
      displayName = food.name || "";
      displayPrice = food.price ? `${food.price}.-` : "";
    } else {
      displayName = String(food).trim();
      displayPrice = "";
    }

    let foodname = "";
    // แปลงรหัสเป็นชื่อไทย
    switch (displayName) {
      case "food1": foodname = "เส้นชะมวง"; break;
      case "food2": foodname = "ไข่เจียว"; break;
      case "food3": foodname = "แกงชะมวง"; break;
      case "food4": foodname = "หมูกระเทียม"; break;
      case "food5": foodname = "ข้าวคลุกกะปิ"; break;
      case "food6": foodname = "หมูหวาน"; break;
      default:
        foodname = displayName;
      // console.warn("ไม่พบชื่อไทยสำหรับรหัส: " + displayName);
    }

    const itemDiv = document.createElement("div");
    itemDiv.className = "food-item";
    itemDiv.style.padding = "10px";
    itemDiv.style.margin = "5px";
    itemDiv.style.border = "1px solid #ddd";
    itemDiv.style.backgroundColor = "#fff";
    itemDiv.style.borderRadius = "5px";

    itemDiv.innerHTML = `
            <span style="font-weight:bold;">${foodname}</span> 
            <span style="float:right; color:green;">${displayPrice}</span>
        `;

    if (row1 && index < 5) {
      row1.appendChild(itemDiv);
    } else if (row2 && index < 10) {
      row2.appendChild(itemDiv);
    } else if (row3) {
      row3.appendChild(itemDiv);
    }
  });
}

function sendMqttMessage(data) {
  if (client.isConnected()) {
    const payload = JSON.stringify(data);
    message = new Paho.MQTT.Message(payload);
    message.destinationName = MQTT_TOPIC;
    client.send(message);
    console.log("Sent MQTT:", payload);
  } else {
    alert("ยังไม่ได้เชื่อมต่อกับ MQTT Broker!");
  }
}

// ==========================================
// 2. โค้ด UI Control
// ==========================================

let activeButton = null;
const modal = document.getElementById("calculatorModal");
const display = document.getElementById("calcDisplay");

document.querySelectorAll(".canvas-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    activeButton = btn;
    display.textContent = "";
    modal.style.display = "flex";
  });
});

let button = document.getElementById("AiBtn");
if (button) {
  button.addEventListener("click", () => {
    if (typeof client !== 'undefined' && client.isConnected()) {
      let message = new Paho.MQTT.Message("1");
      message.destinationName = "chamoung_ai";
      client.send(message);
    }
    setTimeout(() => {
      window.location.href = "ai_chat.html";
    }, 300);
  });
}

// Keypad logic
document.querySelectorAll(".key").forEach(key => {
  key.addEventListener("click", () => {
    const val = key.textContent;
    if (key.classList.contains("send")) {
      if (display.textContent.trim() === "") {
        activeButton.textContent = "";
      } else {
        activeButton.textContent = display.textContent;
      }
      modal.style.display = "none";
      return;
    }
    if (key.classList.contains("del")) {
      display.textContent = display.textContent.slice(0, -1);
      return;
    }
    display.textContent += val;
  });
});

modal.addEventListener("click", e => {
  if (e.target === modal) modal.style.display = "none";
});

// ==========================================
// 3. ปุ่ม Serve (แก้ไข Logic การเปรียบเทียบ)
// ==========================================
const serveBtn = document.getElementById("serveBtn");
serveBtn.addEventListener("click", () => {
  const btn1 = document.getElementById("btn1").textContent.trim();
  const btn2 = document.getElementById("btn2").textContent.trim();
  const btn3 = document.getElementById("btn3").textContent.trim();

  const queueMap = {};
  if (btn1) queueMap[btn1] = queueMap[btn1] ? queueMap[btn1].concat("btn1") : ["btn1"];
  if (btn2) queueMap[btn2] = queueMap[btn2] ? queueMap[btn2].concat("btn2") : ["btn2"];
  if (btn3) queueMap[btn3] = queueMap[btn3] ? queueMap[btn3].concat("btn3") : ["btn3"];

  const queue = Object.keys(queueMap).map(table => ({
    table,
    buttons: queueMap[table]
  }));

  if (queue.length === 0) {
    alert("กรุณาเลือกหมายเลขก่อนทำการนำเสิร์ฟ");
    return;
  }

  // --- เริ่มการดึงข้อมูลจาก Database ---
  fetch('log.php')
    .then(response => response.json())
    .then(data => {
      if (data.length === 0) return;

      // ค้นหาข้อมูลของโต๊ะที่เลือกใน btn3 (ถ้ามีค่า)
      if (btn3) {
        const table2Data = data.find(item => item.id_tb === btn3);

        if (table2Data) {
          console.log(`✅ เจอข้อมูลโต๊ะ ${btn3} แล้ว:`, table2Data);

          // -------------------------------------------------------------
          // 1. แปลงข้อมูล Database ({food1,food2} -> ['food1', 'food2'])
          // -------------------------------------------------------------
          let dbArr = [];
          if (table2Data.id_food) {
            // ลบปีกกา {} ออก แล้วแยกด้วยลูกน้ำ
            dbArr = table2Data.id_food.replace(/[{}]/g, '').split(',');
          }

          // -------------------------------------------------------------
          // 2. แปลงข้อมูล MQTT (["food1","food2"] -> ['food1', 'food2'])
          // -------------------------------------------------------------
          let mqttArr = [];
          try {
            // ใช้ JSON.parse เพราะค่าที่มาเป็น Format JSON Array
            mqttArr = JSON.parse(strMQTT);
          } catch (e) {
            console.error("MQTT Parsing Error", e);
            mqttArr = []; // กัน error ไว้ก่อน
          }

          // -------------------------------------------------------------
          // 3. ทำความสะอาดและเรียงลำดับ (Normalize)
          // -------------------------------------------------------------
          // แปลงเป็น String -> ตัดช่องว่าง -> เรียงลำดับ ก-ฮ
          const cleanDB = dbArr.map(item => String(item).trim()).sort();
          const cleanMQTT = mqttArr.map(item => String(item).trim()).sort();

          // แปลงกลับเป็น String เพื่อเปรียบเทียบ
          const strDBCompare = JSON.stringify(cleanDB);
          const strMQTTCompare = JSON.stringify(cleanMQTT);

          console.log(`DB Array:   ${strDBCompare}`);
          console.log(`MQTT Array: ${strMQTTCompare}`);

          // -------------------------------------------------------------
          // 4. เปรียบเทียบ
          // -------------------------------------------------------------
          if (strDBCompare === strMQTTCompare) {
            console.log("✅ ครบถ้วน! รายการอาหารถูกต้องตรงกันเป๊ะ");
            console.log(queue)
            setTimeout(() => {
              window.location.href = `loading.html?queue=${encodeURIComponent(JSON.stringify(queue))}`;
            }, 500);
            //alert("รายการอาหารถูกต้อง");
          } else {
            console.log("⚠️ ไม่ตรงกัน! รายการอาหารอาจจะขาดหรือเกิน");
            playAlert();
            alert("รายการอาหารไม่ถูกต้อง");
            // (แถม) เช็คให้ดูว่าอะไรเกินมา
            const extras = cleanMQTT.filter(x => !cleanDB.includes(x));
            if (extras.length > 0) console.log("   -> เกินมา: " + extras);
          }

        } else {
          playAlert();
          console.log(`⚠️ ไม่พบข้อมูล Database ของโต๊ะ ${btn3}`);
          alert(`⚠️ ไม่พบข้อมูล Database ของโต๊ะ ${btn3}`);

        }
      }

    })
    .catch(error => {
      console.error('Database Error:', error);
    })
    .finally(() => {
      // ทำงานเสมอ ไม่ว่าจะ Fetch สำเร็จหรือล้มเหลว
      sendMqttMessage(queue);
    });
});

// โหลดเมนู (ถ้าจำเป็น)
function loadFoodMenu() {
  fetch('log.php')
    .then(response => response.json())
    .then(data => {
      // console.log("Log Loaded Type: " + typeof(data));
    })
    .catch(error => console.error('Error:', error));
}

document.addEventListener("DOMContentLoaded", loadFoodMenu);

function playAlert() {
  alertSound.play().catch(error => {
    console.log("Browser ป้องกันการเล่นเสียงอัตโนมัติ: ", error);
  });
}