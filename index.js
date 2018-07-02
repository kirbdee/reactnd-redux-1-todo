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

//reducer
const todos = (state = [], action) => {
    switch (action.type) {
        case 'ADD_TODO':
            return state.concat([action.todo]);
        case 'REMOVE_TODO':
            return state.filter((todo) => todo.id !== action.todo.id);
        case 'TOGGLE_TODO':
            return state.map((todo) => todo.id === action.todo.id ? Object.assign({},todo,{complete: !todo.complete}) : todo)
        default:
            return state;
    }
};

const goals = (state = [], action) => {
    switch (action.type) {
        case 'ADD_GOAL':
            return state.concat([action.goal]);
        case 'REMOVE_GOAL':
            return state.filter((goal) => goal.id !== action.goal.id);
        case 'TOGGLE_GOAL':
            return state.map((goal) => goal.id === action.goal.id ? Object.assign({},goal,{complete: !goal.complete}) : goal)
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
const appState = createStore(combinedReducer);
appState.subscribe(() => console.log(appState.getState()))
appState.dispatch({
    type: 'ADD_TODO',
    todo: {
        id: 0,
        text: "get something",
        complete: true
    }
});
appState.dispatch({
    type: 'TOGGLE_TODO',
    todo: {
        id: 0
    }
});
appState.dispatch({
    type: 'ADD_GOAL',
    goal: {
        id: 1,
        text: "goal of something"
    }
});
appState.dispatch({
    type: 'REMOVE_TODO',
    todo: {
        id: 0
    }
});