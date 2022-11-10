const form = document.querySelector(".form");

const displayErrors = (errors) => {
    const errorContainer = document.querySelector(".error-container");
    const errorList = `
        <ul style="list-style-type:none;" class="mt-0 mb-0 pt-0 pb-0">
            ${errors.map((error) => `
                <li class="pt-0 pb-0 mt-0 mb-0">
                    <span class="text-danger pt-0 pb-0 mt-0 mb-0">*${error}</span>
                </li>`
            ).join("")}
        </ul>
    `;
    const errorElement = `
        <div style="max-width:500px;" class="container-sm d-flex align-items-center alert alert-danger pt-2 pb-2" role="alert">
            ${errorList}
        </div>
    `;

    errorContainer.innerHTML = errorElement;
};

const sendUserData = async () => {
    const select = (selector) => document.querySelector(selector);
    const [email, password] = [
        select("#email-input").value,
        select("#password-input").value
    ];
    const payload = { email, password };
    const rawResponse = await fetch("../rest/login.php", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const response = await rawResponse.json();
    const { errorMessages } = response;

    if (!errorMessages.length) return location.reload();
    console.log(errorMessages);
    displayErrors(errorMessages);
};

form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    sendUserData();
});