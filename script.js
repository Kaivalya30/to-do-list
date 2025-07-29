document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearAllBtn = document.getElementById('clearAll');
    const filterBtns = document.querySelectorAll('.filter-btn');
    let currentFilter = 'all';

    // Load tasks from localStorage
    loadTasks();

    // Add task
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });

    // Filter tasks
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            filterTasks();
        });
    });

    // Clear all tasks
    clearAllBtn.addEventListener('click', clearAllTasks);

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';

        const taskSpan = document.createElement('span');
        taskSpan.className = 'task-text';
        taskSpan.textContent = taskText;

        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';

        const completeBtn = document.createElement('button');
        completeBtn.className = 'complete-btn';
        completeBtn.innerHTML = '<i class="fas fa-check"></i>';
        completeBtn.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            saveTasks();
            updateTaskCount();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.addEventListener('click', () => {
            taskItem.remove();
            saveTasks();
            updateTaskCount();
        });

        taskActions.appendChild(completeBtn);
        taskActions.appendChild(deleteBtn);
        taskItem.appendChild(taskSpan);
        taskItem.appendChild(taskActions);
        taskList.appendChild(taskItem);

        taskInput.value = '';
        saveTasks();
        updateTaskCount();
        filterTasks();
    }

    function filterTasks() {
        const tasks = document.querySelectorAll('.task-item');
        tasks.forEach(task => {
            switch(currentFilter) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'active':
                    task.style.display = task.classList.contains('completed') ? 'none' : 'flex';
                    break;
                case 'completed':
                    task.style.display = task.classList.contains('completed') ? 'flex' : 'none';
                    break;
            }
        });
    }

    function saveTasks() {
        const tasks = [];
        document.querySelectorAll('.task-item').forEach(task => {
            tasks.push({
                text: task.querySelector('.task-text').textContent,
                completed: task.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        savedTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = 'task-item';
            if (task.completed) taskItem.classList.add('completed');

            const taskSpan = document.createElement('span');
            taskSpan.className = 'task-text';
            taskSpan.textContent = task.text;

            const taskActions = document.createElement('div');
            taskActions.className = 'task-actions';

            const completeBtn = document.createElement('button');
            completeBtn.className = 'complete-btn';
            completeBtn.innerHTML = '<i class="fas fa-check"></i>';
            completeBtn.addEventListener('click', () => {
                taskItem.classList.toggle('completed');
                saveTasks();
                updateTaskCount();
                filterTasks();
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.addEventListener('click', () => {
                taskItem.remove();
                saveTasks();
                updateTaskCount();
            });

            taskActions.appendChild(completeBtn);
            taskActions.appendChild(deleteBtn);
            taskItem.appendChild(taskSpan);
            taskItem.appendChild(taskActions);
            taskList.appendChild(taskItem);
        });
        updateTaskCount();
        filterTasks();
    }

    function updateTaskCount() {
        const totalTasks = document.querySelectorAll('.task-item').length;
        const completedTasks = document.querySelectorAll('.task-item.completed').length;
        taskCount.textContent = `${completedTasks} of ${totalTasks} tasks completed`;
    }

    function clearAllTasks() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            taskList.innerHTML = '';
            localStorage.removeItem('tasks');
            updateTaskCount();
        }
    }
});