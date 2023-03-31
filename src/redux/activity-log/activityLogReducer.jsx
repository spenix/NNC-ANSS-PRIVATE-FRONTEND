const initialState = {
    activityLog_data: [],
    activityLog_links: {},
    activityLog_meta: {},
    activityLog_details: {},
    status: "",
    message: "",
  };
  
  const activityLogReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_FOR_TBL_ACTIVITY_LOG":
        return { ...state, activityLog_data: action.data.data, activityLog_links: action.data.links, activityLog_meta: action.data.meta };
      case "SEARCH_ACTIVITY_LOG_FOR_TABLE_DATA":
        return { ...state, activityLog_data: action.data.data, activityLog_links: action.data.links, activityLog_meta: action.data.meta };
      case "GET_ACTIVITY_LOG_DATA":
        return { ...state, activityLog_details: action.data.data};                     
      default:
        return { ...state };
    }
  };
  
  export default activityLogReducer;