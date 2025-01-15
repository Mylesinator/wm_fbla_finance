// send users back to the home page if they're not logged in
if (!localStorage.getItem("auth")) {
    window.location = "/"
}

function userLogout() {
    localStorage.removeItem("auth");
    window.location = "/";
}

// render certain elements if the user is logged in
async function renderAccountElements() {
    const auth = localStorage.getItem("auth");

    if (auth) {
        const accountNameDisplay = document.getElementById("account-name-display");
        const accountEmailDisplay = document.getElementById("account-email-display");

        try {
            const response = await fetch(`/users/auth-user/${auth}`);

            if (response.ok) {
                const user = await response.json();

                accountNameDisplay.textContent = `Username: ${user.username}`;
                accountEmailDisplay.textContent = `Email: ${user.email}`;
            }
        } catch (err) {
            console.error(err);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderAccountElements();

    const sectionButtons = document.querySelectorAll(".section-button");

    sectionButtons.forEach(btn => {
        // content switcher for account details & input forms
        // will definitely try to simplify later on
        btn.addEventListener("click", () => {
            const value = btn.getAttribute("value");

            const profile = document.querySelector(".account-profile");
            const forms = document.querySelector(".input-forms");
            const profileBtn = document.getElementById("profile-button");
            const formsBtn = document.getElementById("input-forms-button");

            switch (value) {
                case "profile":
                    btn.classList.toggle("selected-section");
                    profile.classList.toggle("hidden");
                    forms.classList.toggle("hidden");
                    formsBtn.classList.toggle("selected-section");
                    break;
                case "forms":
                    btn.classList.toggle("selected-section");
                    forms.classList.toggle("hidden");
                    profile.classList.toggle("hidden");
                    profileBtn.classList.toggle("selected-section");
                    break;
            }
        });
    });

    // form stuff below

    // probably could simplify this heavily or just remove it entirely
    // but for the most part i just did it so it wouldn't refresh the page

    const incomeForm = document.getElementById("addIncomeForm");
    const expenseForm = document.getElementById("addExpenseForm");

    incomeForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            let response = await fetch(`/users/deposit/${localStorage.getItem("auth")}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        } catch (err) {
            console.error(err);
        }
    });

    expenseForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            let response = await fetch(`/users/submit-expense/${localStorage.getItem("auth")}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        } catch (err) {
            console.error(err);
        }
    });
});