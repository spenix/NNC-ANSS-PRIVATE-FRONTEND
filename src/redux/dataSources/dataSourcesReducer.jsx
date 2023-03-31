const initialState = {
  dataSource_data: [],
  dataSource_links: {},
  dataSource_meta: {},
  dataSource_details: {},
  status: "",
  message: "",
};

const dataSourcesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ALL_DATA_SOURCE":
      return { ...state, dataSource_data: action.data.data, dataSource_links: action.data.links, dataSource_meta: action.data.meta };
    case "GET_ALL_FOR_TBL_SOURCE_DATA":
      return { ...state, dataSource_data: action?.data?.data, dataSource_links: action?.data?.links, dataSource_meta: action?.data?.meta };
    case "ADD_SOURCE_DATA":
      return { ...state, dataSource_details: action.data, status: action?.status, message: action?.msg}
    case "GET_SOURCE_DATA":
      return { ...state, dataSource_details: action?.data?.data, status: action?.status, message: action?.msg}
    case "DELETE_SOURCE_DATA":
      return { ...state, status: action?.status, message: action?.msg}
    case "SET_SOURCE_DATA_MESSAGE":
      return { ...state, status: action.status, message: action.msg}
    default:
      return { ...state };
  }
};

export default dataSourcesReducer;