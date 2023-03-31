// import instance from "./data";
import UserManualService from "../../services/userManualService";

export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await UserManualService.getAllUserManualData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_USER_MANUAL',
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
            return Promise.reject();
      }
    );
  };
  
};

export const getAllForTblData = (params) =>(dispatch)=>{
  return UserManualService.getAllUserManualForTblData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FOR_TBL_DATA_USER_MANUAL',
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
          return Promise.reject();
    }
  );
};

export const getUserManualData = (params, id) =>(dispatch)=>{
  return UserManualService.getUserManualData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_USER_MANUAL_DATA',
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
          return Promise.reject();
    }
  );
};

export const deleteUserManualData = (params, id) =>(dispatch)=>{
  return UserManualService.deleteUserManualData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_USER_MANUAL_DATA',
          status: "success",
          msg: "Afns report data is successfully deleted."
        });
      }
        return Promise.resolve();
      },
    (error) => {
      const message =
        (error.response &&
        error.response.data &&
        error.response.data.message) ||
        error.message ||
        error.toString();
          return Promise.reject();
    }
  );
};

export const editUserManualData = (params, id) =>(dispatch)=>{
  return UserManualService.editUserManualData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_USER_MANUAL_DATA',
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
          return Promise.reject();
    }
  );
};

export const addUserManualData = (dataInputs) => (dispatch) => {
	return UserManualService.submitUserManualData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_USER_MANUAL_DATA',
				data: data,
        status: "success",
        msg: "Afns report is successfully added."
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

      const respData = error.response.data;
      let errMsg = "";
      if(respData.hasOwnProperty('errors')) {
        const respErrors = error.response.data.errors;
        for (let i = 0; i < respErrors.length; i++) {
          if(i > 0) {
            errMsg = errMsg + ", ";
          }
          errMsg = errMsg + respErrors[i]['detail'];
        }
      } else {
        errMsg =   error.response.data.error.detail;
      }
			dispatch({
				type: 'SET_USER_MANUAL_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}

export const getLatestManual = (params) =>(dispatch)=>{
  return UserManualService.getLatestManual(params).then(
    (response) => {
      dispatch({
        type: 'GET_LATEST_USER_MANUAL',
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
          return Promise.reject();
    }
  );
};