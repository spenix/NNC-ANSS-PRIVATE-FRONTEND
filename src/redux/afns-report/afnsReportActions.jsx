// import instance from "./data";
import afnsReportService from "../../services/afnsReportService";

export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await afnsReportService.getAllAfnsReportData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_AFNS_REPORT',
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
  return afnsReportService.getAllAfnsReportForTblData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FOR_TBL_DATA_AFNS_REPORT',
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

export const getAfnsReportData = (params, id) =>(dispatch)=>{
  return afnsReportService.getAfnsReportData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_AFNS_REPORT_DATA',
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

export const deleteAfnsReportData = (params, id) =>(dispatch)=>{
  return afnsReportService.deleteAfnsReportData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_AFNS_REPORT_DATA',
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

export const editAfnsReportData = (params, id) =>(dispatch)=>{
  return afnsReportService.editAfnsReportData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_AFNS_REPORT_DATA',
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

export const addAfnsReportData = (dataInputs) => (dispatch) => {
	return afnsReportService.submitAfnsReportData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_AFNS_REPORT_DATA',
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
				type: 'SET_AFNS_REPORT_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}