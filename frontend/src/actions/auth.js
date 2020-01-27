import axios from 'axios';
import { returnErrors } from './messages';
import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
    REGISTER_FAIL,
    REGISTER_SUCCESS,
    RESET_PASSWORD,
    RESET_FAIL
}
from './types';

// Reset password
export const resetPassword = (username, password) => (dispatch, getState) => {
    // Header
    const config = {
        headers: {
            'Content-Type': 'application/json',
        }
    }

    // Request body
    const body = JSON.stringify({username, password})

    axios
        .put('http://127.0.0.1:8000/users/api/auth/password', body, tokenConfig(getState))
        .then(res => {
            dispatch({
                type: RESET_PASSWORD,
                payload: res.data
            });
            alert('Password successfully changed. Please login with the new password')
        }).catch(err => {
            dispatch ({
                type: RESET_FAIL
            })
        alert('Username not found')
        });
}

// Check token & load user
export const loadUser = () => (dispatch, getState) => {
    // User loading
    dispatch({ type: USER_LOADING });
    // Get token from state
    const token = getState().auth.token;
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    // If token add to headers config
    if(token) {
        config.headers['Authorization'] = `Token ${token}`;
    }
    axios
      .get('http://127.0.0.1:/users/api/auth/user', config)
      .then(res => {
          dispatch({
            type: USER_LOADED,
            payload: res.data
          });
      })
      .catch(err => {
          dispatch(returnErrors(err.response, err.response));
          dispatch({
              type: AUTH_ERROR
          });
      });
};
// Login user
export const login = (username, password) => dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    // Request Body 
    const body = JSON.stringify({ username, password });
    axios
      .post('http://127.0.0.1:8000/users/api/auth/login', body, config)
      .then(res => {
          dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
          });
      })
      .catch(err => {
        //   dispatch(returnErrors(err.response.data, err.response.status));
          dispatch({
              type: LOGIN_FAIL
          });
          alert(err.response.data.non_field_errors);
      });
};
// Register new user
export const register = ({ username, email, password }) => dispatch => {
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    // Request Body 
    const body = JSON.stringify({ username, email, password });
    axios
      .post('http://127.0.0.1:8000/users/api/auth/register', body, config)
      .then(res => {
          dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
          });
          alert("You have successfully registered an account. Please login.");
          console.log("register");
      })
      .catch(err => {
        //   dispatch(returnErrors(err.response.data, err.response.status));
          dispatch({
              type: REGISTER_FAIL
          });
          alert(err.response.data.username);
      });
};
// Logout user
export const logout = () => (dispatch, getState) => {
    // Get token from state
    const token = getState().auth.token;
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    // If token add to headers config
    if(token) {
        config.headers['Authorization'] = `Token ${token}`;
    }
    axios
      .post('http://127.0.0.1:8000/users/api/auth/logout', null, config)
      .then(res => {
          dispatch({
            type: LOGOUT_SUCCESS,
          });
      })
      .catch(err => {
          dispatch(returnErrors(err.response.data, err.response.status));
      });
};

export const tokenConfig = getState =>{
    // Get token from state
    const token = getState().auth.token;
    // Headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }
    // If token add to headers config
    if(token) {
        config.headers['Authorization'] = `Token ${token}`;
    }
    return config
}