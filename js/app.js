<<<<<<< HEAD
const inputTextTask = document.querySelector('#inputTextTask')
const buttonClearTextTask = document.querySelector('#buttonClearTextTask')
const buttonAddTask = document.querySelector('#buttonAddTask')
const buttonRemoveAllTasks = document.querySelector('#buttonRemoveAllTasks')
const buttonSaveAllTasks = document.querySelector('#buttonSaveAllTasks')
const listToDo = document.querySelector('#listToDo')

function getTime() {
    const date = new Date()
    return {
        dayMonth: date.getDate(),
        month: date.getMonth()+1,
        year: date.getFullYear(),
        hourse: date.getHours(),
        minutes: date.getMinutes()
    }
}

let allToDos = []
loadLocalStorageAllToDos()

function createNewTask(text, data = null) {
    let listContainer = document.createElement('div')
    listContainer.className = 'list__container draggable'
    listContainer.draggable = true

    const {dayMonth, month, year, hourse, minutes} = getTime()

    const toDo = {
        time: `${data ? (data.time) : `${dayMonth}.${month}.${year} ${hourse}:${minutes}`}`,
        // time: {
        //     dayMonth: data ? data.time.dayMonth : dayMonth,
        //     month: data ? data.time.month : month,
        //     year: data ? data.time.year : year,
        //     hourse: data ? data.time.hourse : hourse,
        //     minutes: data ? data.time.minutes : minutes
        // },
        text: text ? text : data.text,
        completed: (data && data.completed) ? true : false
    }

    listContainer.innerHTML = `
    <div class="list__tools">
        <div class="list__ico list__ico_edit" data-editing="true" title="Редактировать"></div>
        <div class="list__ico list__ico_remove" data-close="true" title="Удалить"></div>
    </div>
    <div class="list__content">
        <div class="check-completed ${toDo.completed ? 'check-completed_yes' : ''}" data-checkCompleted="true"></div>
        <div class="list__date">
            <span data-time>${toDo.time}</span>
        </div>
        <div class="list__text">
            <p data-text class="${(data && data.completed) ? 'text-completed' : ''}">${toDo.text}</p>
        </div>
    </div>
    `
    data ? listToDo.append(listContainer) : listToDo.prepend(listContainer)

    allToDos.push(toDo)

    return listContainer
}

function isEmptyInput(element) {
    const value = element.value.trim()
    if (value === '') {
        return ''
    } else {
        return value
    }
}

function initNewToDo($newTask) {
    const listener = event => {
        if (event.target.dataset.editing) {
            createInput($newTask)
            onOffDraggable($newTask, false)
        } else if(event.target.dataset.close) {
            destroyElem($newTask)
            $newTask.removeEventListener('click', listener)
        } else if (event.target.dataset.checkcompleted) {
            checkCompleted($newTask)
        }
    }

    $newTask.addEventListener('click', listener)
}

buttonAddTask.addEventListener('click', event => {
    const inputText = isEmptyInput(inputTextTask)

    if (inputText !== '') {
        const $newTask = createNewTask(inputText)
        initNewToDo($newTask)
    }
})

function destroyElem(elem) {
    const elemText = elem.querySelector('[data-text]').innerText
    const obj = allToDos.find((item, index) => {
        if (item.text === elemText) {
            allToDos.splice(index, 1)
            return true
        }
    })

    elem.remove()
}

function setText(elem, text) {
    elem.querySelector('[data-text]').innerText = text
}

function checkCompleted(elem) {
    const textCompleted = elem.querySelector('[data-text]')
    const checkCompleted = elem.querySelector('[data-checkCompleted]')

    // textCompleted true если на этом месте нет input
    if (textCompleted) {
        textCompleted.classList.toggle('text-completed')
        checkCompleted.classList.toggle('check-completed_yes')

        const obj = findObjInArrAllToDo(elem)
        obj.completed = !obj.completed
    } else {
        // Выводим сообщение что нужно завершить редактирование
    }
}

