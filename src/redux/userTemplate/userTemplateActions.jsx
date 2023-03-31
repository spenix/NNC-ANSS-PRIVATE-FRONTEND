// import instance from "./data";
import UserTemplateService from "../../services/userTemplateService";

export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await UserTemplateService.getAllUserTemplateData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_USER_TEMPLATE',
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
  return UserTemplateService.getAllUserTemplateForTblData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FOR_TBL_DATA_USER_TEMPLATE',
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

export const getUserTemplateData = (params, id) =>(dispatch)=>{
  return UserTemplateService.getUserTemplateData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_USER_TEMPLATE_DATA',
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

export const deleteUserTemplateData = (params, id) =>(dispatch)=>{
  return UserTemplateService.deleteUserTemplateData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_USER_TEMPLATE_DATA',
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

export const editUserTemplateData = (params, id) =>(dispatch)=>{
  return UserTemplateService.editUserTemplateData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_USER_TEMPLATE_DATA',
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

export const addUserTemplateData = (dataInputs) => (dispatch) => {
	return UserTemplateService.submitUserTemplateData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_USER_TEMPLATE_DATA',
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
				type: 'SET_USER_TEMPLATE_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}

export const getLatestTemplate = (params) =>(dispatch)=>{
  return UserTemplateService.getLatestTemplate(params).then(
    (response) => {
      dispatch({
        type: 'GET_LATEST_USER_TEMPLATE',
        data: response?.data,
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
				type: 'SET_USER_TEMPLATE_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});

          return Promise.reject();
    }
  );
};

export const showFile = (params) =>(dispatch)=>{
  return UserTemplateService.showFile(params).then(
    (response) => {
      dispatch({
        type: 'SHOW_TEMPLATE_DATA',
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