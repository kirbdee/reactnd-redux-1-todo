function generateId() {
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
}

// App Code
const ADD_TODO = 'ADD_TODO'
const REMOVE_TODO = 'REMOVE_TODO'
const TOGGLE_TODO = 'TOGGLE_TODO'
const ADD_GOAL = 'ADD_GOAL'
const REMOVE_GOAL = 'REMOVE_GOAL'
function addTodoAction(todo) {
    return {
        type: ADD_TODO,
        todo,
    }
}
function removeTodoAction(id) {
    return {
        type: REMOVE_TODO,
        id,
    }
}
function toggleTodoAction(id) {
    return {
        type: TOGGLE_TODO,
        id,
    }
}
function addGoalAction(goal) {
    return {
        type: ADD_GOAL,
        goal,
    }
}
function removeGoalAction(id) {
    return {
        type: REMOVE_GOAL,
        id,
    }
}
function todos(state = [], action) {
    switch (action.type) {
        case ADD_TODO:
            return state.concat([action.todo])
        case REMOVE_TODO:
            return state.filter((todo) => todo.id !== action.id)
        case TOGGLE_TODO:
            return state.map((todo) => todo.id !== action.id ? todo :
                Object.assign({}, todo, { complete: !todo.complete }))
        default:
            return state
    }
}
function goals(state = [], action) {
    switch (action.type) {
        case ADD_GOAL:
            return state.concat([action.goal])
        case REMOVE_GOAL:
            return state.filter((goal) => goal.id !== action.id)
        default:
            return state
    }
}

function checkAndDispatch(store, action) {
    if (
        action.type === ADD_TODO &&
        action.todo.name.toLowerCase().includes('bitcoin')
    ) {
        return alert(`Nope. That's a bad idea`)
    }

    if (
        action.type === ADD_GOAL &&
        action.goal.name.toLowerCase().includes('bitcoin')
    ) {
        return alert(`Nope. That's a bad idea`)
    }

    return store.dispatch(action);
}

const store = Redux.createStore(Redux.combineReducers({
    todos, goals
}))


store.subscribe(() => {
    console.log('The new state is: ', store.getState());
    const { goals, todos } = store.getState();

    resetList(document.getElementById('goals'))
    goals.forEach(addGoalToDOM)

    resetList(document.getElementById('todos'))
    todos.forEach(addTodoToDOM)
})
// store.dispatch(addTodoAction({
//     id: 0,
//     name: 'Walk the dog',
//     complete: false,
// }))
// store.dispatch(addTodoAction({
//     id: 1,
//     name: 'Wash the car',
//     complete: false,
// }))
// store.dispatch(addTodoAction({
//     id: 2,
//     name: 'Go to the gym',
//     complete: true,
// }))
// store.dispatch(removeTodoAction(1))
// store.dispatch(toggleTodoAction(0))
// store.dispatch(addGoalAction({
//     id: 0,
//     name: 'Learn Redux'
// }))
// store.dispatch(addGoalAction({
//     id: 1,
//     name: 'Lose 20 pounds'
// }))
// store.dispatch(removeGoalAction(0))

function addTodo() {
    const input = document.getElementById('todo')
    const name = input.value;
    if (name) {
        checkAndDispatch(store, addTodoAction({
            name,
            complete: false,
            id: generateId()

        }));
    }
    input.value = ''
}

function addGoal() {
    const input = document.getElementById('goal')
    const name = input.value;
    if (name) {
        checkAndDispatch(store, addGoalAction({
            name,
            id: generateId()

        }));
    }
    input.value = ''
}

function resetList(target) {
    target.innerHTML = '';
};

function createRemoveButton(onClick) {
    const removeBtn = document.createElement('button');
    removeBtn.innerHTML = 'X';
    removeBtn.addEventListener('click', onClick);

    return removeBtn;
}

function addTodoToDOM(todo) {
    const target = document.getElementById('todos');
    const node = document.createElement('li');
    const text = document.createTextNode(todo.name);
    const removeBtn = createRemoveButton(() => {
        checkAndDispatch(store, dispatch(removeTodoAction(todo.id)));
    })

    node.appendChild(text);
    node.appendChild(removeBtn);
    node.style.textDecoration = todo.complete ? 'line-through' : 'none';

    node.addEventListener('click', () => {
        checkAndDispatch(store, toggleTodoAction(todo.id));
    });

    target.appendChild(node);
}

function addGoalToDOM(goal) {
    const target = document.getElementById('goals')
    const node = document.createElement('li');
    const text = document.createTextNode(goal.name);
    const removeBtn = createRemoveButton(() => {
        checkAndDispatch(store.removeGoalAction(goal.id));
    })
    node.appendChild(text);
    node.appendChild(removeBtn);
    target.appendChild(node);
}