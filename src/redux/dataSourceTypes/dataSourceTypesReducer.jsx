const initialState = {
  dataSourceType_data: [],
  dataSourceType_links: {},
  dataSourceType_meta: {},
  dataSourceType_details: {},
  status: "",
  message: "",
};

const custodianReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ALL_DATA_SOURCE_TYPE":
      return { ...state, dataSourceType_data: action.data.data, dataSourceType_links: action.data.links, dataSourceType_meta: action.data.meta };
    case "GET_ALL_FOR_TBL_DATA":
      return { ...state, dataSourceType_data: action.data.data, dataSourceType_links: action.data.links, dataSourceType_meta: action.data.meta };
    case "ADD_SOURCE_TYPE_DATA":
      return { ...state, dataSourceType_details: action.data, status: action?.status, message: action?.msg}
    case "GET_SOURCE_TYPE_DATA":
      return { ...state, dataSourceType_details: action?.data?.data, status: action?.status, message: action?.msg}
    case "DELETE_SOURCE_TYPE_DATA":
      return { ...state, status: action?.status, message: action?.msg}
    case "SET_SOURCE_TYPE_DATA_MESSAGE":
      return { ...state, status: action.status, message: action.msg}
    default:
      return { ...state };
  }
};

export default custodianReducer;