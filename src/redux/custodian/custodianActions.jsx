// import instance from "./data";
import custodianServices from "../../services/custodianServices";

export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await custodianServices.getAllCustodianData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_CUSTODIAN',
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


export const getAllForTblData = (params) => (dispatch)=>{
  return custodianServices.getAllCustodianForTblData(params).then(
    (response) => {
      
      dispatch({
        type: 'GET_ALL_FOR_TBL_DATA_CUSTODIAN',
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
  return custodianServices.searchCustodianForTblData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FOR_TBL_DATA_CUSTODIAN',
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

export const getCustodianData = (params, id) =>(dispatch)=>{
  return custodianServices.getCustodianData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_CUSTODIAN_DATA',
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

export const deleteCustodianData = (params, id) =>(dispatch)=>{
  return custodianServices.deleteCustodianData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_CUSTODIAN_DATA',
          status: "success",
          msg: "Custodian data is successfully deleted."
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
            type: 'SET_CUSTODIAN_DATA_MESSAGE',
            status: "error",
            msg: errMsg,
          });
          return Promise.reject();
      }
  );
};

export const editCustodianData = (params, id) =>(dispatch)=>{
  return custodianServices.editCustodianData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_CUSTODIAN_DATA',
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
          type: 'SET_CUSTODIAN_DATA_MESSAGE',
          status: "error",
          msg: errMsg,
        });
        return Promise.reject();
    }
  );
};

export const addCustodianData = (dataInputs) => (dispatch) => {
	return custodianServices.submitCustodianData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_CUSTODIAN_DATA',
				data: data,
        status: "success",
        msg: "Custodian is successfully added."
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
				type: 'SET_CUSTODIAN_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}