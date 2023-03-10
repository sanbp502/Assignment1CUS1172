let tasks = []; //array for tasks

document.addEventListener("DOMContentLoaded", function() { //dom loaded function
    document.querySelector("#add-task").onclick = function(event) { //function when button add task is clicked
        event.preventDefault(); //stop form from refreshing page
        const list = document.createElement('li'); //create list element for ul
        const priority = document.querySelector('#priority').value; //get priority
        let task = document.querySelector('#task').value; //get task
        tasks.push({task: task, priority: priority, status: "pending"}); //put task and priority in array and default status to pending
        console.log(tasks);
        renderTasks();
    }
});

function renderTasks() {
    const list = document.querySelector('#list');
    list.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        const task_status = task.status || "pending"; //create task status constant. Defaults to pending
        li.innerHTML = `
            <span class="task-priority">${task.priority}</span>
            <span class="task-name task-name-${index} ${task_status}">${task.task}</span> //add status to task in class name
            <div class="buttons">
            <button class="done" data-index="${index}">Done</button>
            <button class="remove" data-index="${index}">Remove</button>
            </div>
        `;
        li.classList.add('task-${index}')
        list.appendChild(li); //add list element to array and display in html
    });
    doneButton(); //run functions for remove and done buttons
    removeButtons();
}

function removeButtons() {
    const removeButtons = document.querySelectorAll('.remove');
    removeButtons.forEach((button) => { //for each task there is a remove button
        button.onclick = function(event) {
            const index = parseInt(event.target.dataset.index); //get task index
            tasks.splice(index, 1); //splice to take element out of array
            renderTasks(); //render tasks again to update list
        };
    });
}

function doneButton() {
    const doneButton = document.querySelectorAll('.done');
    doneButton.forEach((button) => { //for each task there is a done button
        button.onclick = function(event) {
            const index = parseInt(event.target.dataset.index); //get task index
            const taskElement = document.querySelector('.task-name-' + index); //get task element wiht index
            taskElement.style.textDecoration = 'line-through';
            taskElement.style.color = 'gray'; //change styling programatically
            tasks[index].status = "completed"; //modify status to conserve styling when tasks are redered again
        };
    });
}