"use strict";
const newGame = document.createElement("div");
newGame.classList.add("newGame");
newGame.classList.add("hidden");
newGame.innerHTML = '<a href="./index.html">Let`s play a new game</a>';
document.body.appendChild(newGame);


const myVid = document.getElementById("audio");
myVid.volume = 0.30;
myVid.loop=true;

document.onkeydown = () => audio.play();

function soundClick() {
  let audio = new Audio();
  audio.src = "./sound/laser.mp3";
  audio.autoplay = true;
}

function soundBoom() {
  let audio = new Audio();
  audio.src = "./sound/boom2.mp3";
  audio.autoplay = true;
}

function soundSelect() {
  let audio = new Audio();
  audio.src = "./sound/select.mp3";
  audio.autoplay = true;
}
function soundBonus() {
  let audio = new Audio();
  audio.src = "./sound/bonus.mp3";
  audio.autoplay = true;
}

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

canvas.height = 600;
canvas.width = 1200;

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.opasity = 1;
    const image = new Image();
    image.src = "./1.png";

    image.onload = () => {
      this.image = image;
      this.width = image.width * 0.5;
      this.height = image.height * 0.5;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height + 10,
      };
    };
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opasity;

    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
    ctx.restore();
  }
  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 6;
    this.hadow = 1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";

    ctx.fill();
    ctx.closePath();
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Particle {
  constructor({ position, velocity, radius, color }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.opasity = 1
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opasity;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;

    ctx.fill();
    ctx.closePath();
    ctx.restore()
  }
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
           setTimeout(() => {
        this.opasity = 1;
      },1500)
  }
}

class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };
    const image = new Image();
    image.src = "./bomb.png";

    image.onload = () => {
      this.image = image;
      this.width = image.width * 0.1;
      this.height = image.height * 0.1;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  update({ velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }
}

function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
    this.velocity = {
      x: getRandomValue(0, +0.4),
      y: getRandomValue(1, 3),
    };
    this.invaders = [];

    const rows = Math.floor(Math.random() * 1050);

    for (let x = 0; x < 1; x++) {
      this.invaders.push(
        new Invader({
          position: {
            x: rows,
            y: -150,
          },
        })
      );
    }
  }
  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}


const player = new Player();
const projectile = [];
const grids = [new Grid()];
const particles = [];
const keys = {
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

let frames = 0;
let game = {
  over: false,
  active: false,
};
let score = 0;

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "aliceblue";

  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = "15px Verdana";
  ctx.strokeText('tap to space', canvas.width / 2 + 30, 580);
  player.update();

particles.forEach(particle => {
  particle.update()
})

  projectile.forEach((projectile) => {
    projectile.update();
  });

  grids.forEach((grid) => {
    grid.update();
    grid.invaders.forEach((invader, i) => {
       if (invader.position.y + invader.height >= canvas.height + 200) {
        player.opasity = 0;
        ctx.clearRect(0, 0, 1200, 500);
        canvas.classList.add("hidden");
        newGame.classList.remove("hidden");
      }

      invader.update({ velocity: grid.velocity });

      projectile.forEach((projectile) => {
        if (
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {

          for(let i = 0; i < 7; i++ ){
          particles.push(
            new Particle({
              position: {
                x: invader.position.x + invader.width / 2,
                y: invader.position.y + invader.height / 2,
              },
              velocity: {
                x: (Math.random() -0.5) * 20,
                y: (Math.random() -0.5) * 20,
              },
              radius: Math.random() * 5,
              color: 'black ',
            })
          );
        }
          setTimeout(() => {
            const invaderFount = grid.invaders.find((invader2) => {
              return invader2 === invader;
            });
            if (invaderFount) {
              grid.invaders.splice(i, 1);
              score += 100;
              spanScore.innerHTML = score;
              if(score >= 1200 && score <= 2500) {
                spanScore.style.color = 'yellow';
              } else {
                spanScore.style.color = 'beige';
              }
              soundBoom(); 
            }
          }, 0);
        }
      });
    });
  });

  if (keys.ArrowRight.pressed) {
    player.velocity.x = +11;
  } else if (keys.ArrowLeft.pressed) {
    player.velocity.x = -11;
  } else {
    player.velocity.x = 0;
  }
  if (frames % 60 === 0) {
    grids.push(new Grid());
  }
  frames++;
}

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      break;
    case " ":
      soundClick();
      projectile.push(
        new Projectile({
          position: {
            x: player.position.x + player.width - 50,
            y: player.position.y,
          },
          velocity: {
            x: getRandomValue(-3, 3),
            y: getRandomValue(-20, -25),
          },
        })
      );
      if(score >= 1200 && score <= 2500) {
        projectile.push(
          new Projectile({
            position: {
              x: player.position.x + player.width - 50,
              y: player.position.y,
            },
            velocity: {
              x: getRandomValue(-10, 10),
              y: getRandomValue(-40, -50),
            },

          })
        );
      }
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case " ":
      break;
  }
});

