/* =====================================================
   MOBILE MENU
===================================================== */

const menuBtn = document.querySelector(".navbar-toggler");
const mobileMenu = document.querySelector(".mobile-menu");
const overlay = document.querySelector(".mobile-overlay");
const closeBtn = document.querySelector(".close-menu");

if (menuBtn && mobileMenu && overlay && closeBtn) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  function closeMenu() {
    mobileMenu.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Close menu when clicking on a link
  const mobileLinks = mobileMenu.querySelectorAll(
    ".nav-link, .btn-subscribe, .btn-register"
  );

  mobileLinks.forEach(link => {
    link.addEventListener("click", () => {
      setTimeout(closeMenu, 300);
    });
  });
}

/* =====================================================
   GLOBAL CAROUSEL COMPONENT
===================================================== */

class Carousel {
  constructor(wrapper, options = {}) {
    this.wrapper = wrapper;
    this.track = wrapper.querySelector(".carousel-track");
    this.next = wrapper.querySelector(".btn-next");
    this.prev = wrapper.querySelector(".btn-prev");

    this.visible =
      Number(wrapper.dataset.visible) || options.visible || 3;

    this.gap = options.gap || 20;
    this.items = Array.from(this.track.children);

    if (this.items.length <= this.visible) return;

    this.init();
  }

  init() {
    if (window.innerWidth <= 768) {
      this.isMobile = true;
      this.bind();
      this.refresh();
    } else {
      this.isMobile = false;
      this.clone();
      this.bind();
      this.refresh();
    }
  }

  clone() {
    if (this.isMobile) return;

    const first = this.items
      .slice(0, this.visible)
      .map(el => el.cloneNode(true));

    const last = this.items
      .slice(-this.visible)
      .map(el => el.cloneNode(true));

    first.forEach(c => this.track.appendChild(c));
    last.reverse().forEach(c =>
      this.track.insertBefore(c, this.track.firstChild)
    );

    this.items = Array.from(this.track.children);
    this.index = this.visible;
  }

  refresh() {
    requestAnimationFrame(() => {
      if (this.isMobile) return;

      const card = this.items[this.visible];
      if (!card) return;

      this.cardWidth = card.offsetWidth;
      this.moveAmount = this.cardWidth + this.gap;

      this.track.style.transition = "none";
      this.track.style.transform = `translateX(${
        this.index * this.moveAmount
      }px)`;
    });
  }

  move(anim = true) {
    this.track.style.transition = anim
      ? "transform .5s ease"
      : "none";

    this.track.style.transform = `translateX(${
      this.index * this.moveAmount
    }px)`;
  }

  bind() {
    if (this.isMobile) {
      if (this.track) {
        this.track.style.scrollBehavior = "smooth";
      }
      return;
    }

    this.next?.addEventListener("click", () => {
      this.index++;
      this.move();

      if (this.index === this.items.length - this.visible) {
        setTimeout(() => {
          this.index = this.visible;
          this.move(false);
        }, 500);
      }
    });

    this.prev?.addEventListener("click", () => {
      this.index--;
      this.move();

      if (this.index === 0) {
        setTimeout(() => {
          this.index =
            this.items.length - this.visible * 2;
          this.move(false);
        }, 500);
      }
    });

    window.addEventListener("resize", () => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 768;

      if (wasMobile !== this.isMobile) {
        this.items = Array.from(this.track.children);

        if (!this.isMobile && this.items.length > this.visible) {
          this.clone();
        }
      }

      this.refresh();
    });
  }
}

/* =====================================================
   INIT ALL CAROUSELS
===================================================== */

const carousels = [];

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".carousel").forEach(el => {
    carousels.push(new Carousel(el));
  });
});

/* =====================================================
   REFRESH ALL CAROUSELS (ON TAB CHANGE)
===================================================== */

function refreshAllCarousels() {
  setTimeout(() => {
    carousels.forEach(c => c.refresh());
  }, 50);
}

/* =====================================================
   TABS (MAIN + SUB)
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  function initDefaultTabs() {
    document
      .querySelectorAll(
        ".main-tab, .sub-tab, .sub-group, .cards-group"
      )
      .forEach(el => el.classList.remove("active"));

    const main = document.querySelector(
      '.main-tab[data-main="popular"]'
    );
    const group = document.querySelector(
      '.sub-group[data-main="popular"]'
    );
    const sub = group?.querySelector(".sub-tab");
    const cards = document.getElementById(sub?.dataset.target);

    main?.classList.add("active");
    group?.classList.add("active");
    sub?.classList.add("active");
    cards?.classList.add("active");

    refreshAllCarousels();
  }

  initDefaultTabs();

  document.querySelectorAll(".main-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const main = tab.dataset.main;

      document
        .querySelectorAll(".main-tab")
        .forEach(t => t.classList.remove("active"));

      tab.classList.add("active");

      document.querySelectorAll(".sub-group").forEach(g => {
        g.classList.toggle(
          "active",
          g.dataset.main === main
        );
      });

      document
        .querySelectorAll(".sub-tab, .cards-group")
        .forEach(el => el.classList.remove("active"));

      const firstSub = document.querySelector(
        `.sub-group[data-main="${main}"] .sub-tab`
      );
      const target = document.getElementById(
        firstSub?.dataset.target
      );

      firstSub?.classList.add("active");
      target?.classList.add("active");

      refreshAllCarousels();
    });
  });

  document.querySelectorAll(".sub-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const parent = tab.closest(".sub-group");
      const target = document.getElementById(
        tab.dataset.target
      );

      parent
        .querySelectorAll(".sub-tab")
        .forEach(t => t.classList.remove("active"));

      tab.classList.add("active");

      document
        .querySelectorAll(".cards-group")
        .forEach(c => c.classList.remove("active"));

      target?.classList.add("active");

      refreshAllCarousels();
    });
  });
});

/* =====================================================
   INFINITE LOGOS SCROLL (PARTNERS)
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  function setupInfiniteLogosScroll() {
    const logosWrapper =
      document.querySelector(".logos-wrapper");
    if (!logosWrapper) return;

    const col1 =
      logosWrapper.querySelector(".logos-column.col-1");
    const col2 =
      logosWrapper.querySelector(".logos-column.col-2");

    if (!col1 || !col2) return;

    if (window.innerWidth <= 768) {
      if (col1.dataset.combined !== "true") {
        const col2Images = Array.from(
          col2.querySelectorAll("img")
        );

        col2Images.forEach(img => {
          col1.appendChild(img.cloneNode(true));
        });

        const allImages = Array.from(
          col1.querySelectorAll("img")
        );

        allImages.forEach(img => {
          col1.appendChild(img.cloneNode(true));
        });

        col1.dataset.combined = "true";
      }
    } else {
      if (col1.dataset.combined === "true") {
        const allImages = Array.from(
          col1.querySelectorAll("img")
        );

        const originalCol1Count = 14;

        allImages
          .slice(originalCol1Count)
          .forEach(img => img.remove());

        col2.style.display = "";
        col1.dataset.combined = "false";
      }
    }
  }

  setupInfiniteLogosScroll();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const col1 = document.querySelector(
        ".logos-column.col-1"
      );
      if (col1) col1.dataset.combined = "false";
      setupInfiniteLogosScroll();
    }, 250);
  });
});
