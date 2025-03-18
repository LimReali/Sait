// Временные слоты с объединением времени
const timeSlots = [
    ["08:20", "09:55"],
    ["10:05", "11:40"],
    ["12:05", "13:40"],
    ["13:55", "15:30"],
    ["15:40", "17:15"],
    ["17:25", "19:00"],
    ["19:10", "20:45"]
];

// Функция для загрузки данных из JSON
function loadData() {
    return fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка загрузки файла data.json');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Ошибка при загрузке данных:', error);
            return []; // Возвращаем пустой массив в случае ошибки
        });
}

// Функция для нормализации формата времени
function normalizeTimeFormat(time) {
    return time.replace(/\./g, ":");
}

// Функция для скачивания файла
function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

// Функция для сохранения данных с помощью скачивания
function saveDataAndDownload(data) {
    const json = JSON.stringify(data, null, 4);
    download('data.json', json);
}

// Функция для заполнения основной таблицы расписания
function populateTable(data) {
    const scheduleTableBody = document.getElementById("scheduleTable").getElementsByTagName("tbody")[0];
    scheduleTableBody.innerHTML = "";

    timeSlots.forEach((slot) => {
        const row = scheduleTableBody.insertRow();
        const time = `${slot[0]} - ${slot[1]}`;

        row.insertCell(0).innerText = time;

        ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"].forEach(day => {
            const cell = row.insertCell();
            const entry = data.find(item => normalizeTimeFormat(item.time) === time && item.day === day);

            if (entry) {
                cell.innerText = `${entry.teacher}\n${entry.group}\n${entry.room}`;
                cell.style.whiteSpace = 'pre-wrap';
            }
        });
    });
}

// Функция для заполнения таблицы редактирования
function populateEditTable(data) {
    const editTableBody = document.getElementById("editTable").getElementsByTagName("tbody")[0];
    editTableBody.innerHTML = "";

    timeSlots.forEach((slot) => {
        const row = editTableBody.insertRow();
        const time = `${slot[0]} - ${slot[1]}`;

        row.insertCell(0).innerText = time;

        ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"].forEach(day => {
            const cell = row.insertCell();
            const entry = data.find(item => normalizeTimeFormat(item.time) === time && item.day === day);

            if (entry) {
                cell.contentEditable = true;
                const contentDiv = document.createElement('div');
                contentDiv.contentEditable = true;
                contentDiv.innerText = `${entry.teacher}\n${entry.group}\n${entry.room}`;
                contentDiv.style.whiteSpace = 'pre-wrap';
                cell.appendChild(contentDiv);

                // Добавляем кнопку удаления
                addDeleteButton(cell, time, day);
            } else {
                cell.contentEditable = true;
                cell.innerText = '';
            }
        });
    });
}

// Функция для заполнения таблицы преподавателей
function populateTeacherTable(data) {
    const teacherTableBody = document.getElementById("teacherTable").getElementsByTagName("tbody")[0];
    teacherTableBody.innerHTML = "";

    data.forEach(item => {
        const row = teacherTableBody.insertRow();
        row.insertCell(0).innerText = item.teacher;
        row.insertCell(1).innerText = item.time;
        row.insertCell(2).innerText = item.day;
        row.insertCell(3).innerText = item.group;
        row.insertCell(4).innerText = item.room;
        row.insertCell(5).innerText = item.subject;

        // Добавляем кнопку удаления
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.onclick = function () {
            data = data.filter(i => !(i.time === item.time && i.day === item.day));
            populateTeacherTable(data);
            populateTable(data);
            populateEditTable(data);
            saveDataAndDownload(data);
        };
        row.insertCell(6).appendChild(deleteButton);
    });
}

// Функция для заполнения таблицы расписания по кабинету
function populateRoomTable(data, selectedRoom) {
    const roomTableBody = document.getElementById("roomTable").getElementsByTagName("tbody")[0];
    roomTableBody.innerHTML = "";

    timeSlots.forEach((slot) => {
        const row = roomTableBody.insertRow();
        const time = `${slot[0]} - ${slot[1]}`;

        row.insertCell(0).innerText = time;

        ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"].forEach(day => {
            const cell = row.insertCell();
            const entry = data.find(item => normalizeTimeFormat(item.time) === time && item.day === day && item.room === selectedRoom);

            if (entry) {
                cell.innerText = `${entry.teacher}\n${entry.group}\n${entry.subject}`;
                cell.style.whiteSpace = 'pre-wrap';
            }
        });
    });
}

