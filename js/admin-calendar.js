const select = document.querySelector.bind(document);

const getRowElement = (task, number) => {
    return `
        <tr>
            <th scope="row">${number}</th>
            <td>${task.name}</td>
            <td>${task.description}</td>
            <td>${task.date}</td>
            <td>
                <a href="" class="update-btn btn btn-warning">Edit</a>
                <a href="./delete-task/?tag=${task.tag}" class="delete-btn btn btn-danger">Hapus</a>
            </td>
        </tr>
    `;
};

const getTableElement = (tasks=[]) => {
    return tasks.map((task, i) => getRowElement(task, i + 1)).join("");
};

const getTasks = async () => {
    const rawTasks = await fetch("../../rest/calendar-task.php");
    const tasks = await rawTasks.json();
    return tasks;
};

const displayTasks = async () => {
    const tbody = select("tbody");
    const tasks = await getTasks();
    const tableElementString = getTableElement(tasks);
    tbody.innerHTML = tableElementString;
};

window.addEventListener("load", () => {
    displayTasks();
    console.log(document.querySelector(".delete-btn").value)
});