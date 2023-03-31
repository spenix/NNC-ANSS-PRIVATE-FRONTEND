const initialState = {
    esportData_data: [],
    esportData_links: {},
    esportData_meta: {},
    esportData_details: {},
    status: "",
    message: "",
  };
  
  const exportDataReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_DATA_EXPORT":
        return { ...state, esportData_data: action.data.data, esportData_links: action.data.links, esportData_meta: action.data.meta };
      case "GET_ALL_FOR_TBL_DATA_EXPORT":
        return { ...state, esportData_data: action.data.data, esportData_links: action.data.links, esportData_meta: action.data.meta };
      case "ADD_EXPORT_DATA":
        return { ...state, esportData_details: action.data, status: action?.status, message: action?.msg}
      case "GET_EXPORT_DATA":
        return { ...state, esportData_details: action?.data?.data, status: action?.status, message: action?.msg}
      case "DELETE_EXPORT_DATA":
        return { ...state, status: action?.status, message: action?.msg}
      case "SET_EXPORT_DATA_MESSAGE":
        return { ...state, status: action.status, message: action.msg}
      default:
        return { ...state };
    }
  };
  
  export default exportDataReducer;