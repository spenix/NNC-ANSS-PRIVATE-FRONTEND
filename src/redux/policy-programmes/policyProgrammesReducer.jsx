const initialState = {
    programmes_data: [],
    programmes_links: {},
    programmes_meta: {},
    programmes_details: {},
    programmes_status: {},
    status: "",
    message: "",
  };
  
  const custodianReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_DATA_PROGRAMMES":
        return { ...state, programmes_data: action.data.data, programmes_links: action.data.links, programmes_meta: action.data.meta };
      case "GET_ALL_DATA_PROGRAMMES_STATUS":
        return { ...state, programmes_status: action?.data?.data};
      case "GET_ALL_FOR_TBL_DATA_PROGRAMMES":
        return { ...state, programmes_data: action.data.data, programmes_links: action.data.links, programmes_meta: action.data.meta };
      case "ADD_PROGRAMMES_DATA":
        return { ...state, programmes_details: action.data, status: action?.status, message: action?.msg}
      case "GET_PROGRAMMES_DATA":
        return { ...state, programmes_details: action?.data?.data, status: action?.status, message: action?.msg}
      case "DELETE_PROGRAMMES_DATA":
        return { ...state, status: action?.status, message: action?.msg}
      case "SET_PROGRAMMES_DATA_MESSAGE":
        return { ...state, status: action.status, message: action.msg}
      default:
        return { ...state };
    }
  };
  
  export default custodianReducer;