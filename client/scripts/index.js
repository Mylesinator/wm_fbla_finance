async function form(element, method) {
    let response;
    try {
        element.addEventListener("submit", async e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            response = await fetch(e.target.action, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
        });
        return response;
    } catch (error) {
        alert(error.message);
    }
}