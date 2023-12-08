let t = 0.0;
let buildingHeight = 600; // 建筑高度
let maxBuildingHeight = 1200; // 最大建筑高度
let amplitude = 70; // 横向运动的振幅
let ballPositions = []; // 保存小球的位置
let fluidScale = 0.01; // 流体效果的规模
let rotationAngle = 0; // 初始旋转角度

function setup() {
   // Set canvas size
  createCanvas(windowWidth, windowHeight, WEBGL);
  
  
  // Set black background
  document.body.style.backgroundColor = "#000000";

  noFill();
}

function draw() {
  // 使用 lerpColor 插值背景颜色
  let bgColor = lerpColor(color(0), color(255), (1 + cos(t)) / 2);
  background(bgColor);

  // 根据鼠标水平移动来改变旋转角度
  let newRotationAngle = map(mouseX, 0, width, -PI, PI);
  rotationAngle = lerp(rotationAngle, newRotationAngle, 0.05);

  rotateY(rotationAngle);

  for (let x = -width / 2; x < width / 2; x += 20) {
    for (let y = -height / 2; y < height / 2; y += 20) {
      let z = map(noise(x * 0.01, y * 0.01, t), 0, 1, -buildingHeight / 2, buildingHeight / 2);
      let radius = map(noise(x * 0.02, y * 0.02, t), 0, 1, 1, 50);
      let weight = map(noise(x * 0.03, y * 0.03, t), 0, 1, 1, 1);
      let colorR = map(noise(x * 0.04, y * 0.04, t), 0, 1, 100, 255);
      let colorG = map(noise(x * 0.05, y * 0.05, t), 0, 1, 100, 255);
      let colorB = map(noise(x * 0.06, y * 0.06, t), 0, 1, 100, 255);
      let alpha = map(noise(x * 0.07, y * 0.07, t), 0, 1, 100, 255);

      // 添加圆形
      let circleSize = 50;
      let circleX = 0;
      let circleY = 0;
      let d = dist(x, y, circleX, circleY);

      // 如果小球与圆形相交
      if (d < circleSize / 2) {
        alpha = map(d, 0, circleSize / 2, 0, 255);
        radius = map(d, 0, circleSize / 2, 40, 10);
      }

      push();
      translate(x, y, z);
      stroke(colorR, colorG, colorB, alpha);
      strokeWeight(weight);
      ellipse(0, 0, radius, radius);
      pop();
    }
  }

  // 添加多个横向运动的小球
  for (let i = -width / 2; i < width / 2; i += 30) {
    for (let j = -height / 2; j < height / 2; j += 50) {
      push();
      let z = sin(t + i * 0.1 + j * 0.1) * amplitude * 20;
      translate(i, j, z);
      ambientMaterial(0, 0, 0);
      fill(255, 255, 255);
      sphere(3);
      pop();

      // 添加随机性来模拟散开
      let offsetX = random(-5, 5);
      let offsetY = random(-5, 5);
      let offsetZ = random(-5, 5);
      ballPositions.push({ x: i + offsetX, y: j + offsetY, z: z + offsetZ });
    }
  }

  // 当小球穿过建筑时，增加建筑的高度
  if (buildingHeight < maxBuildingHeight) {
    buildingHeight += 2;
  }

  // 添加流体效果
  for (let i = -width / 2; i < width / 2; i += 20) {
    for (let j = -height / 2; j < height / 2; j += 20) {
      let fluidSize = map(noise(i * fluidScale, j * fluidScale, t), 0, 1, 300, 0.1);
      let fluidWeight = map(noise(i * fluidScale, j * fluidScale, t), 0, 1, 0.1, 2);
      push();
      translate(i, j, -buildingHeight / 10);
      stroke(0, 0, 0, 100);
      strokeWeight(fluidWeight);
      noFill();
      ellipse(0, 0, fluidSize, fluidSize);
      pop();
    }
  }

  t += 0.05;
 // 更新 filter
  filter(BLUR, map(width, 0, windowWidth, 0, 5)); // 这里使用 map 函数将宽度映射到 BLUR 的参数范围内
}

// 自适应屏幕尺寸变化
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
 
}
