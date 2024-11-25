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

const initialState = {user: null}

const sessionReducer (state = initialState, action) => {
    switch (action.type)
}