import AuthService from "../../services/authServices";
export const login = (username, password) => (dispatch) => {
	return AuthService.login(username, password).then(
		(data) => {
			dispatch({
				type: 'LOGIN_SUCCESS',
				payload: { user: data },
			});
			return Promise.resolve();
			},
		(error) => {

			const message =
				(error.response &&
				error.response.data &&
				error.response.data.message) ||
				error.response.data.error.detail ||
				error.message ||
				error.toString();
			dispatch({
				type: 'LOGIN_FAIL',
			});
			dispatch({
				type: 'SET_LOGIN_MESSAGE',
				payload: message,
			});
			return Promise.reject();
		}
    );
};

export const verifyUserInvitation = (token) => (dispatch) => {
	return AuthService.verifyUserInvitation(token).then(
		(data) => {
			dispatch({
				type: 'VERIFY_INVITATION_SUCCESS',
				payload: data,
			});
			return Promise.resolve();
			},
		(error) => {

			const errData = error.response;

			const message =
				(error.response &&
				error.response.data &&
				error.response.data.message) ||
				error.message ||
				error.toString();
			dispatch({
				type: 'VERIFY_INVITATION_FAIL',
				payload: errData,
			});
			return Promise.reject();
		}
    );
};

export const register = (data) => (dispatch) => {
	return AuthService.register(data).then(
		(data) => {
			dispatch({
				type: 'REGISTER_SUCCESS',
				payload: { data: data },
			});
			return Promise.resolve();
			},
		(error) => {
			const message =
				(error.response &&
				error.response.data &&
				error.response.data.message) ||
				error.response.data.error.detail ||
				error.message ||
				error.response.data.error.detail;
			dispatch({
				type: 'REGISTER_FAIL',
			});
			dispatch({
				type: 'SET_MESSAGE',
				payload: message,
			});
			return Promise.reject();
		}
    );
};

export const logout = () => (dispatch) => {
	AuthService.logout();
	dispatch({
		type: 'LOGOUT',
	});
};

export const forgotPassword = (email) => (dispatch) => {
	return AuthService.forgotPassword(email).then(
		(data) => {
			dispatch({
				type: 'FORGOT_PASSWORD',
				payload: { email: data.email },
			});
      return Promise.resolve();
			},
		(error) => {

			const message =
				(error.response &&
				error.response.data &&
				error.response.data.message) ||
				error.message ||
				error.toString();

			dispatch({
				type: 'FORGOT_PASSWORD_FAIL',
			});
			dispatch({
				type: 'SET_FORGOT_PASSWORD_MESSAGE',
				payload: message,
			});
      return Promise.reject();
		}
  );
};

export const verifyOtp = (hash) => (dispatch) => {
	return AuthService.verifyOtp(hash).then(
		(data) => {
			dispatch({
				type: 'VERIFY_OTP',
				payload: { hash: data.password_hash },
			});
      		return Promise.resolve();
			},
		(error) => {

			const message =
				(error.response &&
				error.response.data &&
				error.response.data.message) ||
				error.message ||
				error.toString();

			dispatch({
				type: 'VERIFY_OTP_FAIL',
			});
			dispatch({
				type: 'SET_VERIFY_OTP_MESSAGE',
				payload: message,
			});
      		return Promise.reject();
		}
  );
};

export const changePassword = (data) => (dispatch) => {
	return AuthService.changePassword(data).then(
		(data) => {
			dispatch({
				type: 'CHANGE_PASSWORD',
				payload: { payload: data },
			});
      return Promise.resolve();
			},
		(error) => {
			const message =
				(error.response &&
				error.response.data &&
				error.response.data.message) ||
				error.message ||
				error.toString();

			dispatch({
				type: 'CHANGE_PASSWORD_FAIL',
			});
			dispatch({
				type: 'SET_CHANGE_PASSWORD_MESSAGE',
				payload: message,
			});
      		return Promise.reject();
		}
  );
};

export const checkIfVerified = (data) =>(dispatch)=>{
	return AuthService.checkIfVerified(data).then(
	  (response) => {
		dispatch({
		  type: 'CHECK_IF_VERIFIED',
		  data: response,
		});
			return Promise.resolve();
		},
		(error) => {
			const message =
				(error.response &&
				error.response.data &&
				error.response.data.message) ||
				error.response.data.error.detail ||
				error.message ||
				error.toString();
			dispatch({
				type: 'SET_LOGIN_MESSAGE',
				payload: message,
			});
			return Promise.reject();
		}
	);
  };

  export const getNotifList = () =>(dispatch)=>{
	  return AuthService.getNotifList().then(
		  (response) => {
			  dispatch({
				  type: 'GET_USER_NOTIFICATION',
				  data: response.data,
				});
			return Promise.resolve();
		},
		(error) => {
			const message =
				(error.response &&
				error.response.data &&
				error.response.data.message) ||
				error.response.data.error.detail ||
				error.message ||
				error.toString();
			dispatch({
				type: 'SET_MESSAGE',
				payload: message,
			});
			return Promise.reject();
		}
	);
  };  

  export const clearAllNotif = () =>(dispatch)=>{
	return AuthService.clearAllNotif().then(
		(response) => {
			dispatch({
				type: 'CLEAR_USER_NOTIFICATION',
				data: response.data,
			  });
		  return Promise.resolve();
	  },
	  (error) => {
		  const message =
			  (error.response &&
			  error.response.data &&
			  error.response.data.message) ||
			  error.response.data.error.detail ||
			  error.message ||
			  error.toString();
		  dispatch({
			  type: 'SET_MESSAGE',
			  payload: message,
		  });
		  return Promise.reject();
	  }
  );
};  
