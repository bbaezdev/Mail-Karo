// navbar.js

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");

  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    // Animate hamburger into X
    const bars = menuBtn.querySelectorAll(".bar");
    bars[0].classList.toggle("rotate1");
    bars[1].classList.toggle("fade");
    bars[2].classList.toggle("rotate2");
  });

  // Optional smooth shrink on scroll
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 30) {
      navbar.style.background = "rgba(13,13,13,0.85)";
      navbar.style.backdropFilter = "blur(8px)";
      navbar.style.padding = "12px 40px";
    } else {
      navbar.style.background = "rgba(13,13,13,0.9)";
      navbar.style.padding = "18px 40px";
    }
  });
});

// Add small CSS animations for hamburger in JS file
const style = document.createElement("style");
style.innerHTML = `
.bar.rotate1 { transform: translateY(7px) rotate(45deg); background-color: #FFD700; }
.bar.rotate2 { transform: translateY(-7px) rotate(-45deg); background-color: #FFD700; }
.bar.fade { opacity: 0; }
`;
document.head.appendChild(style);
