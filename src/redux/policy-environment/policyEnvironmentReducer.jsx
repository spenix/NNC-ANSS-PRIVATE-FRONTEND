const initialState = {
    policyEnvironment_data: [],
    policyEnvironment_links: {},
    policyEnvironment_meta: {},
    policyEnvironment_details: {},
    status: "",
    message: "",
  };
  
  const policyEnvironmentReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_DATA_ENVIRONMENT":
        return { ...state, policyEnvironment_data: action.data.data, policyEnvironment_links: action.data.links, policyEnvironment_meta: action.data.meta };
      case "GET_ALL_FOR_TBL_DATA_ENVIRONMENT":
        return { ...state, policyEnvironment_data: action.data.data, policyEnvironment_links: action.data.links, policyEnvironment_meta: action.data.meta };
      case "ADD_ENVIRONMENT_DATA":
        return { ...state, policyEnvironment_details: action.data, status: action?.status, message: action?.msg}
      case "GET_ENVIRONMENT_DATA":
        return { ...state, policyEnvironment_details: action?.data?.data, status: action?.status, message: action?.msg}
      case "DELETE_ENVIRONMENT_DATA":
        return { ...state, status: action?.status, message: action?.msg}
      case "SET_ENVIRONMENT_DATA_MESSAGE":
        return { ...state, status: action.status, message: action.msg}
      default:
        return { ...state };
    }
  };
  
  export default policyEnvironmentReducer;