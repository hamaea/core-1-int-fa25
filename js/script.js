document.addEventListener("DOMContentLoaded", () => {
  const floatImgs = document.querySelectorAll(".float-img");
  const imgSize = 200; // must match CSS width

  floatImgs.forEach(img => {
    // initial placement
    img.style.left = Math.random() * (window.innerWidth - imgSize) + "px";
    img.style.top  = Math.random() * (window.innerHeight - imgSize) + "px";

    // start drifting
    moveRandom(img);
  });

  function moveRandom(el) {
    const maxX = window.innerWidth - imgSize;
    const maxY = window.innerHeight - imgSize;

    const toX = Math.random() * maxX;
    const toY = Math.random() * maxY;

    // rotation between -20° and 20°
    const rotateDeg = (Math.random() * 40 - 20).toFixed(2);

    // 8–16 seconds
    const time = 8000 + Math.random() * 8000;

    el.animate(
      [
        { transform: el.style.transform },
        { transform: `translate(${toX - el.offsetLeft}px, ${toY - el.offsetTop}px) rotate(${rotateDeg}deg)` }
      ],
      {
        duration: time,
        easing: "ease-in-out",
        fill: "forwards"
      }
    ).onfinish = () => {
      // permanently move to new position
      el.style.left = toX + "px";
      el.style.top = toY + "px";
      el.style.transform = `rotate(${rotateDeg}deg)`;
      moveRandom(el);
    };
  }

  // keep images inside viewport on resize
  window.addEventListener("resize", () => {
    floatImgs.forEach(el => {
      const maxX = window.innerWidth - imgSize;
      const maxY = window.innerHeight - imgSize;
      el.style.left = Math.min(parseFloat(el.style.left), maxX) + "px";
      el.style.top  = Math.min(parseFloat(el.style.top),  maxY) + "px";
    });
  });
});


// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-icon');
const body = document.body;
//hai
// Get saved theme or default to light
const savedTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', function () {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`);
}

// Clap Button Animation
const clapButton = document.querySelector('.clap-button');
const clapCount = document.querySelector('.clap-count');
let currentClaps = parseInt(clapCount.textContent) || 0;

clapButton.addEventListener('click', function () {
    currentClaps++;
    clapCount.textContent = currentClaps;

    // Add animation class
    clapButton.style.transform = 'scale(1.1)';

    // Reset animation
    setTimeout(() => {
        clapButton.style.transform = 'scale(1)';
    }, 150);

    // Save claps to localStorage
    localStorage.setItem('article-claps', currentClaps);

    // Create floating clap animation
    createClapAnimation();
});

// Load saved claps
const savedClaps = localStorage.getItem('article-claps');
if (savedClaps) {
    currentClaps = parseInt(savedClaps);
    clapCount.textContent = currentClaps;
}

function createClapAnimation() {
    const clapEmoji = document.createElement('div');
    clapEmoji.textContent = '👏';
    clapEmoji.style.cssText = `
            position: fixed;
            pointer-events: none;
            font-size: 1.5rem;
            z-index: 1000;
            animation: clapFloat 1s ease-out forwards;
        `;

    const rect = clapButton.getBoundingClientRect();
    clapEmoji.style.left = rect.left + rect.width / 2 + 'px';
    clapEmoji.style.top = rect.top + 'px';

    document.body.appendChild(clapEmoji);

    setTimeout(() => {
        clapEmoji.remove();
    }, 1000);
}

// Add CSS for clap animation
const style = document.createElement('style');
style.textContent = `
        @keyframes clapFloat {
            0% { 
                transform: translateY(0) scale(1); 
                opacity: 1; 
            }
            100% { 
                transform: translateY(-50px) scale(1.2); 
                opacity: 0; 
            }
        }
    `;
document.head.appendChild(style);

// Reading Progress Indicator
function updateReadingProgress() {
    const article = document.querySelector('.article-content');
    const scrolled = window.scrollY;
    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;

    const progress = Math.max(0, Math.min(1,
        (scrolled - articleTop + windowHeight * 0.1) / (articleHeight - windowHeight * 0.2)
    ));

    // Update a CSS custom property for potential progress bar
    document.documentElement.style.setProperty('--reading-progress', progress);
}

window.addEventListener('scroll', updateReadingProgress);
updateReadingProgress();

// Smooth tag interactions
document.querySelectorAll('.tag').forEach(tag => {
    tag.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px)';
    });

    tag.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

// Console messages for developers
console.log('📖 Medium-style Article Template');
console.log('Current theme:', savedTheme);
console.log('Article claps:', currentClaps);
console.log('');
console.log('This template features:');
console.log('- Clean, Medium-inspired design');
console.log('- Dark/light theme switching');
console.log('- Interactive clap button');
console.log('- Responsive typography');
console.log('- Accessible navigation');
console.log('- Smooth animations');

// Export utility functions
window.mediumTemplate = {
    resetClaps: function () {
        localStorage.removeItem('article-claps');
        document.querySelector('.clap-count').textContent = '47';
        console.log('Clap count reset');
    },

    getTheme: function () {
        return document.body.getAttribute('data-theme');
    },

    setTheme: function (theme) {
        if (['light', 'dark'].includes(theme)) {
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            console.log(`Theme set to: ${theme}`);
        }
    }
};