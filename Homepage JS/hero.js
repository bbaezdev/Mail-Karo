// hero.js

document.addEventListener("DOMContentLoaded", () => {
  const hero = document.querySelector(".hero");
  const title = document.querySelector(".hero-title");
  const subtitle = document.querySelector(".hero-subtitle");
  const button = document.querySelector(".hero-btn");

  // Subtle fade-in effects for text and button
  setTimeout(() => {
    title.style.opacity = "1";
    subtitle.style.opacity = "1";
    button.style.opacity = "1";
    title.style.transform = "translateY(0)";
  }, 300);

  // Create small moving glowing particles for background
  for (let i = 0; i < 10; i++) {
    const spark = document.createElement("div");
    spark.classList.add("spark");
    spark.style.left = Math.random() * 100 + "%";
    spark.style.top = Math.random() * 100 + "%";
    spark.style.animationDuration = 3 + Math.random() * 5 + "s";
    hero.appendChild(spark);
  }
});

const heroStyle = document.createElement("style");
style.innerHTML = `
.spark {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #FFD700;
  border-radius: 50%;
  opacity: 0.8;
  box-shadow: 0 0 8px #FFD700;
  animation: moveSpark linear infinite;
}
@keyframes moveSpark {
  0% { transform: translate(0, 0) scale(1); opacity: 1; }
  50% { transform: translate(20px, -20px) scale(1.4); opacity: 0.6; }
  100% { transform: translate(0, 0) scale(1); opacity: 1; }
}
`;
document.head.appendChild(heroStyle);
