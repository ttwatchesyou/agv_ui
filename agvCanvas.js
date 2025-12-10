const canvas = document.getElementById("agvCanvas");
const ctx = canvas.getContext("2d");

const width = 300;
const height = 300;
const radius = 8;

canvas.width = width;
canvas.height = height;
canvas.style.borderRadius = radius + "px";

const img = new Image();
img.src = "public/agv_pic.png";

img.onload = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
};
