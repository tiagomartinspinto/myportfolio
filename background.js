const PARTICLE_COUNT_DESKTOP = 42;
const PARTICLE_COUNT_MOBILE = 28;
const MAX_CONNECTION_DISTANCE = 150;
const MAX_CONNECTION_DISTANCE_SQUARED = MAX_CONNECTION_DISTANCE * MAX_CONNECTION_DISTANCE;
const PARTICLE_SPEED = 0.12;
const PARTICLE_OPACITY = 0.22;
const LINE_OPACITY = 0.055;
const RESIZE_DEBOUNCE_MS = 150;

const canvas = document.querySelector("#processing-background");
const context = canvas?.getContext("2d");
const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

let particles = [];
let width = 0;
let height = 0;
let pixelRatio = 1;
let animationFrame = null;

const randomBetween = (min, max) => min + Math.random() * (max - min);

const isMobile = () => window.matchMedia("(max-width: 760px)").matches;

const particleCount = () => (isMobile() ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP);

const resizeCanvas = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
};

const createParticle = () => {
  const angle = randomBetween(0, Math.PI * 2);
  const speed = randomBetween(PARTICLE_SPEED * 0.35, PARTICLE_SPEED);

  return {
    x: randomBetween(0, width),
    y: randomBetween(0, height),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: randomBetween(0.7, 1.45)
  };
};

const buildParticles = () => {
  particles = Array.from({ length: particleCount() }, createParticle);
};

const keepInsideCanvas = (particle) => {
  if (particle.x < -8 || particle.x > width + 8) {
    particle.vx *= -1;
  }

  if (particle.y < -8 || particle.y > height + 8) {
    particle.vy *= -1;
  }

  particle.x = Math.max(-8, Math.min(width + 8, particle.x));
  particle.y = Math.max(-8, Math.min(height + 8, particle.y));
};

const draw = ({ move = true } = {}) => {
  context.clearRect(0, 0, width, height);
  context.lineWidth = 0.7;

  particles.forEach((particle, index) => {
    if (move) {
      particle.x += particle.vx;
      particle.y += particle.vy;
      keepInsideCanvas(particle);
    }

    for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
      const next = particles[nextIndex];
      const deltaX = particle.x - next.x;
      const deltaY = particle.y - next.y;
      const distanceSquared = deltaX * deltaX + deltaY * deltaY;

      // Skip the expensive sqrt for the many pairs that are out of range.
      if (distanceSquared < MAX_CONNECTION_DISTANCE_SQUARED) {
        const proximity = 1 - Math.sqrt(distanceSquared) / MAX_CONNECTION_DISTANCE;
        context.strokeStyle = `rgba(190, 190, 190, ${LINE_OPACITY * proximity})`;
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(next.x, next.y);
        context.stroke();
      }
    }

    context.fillStyle = `rgba(205, 205, 205, ${PARTICLE_OPACITY})`;
    context.beginPath();
    context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    context.fill();
  });
};

const stopAnimation = () => {
  if (animationFrame) {
    window.cancelAnimationFrame(animationFrame);
    animationFrame = null;
  }
};

const tick = () => {
  draw();
  animationFrame = window.requestAnimationFrame(tick);
};

const startAnimation = () => {
  stopAnimation();

  if (document.hidden || reducedMotionQuery.matches) {
    draw({ move: false });
    return;
  }

  tick();
};

const rebuild = () => {
  resizeCanvas();
  buildParticles();
  startAnimation();
};

let resizeTimer = null;
const debouncedRebuild = () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(rebuild, RESIZE_DEBOUNCE_MS);
};

if (canvas && context) {
  rebuild();

  window.addEventListener("resize", debouncedRebuild, { passive: true });
  document.addEventListener("visibilitychange", startAnimation);
  reducedMotionQuery.addEventListener("change", startAnimation);
}
