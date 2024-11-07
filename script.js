function checkTriangle() {
    const side1Input = document.getElementById("side1");
    const side2Input = document.getElementById("side2");
    const side3Input = document.getElementById("side3");

    const a = parseFloat(side1Input.value);
    const b = parseFloat(side2Input.value);
    const c = parseFloat(side3Input.value);

    let hasError = false;

    function validateNumber(inputElement, value) {
        if (isNaN(value) || value <= 0) {
            inputElement.style.backgroundColor = "lightcoral";
            inputElement.value = "エラー: 数字を入力してください";
            hasError = true;
        } else {
            inputElement.style.backgroundColor = "";
        }
    }

    validateNumber(side1Input, a);
    validateNumber(side2Input, b);
    validateNumber(side3Input, c);

    if (hasError) {
        document.getElementById("triangleType").innerText = "";
        document.getElementById("sideLengths").innerText = "";
        document.getElementById("triangleCanvas").style.display = 'none';
        return;
    }

    let result = "";
    const tolerance = 0.05;

    if (a + b <= c || b + c <= a || c + a <= b) {
        result = "三角形は作れません";
        document.getElementById("triangleCanvas").style.display = 'none';
    } else {
        if (withinTolerance(a, b, tolerance) && withinTolerance(b, c, tolerance)) {
            result = "正三角形";
            drawTriangle("正三角形", a, b, c);
        } else if (withinTolerance(a, b, tolerance) || withinTolerance(b, c, tolerance) || withinTolerance(c, a, tolerance)) {
            const base = withinTolerance(a, b, tolerance) ? c : withinTolerance(b, c, tolerance) ? a : b;
            if (isAcuteIsosceles(a, base, tolerance)) {
                result = "鋭角二等辺三角形";
                drawTriangle("鋭角二等辺三角形", a, b, c);
            } else if (isRightAngle(a, b, c, tolerance)) {
                result = "直角二等辺三角形";
                drawTriangle("直角二等辺三角形", a, b, c);
            } else {
                result = "鈍角二等辺三角形";
                drawTriangle("鈍角二等辺三角形", a, b, c);
            }
        } else if (isRightAngle(a, b, c, tolerance)) {
            result = "直角三角形";
            drawTriangle("直角三角形", a, b, c);
        } else {
            result = "不等辺三角形";
            drawTriangle("不等辺三角形", a, b, c);
        }
    }

    document.getElementById("triangleType").innerText = result;
    document.getElementById("sideLengths").innerText = `辺の長さ: ${a}, ${b}, ${c}`;
    document.querySelector('.output-container').style.display = 'flex';
    document.querySelector('.form-container').style.display = 'none';
}

function withinTolerance(x, y, tolerance) {
    return Math.abs(x - y) / Math.max(x, y) <= tolerance;
}

function isAcuteIsosceles(a, base, tolerance) {
    return withinTolerance(base ** 2, 2 * a ** 2 * (1 + tolerance), tolerance);
}

function isRightAngle(a, b, c, tolerance) {
    const sides = [a, b, c].sort((x, y) => x - y);
    return withinTolerance(sides[0] ** 2 + sides[1] ** 2, sides[2] ** 2, tolerance);
}

function drawTriangle(type, a, b, c) {
    const canvas = document.getElementById("triangleCanvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height); // 以前の描画をクリア

    ctx.beginPath();
    if (type === "正三角形") {
        drawEquilateralTriangle(ctx);
    } else if (type === "鋭角二等辺三角形") {
        drawIsoscelesTriangle(ctx, "acute");
    } else if (type === "鈍角二等辺三角形") {
        drawIsoscelesTriangle(ctx, "obtuse");
    } else if (type === "直角二等辺三角形") {
        drawRightIsoscelesTriangle(ctx);
    } else if (type === "直角三角形") {
        drawRightTriangle(ctx);
    } else if (type === "不等辺三角形") {
        drawScaleneTriangle(ctx);
    }

    ctx.fillStyle = "black";  // 辺の長さテキストの色
    ctx.font = "16px Arial";
    ctx.fillText(`a: ${a}`, 10, 20);
    ctx.fillText(`b: ${b}`, 10, 40);
    ctx.fillText(`c: ${c}`, 10, 60);
}

function drawEquilateralTriangle(ctx) {
    const size = 150;
    const height = size * Math.sqrt(3) / 2;
    const centerX = 150;
    const centerY = 150;

    const topX = centerX;
    const topY = centerY - height / 2;
    const leftX = centerX - size / 2;
    const leftY = centerY + height / 2;
    const rightX = centerX + size / 2;
    const rightY = centerY + height / 2;

    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.lineTo(leftX, leftY);
    ctx.lineTo(rightX, rightY);
    ctx.closePath();

    ctx.fillStyle = "lightblue"; // 色を設定
    ctx.fill();
}

function drawIsoscelesTriangle(ctx, type) {
    const base = 150;
    let height;

    ctx.beginPath();

    if (type === 'acute') {
        height = Math.sqrt(3) * base / 2;
        ctx.moveTo(150, 50);
        ctx.fillStyle = "lightgreen"; // 鋭角二等辺三角形の色
    } else if (type === 'obtuse') {
        height = 40;
        ctx.moveTo(150, 100);
        ctx.fillStyle = "orange"; // 鈍角二等辺三角形の色
    }

    ctx.lineTo(150 - base / 2, height + 150);
    ctx.lineTo(150 + base / 2, height + 150);
    ctx.closePath();
    ctx.fill();
}

function drawRightTriangle(ctx) {
    ctx.beginPath();
    ctx.moveTo(50, 200);
    ctx.lineTo(200, 200);
    ctx.lineTo(200, 50);
    ctx.closePath();

    ctx.fillStyle = "lightcoral"; // 直角三角形の色
    ctx.fill();
}

function drawRightIsoscelesTriangle(ctx) {
    const base = 100;
    ctx.beginPath();
    ctx.moveTo(100, 200);
    ctx.lineTo(200, 200);
    ctx.lineTo(100, 100);
    ctx.closePath();

    ctx.fillStyle = "yellow"; // 直角二等辺三角形の色
    ctx.fill();
}

function drawScaleneTriangle(ctx) {
    ctx.beginPath();
    ctx.moveTo(50, 200);
    ctx.lineTo(150, 100);
    ctx.lineTo(200, 150);
    ctx.closePath();

    ctx.fillStyle = "lightpink"; // 不等辺三角形の色
    ctx.fill();
}


function resetForm() {
    document.getElementById("side1").value = "";
    document.getElementById("side2").value = "";
    document.getElementById("side3").value = "";
    document.getElementById("triangleType").innerText = "";
    document.getElementById("sideLengths").innerText = "";
    document.querySelector('.output-container').style.display = 'none';
    document.querySelector('.form-container').style.display = 'block';

    location.reload();
}
