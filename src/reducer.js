export const Reduser = (state, action) => {
    switch (action.type) {
        case 'GET_AUTH':
            return {
                ...state,
                ...action.payload
            };
        case 'GET_LISTS':
            return {
                ...state,
                lists: [...action.payload]
            };
        case 'GET_DEPARTMENT':
            return {
                ...state,
                department: action.payload
            };
        case 'GET_COLORS':
            return {
                ...state,
                colors: [...action.payload]
            };
        case 'GET_ME':
            return {
                ...state,
                me: action.payload
            };
        case 'ADD_LIST':
            return {
                ...state,
                lists: [...state.lists, action.payload]
            };
        case 'EDIT_LIST':
            return {
                ...state,
                lists: [...action.payload]
            };
        case 'REMOVE_LIST':
            return {
                ...state,
                lists: [...action.payload]
            };
        case 'ADD_TASK':
            return {
                ...state,
                lists: [...action.payload]
            };
        case 'EDIT_TASK':
            return {
                ...state,
                lists: [...action.payload]
            };
        case 'COMPLETE_TASK':
            return {
                ...state,
                lists: [...action.payload]
            };
        case 'HISTORY_TASK':
            return {
                ...state,
                tasks: [...action.payload]
            };
        case 'REMOVE_TASK':
            return {
                ...state,
                lists: [...action.payload]
            };
        case 'IS_LOAD':
            return {
                ...state,
                ...action.payload
            };
        case 'MY_LIST':
            return {
                ...state,
                mylists: [...action.payload]
            };
        default:
            return state
    }
};

