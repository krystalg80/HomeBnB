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
//think actiion creator restore user

export const restoreUser = () => async (dispatch) => {
    try {
        console.log('Attempting to restore user');
        console.log('Full URL being fetched:', '/api/session');
        
        const res = await csrfFetch('/api/session');
        
        console.log('Response status:', res.status);
        console.log('Response headers:', Object.fromEntries(res.headers.entries()));
        
        const data = await res.json();
        
        console.log('Received data:', data);
        dispatch(setSessionUser(data.user));
        return res;
    } catch (error) {
        console.error('Error in restoreUser:', error);
        console.error('Error details:', {
            status: error.status,
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
}

//thunk action creator but for signup!
export const signup = (user) => async (dispatch) => {
    const { username, firstName, lastName, email, password } = user;
    const res = await csrfFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify({username, firstName, lastName, email, password})
    });
    const data = await res.json();
    dispatch(setSessionUser(data.user));
    return res;
}
//thunk action creator for logout
export const logout = () => async (dispatch) => {
    const res = await csrfFetch('/api/session', {
      method: 'DELETE',
    });
    dispatch(clearSessionUser());
    return res;
  };

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