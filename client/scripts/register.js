document.addEventListener("DOMContentLoaded", () => {
    const signup_form = document.getElementById("signup-id");

    signup_form.addEventListener("submit", async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());

            let response = await fetch(`/users/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                window.location = "/login";
            }
        } catch (err) {
            console.error(err);
        }
    });
});