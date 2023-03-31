const initialState = {
    afnsReport_data: [],
    afnsReport_links: {},
    afnsReport_meta: {},
    afnsReport_details: {},
    status: "",
    message: "",
  };
  
  const afnsReportReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_DATA_AFNS_REPORT":
        return { ...state, afnsReport_data: action.data.data, afnsReport_links: action.data.links, afnsReport_meta: action.data.meta };
      case "GET_ALL_FOR_TBL_DATA_AFNS_REPORT":
        return { ...state, afnsReport_data: action.data.data, afnsReport_links: action.data.links, afnsReport_meta: action.data.meta };
      case "ADD_AFNS_REPORT_DATA":
        return { ...state, afnsReport_details: action.data, status: action?.status, message: action?.msg}
      case "GET_AFNS_REPORT_DATA":
        return { ...state, afnsReport_details: action?.data?.data, status: action?.status, message: action?.msg}
      case "DELETE_AFNS_REPORT_DATA":
        return { ...state, status: action?.status, message: action?.msg}
      case "SET_AFNS_REPORT_DATA_MESSAGE":
        return { ...state, status: action.status, message: action.msg}
      default:
        return { ...state };
    }
  };
  
  export default afnsReportReducer;