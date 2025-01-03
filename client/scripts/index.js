function form(element, method) {
    try {
        element.addEventListener("submit", e => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            fetch(e.target.action, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Success:", data);
            })
            .catch(error => {
                alert(`Request failed: ${error.message}`);
            });
        });
    } catch (error) {
        alert(error.message);
    }
}