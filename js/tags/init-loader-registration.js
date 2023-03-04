(() => {
    const select = document.querySelector.bind(document);
    const loaderContainer = select(".loader-container");
    const loaderElementString = `
        <div class="loader-container">
            <div class="loader spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;
    loaderContainer.innerHTML = loaderElementString;
})();