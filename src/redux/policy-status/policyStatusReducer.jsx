const initialState = {
    policyStatus_data: [],
    policyStatus_links: {},
    policyStatus_meta: {},
    policyStatus_details: {},
    status: "",
    message: "",
  };
  
  const policyStatusReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_DATA_POLICY_STATUS":
        return { ...state, policyStatus_data: action.data.data, policyStatus_links: action.data.links, policyStatus_meta: action.data.meta };
      case "GET_ALL_FOR_TBL_DATA_POLICY_STATUS":
        return { ...state, policyStatus_data: action.data.data, policyStatus_links: action.data.links, policyStatus_meta: action.data.meta };
      case "ADD_POLICY_STATUS_DATA":
        return { ...state, policyStatus_details: action.data, status: action?.status, message: action?.msg}
      case "GET_POLICY_STATUS_DATA":
        return { ...state, policyStatus_details: action?.data?.data, status: action?.status, message: action?.msg}
      case "DELETE_POLICY_STATUS_DATA":
        return { ...state, status: action?.status, message: action?.msg}
      case "SET_POLICY_STATUS_DATA_MESSAGE":
        return { ...state, status: action.status, message: action.msg}
      default:
        return { ...state };
    }
  };
  
  export default policyStatusReducer;