// Функция для заполнения редактируемой таблицы расписания по кабинету
function populateEditRoomEditTable(data, selectedRoom) {
    const editRoomEditTableBody = document.getElementById("editRoomEditTable").getElementsByTagName("tbody")[0];
    editRoomEditTableBody.innerHTML = "";

    timeSlots.forEach((slot) => {
        const row = editRoomEditTableBody.insertRow();
        const time = `${slot[0]} - ${slot[1]}`;

        row.insertCell(0).innerText = time;

        ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"].forEach(day => {
            const cell = row.insertCell();
            const entry = data.find(item => normalizeTimeFormat(item.time) === time && item.day === day && item.room === selectedRoom);

            if (entry) {
                const contentDiv = document.createElement('div');
                contentDiv.contentEditable = true;
                contentDiv.innerText = `${entry.teacher}\n${entry.group}\n${entry.subject}`;
                contentDiv.style.whiteSpace = 'pre-wrap';
                cell.appendChild(contentDiv);

                // Добавляем кнопку удаления
                addDeleteButton(cell, time, day);
            } else {
                cell.contentEditable = true;
                cell.innerText = '';
            }
        });
    });
}


// Функция для добавления кнопки удаления в ячейку
function addDeleteButton(cell, time, day) {
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Удалить';
    deleteButton.style.float = 'right';
    deleteButton.onclick = function () {
        data = data.filter(item => !(normalizeTimeFormat(item.time) === time && item.day === day));

        // Очищаем ячейку
        cell.innerHTML = '';

        // Обновляем таблицы
        populateTable(data);
        populateEditTable(data);
        populateTeacherTable(data);
        populateRoomTable(data, document.getElementById('roomSelect').value);
        populateEditRoomEditTable(data, document.getElementById('editRoomSelect').value);

        // Сохраняем обновлённые данные
        saveDataAndDownload(data);
    };

    // Создаём div для содержимого ячейки и кнопки
    const contentDiv = document.createElement('div');
    contentDiv.style.float = 'left';

    if (cell.children.length > 0) {
        // Если ячейка уже содержит текст, добавляем его в div
        contentDiv.innerText = cell.innerText;
        cell.innerText = ''; // Очищаем ячейку
    }

    cell.appendChild(contentDiv);
    cell.appendChild(deleteButton);
}





