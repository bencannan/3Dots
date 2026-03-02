// Smooth scroll for buttons with data-scroll-to
document.querySelectorAll("[data-scroll-to]").forEach((trigger) => {
  trigger.addEventListener("click", (e) => {
    const targetSelector = trigger.getAttribute("data-scroll-to");
    const target = targetSelector ? document.querySelector(targetSelector) : null;
    if (target) {
      e.preventDefault();
      const rect = target.getBoundingClientRect();
      const offset = window.scrollY + rect.top - 72; // header offset
      window.scrollTo({ top: offset, behavior: "smooth" });
    }
  });
});

// Keep refresh from jumping to an old hash/scroll position
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

// Smooth scroll for in-page anchors without keeping the hash in the URL
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href") || "";
    const id = href.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;

    e.preventDefault();
    const rect = target.getBoundingClientRect();
    const offset = window.scrollY + rect.top - 72;
    window.scrollTo({ top: offset, behavior: "smooth" });

    // Clear hash so refresh doesn't jump
    history.replaceState(null, "", window.location.pathname + window.location.search);
  });
});

// If the page was opened with a hash, reset to top (prevents "refresh goes to bottom")
window.addEventListener("load", () => {
  if (window.location.hash) {
    history.replaceState(null, "", window.location.pathname + window.location.search);
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }
});

// Dynamic year in footer
const yearEl = document.getElementById("year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear().toString();
}

// Hero "AI dev" code typing animation (15–20 lines)
const codeLines = [
  '<span class="token-comment">// 3Dots :: AI-enabled MVP pipeline</span>',
  '<span class="token-keyword">async</span> <span class="token-keyword">function</span> <span class="token-fn">buildMVP</span>(<span class="token-param">idea</span>) {',
  '  <span class="token-keyword">const</span> design = <span class="token-fn">finalizeDesign</span>(idea);',
  '  <span class="token-keyword">const</span> stack = <span class="token-fn">pickStack</span>(design, { aiFirst: <span class="token-keyword">true</span> });',
  "  <span class=\"token-keyword\">await</span> <span class=\"token-fn\">ship</span>({ design, stack, deadline: <span class=\"token-str\">'15 days'</span> });",
  "  <span class=\"token-keyword\">return</span> <span class=\"token-str\">'launch-ready MVP'</span>;",
  "}",
  "",
  '<span class="token-comment">// Design → build → launch in 15 days</span>',
  '<span class="token-keyword">const</span> <span class="token-param">result</span> = <span class="token-keyword">await</span> <span class="token-fn">buildMVP</span>(<span class="token-str">"your idea"</span>);',
  '<span class="token-fn">console</span>.<span class="token-fn">log</span>(result); <span class="token-comment">// "launch-ready MVP"</span>',
  "",];
  // '<span class="token-comment">// Phase 1: Foundation (Days 1–5)</span>',
  // '<span class="token-comment">// Phase 2: Core features (Days 6–10)</span>',
  // '<span class="token-comment">// Phase 3: Test & handover (Days 11–15)</span>',
  // "",
  // '<span class="token-keyword">const</span> <span class="token-param">ready</span> = <span class="token-keyword">await</span> <span class="token-fn">buildMVP</span>(<span class="token-str">"your idea"</span>);',
  // '<span class="token-fn">console</span>.<span class="token-fn">log</span>(<span class="token-str">"Done:"</span>, ready);',


const codeStreamEl = document.getElementById("code-stream");

// Parse line HTML into segments { class, text } for letter-by-letter typing
function parseLineSegments(html) {
  const segments = [];
  const re = /<span class="(token-[^"]+)">([^<]*)<\/span>|([^<]+)/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    if (m[1] != null) segments.push({ tokenClass: m[1], text: m[2] });
    else if (m[3]) segments.push({ tokenClass: "", text: m[3] });
  }
  return segments;
}

function decodeHtmlEntities(str) {
  const el = document.createElement("span");
  el.innerHTML = str;
  return el.textContent || str;
}

