const user = JSON.parse(localStorage.getItem("user"));
const initialState1 = user
  ? { isLoggedIn: true, user }
  : { isLoggedIn: false, user: null };

const initialState2  = {
	errorCode: 200,
	isVerifySuccess: true,
	email: "",
	message: "",
	registerSuccess: true,
	loginMessage: "",
	hash: "",
	pageRoles: "",
	userNotifs:[],
	notif_list:[],
	isVerified:false
};

const initialState = {
  ...initialState1,
  ...initialState2
};

export default function (state = initialState, action) {
const { type, payload } = action;
	switch (type) {
		case 'LOGIN_SUCCESS':
			return {
				...state,
				isLoggedIn: true,
				user: payload.user,
			};
		case 'LOGIN_FAIL':
			return {
				...state,
				isLoggedIn: false,
				user: null,
			};
		case 'LOGOUT':
			return {
				...state,
				isLoggedIn: false,
				user: null,
			};
		case 'VERIFY_INVITATION_SUCCESS':
			return {
				...state,
				isVerifySuccess: true,
				email: payload.data.data.attributes.email,
			};
		case 'VERIFY_INVITATION_FAIL':
			return {
				...state,
				isVerifySuccess: false,
				errorCode: payload.status
			};
		case 'REGISTER_SUCCESS':
			return {
				...state,
				isLoggedIn: true,
				data: payload.data,
			};
		case 'REGISTER_FAIL':
			return {
				...state,
				isLoggedIn: false,
				registerSuccess: false,
				user: null,
			};
		case 'FORGOT_PASSWORD':
			return {
				...state,
				email: action.payload.email,
			};
		case 'VERIFY_OTP':
			return {
				...state,
				hash: action.payload.hash,
			};
		case 'CHANGE_PASSWORD':
			return {
				...state,
				data: payload.data,
			};									
		case "SET_LOGIN_MESSAGE":
			return { ...state, loginMessage: action.payload };
		case "SET_PAGE_PERMISSION":
			return { ...state, pageRoles: action.roles };
		case "SET_MESSAGE":
			return { ...state, message: action.payload };
		case "SET_USER_NOTIFICATION":
			return { ...state, userNotifs: action.data };
		case "CHECK_IF_VERIFIED":
			return { ...state, isVerified: action?.data?.data?.is_verified, isLoggedIn: false, user: null };
		case "GET_USER_NOTIFICATION":
			return { ...state, notif_list: action.data.data };		
		case "CLEAR_USER_NOTIFICATION":
			return { ...state};					
		default:
			return state;
	}
}