const initialState = {
  indicatorCategory_data: [],
  indicatorCategory_links: {},
  indicatorCategory_meta: {},
  indicatorCategory_details: {},
  status: "",
  message: "",
};

const indicatorCategoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ALL_DATA_INDICATOR_CATEGORY":
      return { ...state, indicatorCategory_data: action.data.data, indicatorCategory_links: action.data.links, indicatorCategory_meta: action.data.meta };
    case "GET_ALL_FOR_TBL_DATA":
      return { ...state, indicatorCategory_data: action.data.data, indicatorCategory_links: action.data.links, indicatorCategory_meta: action.data.meta };
    case "ADD_INDICATOR_CATEGORY_DATA":
      return { ...state, indicatorCategory_details: action.data, status: action?.status, message: action?.msg}
    case "GET_INDICATOR_CATEGORY_DATA":
      return { ...state, indicatorCategory_details: action?.data?.data, status: action?.status, message: action?.msg}
    case "DELETE_INDICATOR_CATEGORY_DATA":
      return { ...state, status: action?.status, message: action?.msg}
    case "SET_INDICATOR_CATEGORY_DATA_MESSAGE":
      return { ...state, status: action.status, message: action.msg}
    default:
      return { ...state };
  }
};

export default indicatorCategoriesReducer;