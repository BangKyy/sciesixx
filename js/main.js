import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";
import { UpArrow } from "./partials/float.js";

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

const responsiveIdentificationImg = () => {
    const img = document.querySelector(".identification-image");
    const width = window.innerWidth;
    const imgUrls = ["./images/identification-3.jpg", "./images/identification-2.jpg"];
    const sizes = [0, 992];
    const imgUrlsIndex = sizes.filter((size) => size <= width).length - 1;
    const url = imgUrls[imgUrlsIndex];
    img.src = url;
};

const initTyped = () => {
    const typed = new Typed(".h1-typed", {
        // Words here
        strings: ["kreatif", "inovatif", "ceria", "damai"],
        typeSpeed: 75,
        loop: true,
        backSpeed: 50
    });
};

formBtn.addEventListener("click", submitForm);
window.addEventListener("scroll", () => {
    nav.changeNavColor(document, window.scrollY);
    nav.toggleNavShadow(document, window.scrollY);
});
window.addEventListener("resize", () => {
    responsiveIdentificationImg();
});
window.addEventListener("load", () => {
    generateDynamicSiteName();
    initTyped();
    nav.initSidebar();
    nav.initSidebarArrow();
    nav.checkUsername();
    nav.toggleSignBtn(document);
    nav.toggleSignBtn(document, ".sign-button-list");
    footer.generateDynamicCopyrightYear(document);
    footer.updateSocmedUrl(document);
    responsiveIdentificationImg();
    new UpArrow(".up-arrow-container").init();
});