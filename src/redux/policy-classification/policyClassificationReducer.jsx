const initialState = {
    classification_data: [],
    classification_links: {},
    classification_meta: {},
    classification_details: {},
    status: "",
    message: "",
  };
  
  const policyClassificationReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_DATA_CLASSIFICATION":
        return { ...state, classification_data: action.data.data, classification_links: action.data.links, classification_meta: action.data.meta };
      case "GET_ALL_FOR_TBL_DATA_CLASSIFICATION":
        return { ...state, classification_data: action.data.data, classification_links: action.data.links, classification_meta: action.data.meta };
      case "ADD_CLASSIFICATION_DATA":
        return { ...state, classification_details: action.data, status: action?.status, message: action?.msg}
      case "GET_CLASSIFICATION_DATA":
        return { ...state, classification_details: action?.data?.data, status: action?.status, message: action?.msg}
      case "DELETE_CLASSIFICATION_DATA":
        return { ...state, status: action?.status, message: action?.msg}
      case "SET_CLASSIFICATION_DATA_MESSAGE":
        return { ...state, status: action.status, message: action.msg}
      default:
        return { ...state };
    }
  };
  
  export default policyClassificationReducer;