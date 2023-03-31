// import instance from "./data";
import dataSourceTypes from "../../services/dataSourceTypes";

export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await dataSourceTypes.getAllDataSourceTypeData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_SOURCE_TYPE',
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
  return dataSourceTypes.getAllDataSourceTypeForTblData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FOR_TBL_DATA',
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

export const getDataSourceTypeData = (params, id) =>(dispatch)=>{
  return dataSourceTypes.getDataSourceTypeData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_SOURCE_TYPE_DATA',
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

export const deleteDataSourceTypeData = (params, id) =>(dispatch)=>{
  return dataSourceTypes.deleteDataSourceTypeData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_SOURCE_TYPE_DATA',
          status: "success",
          msg: "Data source type data is successfully deleted."
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
          type: 'SET_SOURCE_TYPE_DATA_MESSAGE',
          status: "error",
          msg: errMsg,
        });
        return Promise.reject();
      }
  );
};

export const editDataSourceTypeData = (params, id) =>(dispatch)=>{
  return dataSourceTypes.editDataSourceTypeData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_SOURCE_TYPE_DATA',
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

export const addDataSourceTypeData = (dataInputs) => (dispatch) => {
	return dataSourceTypes.submitDataSourceTypeData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_SOURCE_TYPE_DATA',
				data: data,
        status: "success",
        msg: "Data source type is successfully added."
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
				type: 'SET_SOURCE_TYPE_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}