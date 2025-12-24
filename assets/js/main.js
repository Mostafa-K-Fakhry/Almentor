document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("track");
  const btnNext = document.getElementById("btnNext");
  const btnPrev = document.getElementById("btnPrev");

  if (!track || !btnNext || !btnPrev) return;

  const visibleCards = 3; // عدد الكروت الظاهرة
  const gap = 20;

  let items = Array.from(track.children);

  // ===== 1) Clone =====
  const firstClones = items.slice(0, visibleCards).map(el => el.cloneNode(true));
  const lastClones = items.slice(-visibleCards).map(el => el.cloneNode(true));

  firstClones.forEach(clone => track.appendChild(clone));
  lastClones.reverse().forEach(clone => track.insertBefore(clone, track.firstChild));

  items = Array.from(track.children);

  // ===== 2) حساب المقاسات =====
  let cardWidth = items[visibleCards].offsetWidth;
  let moveAmount = cardWidth + gap;

  let index = visibleCards;

  // نبدأ من أول عنصر حقيقي
  track.style.transform = `translateX(${index * moveAmount}px)`;

  function move(animated = true) {
    track.style.transition = animated ? "transform 0.5s ease" : "none";
    track.style.transform = `translateX(${index * moveAmount}px)`;
  }

  // ===== 3) Next =====
  btnNext.addEventListener("click", () => {
    index++;
    move(true);

    if (index === items.length - visibleCards) {
      setTimeout(() => {
        index = visibleCards;
        move(false);
      }, 500);
    }
  });

  // ===== 4) Prev =====
  btnPrev.addEventListener("click", () => {
    index--;
    move(true);

    if (index === 0) {
      setTimeout(() => {
        index = items.length - visibleCards * 2;
        move(false);
      }, 500);
    }
  });

  // ===== 5) Resize =====
  window.addEventListener("resize", () => {
    cardWidth = items[visibleCards].offsetWidth;
    moveAmount = cardWidth + gap;
    move(false);
  });
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// تفعيل أزرار الفئات الفرعية عند الضغط عليها
// ================= Tabs =================
$(function () {

  /* ========== INIT DEFAULT ========== */
  function initDefault() {
    $(".main-tab, .sub-tab, .sub-group, .cards-group").removeClass("active");

    const $main = $('.main-tab[data-main="popular"]');
    const $group = $('.sub-group[data-main="popular"]');
    const $sub = $group.find(".sub-tab").first();
    const $cards = $("#" + $sub.data("target"));

    $main.addClass("active");
    $group.addClass("active");
    $sub.addClass("active");
    $cards.addClass("active");

    initCarousel($cards);
    refreshCarousel($cards);
  }

  initDefault();

  /* ========== MAIN TABS ========== */
  $(".main-tab").on("click", function () {
    const main = $(this).data("main");

    $(".main-tab").removeClass("active");
    $(this).addClass("active");

    $(".sub-group").removeClass("active")
      .filter(`[data-main="${main}"]`).addClass("active");

    $(".sub-tab").removeClass("active");
    $(".cards-group").removeClass("active");

    const $firstSub = $(`.sub-group[data-main="${main}"] .sub-tab`).first();
    const $target = $("#" + $firstSub.data("target"));

    $firstSub.addClass("active");
    $target.addClass("active");

    initCarousel($target);
    refreshCarousel($target);
  });

  /* ========== SUB TABS ========== */
  $(".sub-tab").on("click", function () {
    const $parent = $(this).closest(".sub-group");
    const $target = $("#" + $(this).data("target"));

    $parent.find(".sub-tab").removeClass("active");
    $(this).addClass("active");

    $(".cards-group").removeClass("active");
    $target.addClass("active");

    initCarousel($target);
    refreshCarousel($target);
  });

});


/* ========== CAROUSEL CORE ========== */
function initCarousel($wrapper) {

  if ($wrapper.data("init")) return;

  const $track = $wrapper.find(".carousel-track");
  const $next = $wrapper.find(".btn-next");
  const $prev = $wrapper.find(".btn-prev");

  const visible = 3, gap = 20;
  let $items = $track.children();

  if ($items.length <= visible) return;

  $items.slice(0, visible).clone().appendTo($track);
  $items.slice(-visible).clone().prependTo($track);

  $items = $track.children();
  let index = visible;
  let moveAmount = 0;

  function calc() {
    const w = $items.eq(visible).outerWidth();
    moveAmount = w + gap;
    $track.css({ transition: "none", transform: `translateX(${index * moveAmount}px)` });
  }

  calc();

  function move(anim = true) {
    $track.css({
      transition: anim ? "transform .5s ease" : "none",
      transform: `translateX(${index * moveAmount}px)`
    });
  }

  $next.on("click", () => {
    index++;
    move(true);
    if (index === $items.length - visible) {
      setTimeout(() => { index = visible; move(false); }, 500);
    }
  });

  $prev.on("click", () => {
    index--;
    move(true);
    if (index === 0) {
      setTimeout(() => {
        index = $items.length - visible * 2;
        move(false);
      }, 500);
    }
  });

  $(window).on("resize", calc);

  $wrapper.data("init", true);
}


/* ========== REFRESH ON SHOW ========== */
function refreshCarousel($wrapper) {
  const $track = $wrapper.find(".carousel-track");
  const $items = $track.children();
  if ($items.length < 4) return;

  requestAnimationFrame(() => {
    const w = $items.eq(3).outerWidth();
    $track.css({
      transition: "none",
      transform: `translateX(${3 * (w + 20)}px)`
    });
  });
}

