document.addEventListener("DOMContentLoaded", function () {
    // 1. تعريف العناصر
    const track = document.getElementById("track");
    const btnNext = document.getElementById("btnNext");
    const btnPrev = document.getElementById("btnPrev");

    if (!track || !btnNext || !btnPrev) return;

    let currentPosition = 0;

    function moveSlider(direction) {
        // 2. حساب العرض والمسافات
        const cardItem = document.querySelector(".course-item");
        if (!cardItem) return;

        const cardWidth = cardItem.offsetWidth;
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 20; 
        const moveAmount = cardWidth + gap;

        // 3. حساب الحدود
        const maxScroll = track.scrollWidth - track.parentElement.offsetWidth;

        // 4. منطق الحركة (Loop Logic)
        if (direction === "next") {
            // --- زر التالي ---
            
            // تحقق: هل نحن وصلنا للنهاية بالفعل؟ (نستخدم هامش خطأ بسيط 5px للدقة)
            if (currentPosition >= maxScroll - 5) {
                // نعم، وصلنا للنهاية -> ارجع للبداية (Loop to Start)
                currentPosition = 0;
            } else {
                // لا، لسه موصلناش -> كمل حركة عادي
                currentPosition += moveAmount;

                // لو الحركة دي عدت الحد الأقصى، نثبت عند الحد الأقصى
                if (currentPosition > maxScroll) {
                    currentPosition = maxScroll;
                }
            }

        } else {
            // --- زر السابق ---

            // تحقق: هل نحن في البداية بالفعل؟
            if (currentPosition <= 0 + 5) {
                // نعم، نحن في البداية -> اذهب للنهاية (Loop to End)
                currentPosition = maxScroll;
            } else {
                // لا، لسه موصلناش -> ارجع لورا عادي
                currentPosition -= moveAmount;

                // لو الحركة دي قلت عن الصفر، نثبت عند الصفر
                if (currentPosition < 0) {
                    currentPosition = 0;
                }
            }
        }

        // 5. تطبيق الحركة
        track.style.transform = `translateX(${currentPosition}px)`;
    }

    // ربط الأزرار
    btnNext.addEventListener("click", () => moveSlider("next"));
    btnPrev.addEventListener("click", () => moveSlider("prev"));

    // إعادة الضبط عند تغيير حجم الشاشة
    window.addEventListener("resize", () => {
        currentPosition = 0;
        track.style.transform = `translateX(0px)`;
    });
});