if (codeStreamEl) {
  let lineIdx = 0;
  const charDelay = 24;
  const linePause = 220;
  const loopPause = 1800;

  function typeNextChar(lineEl, segments, segIdx, charIdx) {
    if (segIdx >= segments.length) {
      lineIdx += 1;
      if (lineIdx >= codeLines.length) {
        setTimeout(() => {
          codeStreamEl.innerHTML = "";
          lineIdx = 0;
          setTimeout(startNextLine, 400);
        }, loopPause);
      } else {
        setTimeout(startNextLine, linePause);
      }
      return;
    }
    const seg = segments[segIdx];
    const decoded = decodeHtmlEntities(seg.text);
    if (charIdx >= decoded.length) {
      typeNextChar(lineEl, segments, segIdx + 1, 0);
      return;
    }
    const span = document.createElement("span");
    if (seg.tokenClass) span.className = seg.tokenClass;
    span.textContent = decoded[charIdx];
    lineEl.appendChild(span);
    setTimeout(() => typeNextChar(lineEl, segments, segIdx, charIdx + 1), charDelay);
  }

  function startNextLine() {
    if (lineIdx >= codeLines.length) return;
    const lineHtml = codeLines[lineIdx];
    const lineEl = document.createElement("div");
    lineEl.className = "code-line";
    codeStreamEl.appendChild(lineEl);
    if (lineHtml === "") {
      lineIdx += 1;
      setTimeout(startNextLine, linePause);
      return;
    }
    const segments = parseLineSegments(lineHtml);
    typeNextChar(lineEl, segments, 0, 0);
  }

  startNextLine();
}

// Scroll reveal (per-element, staggered within each section)
const ensureRevealTargets = () => {
  const sections = Array.from(document.querySelectorAll(".section"));

  sections.forEach((section) => {
    const targets = [];

    // Hero content (exclude hero-title so scroll-reveal transform doesn't affect centering)
    section.querySelectorAll(".hero-content > *").forEach((el) => {
      if (!el.classList.contains("hero-title")) targets.push(el);
    });
    section.querySelectorAll(".careers-hero-inner > *").forEach((el) => targets.push(el));
    section.querySelectorAll(".section-split .split-panel").forEach((el) => targets.push(el));
    section.querySelectorAll(".section-approach .section-approach-title").forEach((el) => targets.push(el));
    section.querySelectorAll(".section-approach .section-approach-headline").forEach((el) => targets.push(el));
    section.querySelectorAll(".section-approach .approach-body .approach-p").forEach((el) => targets.push(el));
    section.querySelectorAll(".capabilities-code-wrap").forEach((el) => targets.push(el));
    section.querySelectorAll(".startups-worked-header > *").forEach((el) => targets.push(el));
    section.querySelectorAll(".faq-header > *").forEach((el) => targets.push(el));
    section.querySelectorAll(".faq-item").forEach((el) => targets.push(el));

    // Header: eyebrow + title + paragraph(s)
    section.querySelectorAll(".section-header > *").forEach((el) => targets.push(el));
    section.querySelectorAll(".careers-section-title").forEach((el) => targets.push(el));
    section.querySelectorAll(".careers-section-lead").forEach((el) => targets.push(el));

    // Common content blocks
    section.querySelectorAll(".lead").forEach((el) => targets.push(el));
    section.querySelectorAll(".framework-footer").forEach((el) => targets.push(el));
    section.querySelectorAll(".bullet-list").forEach((el) => targets.push(el));

    // Cards + card grids
    section.querySelectorAll(".card, .card-list, .card-grid > *").forEach((el) => targets.push(el));

    // Timeline pieces (reveal the whole item + its inner content)
    section.querySelectorAll(".timeline-item").forEach((el) => targets.push(el));
    section.querySelectorAll(".timeline-content").forEach((el) => targets.push(el));

    // Careers: culture cards, opening cards, form
    section.querySelectorAll(".careers-culture-card").forEach((el) => targets.push(el));
    section.querySelectorAll(".careers-opening-card").forEach((el) => targets.push(el));
    section.querySelectorAll(".careers-form-wrap").forEach((el) => targets.push(el));

    // About page: story, mission/vision cards, team
    section.querySelectorAll(".about-story-title, .about-story-body > *").forEach((el) => targets.push(el));
    section.querySelectorAll(".about-card").forEach((el) => targets.push(el));
    section.querySelectorAll(".about-team-title, .about-team-lead").forEach((el) => targets.push(el));
    section.querySelectorAll(".about-team-body > *").forEach((el) => targets.push(el));
    section.querySelectorAll(".about-team-highlights").forEach((el) => targets.push(el));

    // Contact page: hero, form card, info cards, social, map
    section.querySelectorAll(".contact-hero-inner > *").forEach((el) => targets.push(el));
    section.querySelectorAll(".contact-card").forEach((el) => targets.push(el));

    // Blog page: hero, sidebar, cards
    section.querySelectorAll(".blog-hero-inner > *").forEach((el) => targets.push(el));
    section.querySelectorAll(".blog-sidebar").forEach((el) => targets.push(el));
    section.querySelectorAll(".blog-card").forEach((el) => targets.push(el));

    // Final CTA columns
    section.querySelectorAll(".final-cta-content > *").forEach((el) => targets.push(el));

    // De-dupe while preserving order
    const unique = Array.from(new Set(targets));

    unique.forEach((el, index) => {
      if (!el.hasAttribute("data-reveal")) {
        el.setAttribute("data-reveal", "");
      }
      el.dataset.revealIndex = String(index);
      el.dataset.revealSection = section.id || "section";
    });
  });
};

