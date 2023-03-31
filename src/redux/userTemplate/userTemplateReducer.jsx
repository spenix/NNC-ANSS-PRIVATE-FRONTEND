const initialState = {
    userTemplate_data: [],
    userTemplate_links: {},
    userTemplate_meta: {},
    userTemplate_details: {},
    lastestTemplate:{},
    status: "",
    message: "",
    fileData: {}
  };
  
  const custodianReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_DATA_USER_TEMPLATE":
        return { ...state, userTemplate_data: action.data.data, userTemplate_links: action.data.links, userTemplate_meta: action.data.meta };
      case "GET_ALL_FOR_TBL_DATA_USER_TEMPLATE":
        return { ...state, userTemplate_data: action.data.data, userTemplate_links: action.data.links, userTemplate_meta: action.data.meta };
      case "ADD_USER_TEMPLATE_DATA":
        return { ...state, userTemplate_details: action.data, status: action?.status, message: action?.msg}
      case "GET_USER_TEMPLATE_DATA":
        return { ...state, userTemplate_details: action?.data?.data, status: action?.status, message: action?.msg}
      case "DELETE_USER_TEMPLATE_DATA":
        return { ...state, status: action?.status, message: action?.msg}
      case "SET_USER_TEMPLATE_DATA_MESSAGE":
        return { ...state, status: action.status, message: action.msg}
      case "GET_LATEST_USER_TEMPLATE":
        return { ...state, lastestTemplate: action?.data?.data };  
      case "SHOW_TEMPLATE_DATA":
        return { ...state, fileData: action.data};                  
      default:
        return { ...state };
    }
  };
  
  export default custodianReducer;