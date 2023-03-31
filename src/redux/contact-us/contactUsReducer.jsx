const initialState = {
    contactUs_data: [],
    contactUs_links: {},
    contactUs_meta: {},
    contactUs_details: {},
    status: "",
    message: "",
  };
  
  const contactUsReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_FOR_TBL_CONTACT_US":
        return { ...state, contactUs_data: action.data.data, contactUs_links: action.data.links, contactUs_meta: action.data.meta };
      case "DELETE_CONTACT_US_DATA":
        return { ...state, status: action?.status, message: action?.msg};
      case "SEARCH_CONTACT_US_FOR_TABLE_DATA":
        return { ...state, contactUs_data: action.data.data, contactUs_links: action.data.links, contactUs_meta: action.data.meta };        
      default:
        return { ...state };
    }
  };
  
  export default contactUsReducer;