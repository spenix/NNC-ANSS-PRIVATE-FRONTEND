const initialState = {
    languages_data: [],
    status: "",
    message: "",
  };
  
  const policyStatusReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_LANGUAGES_AVAILABLE":
        return { ...state, languages_data: action.data};
      case "SET_PUBLIC_ROUTE_STATUS_DATA_MESSAGE":
        return { ...state, status: action.status, message: action.msg}
      default:
        return { ...state };
    }
  };
  
  export default policyStatusReducer;