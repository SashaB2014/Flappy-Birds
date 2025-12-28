let canvas = document.getElementById('canvas');
let ctx = canvas.getContext("2d");

let score_text = document.getElementById('score');
let bestScore_text = document.getElementById('best_score');


canvas.width = 256;
canvas.height = 512;


let bird = new Image();
bird.src = "./img/bird.png";

let back = new Image();
back.src = "./img/back.png";

let pipeBottom = new Image();
pipeBottom.src = "./img/pipeBottom.png";

let pipeUp = new Image();
pipeUp.src = "./img/pipeUp.png";

let road = new Image();
road.src = "./img/road.png";

let fly_audio = new Audio();
fly_audio.src = "./audio/fly.mp3";

let score_audio = new Audio();
score_audio.src = "./audio/score.mp3";


let xPos = 10;
let yPos = 150;


let pipe = [];

pipe[0] = {
    x: canvas.width + 130,
    y: 0
}


// --- 1. Додайте цей код на початку або в окремий файл ---
const particlesArray = [];
// Менше сніжинок для гри, щоб не відволікало (наприклад, 50)
const numberOfParticles = 75;

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.size = Math.random() * 2 + 1; // РОЗМІР СНІЖИНКИ
    this.speedY = Math.random() * 1.5 + 0.5;
    this.opacity = Math.random() * 0.5 + 0.5;
  }

  update() {
    this.y += this.speedY;

    // Перезапуск зверху
    if (this.y > canvas.height) {
      this.y = 0;
      this.x = Math.random() * canvas.width;
    }
  }

  draw() {
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Заповнюємо масив один раз при старті гри
function initSnow() {
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}

// Функція для оновлення і малювання в кожному кадрі
function handleSnow() {
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }
}



let gravity = 0.3;
let velY = 0;
 
let gap = 100;


let score = 0;
let bestScore = 0;
let pause = false;

function draw() {
    if(!pause){
    ctx.drawImage(back, 0, 0);
    ctx.drawImage(bird, xPos, yPos);
    velY += gravity;
    yPos += velY;
    

    if(yPos+bird.height > canvas.height-road.height) {
        reload();
    }

    for(let i = 0; i < pipe.length; i++) {
         ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
         ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);

         pipe[i].x -= 3;

         if (pipe[i].x == 80){
            pipe.push( {
                x: canvas.width + 130,
                y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height
            } )

         }
        if(
            xPos + bird.width >= pipe[i].x &&
            xPos <= pipe[i].x + pipeUp.width &&
            (pipe[i].y + pipeUp.height >= yPos ||
            pipe[i].y + pipeUp.height + gap <= yPos + bird.height)
            ) {
                reload();
        }
        console.log(pipe[i].x)

        if(pipe[i].x == -1) {
            score++;
            score_audio.play(); 
        }

        score_text.innerHTML = `SCORE: ${score}`;
        bestScore_text.innerHTML = `BEST SCORE: ${bestScore}`;
    }
    handleSnow();
    ctx.drawImage(road, 0, canvas.height - road.height);
    if(
        pipe[0].x < -canvas.width &&
        pipe.length > 0
        ) {
        pipe.shift();
    }
    }else {
        ctx.drawImage(back, 0, 0);
        ctx.drawImage(bird, xPos, yPos);
       for(let i = 0; i < pipe.length; i++) {
         ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
         ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);
        } 
        handleSnow();
         ctx.drawImage(road, 0, canvas.height - road.height);
         
    }
}


function reload() {
    xPos = 10;
    yPos = 150;
    velY = 0;
    pipe = [];
    if(bestScore < score) {
        bestScore = score;
    }
    score = 0;
    pipe[0] = {
    x: canvas.width + 40,
    y: 0
    
}

}  
document.addEventListener("keydown", (event) => {
    if(event.code == "Space") {
        pause = !pause;
    }
})

function moveUp() {
    velY = -4;
    fly_audio.play();
}


document.addEventListener("mousedown", (event) => {
    if(event.button == 0) {
        moveUp();
    }
})
setInterval(draw, 20);


initSnow();