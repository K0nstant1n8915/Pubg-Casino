const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinButton = document.getElementById('spin');
const shuffleButton = document.getElementById('shuffle');
const timeBox = document.getElementById('time-box');
const increaseTimeButton = document.getElementById('increase-time');
const decreaseTimeButton = document.getElementById('decrease-time');

let slices = [
    { name: 'M16A4', type: 'ШВ' },
    { name: 'M416', type: 'ШВ' },
    { name: 'SCAR-L', type: 'ШВ' },
    { name: 'AUG A3', type: 'ШВ' },
    { name: 'FAMAS', type: 'ШВ' },
    { name: 'AKM', type: 'ШВ' },
    { name: 'Beryl M762', type: 'ШВ' },
    { name: 'Mk47 Mutant', type: 'ШВ' },
    { name: 'Гроза', type: 'ШВ' },
    { name: 'ACE32', type: 'ШВ' },
    { name: 'Mini14', type: 'МВ' },
    { name: 'QBU88', type: 'МВ' },
    { name: 'Mk12', type: 'МВ' },
    { name: 'SKS', type: 'МВ' },
    { name: 'SLR', type: 'МВ' },
    { name: 'Mk14', type: 'МВ' },
    { name: 'VSS', type: 'МВ' },
    { name: 'Dragunov', type: 'МВ' },
    { name: 'Автомат Томпсона', type: 'ПП' },
    { name: 'UMP45', type: 'ПП' },
    { name: 'Micro UZI', type: 'ПП' },
    { name: 'Vector', type: 'ПП' },
    { name: 'ПП-19 «БИЗОН»', type: 'ПП' },
    { name: 'MP5K', type: 'ПП' },
    { name: 'P90', type: 'ПП' },
    { name: 'Kar98k', type: 'СВ' },
    { name: 'Винтовка Мосина', type: 'СВ' },
    { name: 'M24', type: 'СВ' },
    { name: 'AWM', type: 'СВ' },
    { name: 'AMR «Рысь»', type: 'СВ' },
    { name: 'S12K', type: 'ШОТГАН' },
    { name: 'S1897', type: 'ШОТГАН' },
    { name: 'S686', type: 'ШОТГАН' },
    { name: 'DBS', type: 'ШОТГАН' },
    { name: 'P18C', type: 'ПИСТОЛЕТ' },
    { name: 'P92', type: 'ПИСТОЛЕТ' },
    { name: 'Skorpion', type: 'ПИСТОЛЕТ' },
    { name: 'P1911', type: 'ПИСТОЛЕТ' },
    { name: 'ДИГЛ', type: 'ПИСТОЛЕТ' },
    { name: 'R1895', type: 'ПИСТОЛЕТ' },
    { name: 'Сковорода', type: 'БЛИЖ БОЙ' },
    { name: 'M249', type: 'ДРУГОЕ' },
    { name: 'ДП-28', type: 'ДРУГОЕ' },
    { name: 'MG3', type: 'ДРУГОЕ' },
    { name: 'Арбалет', type: 'ДРУГОЕ' },
    { name: 'Миномет', type: 'ДРУГОЕ' },
    { name: 'Панцерфауст', type: 'ДРУГОЕ' }
];

const colors = {
    'ШВ': '#006400',        
    'ПП': '#add8e6', // Светло-голубой
    'МВ': '#ffa500', // Оранжевый
    'СВ': '#8b4513', // Коричневый
    'ШОТГАН': '#ff0000', // Красный
    'ПИСТОЛЕТ': '#ffffff', // Белый
    'БЛИЖ БОЙ': '#000000', // Черный

    'ДРУГОЕ': '#800080'    
};

let startAngle = 0;
let arc = Math.PI / (slices.length / 2);
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 3000; // Время крутки в миллисекундах (3 секунды)
let isSpinning = false;

function drawWheel() {
    for (let i = 0; i < slices.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = colors[slices[i].type];
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, angle, angle + arc);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, canvas.height / 2);
        ctx.lineTo(
            canvas.width / 2 + Math.cos(angle) * (canvas.width / 2),
            canvas.height / 2 + Math.sin(angle) * (canvas.height / 2)
        );
        ctx.stroke();

        ctx.save();
        ctx.fillStyle = (slices[i].type === 'ПП' || slices[i].type === 'ПИСТОЛЕТ') ? 'black' : 'white';
        ctx.translate(
            canvas.width / 2 + Math.cos(angle + arc / 2) * (canvas.width / 2 - 50),
            canvas.height / 2 + Math.sin(angle + arc / 2) * (canvas.height / 2 - 50)
        );
        ctx.rotate(angle + arc / 2);
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillText(slices[i].name, 0, 0);
        ctx.restore();
    }
}

function drawArrow() {
    const arrowWidth = 19;  
    const arrowHeight = 50;
    const arrowYOffset = 0;
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - arrowWidth / 2, arrowYOffset);
    ctx.lineTo(canvas.width / 2 + arrowWidth / 2, arrowYOffset);
    ctx.lineTo(canvas.width / 2, arrowHeight + arrowYOffset);
    ctx.closePath();
    ctx.fill();
}

function rotateWheel() {
    spinTime += 30;
    const spinRemaining = spinTimeTotal - spinTime;

    if (spinRemaining <= 0) {
        stopRotateWheel();
        return;
    }

    const spinAngle = easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawWheel();
    drawArrow();
    requestAnimationFrame(rotateWheel);
}

function stopRotateWheel() {
    const degrees = startAngle * 180 / Math.PI + 90;
    const arcd = arc * 180 / Math.PI;
    const index = Math.floor((360 - degrees % 360) / arcd);

    if (slices[index].name === 'Сковорода') {
        alert('Вы Сорвали ДЖЕКПОТ!');
    } else {
        alert(`Выпало: ${slices[index].name}`);
    }
    spinButton.disabled = false;
    shuffleButton.disabled = false;
    isSpinning = false;
}

function easeOut(t, b, c, d) {
    return c * (1 - Math.pow(1 - t / d, 3)) + b; // Более точная функция easing
}

function shuffleSlices() {
    for (let i = slices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [slices[i], slices[j]] = [slices[j], slices[i]];
    }
    drawWheel();
    drawArrow();
}

spinButton.addEventListener('click', () => {
    if (isSpinning) return; // Не позволять запускать колесо во время вращения
    isSpinning = true;
    spinButton.disabled = true;
    shuffleButton.disabled = true;
    spinTime = 0;
    spinAngleStart = (Math.random() * 5 + 5) * 360; // Вращение от 5 до 10 оборотов
    rotateWheel();
});

shuffleButton.addEventListener('click', () => {
    if (isSpinning) return; // Не позволять перемешивать во время вращения
    shuffleSlices();
});

increaseTimeButton.addEventListener('click', () => {
    spinTimeTotal += 1000; // Увеличиваем время на 1 секунду
    timeBox.textContent = `Время: ${spinTimeTotal / 1000} сек`;
});

decreaseTimeButton.addEventListener('click', () => {
    if (spinTimeTotal > 3000) { // Минимальное время — 3 секунды
        spinTimeTotal -= 1000; // Уменьшаем время на 1 секунду
        timeBox.textContent = `Время: ${spinTimeTotal / 1000} сек`;
    }
});

drawWheel();
drawArrow();
