// import instance from "./data";
import policyClassificationServices from "../../services/policyClassificationServices";

export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await policyClassificationServices.getAllPolicyClassificationData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_CLASSIFICATION',
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
  return policyClassificationServices.getAllPolicyClassificationForTblData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FOR_TBL_DATA_CLASSIFICATION',
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

export const getPolicyClassificationData = (params, id) =>(dispatch)=>{
  return policyClassificationServices.getPolicyClassificationData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_CLASSIFICATION_DATA',
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

export const deletePolicyClassificationData = (params, id) =>(dispatch)=>{
  return policyClassificationServices.deletePolicyClassificationData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_CLASSIFICATION_DATA',
          status: "success",
          msg: "PolicyClassification data is successfully deleted."
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
          type: 'SET_CLASSIFICATION_DATA_MESSAGE',
          status: "error",
          msg: errMsg,
        });
        return Promise.reject();
      }
  );
};

export const editPolicyClassificationData = (params, id) =>(dispatch)=>{
  return policyClassificationServices.editPolicyClassificationData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_CLASSIFICATION_DATA',
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

export const addPolicyClassificationData = (dataInputs) => (dispatch) => {
	return policyClassificationServices.submitPolicyClassificationData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_CLASSIFICATION_DATA',
				data: data,
        status: "success",
        msg: "PolicyClassification is successfully added."
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
				type: 'SET_CLASSIFICATION_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}