// Henter fra HTML til JavaScript

const taskInput = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    taskBox = document.querySelector(".task-box");

// Declare a variable called 'editId' (presumably for editing tasks).   
// Declare a variable 'isEditTask' and set it to 'false' (likely to indicate if a task is in edit mode).
// Retrieve and parse the 'todo-list' from local storage, storing the result in the 'todos' variable.

let editId,
    isEditTask = false,
    todos = JSON.parse(localStorage.getItem("todo-list"));

// The following code iterates through elements in the 'filters' array and adds event listeners to them.
// When a filter button is clicked, it performs the following actions:
// 1. Removes the "active" class from any element with the 'span' tag that currently has it.
// 2. Adds the "active" class to the clicked filter button (represented by 'btn').
// 3. Calls the 'showTodo' function with the 'id' of the clicked button as an argument to filter and display relevant todos.

filters.forEach((btn) => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    });
});

showTodo("all");

// Initialize an empty string to store the HTML for the list of tasks.
// Check if 'todos' (presumably an array of tasks) exists.
// Loop through each task in the 'todos' array, along with its index.
// Determine if the task is completed and set the 'completed' variable accordingly.
// Check if the task matches the provided filter or if 'all' tasks should be displayed.
// Create HTML for the task and add it to the 'liTag' string.
// Update the innerHTML of 'taskBox' with the generated 'liTag' content or a message if no tasks exist.
// Check the number of tasks and add or remove the 'active' class from 'clearAll' accordingly.
// Add the 'overflow' class to 'taskBox' if its height exceeds 300 pixels, or remove the class if it doesn't
 
function showTodo(filter) {
    let liTag = "";
    if (todos) {
        todos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if (filter == todo.status || filter == "all") {
                liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length
        ? clearAll.classList.remove("active")
        : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300
        ? taskBox.classList.add("overflow")
        : taskBox.classList.remove("overflow");
}

// Select the menu's container (assuming it's the last child of selectedTask)
// Add the "show" class to make the menu visible
// Add a click event listener to the document
// Check if the clicked element is not an <i> tag and is not the selectedTask
// Remove the "show" class to hide the menu

function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", (e) => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}

// Get the task name element
// Check if the task is checked (completed) or unchecked (pending)
// If checked, add the "checked" class to the task name
// Update the status of the task in the "todos" array to "completed"
// If unchecked, remove the "checked" class from the task name
// Update the status of the task in the "todos" array to "pending"
 // Store the updated "todos" array in local storage as a JSON string

 function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}

// This function is used to enable task editing by populating the input field with task text.
// Parameters:
// - taskId: The unique identifier of the task being edited.
// - textName: The text content of the task to be edited.

// Set the editId variable to the taskId, indicating which task is being edited.
// Set isEditTask to true, indicating that a task is currently being edited.
// Populate the taskInput element with the task text for editing.
// Set focus to the taskInput element, making it ready for user input.
// Add the "active" class to the taskInput element, which might trigger specific CSS styles.

function editTask(taskId, textName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
}

// The function takes two parameters: deleteId and filter.
// isEditTask is set to false. This variable is not defined in the code snippet, so it's likely a global or external variable used elsewhere in the application.
// The following line removes an item from the 'todos' array, using the 'deleteId' as the index. It removes only one item.
// The 'localStorage' API is used to store data in the browser's local storage. In this case, the 'todos' array is converted to a JSON string and stored with the key "todo-list".
// The 'showTodo' function is called, passing the 'filter' as an argument. It's likely that 'showTodo' is responsible for displaying or updating the to-do list on the user interface.

function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
}

// Set a variable 'isEditTask' to false
// Remove all elements from the 'todos' array
// Save the empty 'todos' array in local storage
// Call a function named 'showTodo'

clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo();
});

taskInput.addEventListener("keyup", (e) => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = { name: userTask, status: "pending" };
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }
});
