const select = document.querySelector.bind(document);

const getTaskTag = (randomNumberLength=4) => {
    const dateNowString = String(Date.now());
    const randomNumberString = Array(randomNumberLength).fill(10).map((n) => {
        return Math.floor(n * Math.random());
    }).join("");
    const tag = dateNowString + randomNumberString;
    return tag;
};

const getFormattedDate = (value="") => {
    const values = value.split("-");
    values.reverse();
    const [dd, mm, yy] = [...values];
    const formatted = `${[mm, dd, yy].join("/")}, 00:00:00 AM`;
    return formatted;
};

const displayError = async (title, message="", icon="error") => {
    await Swal.fire(title, message, icon);
};

const stayPageObj = {
    element: select(".stay-page-check"),

    get() {
        return localStorage.getItem("sciesixx-admin-calendar-add-task-stay-page-check");
    },
    
    save() {
        localStorage.setItem("sciesixx-admin-calendar-add-task-stay-page-check", "1");
    },

    delete() {
        localStorage.removeItem("sciesixx-admin-calendar-add-task-stay-page-check");
    },
    
    toggle() {
        this.get() ? this.delete() : this.save();
    },

    checkDefault() {
        this.get() ? this.check() : 0;
    },

    check() {
        this.element.setAttribute("checked", "checked");
    }
};

const handleRedirect = () => {
    const isStayInPage = !!stayPageObj.get();
    const targetUrl = isStayInPage ? "./" : "../";
    location.assign(targetUrl);
};

const sendForm = async (payload={}) => {
    const rawResponse = await fetch("../../../rest/calendar-task.php", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    });
    const response = await rawResponse.json();
    return response;
};

const submitForm = async () => {
    try {
        const [
            name,
            description,
            tag,
            date
        ] = [
            select(".task-name-input").value,
            select(".task-description-input").value,
            getTaskTag(),
            getFormattedDate(select(".task-date-input").value)
        ];
        const sendFormResponse = await sendForm({ name, description, tag, date });
        if (sendFormResponse?.error === true) throw new Error("Telah terjadi kesalahan dalam mengirim data");
        handleRedirect();
    } catch (err) {
        await displayError("Error", err.message);
    }
};

const initForm = () => {
    const form = select(".form");
    const stayPageCheck = select(".stay-page-check");
    stayPageObj.checkDefault();
    form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        submitForm();
    });
    stayPageCheck.addEventListener("click", (ev) => {
        stayPageObj.toggle();
    });
};

window.addEventListener("load", () => {
    initForm();
});