function createInput(elem) {
    const $listText = elem.querySelector('.list__text')
    if (!$listText) return // здесь null если нажали редактировать, но вместо текста там input
    // Текст $listText который находится между <p></p>
    const listTextContent = $listText.querySelector('[data-text]').innerText
    
    let $input = document.createElement('div')
    $input.className = 'input list__input'
    $input.innerHTML = `
        <div class="input__container">
            <div class="input__main input__main_border-green">
                <input type="text" data-inputUpdate value='${listTextContent}'>
            </div>
            <input type="update" data-update="true" value="Обновить">
        </div>
    `
    $listText.replaceWith($input)

    const $inputTextUpdate = $input.querySelector('[data-inputupdate]')

    const listener = event => {
        if (event.target.dataset.update) {
            const inputText = isEmptyInput($inputTextUpdate)

            if (inputText !== '') {
                pasteNewTextArrToDo($listText, inputText)
                $input.replaceWith($listText)
                setText(elem, inputText)
                $input.removeEventListener('click', listener)
                onOffDraggable(elem, true)
=======
// Поле ввода
const inputTextTask = document.getElementById('inputTextTask')
// Крестик для очистки поля ввода
const buttonClearTextTask = document.getElementById('buttonClearTextTask')
// Кнопка добавить задачу
const buttonAddTask = document.getElementById('buttonAddTask')

// Кнопка для удаления всех задач
const buttonRemoveAllTasks = document.getElementById('buttonRemoveAllTasks')

// div со всеми toDo
const listToDo = document.getElementById('listToDo')


// Срабатывает каждый раз при вводе символа в inputTextTask
inputTextTask.oninput = (event) => {
    // Если input НЕ пустой (!)
    if (!getInputIsEmpty(inputTextTask)) {
        buttonClearTextTask.style.visibility = 'visible'
        buttonClearTextTask.style.opacity = 1
    } else {
        buttonClearTextTask.style.opacity = 0
        buttonClearTextTask.style.visibility = 'hidden'
    }
}

buttonClearTextTask.onclick = (event) => {
    // Проверять на пустую строку не нужно, т.к. когда она пустая - кнопка недоступна
    inputTextTask.value = ''
    // Скрываем кнопку
    buttonClearTextTask.style.opacity = 0
    buttonClearTextTask.style.visibility = 'hidden'
}

buttonAddTask.onclick = (event) => {
    // Если input не пустой
    if (!getInputIsEmpty(inputTextTask)) {
        // Создаем объект вида: task: 'текст из inputTextTask'
        let objectToDo = {task: inputTextTask.value.trim()}
        // Добавляем созданный объект в DOM class list с id listToDo
        addDomInListToDo(objectToDo)
    }
}


// class tools__container
buttonRemoveAllTasks.onclick = (event) => {
    // Получаем объект всех детей div с id listToDo (это все to do)
    let listToDo = document.querySelector('#listToDo').childNodes
    // Преобразовываем объект в массив с его значениями
    // ГАЙД: Все о преобразовании объекта в массив - https://badcode.ru/pieriebor-eliemientov-obiekta-v-javascript/
    const keys = Object.values(listToDo)

    // Проходимся по всем значениям массива
    for (let elem of keys) {
        // Удаляем 
        elem.remove()
    }
}


// Создание нового list__container в DOM
function addDomInListToDo(object) {
    // Создаем html элемент с тегом div
    let listContainer = document.createElement('div')
    // Устанавливаем имя класса на list__container
    listContainer.className = 'list__container'
    // Добавляем в listContainer весь остальной HTML
    listContainer.innerHTML = `
        <div class="list__tools">
            <div id="buttonEditToDo" class="list__ico list__ico_edit" title="Редактировать"></div>
            <div id="buttonRemoveToDo" class="list__ico list__ico_remove" title="Удалить"></div>
        </div>
        <div class="list__content">
            <div id="checkCompleted" class="check-completed"></div>
            <div class="list__text">
                <p>${object.task}</p>
            </div>
        </div>
    `
    // Вставляем listContainer в DOM начало класса listContainer
    listToDo.prepend(listContainer)

    // ToDo уже находится в DOM, поэтому если попробовать найти первый элемент с id buttonRemoveToDo найдет именно только что вставленный listContainer
    let buttonRemoveToDo = document.querySelector('#buttonRemoveToDo')
    buttonRemoveToDo.onclick = (event) => {
        // Идем от кнопкиу даления до родителя (list__tools) до его родителя (list__container) и удаляем
        event.target.parentNode.parentNode.remove()
    }

    // Таким же образом ищем кнопку редактирования
    let buttonEditToDo = document.querySelector('#buttonEditToDo')
    buttonEditToDo.onclick = (event) => {
        // Сохраняем оригинальный текст toDo
        let textOriginal = event.target.parentNode.parentNode.querySelector('.list__text').innerText
        // Получаем элемент с классом list__text
        let listText = event.target.parentNode.parentNode.querySelector('.list__text')

        // Создаем элемент с тегом div
        let inputWindow = document.createElement('div')
        // Устанавливаем имя класса на input и list__input
        inputWindow.className = 'input list__input'
        // Заполняем inputWindow остальным HTML содержимом
        inputWindow.innerHTML = `
            <div class="input__container">
                <div class="input__main input__main_border-green">
                    <input id="inputUpdateTextTask" type="text" value='${textOriginal}'>
                </div>
                <input id="buttonUpdateTaskText" type="update" value="Обновить">
            </div>
        `
        // Заменяем listText на inputWindow
        listText.replaceWith(inputWindow)
        
        // Сразу после размещения input для ввода текста и кнопкой 'Обновить' получаем этот input и кнопку
        let buttonUpdateTaskText = document.querySelector('#buttonUpdateTaskText')
        let inputUpdateTextTask = document.querySelector('#inputUpdateTextTask')

        // Обработчик на клик кнопки
        buttonUpdateTaskText.onclick = (event) => {
            // Если input не пустой
            if (!getInputIsEmpty(inputUpdateTextTask)) {
                // Получаем div с input и кнопкой, что бы дальше ее удалить
                let listInput = event.target.parentNode.parentNode
                // Получаем div с to do что бы потом в его конец добавить обновленный текст
                let listContainer = event.target.parentNode.parentNode.parentNode

                // Создаем div с новым текстом, классом list__text, и тегом <p> внутри
                let listText = document.createElement('div')
                listText.className = 'list__text'
                listText.innerHTML = `
                    <p>${inputUpdateTextTask.value}</p>
                `

                // Меняем listInput (поле для ввода и кнопку) на listText (новый текст)
                listInput.replaceWith(listText)
>>>>>>> 79c4e05b12c2d3668a5af98427a792553e473aef
            }
        }
    }

<<<<<<< HEAD
    $input.addEventListener('click', listener)

    function pasteNewTextArrToDo(elem, text) {
        const obj = findObjInArrAllToDo(elem)
        obj.text = text
    }
}

function findObjInArrAllToDo(elem) {
    const elemText = elem.querySelector('[data-text]').innerText
    const obj = allToDos.find(item => item.text === elemText)
    return obj
}

buttonSaveAllTasks.addEventListener('click', event => {
    if (allToDos.length > 0) {
        saveAllToDoCycle()
        localStorage.setItem('toDos', JSON.stringify(allToDos))
    } else {
        localStorage.removeItem('toDos')
    }
})

buttonRemoveAllTasks.addEventListener('click', event => {
    const listToDoChildren = [...listToDo.children]
    if (listToDoChildren.length > 0) {
        const isRemove = confirm('Вы точно хотите все удалить?')
        if (isRemove) {
            listToDoChildren.forEach(elem => elem.remove())
            allToDos = [] // очищаем весь массив с toDos
        }
    } else {
        console.log('Ошибка удаления: нет задач')
    }
})

function loadLocalStorageAllToDos() {
    const loadToDos = localStorage.getItem('toDos')
    const parseToDos = JSON.parse(loadToDos)
    if (parseToDos) {
        parseToDos.forEach(element => {
            const $newTask = createNewTask(undefined, element)
            initNewToDo($newTask)
        });
    }
}

function onOffDraggable(elem, shift) {
    elem.draggable = shift
}

function saveAllToDoCycle() {
    allToDos = []
    const children = [...listToDo.children]

    children.forEach(elem => {
        const text = elem.querySelector('[data-text]').innerText

        let complite
        if (elem.querySelector('[data-checkcompleted]').classList.contains('check-completed_yes')) {
            complite = true
        } else {
            complite = false
        }

        const time = elem.querySelector('[data-time]').innerText

        const toDo = {
            time: time,
            text: text,
            completed: complite
        }
        allToDos.push(toDo)
    })
}
=======
    // Левая зеленая полоска около текста to do
    let buttonCheckCompleted = document.querySelector('#checkCompleted')

    buttonCheckCompleted.onclick = (event) => {
        // Получаем значение backgroundColor стиля из css
        let divObjBgColor = window.getComputedStyle(event.target).backgroundColor;

        // Если цвет такой как при наведении
        if (divObjBgColor === 'rgba(0, 255, 136, 0.38)') {
            // Ставим яркость цвета на 1
            buttonCheckCompleted.style.backgroundColor = 'rgba(0, 255, 136, 1)'
        } else {
            // Т.к. style изменяется не в css, а в html - очищаем, т.к. если этого не сделать, hover не будет работать
            buttonCheckCompleted.style.backgroundColor = ''
        }
    }
}

// Проверка на пустой input
function getInputIsEmpty(input) {
    // Получаем текст из input и удаляем пробелы с начала и конца (trim)
    let getInputText = input.value.trim()
    if (getInputText.length > 0) {
        return false
    } else {
        return true
    }
}


>>>>>>> 79c4e05b12c2d3668a5af98427a792553e473aef
