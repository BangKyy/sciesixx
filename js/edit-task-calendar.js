import { getQueryOrigin } from "./lib/query-parser.js"

const select = document.querySelector.bind(document);

const displayError = async (title, message="", icon="error") => {
    await Swal.fire(title, message, icon);
};

const getFormattedDate = (value="") => {
    const values = value.split("-");
    values.reverse();
    const [dd, mm, yy] = [...values];
    const formatted = `${[mm, dd, yy].join("/")}, 00:00:00 AM`;
    return formatted;
};

const getInputDateFormat = (value) => {
    const values = value.split(",")[0].split("/");
    const validValues = values.map((value) => {
        return (value.length < 2 ? "0" : "") + value;
    });
    const formatted = `${validValues[2]}-${validValues[0]}-${validValues[1]}`;
    return formatted;
};

const enableForm = () => {
    const inputs = [
        select(".task-name-input"),
        select(".task-description-input"),
        select(".task-date-input"),
        select(".form-btn")
    ];
    inputs.forEach((input) => {
        input.removeAttribute("disabled");
    });
};

const redirectBack = () => {
    location.assign("../");
};

const getTag = () => getQueryOrigin(window, "tag");

const checkTag = (callback, errCallback) => {
    const tag = getQueryOrigin(window, "tag");
    tag ? callback(tag) : errCallback();
};

const checkTask = async (tag, callback, errCallback) => {
    const task = await getTask(tag);
    if (task) return callback(task);
    errCallback(new Error("Data tidak ditemukan"));
};

const getTask = async (tag) => {
    try {
        const rawTask = await fetch(`../../../rest/calendar-task.php?key=tag&value=${tag}`);
        const task = await rawTask.json();
        if (!task) throw new Error("Error");
        console.log(task)
        return task;
    } catch (err) {
        console.log(err);
        return null;
    }
}

const sendUpdatedForm = async (payload={}) => {
    const rawResponse = await fetch("../../../rest/calendar-task.php", {
        method: "PATCH",
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
            getTag(),
            getFormattedDate(select(".task-date-input").value)
        ];
        const sendFormResponse = await sendUpdatedForm({ name, description, tag, date });
        if (sendFormResponse?.error === true) throw new Error("Telah terjadi kesalahan dalam mengirim data");
        redirectBack();
    } catch (err) {
        console.error(err);
        await displayError("Error", err.message);
    }
};

const fillForm = (task) => {
    const nameInput = select(".task-name-input");
    const descriptionInput = select(".task-description-input");
    const dateInput = select(".task-date-input");
    
    nameInput.value = task.name;
    descriptionInput.value = task.description;
    dateInput.value = getInputDateFormat(task.date);
};

const initSubmitEvent = () => {
    const form = select(".form");
    form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        submitForm();
    });
};

const initForm = () => {
    checkTag((tag) => {
        checkTask(tag, (task) => {
            fillForm(task);
            enableForm();
            initSubmitEvent();
        }, async (err) => {
            await displayError("Error", err.message);
            redirectBack();
        });
    }, () => {
        redirectBack();
    });
};

window.addEventListener("load", () => {
    initForm();
});