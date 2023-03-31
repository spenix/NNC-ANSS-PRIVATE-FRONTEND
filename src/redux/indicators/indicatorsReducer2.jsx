const initialState = {
  indicator_data: [],
  indicator_links: {},
  indicator_meta: {},
  indicator_details: {},
  data_types:[],
  allData: [],
  indicatorsList:{},
  status: "",
  message: "",
};

const indicatorsReducer2 = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ALL_DATA_INDICATOR":
      return { ...state, indicator_data: action.data.data, indicator_links: action.data.links, indicator_meta: action.data.meta };
    case "FILTER_INDICATOR_DATA":
      return { ...state, indicator_data: action?.data?.data, indicator_links: action?.data?.links };
    case "GET_ALL_FOR_TBL_DATA":
      return { ...state, indicator_data: action.data.data, indicator_links: action.data.links, indicator_meta: action.data.meta };
    case "ADD_INDICATOR_DATA":
      return { ...state, indicator_details: action.data, status: action?.status, message: action?.msg}
    case "GET_INDICATOR_DATA":
      return { ...state, indicator_details: action?.data?.data, status: action?.status, message: action?.msg}
    case "DELETE_INDICATOR_DATA":
      return { ...state, status: action?.status, message: action?.msg}
    case "SET_INDICATOR_DATA_MESSAGE":
      return { ...state, status: action.status, message: action.msg}
    case "GET_INDICATORS_LIST":
      return { ...state, indicatorsList: action.indicatorsList}
    case "GET_ALL_DATA_TYPES_INDICATOR":
      return { ...state, data_types: action.data.data };
    default:
      return { ...state };
  }
};

export default indicatorsReducer2;