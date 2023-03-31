// import instance from "./data";
import policyStatusServices from "../../services/policyStatusServices";

export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await policyStatusServices.getAllPolicyStatusData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_POLICY_STATUS',
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
  return policyStatusServices.getAllPolicyStatusForTblData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FOR_TBL_DATA_POLICY_STATUS',
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

export const getPolicyStatusData = (params, id) =>(dispatch)=>{
  return policyStatusServices.getPolicyStatusData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_POLICY_STATUS_DATA',
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

export const deletePolicyStatusData = (params, id) =>(dispatch)=>{
  return policyStatusServices.deletePolicyStatusData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_POLICY_STATUS_DATA',
          status: "success",
          msg: "Policy status data is successfully deleted."
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
          type: 'SET_POLICY_STATUS_DATA_MESSAGE',
          status: "error",
          msg: errMsg,
        });
        return Promise.reject();
      }
  );
};

export const editPolicyStatusData = (params, id) =>(dispatch)=>{
  return policyStatusServices.editPolicyStatusData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_POLICY_STATUS_DATA',
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
          type: 'SET_POLICY_STATUS_DATA_MESSAGE',
          status: "error",
          msg: errMsg,
        });
        return Promise.reject();
      }
  );
};

export const addPolicyStatusData = (dataInputs) => (dispatch) => {
	return policyStatusServices.submitPolicyStatusData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_POLICY_STATUS_DATA',
				data: data,
        status: "success",
        msg: "Policy status is successfully added."
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
				type: 'SET_POLICY_STATUS_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}