const initialState = {
    collectionPeriod_data: [],
    collectionPeriod_links: {},
    collectionPeriod_meta: {},
    collectionPeriod_details: {},
    status: "",
    message: "",
  };
  
  const collectionPeriodReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_DATA":
        return { ...state, collectionPeriod_data: action?.data?.data, collectionPeriod_links: action?.data?.links, collectionPeriod_meta: action?.data?.meta };
      case "GET_ALL_FOR_TBL_DATA":
        return { ...state, collectionPeriod_data: action?.data?.data, collectionPeriod_links: action?.data?.links, collectionPeriod_meta: action?.data?.meta };
      case "ADD_COLLECTION_PERIOD_DATA":
        return { ...state, collectionPeriod_details: action.data, status: action?.status, message: action?.msg}
      case "SET_COLLECTION_PERIOD_DATA_MESSAGE":
        return { ...state, status: action.status, message: action.msg}
      default:
        return { ...state };
    }
  };
  
  export default collectionPeriodReducer;