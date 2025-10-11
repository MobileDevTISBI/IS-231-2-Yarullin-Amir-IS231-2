// ==================== КОНФИГУРАЦИЯ ИГРЫ ====================
// Получаем элементы
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

// Динозавр
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

// Кактусы
let cactusArray = [];
let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

// Физика
let velocityX = -20;
let velocityY = 0;
let gravity = 0;
let jumpPower = -30;
let isJumping = false;
let jumpProgress = 0;
let jumpDuration = 10;

let gameOver = false;
let score = 0;
let lastCactusSpawn = 0;
let minCactusDistance = 200;
let frameCount = 0;
let lastCactusTime = 0;

// ==================== ИНИЦИАЛИЗАЦИЯ ИГРЫ ====================
window.onload = function() {
    // Инициализация canvas
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");
    
    // Загрузка изображения динозавра
    dinoImg = new Image();
    dinoImg.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iOTQiIHZpZXdCb3g9IjAgMCA4OCA5NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9Ijg4IiBoZWlnaHQ9Ijk0IiBmaWxsPSIjNTM1MzUzIi8+Cjwvc3ZnPg==";
    
    // Загрузка изображений кактусов
    cactus1Img = new Image();
    cactus1Img.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzQiIGhlaWdodD0iNzAiIHZpZXdCb3g9IjAgMCAzNCA3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM0IiBoZWlnaHQ9IjcwIiBmaWxsPSIjMmQ1MDE2Ii8+Cjwvc3ZnPg==";
    
    cactus2Img = new Image();
    cactus2Img.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjkiIGhlaWdodD0iNzAiIHZpZXdCb3g9IjAgMCA2OSA3MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY5IiBoZWlnaHQ9IjcwIiBmaWxsPSIjMmQ1MDE2Ii8+Cjwvc3ZnPg==";
    
    cactus3Img = new Image();
    cactus3Img.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAyIiBoZWlnaHQ9IjcwIiB2aWV3Qm94PSIwIDAgMTAyIDcwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTAyIiBoZWlnaHQ9IjcwIiBmaWxsPSIjMmQ1MDE2Ii8+Cjwvc3ZnPgo=";

    // Запуск игрового цикла
    requestAnimationFrame(update);
    
    // Добавление обработчиков событий
    document.addEventListener("keydown", moveDino);
}

