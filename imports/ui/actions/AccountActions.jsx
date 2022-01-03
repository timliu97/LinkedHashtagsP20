import {CHANGE_USER_PASSWORD, CREATE_USER, LOGIN_USER, LOGOUT_USER, CHANGE_API_KEY} from './_actionTypes';

export function changeApiKey(data) {
  return {type: CHANGE_API_KEY, payload: data}
}

export function createUser(data) {
  return {type: CREATE_USER, payload: data}
}

export function changePassword(data) {
  return {type: CHANGE_USER_PASSWORD, payload: data}
}

export function logInUser(data) {
  return {type: LOGIN_USER, payload: data}
}

export function logoutUser() {
  return {type: LOGOUT_USER}
}
