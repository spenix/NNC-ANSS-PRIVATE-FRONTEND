// import instance from "./data";
import policyEnvironmentServices from "../../services/policyEnvironmentServices";

export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await policyEnvironmentServices.getAllPolicyEnvironmentData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_ENVIRONMENT',
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
  return policyEnvironmentServices.getAllPolicyEnvironmentForTblData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FOR_TBL_DATA_ENVIRONMENT',
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

export const getPolicyEnvironmentData = (params, id) =>(dispatch)=>{
  return policyEnvironmentServices.getPolicyEnvironmentData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_ENVIRONMENT_DATA',
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

export const deletePolicyEnvironmentData = (params, id) =>(dispatch)=>{
  return policyEnvironmentServices.deletePolicyEnvironmentData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_ENVIRONMENT_DATA',
          status: "success",
          msg: "PolicyEnvironment data is successfully deleted."
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
          type: 'SET_ENVIRONMENT_DATA_MESSAGE',
          status: "error",
          msg: errMsg,
        });
        return Promise.reject();
      }
  );
};

export const editPolicyEnvironmentData = (params, id) =>(dispatch)=>{
  return policyEnvironmentServices.editPolicyEnvironmentData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_ENVIRONMENT_DATA',
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

export const addPolicyEnvironmentData = (dataInputs) => (dispatch) => {
	return policyEnvironmentServices.submitPolicyEnvironmentData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_ENVIRONMENT_DATA',
				data: data,
        status: "success",
        msg: "Policy environment is successfully added."
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
        console.log(errMsg);
			dispatch({
				type: 'SET_ENVIRONMENT_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}