//store
const createStore = (reducer) => {

    let state;
    let subscriptions = [];

    const getState = () => state;
    const subscribe = (callback) => {

        subscriptions.push(callback);

        return () => {
            subscriptions = subscriptions.filter((subscription) => subscription !== callback);
        }
    };

    const dispatch = (action) => {
        state = reducer(state, action);
        subscriptions.forEach((subscription) => subscription());
    };

    return {
        getState,
        subscribe,
        dispatch
    }
}
//actions
const ADD_TODO = 'ADD_TODO';
const REMOVE_TODO = 'REMOVE_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const ADD_GOAL = 'ADD_GOAL';
const REMOVE_GOAL = 'REMOVE_GOAL';
const TOGGLE_GOAL = 'TOGGLE_GOAL';

//actioncreator
const addTodo = (todo) => ({
    type: ADD_TODO,
    todo
});

const removeTodo = (id) => ({
    type: REMOVE_TODO,
    id
});

const toggleTodo = (id) => ({
    type: TOGGLE_TODO,
    id
});

const addGoal = (goal) => ({
    type: ADD_GOAL,
    goal
});

const removeGoal = (id) => ({
    type: REMOVE_GOAL,
    id
});

const toggleGoal = (id) => ({
    type: TOGGLE_GOAL,
    id
});

//reducer
const todos = (state = [], action) => {
    switch (action.type) {
        case ADD_TODO:
            return state.concat([action.todo]);
        case REMOVE_TODO:
            return state.filter((todo) => todo.id !== action.id);
        case TOGGLE_TODO:
            return state.map((todo) => todo.id === action.id ? Object.assign({},todo,{complete: !todo.complete}) : todo)
        default:
            return state;
    }
};

const goals = (state = [], action) => {
    switch (action.type) {
        case ADD_GOAL:
            return state.concat([action.goal]);
        case REMOVE_GOAL:
            return state.filter((goal) => goal.id !== action.id);
        case TOGGLE_GOAL:
            return state.map((goal) => goal.id === action.id ? Object.assign({},goal,{complete: !goal.complete}) : goal)
        default:
            return state;
    }
};

const combinedReducer = (state = {}, action) => {
    return {
        todos: todos(state.todos,action),
        goals: goals(state.goals,action)
    }
};

//app
const store = createStore(combinedReducer);
store.subscribe(() => console.log(store.getState()))

store.dispatch(addTodo({
    id: 0,
    text: "get something",
    complete: true
}));

store.dispatch(toggleTodo(0));

store.dispatch(addGoal({
    id: 1,
    text: "goal of something"
}));

store.dispatch(removeTodo(0));