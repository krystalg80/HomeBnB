import { csrfFetch } from "./csrf";

//to create a reducer for our store we need an action type first and then our action creator

//action types create user, clear user

const SET_SESSION_USER = 'session/setSessionUser';
const CLEAR_SESSION_USER = 'session/clearSessionUser';

//action creater
export const setSessionUser = (user) => ({
    type: SET_SESSION_USER,
    user
});

export const clearSessionUser = () => ({
    type: CLEAR_SESSION_USER
});

//thunk action creator
export const login = (user) => async (dispatch) => { 
    const { credential, password } = user;
    const res = await csrfFetch('/api/session', {
        method: 'POST',
        body: JSON.stringify({credential, password})
    });
    
    const data = await res.json();
    dispatch(setSessionUser(data.user));
    return res;
}

const initialState = {user: null}

const sessionReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SESSION_USER:
            return {...state, user: action.user}
        case CLEAR_SESSION_USER:
            return {...state, user: null}
        default:
            return state;
    }
}

export default sessionReducer;