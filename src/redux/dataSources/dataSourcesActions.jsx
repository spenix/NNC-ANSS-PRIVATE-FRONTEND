// import instance from "./data";
import dataSourceService from "../../services/dataSourceService";

export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await dataSourceService.getAllDataSourceData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_SOURCE',
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
  return dataSourceService.getAllDataSourceForTblData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FOR_TBL_SOURCE_DATA',
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

export const getDataSourceData = (params, id) =>(dispatch)=>{
  return dataSourceService.getDataSourceData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_SOURCE_DATA',
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

export const deleteDataSourceData = (params, id) =>(dispatch)=>{
  return dataSourceService.deleteDataSourceData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_SOURCE_DATA',
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
            type: 'SET_SOURCE_DATA_MESSAGE',
            status: "error",
            msg: errMsg,
          });
  
            return Promise.reject();
      }
  );
};

export const editDataSourceData = (params, id) =>(dispatch)=>{
  return dataSourceService.editDataSourceData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_SOURCE_DATA',
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
          type: 'SET_SOURCE_DATA_MESSAGE',
          status: "error",
          msg: errMsg,
        });

          return Promise.reject();
    }
  );
};

export const addDataSourceData = (dataInputs) => (dispatch) => {
	return dataSourceService.submitDataSourceData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_SOURCE_DATA',
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
        console.log(errMsg);
			dispatch({
				type: 'SET_SOURCE_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}