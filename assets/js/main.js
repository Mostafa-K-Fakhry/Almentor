document.addEventListener("DOMContentLoaded", function () {
    const scrollContainer = document.getElementById("coursesContainer");
    const leftBtn = document.getElementById("scrollLeftBtn");
    const rightBtn = document.getElementById("scrollRightBtn");

    // مقدار التمرير (عرض الكارت + المسافة بينهم)
    const scrollAmount = 300; 

    // زر التحرك لليمين (في العربي يعني السابق)
    leftBtn.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    // زر التحرك لليسار (في العربي يعني التالي)
    rightBtn.addEventListener("click", () => {
        scrollContainer.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
});