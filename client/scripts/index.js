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