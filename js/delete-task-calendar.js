import { getQueryOrigin } from "./lib/query-parser.js";

const checkTag = (callback, errCallback) => {
    const tag = getQueryOrigin(window, "tag");
    !!tag ? callback(tag) : errCallback();
};

const redirectBack = () => {
    location.assign("../");
};

const deleteTask = async (tag) => {
    const payload = { key: "tag", value: tag };
    const rawResponse = await fetch("../../../rest/delete-calendar-task.php", {
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

const handleDeletion = async (tag) => {
    try {
        if (!confirm("Ingin menghapus 1 data?")) return redirectBack();
        const deleteTaskResponse = await deleteTask(tag);
        if (deleteTaskResponse?.error === true) throw new Error("Telah terjadi kesalahan dalam menghapus data");
        redirectBack();
    } catch (err) {
        alert(err.message);
        redirectBack();
    }
};

window.addEventListener("load", () => {
    checkTag((tag) => {
        handleDeletion(tag);
    }, () => {
        redirectBack();
    });
});