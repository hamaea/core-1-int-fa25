document.addEventListener("DOMContentLoaded", () => {
  const floatImgs = document.querySelectorAll(".float-img");
  const imgSize = 200; // must match CSS width

  function isOverlapping(x, y, el) {
    const padding = 10; // extra spacing between images
    const left1   = x;
    const top1    = y;
    const right1  = x + imgSize;
    const bottom1 = y + imgSize;

    let overlap = false;

    floatImgs.forEach(other => {
      if (other === el) return;

      const otherLeft   = parseFloat(other.style.left) || 0;
      const otherTop    = parseFloat(other.style.top) || 0;
      const otherRight  = otherLeft + imgSize;
      const otherBottom = otherTop + imgSize;

      // expand other rect by padding so they don't get too close
      const l2 = otherLeft   - padding;
      const r2 = otherRight  + padding;
      const t2 = otherTop    - padding;
      const b2 = otherBottom + padding;

      const noOverlap =
        right1 < l2 ||
        left1  > r2 ||
        bottom1 < t2 ||
        top1    > b2;

      if (!noOverlap) {
        overlap = true;
      }
    });

    return overlap;
  }

  floatImgs.forEach(img => {
    // initial placement with simple overlap avoidance
    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 50) {
      const randX = Math.random() * (window.innerWidth - imgSize);
      const randY = Math.random() * (window.innerHeight - imgSize);

      if (!isOverlapping(randX, randY, img)) {
        img.style.left = randX + "px";
        img.style.top  = randY + "px";
        placed = true;
      }

      attempts++;
    }

    // fallback if we somehow failed to find a clean spot
    if (!placed) {
      img.style.left = Math.random() * (window.innerWidth - imgSize) + "px";
      img.style.top  = Math.random() * (window.innerHeight - imgSize) + "px";
    }

    // start drifting
    moveRandom(img);
  });

  function moveRandom(el) {
    const maxOffset = 40; // more movement for a spacey floating feel

    const currentLeft = parseFloat(el.style.left) || 0;
    const currentTop  = parseFloat(el.style.top)  || 0;

    let clampedX = currentLeft;
    let clampedY = currentTop;
    let attempts = 0;

    // try a few random offsets and pick one that doesn't overlap
    while (attempts < 10) {
      const targetX = currentLeft + (Math.random() * 2 - 1) * maxOffset;
      const targetY = currentTop  + (Math.random() * 2 - 1) * maxOffset;

      const candidateX = Math.min(Math.max(targetX, 0), window.innerWidth - imgSize);
      const candidateY = Math.min(Math.max(targetY, 0), window.innerHeight - imgSize);

      if (!isOverlapping(candidateX, candidateY, el)) {
        clampedX = candidateX;
        clampedY = candidateY;
        break;
      }

      attempts++;
    }

    const time = 8000 + Math.random() * 8000; // 8–16 seconds: noticeably floaty but not chaotic

    el.animate(
      [
        { transform: "translate(0, 0)" },
        { transform: `translate(${clampedX - currentLeft}px, ${clampedY - currentTop}px)` }
      ],
      {
        duration: time,
        easing: "ease-in-out",
        fill: "forwards"
      }
    ).onfinish = () => {
      // permanently move to new position using left/top only
      el.style.left = clampedX + "px";
      el.style.top  = clampedY + "px";
      el.style.transform = "none";
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