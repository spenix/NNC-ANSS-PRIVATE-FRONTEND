const initialState = {
    socialProgram_data: [],
    socialProgram_links: {},
    socialProgram_meta: {},
    socialProgram_details: {},
    socialProgram_status: {},
    status: "",
    message: "",
  };
  
  const socialProgramReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_DATA_SOCIAL_PROGRAM":
        return { ...state, socialProgram_data: action.data.data, socialProgram_links: action.data.links, socialProgram_meta: action.data.meta };
      case "GET_ALL_DATA_SOCIAL_PROGRAM_STATUS":
        return { ...state, socialProgram_status: action?.data?.data};
      case "GET_ALL_FOR_TBL_DATA_SOCIAL_PROGRAM":
        return { ...state, socialProgram_data: action.data.data, socialProgram_links: action.data.links, socialProgram_meta: action.data.meta };
      case "ADD_SOCIAL_PROGRAM_DATA":
        return { ...state, socialProgram_details: action.data, status: action?.status, message: action?.msg}
      case "GET_SOCIAL_PROGRAM_DATA":
        return { ...state, socialProgram_details: action?.data?.data, status: action?.status, message: action?.msg}
      case "DELETE_SOCIAL_PROGRAM_DATA":
        return { ...state, status: action?.status, message: action?.msg}
      case "SET_SOCIAL_PROGRAM_DATA_MESSAGE":
        return { ...state, status: action.status, message: action.msg}
      default:
        return { ...state };
    }
  };
  
  export default socialProgramReducer;