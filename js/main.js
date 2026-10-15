const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mobile navigation toggle
const nav = document.querySelector(".dock-wrap");
const menuBtn = document.querySelector(".menu-btn");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    const open = nav.classList.toggle("nav-open");
    menuBtn.setAttribute("aria-expanded", open);
    menuBtn.textContent = open ? "Close" : "Menu";
  });
}

// Reveal sections as they scroll into view
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Liquid lens: real refraction behind the glass in Chromium browsers.
// Other browsers keep the frosted blur, which still looks right.
const isChromium = navigator.userAgentData?.brands?.some((b) => b.brand === "Chromium");
if (isChromium && !reduceMotion) {
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <filter id="liquid-lens" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.006 0.01" numOctaves="2" seed="4" result="noise"/>
        <feGaussianBlur in="noise" stdDeviation="2" result="soft"/>
        <feDisplacementMap in="SourceGraphic" in2="soft" scale="46" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </svg>`
  );
  document.documentElement.classList.add("liquid");
}

// Light that follows the pointer, plus a specular highlight on each glass surface
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduceMotion) {
  const light = document.createElement("div");
  light.className = "pointer-light";
  document.body.appendChild(light);

  window.addEventListener("pointermove", (e) => {
    light.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;

    const glass = e.target.closest(".glass");
    if (glass) {
      const rect = glass.getBoundingClientRect();
      glass.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      glass.style.setProperty("--my", `${e.clientY - rect.top}px`);
    }
  });
}

// Current year in the footer
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
