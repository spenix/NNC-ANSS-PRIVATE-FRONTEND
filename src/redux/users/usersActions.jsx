import instance from "./data";

import axios from "axios";

import {BASE_URL} from "../../utils/Constants"

import authHeader from '../../auth/authHeader';

import UserService from "../../services/userServices";


export const getAllData = () => {
  return async (dispatch) => {
    await instance.get("/api/users/list/all-data").then((response) => {
      dispatch({
        type: "GET_ALL_DATA",
        data: response.data,
      });
    });
  };
};

export const getData = (id) => {
  return async (dispatch) => {

    await axios
        .get(BASE_URL +  "/users/" + id,  {
            headers: authHeader()
        })
        .then((response) => {

            dispatch({
                type: "GET_DATA",
                data: response.data.data,
            });

        });

  };
};

export const getUser = (id) => {
  return async (dispatch) => {
    await axios
        .get(BASE_URL +  "/users/" + id,  {
            headers: authHeader()
        })
        .then((response) => {
            dispatch({
                type: "GET_USER_DETAILS",
                selectedUser: response.data.data,
            });

        });
  };
};

export const getAllUsers = (params) => (dispatch)=> {

	return UserService.getUsers(params).then(
		(response) => {
			dispatch({
				type: 'GET_ALL_USERS',
				data: response.data,
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
				type: 'GET_ALL_USERS_FAIL',
			});
      		return Promise.reject();
		}
	);
}

export const searchDataList = (params) =>(dispatch)=>{
	return UserService.searchUsersData(params).then(
	  (response) => {
		dispatch({
		  type: 'GET_ALL_USERS',
		  data: response.data,
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
			type: 'USER_ACTIVATION_MESSAGE',
			status: 'error',
			msg: message,
		});
			return Promise.reject();
	  }
	);
  };

export const addUser = (user) => (dispatch) => {
	return UserService.addUser(user).then(
		(data) => {
			dispatch({
				type: 'ADD_USER',
				payload: { user: data },
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

        const respErrors = error.response.data.errors;

        let errMsg = "";

        for (let i = 0; i < respErrors.length; i++) {

          if(i > 0) {
            errMsg = errMsg + ", ";
          }


          errMsg = errMsg + respErrors[i]['detail'];
        }

			dispatch({
				type: 'ADD_USER_FAIL',
			});
			dispatch({
				type: 'SET_MESSAGE',
				payload: errMsg,
			});
      return Promise.reject();
		}
  );
};

export const deleteUser = (id) => {
  return (dispatch, getState) => {
    instance
      .delete("/apps/users/delete", {
        id,
      })
      .then(() => {
        dispatch({
          type: "DELETE_USER",
        });
      })
      .then(() => {
        dispatch(getData(getState().contact.params));
        dispatch(getAllData());
      });
  };
};

export const getMyProfileDetails = () => (dispatch) => {
	return UserService.getMyProfileDetails().then(
		(response) => {
			dispatch({
				type: 'GET_MY_PROFILE',
				payload: response.data.data.attributes,
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
				type: 'GET_MY_PROFILE_FAIL',
			});
			dispatch({
				type: 'SET_MESSAGE',
				payload: message,
			});
      		return Promise.reject();
		}
  );
};

export const updateMyProfileDetails = (user) => (dispatch) => {
	return UserService.updateMyProfileDetails(user).then(
		(data) => {
			dispatch({
				type: 'UPDATE_MY_PROFILE',
				payload: { user: data },
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
				type: 'UPDATE_MY_PROFILE_FAIL',
			});
			dispatch({
				type: 'SET_UPDATE_MY_PROFILE_MESSAGE',
				payload: message,
			});
      return Promise.reject();
		}
  );
};

export const changePassword = (user) => (dispatch) => {
	return UserService.changePassword(user).then(
		(data) => {
			dispatch({
				type: 'CHANGE_PASSWORD',
				payload: { user: data },
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
}

export const userActivation = (params) => (dispatch) => {
	return UserService.userActivation(params).then(
		(data) => {
			dispatch({
				type: 'USER_ACTIVATION_MESSAGE',
				status: 'success',
				msg: `User Account was ${params?.status ? "activated" : "deactivated"} successfully.`,
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
				type: 'USER_ACTIVATION_MESSAGE',
				status: 'error',
				msg: message,
			});
      		
			return Promise.reject();
		}
  	);
}

export const getCountryDetails = (country) => (dispatch) => {
	return UserService.getCountryDetails(country).then(
		(data) => {
			dispatch({
				type: 'SET_USER_COUNTRY_DETAIL',
				data: data?.data ?? [],
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
				type: 'SET_MESSAGE',
				status: 'error',
				msg: message,
			});
      		
			return Promise.reject();
		}
  	);
}

export const exportUsers = (filter, params) => (dispatch) => {
	return UserService.exportUsers(filter, params).then(
		(response) => {
			dispatch({
				type: 'EXPORT_USERS',
				data: response
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
				type: 'EXPORT_USERS_FAIL',
			});
			dispatch({
				type: 'SET_MESSAGE',
				payload: message,
			});
      		return Promise.reject();
		}
  );
};