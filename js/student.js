import * as nav from "./partials/navbar.js";
import * as footer from "./partials/footer.js";
import { generateDynamicSiteName } from "./utils/site-name.js";
import { UpArrow } from "./partials/float.js";

const searchInput = document.querySelector(".search-input");

const calcAge = (dateString) => {
    if (!dateString) return "(?)";
    const currentDate = new Date();
    const birthDate = new Date(dateString);
    const tempAge = currentDate.getTime() - birthDate.getTime();
    const age = new Date(tempAge).getFullYear() - 1970;
    return age;
};

const getStudentElement = (student) => `
    <div class="student-subcontainer-1">
        <div class="student-photo-container">
            <img src="../../images/${student.photo}" alt="" class="student-photo">
        </div>
    </div>
    <div class="student-subcontainer-all">
        <div class="student-subcontainer-2">
            <h4 class="student-name">${student.name}</h4>
            <div class="student-nis">${student.nis}</div>
        </div>
        <div class="student-subcontainer-3">
            <div class="student-religion">Agama: ${student.religion}</div>
            <div class="student-age">Umur: <span class="student-age-dynamic">${calcAge(student.birthday)}</span> tahun</div>
            <div class="student-hobby">Hobi: ${student.hobby}</div>
        </div>
        <div class="student-line"></div>
        <div class="student-subcontainer-5">
            <div class="student-socmed-container">
                <a href="https://instagram.com/${student.instagram}" class="student-socmed-link">
                    <i class="student-socmed-icon bi bi-instagram"></i>
                </a>
            </div>
            <div class="student-socmed-container">
                ${student.tiktok ?
                `<a href="https://tiktok.com/@${student.tiktok}" class="student-socmed-link">
                    <i class="student-socmed-icon bi bi-tiktok"></i>
                </a>` : ""
                }
            </div>
        </div>
    </div>
`;

const getStudents = async () => {
    const rawData = await fetch("../../rest/student.php");
    const data = await rawData.json();
    return data;
};

const getSearchedStudents = async (value) => {
    const rawData = await fetch(`../../rest/search-student.php?key=name&value=${value}`);
    const data = await rawData.json();
    return data;
};

const insertStudentData = (value) => {
    const container = document.querySelector(".student-grid-container");
    container.innerHTML = value;
};

const displayStudents = async () => {
    const students = await getStudents();
    const studentElementString = students.map((student) => {
        return `
            <div class="student" data-aos="fade-up">
                ${getStudentElement(student)}
            </div>
        `;
    }).join("");
    insertStudentData(studentElementString);
};

const displaySearchedStudents = async () => {
    const container = document.querySelector(".student-grid-container");
    const value = searchInput.value;
    const students = await getSearchedStudents(value);
    const studentElements = students.map((student) => {
        return `
            <div class="student" data-aos="fade-up">
                ${getStudentElement(student)}
            </div>
        `;
    });
    container.innerHTML = studentElements.join("");
};

searchInput.addEventListener("keyup", () => {
    displaySearchedStudents();
});

window.addEventListener("scroll", () => {
    nav.toggleNavShadow(document, window.scrollY);
});

window.addEventListener("load", () => {
    displayStudents();
    generateDynamicSiteName("../../json/config.json");
    nav.initSidebar();
    nav.initSidebarArrow();
    nav.toggleSignBtn(document, null, "../../logout");
    nav.toggleSignBtn(document, ".sign-button-list", "../../logout");
    nav.checkUsername();
    footer.generateDynamicCopyrightYear(document);
    footer.updateSocmedUrl(document, "../../json/social-media.json");
    new UpArrow(".up-arrow-container").init();
});