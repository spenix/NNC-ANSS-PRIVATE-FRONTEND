const initialState = {
  memberState_data: [],
  memberState_links: {},
  memberState_meta: {},
  memberState_details: {},
  status: "",
  message: "",
};

const custodianReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GET_ALL_DATA_MEMBER_STATE":
      return { ...state, memberState_data: action.data.data, memberState_links: action.data.links, memberState_meta: action.data.meta };
    case "GET_ALL_FOR_TBL_DATA":
      return { ...state, memberState_data: action.data.data, memberState_links: action.data.links, memberState_meta: action.data.meta };
    case "ADD_MEMBER_STATE_DATA":
      return { ...state, memberState_details: action.data, status: action?.status, message: action?.msg}
    case "GET_MEMBER_STATE_DATA":
      return { ...state, memberState_details: action?.data?.data, status: action?.status, message: action?.msg}
    case "DELETE_MEMBER_STATE_DATA":
      return { ...state, status: action?.status, message: action?.msg}
    case "SET_MEMBER_STATE_DATA_MESSAGE":
      return { ...state, status: action.status, message: action.msg}
    default:
      return { ...state };
  }
};

export default custodianReducer;