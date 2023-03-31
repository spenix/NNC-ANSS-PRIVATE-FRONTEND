const initialState = {
    allData: [],
    data: [],
    total: 1,
    params: {},
    selectedCountry: null,
  };
  
  const asianCountriesReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_ASIAN_COUNTRIES":
        return { ...state, allData: action.data };
      case "GET_ALL_ASIAN_COUNTRIES_V2":
          return { ...state, allData: action.data, data: action.data.data };

      case "GET_ASIAN_COUNTRIES":
        return {
          ...state,
          data: action.data,
          total: action.totalPages,
          params: action.params,
        };
      case "GET_ASIAN_COUNTRY":
        return { ...state, selectedCountry: action.selectedCountry };
  
      case "ADD_ASIAN_COUNTRY":
        return { ...state };
  
      case "DELETE_ASIAN_COUNTRY":
        return { ...state };
  
      default:
        return { ...state };
    }
  };
  
  export default asianCountriesReducer;