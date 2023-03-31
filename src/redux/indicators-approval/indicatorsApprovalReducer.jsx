const initialState = {
  allData: [],
  data: [],
  total: 1,
  params: {},
  selectedIndicator: null,
};

const IndicatorsApprovalReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ALL_INDICATORS_DATA":
      return { ...state, allData: action.data };

    case "GET_INDICATORS_DATA":
      return {
        ...state,
        data: action.data,
        total: action.totalPages,
        params: action.params,
      };
    case "GET_INDICATOR_DATA":
      return { ...state, selectedIndicator: action.selectedIndicator };

    case "ADD_INDICATOR_DATA":
      return { ...state };

    case "DELETE_INDICATOR_DATA":
      return { ...state };

    default:
      return { ...state };
  }
};

export default IndicatorsApprovalReducer;