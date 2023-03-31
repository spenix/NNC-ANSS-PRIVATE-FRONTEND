const initialState = {
    allOrganizations: [],
    data: [],
    total: 1,
    params: {},
  };

  const organizationsReducer = (state = initialState, action) => {

    switch (action.type) {
      
      case "GET_ALL_ORGANIZATIONS":
        return { ...state, allOrganizations: action.data };

      case "GET_ALL_ORGANIZATIONS_FAIL":
        return { ...state };

      default:
        return { ...state };
    }
  };

  export default organizationsReducer;