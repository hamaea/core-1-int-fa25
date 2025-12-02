// ---- Orbiting origami animation ----

// Select all origami images that will orbit
const icons = document.querySelectorAll(".float-img, .bunny-img");

// Global rotation angle
let angle = 0;
// Radius of the orbit (adjust for size)
const radius = 350;
// Rotation speed
const speed = 0.01;

// Main animation loop for orbiting icons
function rotateIcons() {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2 + 60; // slight vertical offset

  icons.forEach((icon, i) => {
    const offset = (Math.PI * 2 / icons.length) * i;

    const x = centerX + Math.cos(angle + offset) * radius;
    const y = centerY + Math.sin(angle + offset) * radius;

    icon.style.left = x + "px";
    icon.style.top = y + "px";
  });

  angle += speed;
  requestAnimationFrame(rotateIcons);
}

rotateIcons();

// ---- Custom cursor effect ----

// Create the cursor element dynamically and add it to the page
const cursorDot = document.createElement("div");
cursorDot.classList.add("cursor-dot");
document.body.appendChild(cursorDot);

// Only run the custom cursor on devices with a real mouse pointer
if (window.matchMedia("(pointer: fine)").matches) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;
  const cursorSpeed = 0.3; // higher = faster/snappier follow

  // Hover effect for LINKS + BUTTONS (general active state)
  const interactiveEls = document.querySelectorAll("a, button");
  interactiveEls.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorDot.classList.add("cursor--active");
    });
    el.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("cursor--active");
    });
  });

  // TEXT-SPECIFIC hover effect (paragraphs + headings)
  const textEls = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span");
  textEls.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursorDot.classList.add("cursor--text");
    });
    el.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("cursor--text");
    });
  });

  // IMAGE-SPECIFIC hover effect (unique color class) + disable drag
  const imageEls = document.querySelectorAll(".float-img, .bunny-img");
  imageEls.forEach((img) => {
    img.addEventListener("mouseenter", () => {
      cursorDot.classList.add("cursor--image");
    });
    img.addEventListener("mouseleave", () => {
      cursorDot.classList.remove("cursor--image");
    });
    // Prevent default drag behavior so clicks feel clean
    img.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
  });

  // Track the real mouse position
  document.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  // Smoothly ease the cursor dot toward the mouse and apply stretch
  function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;

    cursorX += dx * cursorSpeed;
    cursorY += dy * cursorSpeed;

    cursorDot.style.left = cursorX + "px";
    cursorDot.style.top = cursorY + "px";

    // Stretch and rotate based on movement direction + speed
    const distance = Math.hypot(dx, dy);
    const maxStretch = 0.6; // cap the stretch amount
    const stretch = Math.min(distance / 40, maxStretch);

    const angleRad = Math.atan2(dy, dx);
    const scaleX = 1 + stretch;       // longer in the direction of travel
    const scaleY = 1 - stretch * 0.4; // slightly squished perpendicular

    cursorDot.style.transform =
      `translate(-50%, -50%) rotate(${angleRad}rad) scale(${scaleX}, ${scaleY})`;

    requestAnimationFrame(animateCursor);
  }

  animateCursor();
}
