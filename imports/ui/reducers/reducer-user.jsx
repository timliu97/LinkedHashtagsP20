import {SET_USER_ROLES, TOGGLE_USER_ROLE} from "../actions/_actionTypes";

const defaultState = {
  roles: [
    'guest', 'researcher', 'admin'
  ],
  userRoles: {}
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case SET_USER_ROLES:
      state = {
        ...state,
        userRoles: action.payload.userRoles
      };
      break;
    case TOGGLE_USER_ROLE:
      const userId = action.payload.userId;
      const roleId = action.payload.roleId;
      const {userRoles} = state;
      const userSelected = userRoles[userId];
      const selectedIndex = userSelected.indexOf(roleId);
      let newSelected = {};

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, roleId);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1),);
      }

      state = {
        ...state,
        selected: {
          ...selected,
          userId: newSelected
        }
      };
      break;
  }
  return state;
}
