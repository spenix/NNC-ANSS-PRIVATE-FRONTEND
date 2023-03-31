const initialState = {
    indicatorType_data: [],
    indicatorType_links: {},
    indicatorType_meta: {},
    indicatorType_details: {},
    status: "",
    message: "",
  };
  
  const indicatorTypesReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_DATA_INDICATOR_TYPE":
        return { ...state, indicatorType_data: action.data.data, indicatorType_links: action.data.links, indicatorType_meta: action.data.meta };
      case "GET_ALL_FOR_TBL_DATA":
        return { ...state, indicatorType_data: action.data.data, indicatorType_links: action.data.links, indicatorType_meta: action.data.meta };
      case "ADD_INDICATOR_TYPE_DATA":
        return { ...state, indicatorType_details: action.data, status: action?.status, message: action?.msg}
      case "GET_INDICATOR_TYPE_DATA":
        return { ...state, indicatorType_details: action?.data?.data, status: action?.status, message: action?.msg}
      case "DELETE_INDICATOR_TYPE_DATA":
        return { ...state, status: action?.status, message: action?.msg}
      case "SET_INDICATOR_TYPE_DATA_MESSAGE":
        return { ...state, status: action.status, message: action.msg}
      case "GET_ALL_ACTIVE_DATA_INDICATOR_TYPE":
        return { ...state, indicatorType_data: action.data.data, indicatorType_links: action.data.links, indicatorType_meta: action.data.meta };        
      default:
        return { ...state };
    }
  };
  
  export default indicatorTypesReducer;