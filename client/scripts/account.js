document.addEventListener("DOMContentLoaded", () => {
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