export const reduser = (state, action) => {
    switch (action.type) {
        case 'GET_AUTH':
            return {
                ...state,
                ...action.payload
            };
        case 'GET_LISTS':
            return {
                ...state,
                ...action.payload
            };
        case 'GET_DEPARTMENT':
            return {
                ...state,
                ...action.payload
            };
        case 'GET_COLORS':
            return {
                ...state,
                ...action.payload
            };
        case 'GET_ME':
            return {
                ...state,
                ...action.payload
            };
        case 'ADD_LIST':
            return {
                ...state,
                lists: [...state.lists, action.payload]
            };
        case 'EDIT_LIST':
            return {
                ...state,
                ...action.payload
            };
        case 'REMOVE_LIST':
            return {
                ...state,
                lists: [...action.payload]
            };
        case 'ADD_TASK':
            return {
                ...state,
                ...action.payload
            };
        case 'EDIT_TASK':
            return {
                ...state,
                ...action.payload
            };
        case 'COMPLETE_TASK':
            return {
                ...state,
                ...action.payload
            };
        case 'REMOVE_TASK':
            return {
                ...state,
                ...action.payload
            };
        case 'IS_LOAD':
            return {
                ...state,
                ...action.payload
            };
        default:
            return state
    }
};

