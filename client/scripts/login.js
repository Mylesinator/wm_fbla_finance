document.addEventListener("DOMContentLoaded", async () => {
    const login_form = document.getElementById("login-id");
    let result = await form(login_form, "POST");
    result?.then(data => {
        console.log(data);
    })
});