document.addEventListener('DOMContentLoaded', function () {
    let data = [];

    loadData().then(loadedData => {
        data = loadedData;

        // Заполняем таблицы после загрузки данных
        populateTable(data);
        populateEditTable(data);
        populateTeacherTable(data);

        // Получаем уникальные кабинеты из данных
        const uniqueRooms = [...new Set(data.map(item => item.room))];

        // Заполняем список выбора кабинетов для расписания
        const roomSelect = document.getElementById("roomSelect");
        uniqueRooms.forEach(room => {
            const option = document.createElement("option");
            option.value = room;
            option.text = room;
            roomSelect.add(option);
        });

        // Обработчик изменения выбора кабинета для расписания
        roomSelect.addEventListener("change", function () {
            const selectedRoom = this.value;
            populateRoomTable(data, selectedRoom);
        });

        // Заполняем таблицу расписания по кабинетам при начальной загрузке
        populateRoomTable(data, roomSelect.value);

        // Заполняем список выбора кабинетов для редактирования
        const editRoomSelect = document.getElementById("editRoomSelect");
        uniqueRooms.forEach(room => {
            const option = document.createElement("option");
            option.value = room;
            option.text = room;
            editRoomSelect.add(option);
        });

        // Обработчик изменения выбора кабинета для редактирования
        editRoomSelect.addEventListener("change", function () {
            const selectedRoom = this.value;
            populateEditRoomEditTable(data, selectedRoom);
        });

        // Заполняем таблицу редактирования расписания по кабинетам при начальной загрузке
        populateEditRoomEditTable(data, editRoomSelect.value);
    });

    // Обработчик для кнопки добавления нового занятия
   // Обработчик для кнопки добавления нового занятия
document.getElementById('addScheduleButton').addEventListener('click', function () {
    const time = document.getElementById('time').value;
    const teacher = document.getElementById('teacher').value;
    const group = document.getElementById('group').value;
    const room = document.getElementById('room').value;
    const day = document.getElementById('day').value;
    const subject = document.getElementById('subject').value;

    if (!time || !teacher || !group || !room || !day || !subject) {
        alert('Пожалуйста, заполните все поля!');
    } else {
        const newEntry = {
            time,
            teacher,
            group,
            room,
            day,
            subject
        };

        data.push(newEntry);

        populateTable(data);
        populateEditTable(data);
        populateTeacherTable(data);

        saveDataAndDownload(data);

        document.getElementById('editForm').reset();
    }
});


    // Обработчик для сохранения изменений в редактируемой таблице
    document.getElementById('saveChangesButton').addEventListener('click', function () {
        const editRows = document.querySelectorAll('#editTable tbody tr');

        editRows.forEach((row, rowIndex) => {
            const time = `${timeSlots[rowIndex][0]} - ${timeSlots[rowIndex][1]}`;
            const cells = row.querySelectorAll('td');

            cells.forEach((cell, cellIndex) => {
                if (cellIndex === 0) return;

                const day = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'][cellIndex - 1];
                const content = cell.innerText.split('\n');

                let entry = data.find(item => normalizeTimeFormat(item.time) === time && item.day === day);
                if (entry) {
                    entry.teacher = content[0] || "";
                    entry.group = content[1] || "";
                    entry.room = content[2] || "";
                } else if (content.some(Boolean)) {
                    data.push({
                        time,
                        teacher: content[0] || "",
                        group: content[1] || "",
                        room: content[2] || "",
                        day,
                        subject: 'Новый предмет'
                    });
                }
            });
        });

        populateTable(data);
        populateEditTable(data);
        populateTeacherTable(data);

        saveDataAndDownload(data);
    });

    // Обработчик для сохранения изменений в редактируемой таблице по кабинетам
    document.getElementById('saveRoomChangesButton').addEventListener('click', function () {
        const editRows = document.querySelectorAll('#editRoomEditTable tbody tr');

        editRows.forEach((row, rowIndex) => {
            const time = `${timeSlots[rowIndex][0]} - ${timeSlots[rowIndex][1]}`;
            const cells = row.querySelectorAll('td');

            cells.forEach((cell, cellIndex) => {
                if (cellIndex === 0) return;

                const day = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'][cellIndex - 1];
                const content = cell.innerText.split('\n');
                const selectedRoom = document.getElementById('editRoomSelect').value;

                let entry = data.find(item => normalizeTimeFormat(item.time) === time && item.day === day && item.room === selectedRoom);
                if (entry) {
                    entry.teacher = content[0] || "";
                    entry.group = content[1] || "";
                    entry.subject = content[2] || "";
                } else if (content.some(Boolean)) {
                    data.push({
                        time,
                        teacher: content[0] || "",
                        group: content[1] || "",
                        room: selectedRoom,
                        day,
                        subject: content[2] || ""
                    });
                }
            });
        });

        populateEditRoomEditTable(data, document.getElementById('editRoomSelect').value);

        saveDataAndDownload(data);
    });

    // Обработчик для переключения вкладок
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function (event) {
            event.preventDefault();

            const selectedTab = this.getAttribute('data-tab');

            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            document.getElementById(selectedTab + 'Schedule').classList.add('active');

            if (selectedTab === 'teacher') {
                populateTeacherTable(data);
            }

            if (selectedTab === 'room') {
                const selectedRoom = document.getElementById("roomSelect").value;
                populateRoomTable(data, selectedRoom);
            }

            if (selectedTab === 'editRoom') {
                const selectedRoom = document.getElementById("editRoomSelect").value;
                populateEditRoomEditTable(data, selectedRoom);
            }
        });
    });

    // Добавляем обработчик поиска по преподавателям
    const teacherSearchInput = document.getElementById("teacherSearch");
    if (teacherSearchInput) {
        teacherSearchInput.addEventListener("input", function () {
            const searchTerm = this.value.toLowerCase();

            // Фильтруем данные по преподавателю
            const filteredData = data.filter((item) =>
                item.teacher.toLowerCase().includes(searchTerm)
            );

            // Заполняем таблицу преподавателей на основе фильтрации
            populateTeacherTable(filteredData);
        });
    }
});
