const initialState = {
    userManual_data: [],
    userManual_links: {},
    userManual_meta: {},
    userManual_details: {},
    status: "",
    message: "",
  };
  
  const custodianReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_DATA_USER_MANUAL":
        return { ...state, userManual_data: action.data.data, userManual_links: action.data.links, userManual_meta: action.data.meta };
      case "GET_ALL_FOR_TBL_DATA_USER_MANUAL":
        return { ...state, userManual_data: action.data.data, userManual_links: action.data.links, userManual_meta: action.data.meta };
      case "ADD_USER_MANUAL_DATA":
        return { ...state, userManual_details: action.data, status: action?.status, message: action?.msg}
      case "GET_USER_MANUAL_DATA":
        return { ...state, userManual_details: action?.data?.data, status: action?.status, message: action?.msg}
      case "DELETE_USER_MANUAL_DATA":
        return { ...state, status: action?.status, message: action?.msg}
      case "SET_USER_MANUAL_DATA_MESSAGE":
        return { ...state, status: action.status, message: action.msg}
      case "GET_LATEST_USER_MANUAL":
        return { ...state, userManual_data: action.data.data };        
      default:
        return { ...state };
    }
  };
  
  export default custodianReducer;