const initialState = {
    custodian_data: [],
    custodian_links: {},
    custodian_meta: {},
    custodian_details: {},
    status: "",
    message: "",
  };
  
  const custodianReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_DATA_CUSTODIAN":
        return { ...state, custodian_data: action.data.data, custodian_links: action.data.links, custodian_meta: action.data.meta };
      case "GET_ALL_FOR_TBL_DATA_CUSTODIAN":
        return { ...state, custodian_data: action.data.data, custodian_links: action.data.links, custodian_meta: action.data.meta };
      case "ADD_CUSTODIAN_DATA":
        return { ...state, custodian_details: action.data, status: action?.status, message: action?.msg}
      case "GET_CUSTODIAN_DATA":
        return { ...state, custodian_details: action?.data?.data, status: action?.status, message: action?.msg}
      case "DELETE_CUSTODIAN_DATA":
        return { ...state, status: action?.status, message: action?.msg}
      case "SET_CUSTODIAN_DATA_MESSAGE":
        return { ...state, status: action.status, message: action.msg}
      default:
        return { ...state };
    }
  };
  
  export default custodianReducer;