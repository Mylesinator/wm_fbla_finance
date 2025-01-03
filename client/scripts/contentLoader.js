async function getPageHtml(path) {
    try {
        const response = await fetch(path);
        const htmlString = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, "text/html");

        return doc.body.innerHTML;
    } catch (error) {
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const main = document.querySelector("main");
    const linkBtns = document.querySelectorAll(".link-button");

    main.innerHTML = await getPageHtml(`pages/home.html`);

    linkBtns.forEach(btn => {
        btn.addEventListener("click", async () => {
            main.innerHTML = await getPageHtml(`pages${btn.getAttribute("location")}.html`);
        });
    });
});