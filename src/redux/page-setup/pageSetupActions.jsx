// import instance from "./data";
import pageSetupServices from "../../services/pageSetupServices";

export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await pageSetupServices.getAllPageSetupData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_PAGE',
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

export const getContentTypes = (params = {}) => {
  return async (dispatch) => {
    await pageSetupServices.getContentTypes(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_PAGE_CONTENT_TYPE',
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
            console.log(errMsg);
          dispatch({
            type: 'SET_PAGE_DATA_MESSAGE',
            status: "error",
            msg: errMsg,
          });
          return Promise.reject();
      }
    );
  };
};

export const getPageOptions = (params = {}) => {
  return async (dispatch) => {
    await pageSetupServices.getPageOptions(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_PAGE_OPTIONS',
          data: response?.data?.data,
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
            type: 'SET_PAGE_DATA_MESSAGE',
            status: "error",
            msg: errMsg,
          });
          return Promise.reject();
      }
    );
  };
};

export const getAllForTblData = (params) => (dispatch)=>{
  return pageSetupServices.getAllPageSetupForTblData(params).then(
    (response) => {
      
      dispatch({
        type: 'GET_ALL_FOR_TBL_DATA_PAGE',
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

export const getPageSetupData = (params, id) =>(dispatch)=>{
  return pageSetupServices.getPageSetupData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_PAGE_DATA',
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

export const deletePageSetupData = (params, id) =>(dispatch)=>{
  return pageSetupServices.deletePageSetupData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_PAGE_DATA',
          status: "success",
          msg: "Page setup data is successfully deleted."
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
          type: 'SET_PAGE_DATA_MESSAGE',
          status: "error",
          msg: errMsg,
        });
        return Promise.reject();
    }
  );
};

export const editPageSetupData = (params, id) =>(dispatch)=>{
  return pageSetupServices.editPageSetupData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_PAGE_DATA',
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
          type: 'SET_PAGE_DATA_MESSAGE',
          status: "error",
          msg: errMsg,
        });
        
          return Promise.reject();
    }
  );
};

export const addPageSetupData = (dataInputs) => (dispatch) => {
	return pageSetupServices.submitPageSetupData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_PAGE_DATA',
				data: data,
        status: "success",
        msg: "Page setup is successfully added."
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
				type: 'SET_PAGE_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}