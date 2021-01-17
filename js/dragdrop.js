let drag = true
let dragMouseDown = true

listToDo.addEventListener('mousedown', event => {
    const target = event.target
    if (!checkСircsMouseDown(target)) {
        dragMouseDown = false
    } else {
        dragMouseDown = true
    }
})

listToDo.addEventListener('dragstart', event => {
    const target = event.target

    if (!checkСircs(target) || !dragMouseDown) {
        drag = false
    } else {
        drag = true
    }
    if (!drag) return

    target.classList.add('dragging')
})

listToDo.addEventListener('dragend', event => {
    if (!drag) return

    const target = event.target

    target.classList.remove('dragging')
})

listToDo.addEventListener('dragover', event => {
    if (!drag) return

    event.preventDefault()
    const afterElement = getDragAfterElement(listToDo, event.clientY)
    const draggable = document.querySelector('.dragging')
    if (afterElement == null) {
        listToDo.appendChild(draggable)
    } else {
        listToDo.insertBefore(draggable, afterElement)
    }
})

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')]
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect()
        const offset = y - box.top - box.height / 2
        // Если offset отрицательный - значит перетаскиваемый элемент НАД элементом,
        // Если offset > 0 значит перетаскиваемый элемент под элементом
        if (offset < 0 && offset > closest.offset) {
            return {offset: offset, element: child}
        } else {
            return closest
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element
}

function checkСircs(target) {
    if (target.nodeName == '#text') return false // если перетаскиваем текст
    if (!target.closest('.draggable').draggable) return false // если у родительского элемента draggable = false

    return true
}

function checkСircsMouseDown(target) {
    if (target.classList.contains('list__ico')) return false // если родитель с классом list__tools (кнопки удаления и редактирования)
    if (target.classList.contains('check-completed')) return false // если тянем за зеленую кнопку

    return true
}