// ==================== ГЛАВНЫЙ ИГРОВОЙ ЦИКЛ ====================
function update() {
    // Увеличиваем счетчик кадров
    frameCount++;
    
    // Проверка окончания игры
    if (gameOver) { return; }
    
    // Очистка canvas
    context.clearRect(0, 0, board.width, board.height);
    
    // ОБРАБОТКА ПРЫЖКА ДИНОЗАВРА
    if (isJumping) {
        jumpProgress++;
        let progress = jumpProgress / jumpDuration;
        dino.y = dinoY + jumpPower * Math.sin(progress * Math.PI);
        
        if (jumpProgress >= jumpDuration) {
            isJumping = false;
            jumpProgress = 0;
            dino.y = dinoY;
        }
    }
    
    // ОТРИСОВКА ДИНОЗАВРА
    context.fillStyle = "#535353";
    context.fillRect(dino.x, dino.y, dino.width, dino.height);
    
    // Отрисовка глаз динозавра
    context.fillStyle = "#ffffff";
    context.fillRect(dino.x + 65, dino.y + 15, 8, 8);
    context.fillStyle = "#000000";
    context.fillRect(dino.x + 67, dino.y + 17, 4, 4);
    
    // СОЗДАНИЕ КАКТУСОВ С ТАЙМИНГОМ 0.5-1 СЕКУНДА
    let timeSinceLastCactus = frameCount - lastCactusTime;
    let cactusInterval = 15 + Math.random() * 15;
    
    if (timeSinceLastCactus > cactusInterval) {
        placeCactus();
        lastCactusTime = frameCount;
    }
    
    // ОБНОВЛЕНИЕ И ОТРИСОВКА КАКТУСОВ
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        
        // Отрисовка основного кактуса
        context.fillStyle = "#2d5016";
        context.fillRect(cactus.x, cactus.y, cactus.width, cactus.height);
        
        // Добавление деталей кактуса
        context.fillStyle = "#183009";
        
        if (cactus.width === cactus1Width) {
            // Небольшой кактус - простые детали
            context.fillRect(cactus.x + 5, cactus.y + 10, 3, 15);
            context.fillRect(cactus.x + 25, cactus.y + 15, 3, 10);
        } else if (cactus.width === cactus2Width) {
            // Средний кактус - больше деталей
            context.fillRect(cactus.x + 10, cactus.y + 5, 4, 20);
            context.fillRect(cactus.x + 30, cactus.y + 25, 3, 10);
            context.fillRect(cactus.x + 45, cactus.y + 15, 3, 12);
        } else {
            // Большой кактус - много деталей
            context.fillRect(cactus.x + 15, cactus.y + 5, 5, 25);
            context.fillRect(cactus.x + 65, cactus.y + 8, 5, 20);
            context.fillRect(cactus.x + 40, cactus.y + 15, 4, 15);
            context.fillRect(cactus.x + 85, cactus.y + 28, 3, 12);
        }
        
        // СОЗДАНИЕ УМЕНЬШЕННЫХ ХИТБОКСОВ
        let adjustedDino = {
            x: dino.x + 5,
            y: dino.y + 5,
            width: dino.width - 10,
            height: dino.height - 5
        };
        
        let adjustedCactus = {
            x: cactus.x + 3,
            y: cactus.y,
            width: cactus.width - 6,
            height: cactus.height
        };
        
        // ПРОВЕРКА СТОЛКНОВЕНИЙ
        if (detectCollision(adjustedDino, adjustedCactus)) {
            gameOver = true;
            document.getElementById("gameOver").style.display = "block";
        }
    }
    
    // УДАЛЕНИЕ КАКТУСОВ ЗА ПРЕДЕЛАМИ ЭКРАНА
    cactusArray = cactusArray.filter(cactus => cactus.x + cactus.width > 0);
    
    // ОБНОВЛЕНИЕ СЧЕТА
    if (frameCount % 5 === 0) {
        score++;
        updateScore();
    }
    
    // УВЕЛИЧЕНИЕ СЛОЖНОСТИ
    if (score % 50 === 0 && velocityX > -30) {
        velocityX -= 0.5;
    }
    
    // ПРОДОЛЖЕНИЕ ИГРОВОГО ЦИКЛА
    requestAnimationFrame(update);
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

// ФУНКЦИЯ ОБНОВЛЕНИЯ СЧЕТА НА СТРАНИЦЕ
function updateScore() {
    document.getElementById("score").innerText = "Score: " + score;
}

// ФУНКЦИЯ ОБНАРУЖЕНИЯ СТОЛКНОВЕНИЙ
function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

// ФУНКЦИЯ ОБРАБОТКИ УПРАВЛЕНИЯ
function moveDino(e) {
    if (gameOver && e.code === "KeyR") {
        // ПЕРЕЗАПУСК ИГРЫ
        gameOver = false;
        dino.y = dinoY;
        isJumping = false;
        jumpProgress = 0;
        score = 0;
        velocityX = -20;
        cactusArray = [];
        lastCactusTime = frameCount;
        frameCount = 0;
        document.getElementById("gameOver").style.display = "none";
        updateScore();
    } else if ((e.code === "Space" || e.code === "ArrowUp") && !isJumping) {
        // АКТИВАЦИЯ ПРЫЖКА
        isJumping = true;
        jumpProgress = 0;
    }
}

// ФУНКЦИЯ СОЗДАНИЯ КАКТУСА
function placeCactus() {
    if (gameOver) {
        return;
    }
    
    let cactusType = Math.floor(Math.random() * 3) + 1;
    let cactusWidth;
    
    // ВЫБОР ТИПА КАКТУСА БЕЗ ИСПОЛЬЗОВАНИЯ SWITCH/CASE
    if (cactusType === 1) {
        cactusWidth = cactus1Width;
    } else if (cactusType === 2) {
        cactusWidth = cactus2Width;
    } else {
        cactusWidth = cactus3Width;
    }
    
    let cactus = {
        x: cactusX,
        y: cactusY,
        width: cactusWidth,
        height: cactusHeight
    };
    
    cactusArray.push(cactus);
}
