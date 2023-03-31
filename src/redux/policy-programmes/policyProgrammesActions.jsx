// import instance from "./data";
import policyProgrammesService from "../../services/policyProgrammesService";

export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await policyProgrammesService.getAllPolicyProgrammesData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_PROGRAMMES',
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

export const getPolicyProgrammesStatus = (params = {}) => {
  return async (dispatch) => {
    await policyProgrammesService.getPolicyProgrammesStatus(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_PROGRAMMES_STATUS',
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
  return policyProgrammesService.getAllPolicyProgrammesForTblData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FOR_TBL_DATA_PROGRAMMES',
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

export const searchDataList = (params) =>(dispatch)=>{
  return policyProgrammesService.searchPolicyProgrammesForTblData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FOR_TBL_DATA_PROGRAMMES',
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

export const getPolicyProgrammesData = (params, id) =>(dispatch)=>{
  return policyProgrammesService.getPolicyProgrammesData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_PROGRAMMES_DATA',
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

export const deletePolicyProgrammesData = (params, id) =>(dispatch)=>{
  return policyProgrammesService.deletePolicyProgrammesData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_PROGRAMMES_DATA',
          status: "success",
          msg: "Policy and program data is successfully deleted."
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

export const editPolicyProgrammesData = (params, id) =>(dispatch)=>{
  return policyProgrammesService.editPolicyProgrammesData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_PROGRAMMES_DATA',
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
      let errMsg = [];
      if(respData.hasOwnProperty('errors')) {
        const respErrors = error.response.data.errors;
        for (let i = 0; i < respErrors.length; i++) {
          errMsg.push(respErrors[i]['detail']);
        }
      } else {
        errMsg.push(error.response.data.error.detail);
      }
			dispatch({
				type: 'SET_PROGRAMMES_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});

          return Promise.reject();
    }
  );
};

export const PolicyProgrammesDataApproval = (params, id) =>(dispatch)=>{
  return policyProgrammesService.PolicyProgrammesDataApproval(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'SET_PROGRAMMES_DATA_MESSAGE',
          status: "success",
          msg: `Policy and programme data successfully ${params?.data?.attributes?.remarks}.`
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
          type: 'SET_PROGRAMMES_DATA_MESSAGE',
          status: "error",
          msg: errMsg,
        });
    }
  );
};

export const addPolicyProgrammesData = (dataInputs) => (dispatch) => {
	return policyProgrammesService.submitPolicyProgrammesData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_PROGRAMMES_DATA',
				data: data,
        status: "success",
        msg: "Policy and program is successfully added."
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
      let errMsg = [];
      if(respData.hasOwnProperty('errors')) {
        const respErrors = error.response.data.errors;
        for (let i = 0; i < respErrors.length; i++) {
          errMsg.push(respErrors[i]['detail']);
        }
      } else {
        errMsg.push(error.response.data.error.detail);
      }
			dispatch({
				type: 'SET_PROGRAMMES_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}