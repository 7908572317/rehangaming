// script.js
const gameArea = document.querySelector('.game-area');
const gun = document.querySelector('.gun');
const scoreDisplay = document.getElementById('score');

let score = 0;
let gameInterval;
let targets = [];

// Move the gun
document.addEventListener('mousemove', (event) => {
  const rect = gameArea.getBoundingClientRect();
  const x = event.clientX - rect.left;

  if (x > 0 && x < rect.width) {
    gun.style.left = `${x - 25}px`;
  }
});

// Shoot bullet
document.addEventListener('click', () => {
  const bullet = document.createElement('div');
  bullet.classList.add('bullet');
  const gunPosition = gun.offsetLeft + gun.offsetWidth / 2;

  bullet.style.left = `${gunPosition}px`;
  bullet.style.bottom = '50px';
  gameArea.appendChild(bullet);

  moveBullet(bullet);
});

// Move bullet upward
function moveBullet(bullet) {
  const bulletInterval = setInterval(() => {
    const bulletPosition = parseInt(bullet.style.bottom);

    if (bulletPosition >= 400) {
      bullet.remove();
      clearInterval(bulletInterval);
    } else {
      bullet.style.bottom = `${bulletPosition + 10}px`;
    }

    // Check collision with targets
    targets.forEach((target, index) => {
      if (isColliding(bullet, target)) {
        bullet.remove();
        target.remove();
        targets.splice(index, 1);
        clearInterval(bulletInterval);
        score++;
        scoreDisplay.textContent = score;
      }
    });
  }, 20);
}

// Spawn targets
function spawnTarget() {
  const target = document.createElement('div');
  target.classList.add('target');
  target.style.left = `${Math.random() * 550}px`;
  target.style.top = '0px';
  gameArea.appendChild(target);
  targets.push(target);

  moveTarget(target);
}

// Move targets downward
function moveTarget(target) {
  const targetInterval = setInterval(() => {
    const targetPosition = parseInt(target.style.top);

    if (targetPosition >= 400) {
      target.remove();
      clearInterval(targetInterval);
      targets = targets.filter((t) => t !== target);

      // End game if a target reaches the bottom
      if (targets.length === 0) {
        alert('Game Over! Your score: ' + score);
        clearInterval(gameInterval);
        window.location.reload();
      }
    } else {
      target.style.top = `${targetPosition + 5}px`;
    }
  }, 30);
}

// Check collision
function isColliding(bullet, target) {
  const bulletRect = bullet.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();

  return !(
    bulletRect.top > targetRect.bottom ||
    bulletRect.bottom < targetRect.top ||
    bulletRect.left > targetRect.right ||
    bulletRect.right < targetRect.left
  );
}

// Start game
function startGame() {
  gameInterval = setInterval(spawnTarget, 1000);
}

startGame();
