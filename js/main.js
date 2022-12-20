import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";

const formBtn = document.querySelector("#send");

const sendForm = async (name, email, message, date=Date()) => {
    const payload = { name, email, message, date };
    const rawData = await fetch("./rest/contact.php", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const data = await rawData.json();
    return data;
};

const submitForm = async () => {
    const select = document.querySelector.bind(document);
    const [ name, email, message ] = [
        select("#name").value,
        select("#email").value,
        select("#msg").value
    ];

    formBtn.removeEventListener("click", submitForm);
    formBtn.innerHTML = `
        <span class="form-spinner container spinner-border text-white" role="status">
            <span class="visually-hidden">Loading...</span>
        </span>
    `;

    try {
        if (!(name.trim() && email.trim() && message.trim())) throw new Error("Semua input wajib diisi!");
        const resData = await sendForm(name, email, message);
        if (resData?.error) throw new Error("Telah terjadi kesalahan");
        await Swal.fire({
            title: "Sukses!",
            text: "Pesan telah berhasil dikirimkan!",
            icon: "success"
        });
        window.location.reload();
    } catch (err) {
        await Swal.fire({
            title: "Gagal!",
            text: err.message,
            icon: "error"
        });
        formBtn.addEventListener("click", submitForm);
        formBtn.innerHTML = "Kirim";
    }
};

formBtn.addEventListener("click", submitForm);
window.addEventListener("scroll", () => {
    nav.changeNavColor(document, window.scrollY);
    nav.toggleNavShadow(document, window.scrollY);
});
window.addEventListener("load", () => {
    nav.initSidebar();
    nav.toggleSignBtn(document);
    footer.generateDynamicCopyrightYear(document);
    footer.updateSocmedUrl(document);
});