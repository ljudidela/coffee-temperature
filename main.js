import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);

// --- CANVAS BACKGROUND (Falling Coffee Beans & Stars) ---
const canvas = document.getElementById('cosmos-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

function resize() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset(true);
  }

  reset(initial = false) {
    this.x = Math.random() * width;
    this.y = initial ? Math.random() * height : -20;
    this.size = Math.random() * 3 + 1;
    this.speed = Math.random() * 1 + 0.2;
    this.angle = Math.random() * Math.PI * 2;
    this.spin = (Math.random() - 0.5) * 0.05;
    this.isBean = Math.random() > 0.7; // 30% chance to be a bean, else a star
    this.opacity = Math.random() * 0.5 + 0.2;
  }

  update() {
    this.y += this.speed;
    this.angle += this.spin;
    if (this.y > height) this.reset();
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.opacity;

    if (this.isBean) {
      // Draw Coffee Bean
      ctx.fillStyle = '#6f4e37';
      ctx.beginPath();
      ctx.ellipse(0, 0, this.size * 2, this.size * 1.2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Bean crease
      ctx.beginPath();
      ctx.strokeStyle = '#3b2f2f';
      ctx.lineWidth = 1;
      ctx.moveTo(-this.size, 0);
      ctx.quadraticCurveTo(0, -this.size * 0.5, this.size, 0);
      ctx.stroke();
    } else {
      // Draw Star
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
  }
}

function animateCanvas() {
  ctx.clearRect(0, 0, width, height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateCanvas);
}

window.addEventListener('resize', resize);
resize();
initParticles();
animateCanvas();

// --- GSAP ANIMATIONS ---

// 1. Hero Text
gsap.from('.hero-content', {
  duration: 1.5,
  y: 50,
  opacity: 0,
  ease: 'power3.out',
  delay: 0.5
});

// 2. Coffee Cup Section
const cupTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#coffee-section',
    start: 'top 60%',
    end: 'bottom 80%',
    scrub: 1
  }
});

cupTl.from('.cup', { scale: 0.8, opacity: 0, duration: 1 })
     .to('.steam', { y: -30, opacity: 0.6, stagger: 0.2, duration: 1, repeat: -1, yoyo: true });

// 3. Recipes Section
const recipeTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#recipes-section',
    start: 'top 70%',
  }
});

recipeTl.to('.ingredient', {
  y: 0,
  opacity: 1,
  duration: 0.8,
  stagger: 0.3,
  ease: 'back.out(1.7)'
})
.to('.ingredient', {
  y: 100,
  scale: 0.5,
  opacity: 0,
  duration: 0.5,
  stagger: 0.1,
  delay: 0.5
})
.to('.mixing-bowl', { opacity: 1, scale: 1.2, duration: 0.5, ease: 'elastic.out(1, 0.3)' });

// --- FORM SUBMISSION & CONFETTI ---
const form = document.getElementById('order-form');
const btn = document.querySelector('.launch-btn');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  // Button Animation
  gsap.to(btn, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });
  btn.textContent = 'LAUNCHING...';
  
  // Confetti Explosion from button coordinates
  const rect = btn.getBoundingClientRect();
  const x = (rect.left + rect.width / 2) / window.innerWidth;
  const y = (rect.top + rect.height / 2) / window.innerHeight;

  confetti({
    particleCount: 150,
    spread: 70,
    origin: { x, y },
    colors: ['#ff8c42', '#ff2e63', '#ffffff', '#6f4e37'],
    gravity: 1.2,
    scalar: 1.2
  });

  setTimeout(() => {
    btn.textContent = 'MISSION CONFIRMED';
    form.reset();
  }, 1500);
});