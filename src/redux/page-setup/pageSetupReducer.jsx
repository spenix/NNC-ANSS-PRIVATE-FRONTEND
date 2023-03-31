const initialState = {
    page_data: [],
    page_links: {},
    page_meta: {},
    page_details: {},
    page_content_types: [],
    page_options: [],
    status: "",
    message: "",
  };
  
  const pageSetupReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_DATA_PAGE":
      return { ...state, page_data: action.data.data, page_links: action.data.links, page_meta: action.data.meta };
      case "GET_ALL_DATA_PAGE_CONTENT_TYPE":
        return { ...state, page_content_types: action.data.data};
      case "GET_ALL_DATA_PAGE_OPTIONS":
        return { ...state, page_options: action.data};
      case "GET_ALL_FOR_TBL_DATA_PAGE":
        return { ...state, page_data: action.data.data, page_links: action.data.links, page_meta: action.data.meta };
      case "ADD_PAGE_DATA":
        return { ...state, page_details: action.data, status: action?.status, message: action?.msg}
      case "GET_PAGE_DATA":
        return { ...state, page_details: action?.data?.data, status: action?.status, message: action?.msg}
      case "DELETE_PAGE_DATA":
        return { ...state, status: action?.status, message: action?.msg}
      case "SET_PAGE_DATA_MESSAGE":
        return { ...state, status: action.status, message: action.msg}
      default:
        return { ...state };
    }
  };
  
  export default pageSetupReducer;