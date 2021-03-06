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

const checker = (store) => (next) => (action) => {
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

    return next(action);
}

const logger = (store) => (next) => (action) => {
    console.group(action.type)
    console.log('The action:', action)
    const result = next(action)
    console.log('The new state: ', store.getState());
    console.groupEnd()
    return result
}

const store = Redux.createStore(Redux.combineReducers({
    todos,
    goals
}), Redux.applyMiddleware(checker, logger))

//React App
function List(props) {
    return (
        <ul>
            {props.items.map((item) => (
                <li key={item.id}>
                    <span
                        onClick={() => props.toggle && props.toggle(item)}
                        style={{ textDecoration: item.complete ? 'line-through' : 'none' }}
                    >
                        {item.name}
                    </span>
                    <button onClick={() => props.remove(item)}>
                        X
                    </button>
                </li>
            ))}
        </ul>
    )
}

class Todos extends React.Component {
    addItem = (e) => {
        e.preventDefault()
        const name = this.input.value
        this.input.value = ''
        this.props.store.dispatch(addTodoAction({
            name,
            complete: false,
            id: generateId()
        }));
    }

    toggleItem = (item) => {
        this.props.store.dispatch(toggleTodoAction(item.id))
    }

    removeItem = (item) => {
        this.props.store.dispatch(removeTodoAction(item.id))
    }

    render() {
        return (
            <div>
                <h1>Todo List</h1>
                <input
                    type="text"
                    placeholder="Add Todo"
                    ref={(input) => this.input = input}
                />
                <button onClick={this.addItem}>Add Todo</button>
                <List items={this.props.todos} remove={this.removeItem} toggle={this.toggleItem} />
            </div>
        )
    }
}

class Goals extends React.Component {
    addItem = (e) => {
        e.preventDefault()
        const name = this.input.value
        this.input.value = ''
        this.props.store.dispatch(addGoalAction({
            name,
            id: generateId()
        }));
    }

    removeItem = (item) => {
        this.props.store.dispatch(removeGoalAction(item.id))
    }

    render() {
        return (
            <div>
                <h1>Goals</h1>
                <input
                    type="text"
                    placeholder="Add Goal"
                    ref={(input) => this.input = input}
                />
                <button onClick={this.addItem}>Add Goal</button>
                <List items={this.props.goals} remove={this.removeItem} />
            </div>
        )
    }
}

class App extends React.Component {
    componentDidMount() {
        const { store } = this.props

        store.subscribe(() => this.forceUpdate())
    }

    render() {
        const { store } = this.props
        const { todos, goals } = store.getState()

        return (
            <div>
                <Todos todos={todos} store={store} />
                <Goals goals={goals} store={store} />
            </div>
        )
    }
}

ReactDOM.render(<App store={store} />, document.getElementById('app'))