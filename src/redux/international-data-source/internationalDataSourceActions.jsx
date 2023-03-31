// import instance from "./data";
import internationalDataSourceService from "../../services/internationalDataSourceService";

export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await internationalDataSourceService.getAllIDSData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_IDS',
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
  return internationalDataSourceService.getAllIDSForTblData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FOR_TBL_DATA_IDS',
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

export const getIDSData = (params, id) =>(dispatch)=>{
  return internationalDataSourceService.getIDSData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_IDS_DATA',
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

export const deleteIDSData = (params, id) =>(dispatch)=>{
  return internationalDataSourceService.deleteIDSData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_IDS_DATA',
          status: "success",
          msg: "International data source data is successfully deleted."
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
          type: 'SET_IDS_DATA_MESSAGE',
          status: "error",
          msg: errMsg,
        });
        return Promise.reject();
      }
  );
};

export const editIDSData = (params, id) =>(dispatch)=>{
  return internationalDataSourceService.editIDSData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_IDS_DATA',
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

export const addIDSData = (dataInputs) => (dispatch) => {
	return internationalDataSourceService.submitIDSData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_IDS_DATA',
				data: data,
        status: "success",
        msg: "International data source is successfully added."
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
				type: 'SET_IDS_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}