async function form(element, method) {
    try {
        element.addEventListener("submit", async e => {
            e.preventDefault();

            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            fetch(e.target.action, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        });
    } catch (error) {
        alert(error.message);
    }
}

async function renderUserElements() {
    const auth = localStorage.getItem("auth");

    if (auth) {
        const userInfo = document.getElementById("user-info");
        const userLinks = document.getElementById("user-links");
        const financesLink = document.getElementById("finances-link");
        const nameDisplay = document.getElementById("name-display");
        const accountNameDisplay = document.getElementById("account-name-display");

        try {
            const response = await fetch(`/users/auth-user/${auth}`);

            if (response.ok) {
                const user = await response.json();
                sessionStorage.setItem('username', user.username);

                userLinks.classList.add("hidden");
                financesLink.classList.remove("hidden");
                userInfo.classList.remove("hidden");
                nameDisplay.textContent = user.username;
                accountNameDisplay ? accountNameDisplay.textContent = user.username : null;
            }
        } catch (err) {
            console.error(err);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderUserElements();
});
