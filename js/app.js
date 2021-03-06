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
            const result = destroyElem($newTask)
            if (result) {
                $newTask.removeEventListener('click', listener)
            } else {
                alert('Ошибка удаления: завершите редактирование.')
            }
        } else if (event.target.dataset.checkcompleted) {
            checkCompleted($newTask)
        }
    }

    $newTask.addEventListener('click', listener)
}

const addTask = () => {
    const inputText = isEmptyInput(inputTextTask)

    if (inputText !== '') {
        const $newTask = createNewTask(inputText)
        initNewToDo($newTask)
        buttonSetErrorBorder(buttonAddTask, false)
    } else {
        buttonSetErrorBorder(buttonAddTask, true)
    }
}

buttonAddTask.addEventListener('click', addTask)
inputTextTask.addEventListener('keydown', e => {
    if (e.type === 'keydown') {
        if (e.key === 'Enter') {
            addTask()
        }
    }
})

function destroyElem(elem) {
    const input = elem.querySelector('.input')
    if (input) return false   // если создан input - не удалять
    const elemText = elem.querySelector('[data-text]').innerText
    const obj = allToDos.find((item, index) => {
        if (item.text === elemText) {
            allToDos.splice(index, 1)
            return true
        }
    })

    elem.remove()
    return true
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
        alert('Ошибка: завершите редактирование.')
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
            <input class="input_update" type="submit" data-update="true" value="Обновить">
        </div>
    `
    $listText.replaceWith($input)

    const $inputTextUpdate = $input.querySelector('[data-inputupdate]')

    const listener = event => {
        if (event.target.dataset.update || event.key === "Enter") {
            const inputText = isEmptyInput($inputTextUpdate)

            if (inputText !== '') {
                buttonSetErrorBorder($inputTextUpdate, false)
                pasteNewTextArrToDo($listText, inputText)
                $input.replaceWith($listText)
                setText(elem, inputText)
                $input.removeEventListener('click', listener)
                onOffDraggable(elem, true)
            } else {
                buttonSetErrorBorder($inputTextUpdate, true)
            }
        }
    }

    $input.addEventListener('click', listener)
    $input.addEventListener('keydown', listener)

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
        const {result, err} = saveAllToDoCycle()
        if (result) {
            localStorage.setItem('toDos', JSON.stringify(allToDos))
        } else {
            alert('Ошибка сохранения: завершите редактирование.')
            return buttonError(buttonSaveAllTasks, 500)
        }
    } else {
        localStorage.removeItem('toDos')
    }

    buttonSuccessful(buttonSaveAllTasks, 500)
})

buttonRemoveAllTasks.addEventListener('click', event => {
    const listToDoChildren = [...listToDo.children]
    if (listToDoChildren.length > 0) {
        const isRemove = confirm('Вы точно хотите все удалить?')
        if (isRemove) {
            listToDoChildren.forEach(elem => elem.remove())
            allToDos = [] // очищаем весь массив с toDos
            buttonSuccessful(buttonRemoveAllTasks, 500)
        }
    } else {
        // alert('Ошибка удаления: нет задач.')
        buttonError(buttonRemoveAllTasks, 500)
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
    let errors = []

    saveToDos = [] // сохраняем сюда toDo в цикле forEach до проверки на ошибки
    const children = [...listToDo.children]

    children.forEach(elem => {
        const dataText = elem.querySelector('[data-text]')
        if (!dataText) {
            return errors.push(elem)
        }
        const text = dataText.innerText

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
        saveToDos.push(toDo)
    })

    if (errors.length > 0) {
        console.log(errors)
        return {result: false, err: errors}
    } else {
        allToDos = []
        allToDos = [...saveToDos]
        return {result: true}
    }
}

function buttonSetErrorBorder(button, border) {
    const parent = button.closest('.input__container')
    if (parent) {
        const inputMain = parent.querySelector('.input__main')
        if (border) {
            inputMain.classList.add('input__main_border-error')
        } else {
            inputMain.classList.remove('input__main_border-error')
        }
    }
}

function buttonSuccessful(button, delay) {
    button.classList.add('tools__button_successful')
    setTimeout(() => button.classList.remove('tools__button_successful'), delay)
}

function buttonError(button, delay) {
    button.classList.add('tools__button_error')
    setTimeout(() => button.classList.remove('tools__button_error'), delay)
}

inputTextTask.addEventListener('input', () => {
    const inputText = isEmptyInput(inputTextTask)

    if (inputText !== '') {
        buttonClearTextTask.style.visibility = 'visible'
        buttonClearTextTask.style.opacity = 1
    } else {
        buttonClearTextTask.style.visibility = 'hidden'
        buttonClearTextTask.style.opacity = 0
    }
})

buttonClearTextTask.addEventListener('click', () => {
    const inputText = isEmptyInput(inputTextTask)

    if (inputText !== '') {
        inputTextTask.value = ''

        buttonClearTextTask.style.visibility = 'hidden'
        buttonClearTextTask.style.opacity = 0
    }
})