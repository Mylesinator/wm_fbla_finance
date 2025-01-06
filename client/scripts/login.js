document.addEventListener("DOMContentLoaded", async () => {
    const login_form = document.getElementById("login-id");
    try {
        login_form.addEventListener("submit", async e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            let response = await fetch(e.target.action, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            let text = await response.text();
            if (text != "User was not found!") {
                localStorage.setItem("auth", text);
                window.location = "/";
            }
        });
    } catch (error) {
        alert(error.message);
    }
});