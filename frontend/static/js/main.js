function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');


function addTask(task) {
    const wrapper = document.querySelector('#list-wrapper');
    
    let title = `<span class="title" id="title-${task.id}">${task.title}</span>`
    if (task.isCompleted) {
        title = `<span class="title crossed" id="title-${task.id}">${task.title}</span>`
    }
    
    let item = `<div data-id="${task.id}" class="task-wrapper flex-wrapper">
                    <div style="flex: 7">
                        ${title}
                    </div>
                    <div style="flex: 1">
                        <button data-action="edit" class="btn btn-sm btn-outline-info">Edit</button>
                    </div>
                    <div style="flex: 1">
                        <button data-action="delete" class="btn btn-sm btn-outline-dark">Delete</button>
                    </div>

                </div>`;
    wrapper.insertAdjacentHTML('afterbegin', item);
}

async function fillList() {
    let url = '/api/task-list/';
    let response = await fetch(url);
    let taskList = await response.json();
    for (let task of taskList) {
        addTask(task);
    }
}
fillList()


let editingTask = null;
document.querySelector('#form-wrapper').addEventListener('submit', function(e) {
    e.preventDefault();
    
    let url = 'api/task-create/';

    let title = document.getElementById('title').value;
    let newTask = {title, isCompleted: false};

    if (editingTask) {
        url = `api/task-update/${editingTask.id}/`;
        newTask.title = document.getElementById('title').value;
        document.querySelector(`#title-${editingTask.id}`).textContent = newTask.title;
    }

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(newTask)
    })
    .then(function(r) {
        if (!editingTask) {
            addTask(newTask);
        } else {
            editingTask = null;
        }
    })
    document.getElementById('form').reset();
})


function deleteTask(row, id) {
    let url = `/api/task-delete/${id}/`;
    
    fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: id,
    });
    row.remove();
}

function editTask(row, id) {
    let url = `api/task-detail/${id}/`;

    fetch(url)
    .then(response => response.json())
    .then(data => {
        document.querySelector('#title').value = data.title;
        editingTask = data;
    });
}

function toggleCompletion(clickedSpan, task) {

    let url = `api/task-update/${task.id}/`;
    clickedSpan.classList.toggle('crossed');
    
    task.isCompleted = !task.isCompleted;
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(task)
    });
}

document.querySelector('#list-wrapper').addEventListener('click', function(e) {
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'SPAN') return;

    let row = e.target.closest('div[data-id]');
    let taskId = row.dataset.id;
    if (!taskId) return;

    if (e.target.tagName === 'BUTTON'){

        if (e.target.dataset.action === 'delete') {
            deleteTask(row, taskId);
        } else if (e.target.dataset.action === 'edit') {
            editTask(row, taskId);
        }

    } else if (e.target.tagName === 'SPAN') {
        let clickedSpan = e.target;
        let url = `api/task-detail/${taskId}/`;
        fetch(url)
        .then(response => response.json())
        .then(task => {
            toggleCompletion(clickedSpan, task);
        });

    }
})
