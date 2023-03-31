const initialState = {
    allUsers: {},
    allData: [],
    data: [],
    total: 1,
    params: {},
    selectedUser: null,
    myprofile: [],
    myprofileMessage: "",
    message: "",
    status: "",
    countryDetail: [],
    fileData: {}
  };

  const usersReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_DATA":
        return { ...state, allData: action.data };

      case "GET_DATA":
        return {
          ...state,
          data: action.data,
          total: action.totalPages,
          params: action.params,
        };

      case "GET_ALL_USERS":
        return { ...state, allUsers: action.data };

      case "GET_ALL_USERS_FAIL":
        return { ...state };

      case "GET_USER_DETAILS":
        return { ...state, selectedUser: action.selectedUser };

      case "ADD_USER":
        return { ...state, isSuccess: true, isError: false };

      case "ADD_USER_FAIL":
        return { ...state, isError: true, isSuccess:false };

      case "DELETE_USER":
        return { ...state };

      case "SET_MESSAGE":
        return { ...state, message: action.payload, status: action?.status ?? ""  };

      case "GET_MY_PROFILE":
          return { ...state, myprofile: action.payload };

      case "GET_MY_PROFILE_FAIL":
          return { ...state };
      case "SET_USER_COUNTRY_DETAIL":
        return { ...state, countryDetail: action.data };
      case "UPDATE_MY_PROFILE":
        return { ...state, isSuccess: true, isError: false };

      case "UPDATE_MY_PROFILE_FAIL":
        return { ...state, isError: true, isSuccess:false };

      case "SET_UPDATE_MY_PROFILE_MESSAGE":
          return { ...state, myprofileMessage: action.payload };
      case "USER_ACTIVATION_MESSAGE":
        return { ...state, message: action.msg, status : action.status };
      case "CHANGE_PASSWORD_FAIL":
        return { ...state, isError: true, isSuccess:false };
      case "EXPORT_USERS_FAIL":
        return { ...state };   
      case "EXPORT_USERS":
          return { ...state, fileData: action.data};             
      default:
        return { ...state };
    }
  };

  export default usersReducer;