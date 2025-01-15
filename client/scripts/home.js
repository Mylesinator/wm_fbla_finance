document.addEventListener("DOMContentLoaded", () => {
    const homeBtn = document.getElementById("home-page-btn");
    const contentText = document.getElementById("content-text");

    homeBtn.addEventListener("click", () => {
        window.location = homeBtn.getAttribute("value");
    });

    if (localStorage.getItem("auth")) {
        contentText.textContent = `Welcome back, ${sessionStorage.getItem("username")}.`;
        homeBtn.textContent = "See finances";
        homeBtn.setAttribute("value", "/finance");
    }
});