ensureRevealTargets();

// Ensure elements start hidden BEFORE we reveal (prevents "no animation" on first paint)
document.querySelectorAll("[data-reveal]").forEach((el) => {
  el.classList.remove("is-visible");
  el.style.transitionDelay = "0ms";
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const index = Number(el.dataset.revealIndex ?? "0");

      // Stagger inside each section for a clean “scroll down” feel
      const delay = Math.min(index * 110, 900);
      el.style.transitionDelay = `${delay}ms`;

      // Add the class in the next frame so the browser has a "from" state
      requestAnimationFrame(() => {
        el.classList.add("is-visible");
      });

      observer.unobserve(el);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -10% 0px",
  }
);

// Start observing after the first paint so transitions reliably trigger
requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
  });
});

// FAQ accordion: one answer open at a time
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const answer = item?.querySelector(".faq-answer");
    const isOpening = !item?.classList.contains("is-open");

    document.querySelectorAll(".faq-item").forEach((other) => {
      other.classList.remove("is-open");
      const otherAnswer = other.querySelector(".faq-answer");
      const otherBtn = other.querySelector(".faq-question");
      if (otherAnswer) otherAnswer.hidden = true;
      if (otherBtn) otherBtn.setAttribute("aria-expanded", "false");
    });

    if (isOpening && item && answer) {
      item.classList.add("is-open");
      answer.hidden = false;
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

// Hamburger menu (mobile nav)
const navToggle = document.querySelector(".site-nav-toggle");
const siteHeader = document.querySelector(".site-header");
const siteNav = document.getElementById("site-nav");

if (navToggle && siteHeader && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteHeader.classList.toggle("is-nav-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteHeader.classList.remove("is-nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      document.body.style.overflow = "";
    });
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 901px)").matches) {
      siteHeader.classList.remove("is-nav-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
      document.body.style.overflow = "";
    }
  });
}
// ---------------------------------------------------------------------------
// Contact form handler using EmailJS
// ---------------------------------------------------------------------------

const EMAILJS_SERVICE_ID = "service_sp690l9";
const EMAILJS_TEMPLATE_ID = "template_k5l0duh";
const EMAILJS_PUBLIC_KEY = "5eUQMhBa6n5GyHqNK";

document.addEventListener("DOMContentLoaded", function () {
  // Initialize EmailJS
  if (window.emailjs) {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  } else {
    console.error("EmailJS SDK not loaded.");
    return;
  }

  const contactForm = document.getElementById("contact-form");

  if (!contactForm) return;

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const submitBtn = contactForm.querySelector("button[type='submit']");
    if (submitBtn) submitBtn.disabled = true;

    // Add current time
    const timeField = document.getElementById("contact-time");
    if (timeField) {
      timeField.value = new Date().toISOString();
    }
    const messageField = document.getElementById("contact-message");
    if (messageField) {
      let msg = messageField.value.trim();
      // Optional: limit length
      if (msg.length > 2000) {
        msg = msg.substring(0, 2000) + "… (message truncated)";
        messageField.value = msg;
      }
      msg = msg.replace(/[<>{}]/g, "");
    }
    emailjs
      .sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, this)
      .then(function () {
        alert("Your message has been sent successfully!");
        contactForm.reset();
        if (submitBtn) submitBtn.disabled = false;
      })
      .catch(function (error) {
        console.error("EmailJS Error:", error);
        alert("Something went wrong. Please try again later.");
        if (submitBtn) submitBtn.disabled = false;
      });
  });
});