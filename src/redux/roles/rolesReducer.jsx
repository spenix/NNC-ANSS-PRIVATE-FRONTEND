const initialState = {
    roles: [],
    data: [],
    total: 1,
    params: {},
    selectedUser: null,
  };

  const rolesReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_ROLES":
        return { ...state, roles: action.payload.roles };

      case "GET_ROLE":
        return {
          ...state,
          data: action.data,
          total: action.totalPages,
          params: action.params,
        };

      case "GET_ROLE_DETAILS":
        return { ...state, selectedRole: action.selectedRole };

      case "ADD_ROLE":
        return { ...state, isSuccess: true, isError: false };

      case "ADD_ROLE_FAIL":
        return { ...state, isError: true, isSuccess:false };

      case "DELETE_ROLE":
        return { ...state };

      case "SET_MESSAGE":
        return { ...state, message: action.payload };

      default:
        return { ...state };
    }
  };

  export default rolesReducer;