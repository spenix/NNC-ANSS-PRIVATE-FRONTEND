const initialState = {
    ids_data: [],
    ids_links: {},
    ids_meta: {},
    ids_details: {},
    status: "",
    message: "",
  };
  
  const custodianReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_DATA_IDS":
        return { ...state, ids_data: action.data.data, ids_links: action.data.links, ids_meta: action.data.meta };
      case "GET_ALL_FOR_TBL_DATA_IDS":
        return { ...state, ids_data: action.data.data, ids_links: action.data.links, ids_meta: action.data.meta };
      case "ADD_IDS_DATA":
        return { ...state, ids_details: action.data, status: action?.status, message: action?.msg}
      case "GET_IDS_DATA":
        return { ...state, ids_details: action?.data?.data, status: action?.status, message: action?.msg}
      case "DELETE_IDS_DATA":
        return { ...state, status: action?.status, message: action?.msg}
      case "SET_IDS_DATA_MESSAGE":
        return { ...state, status: action.status, message: action.msg}
      default:
        return { ...state };
    }
  };
  
  export default custodianReducer;