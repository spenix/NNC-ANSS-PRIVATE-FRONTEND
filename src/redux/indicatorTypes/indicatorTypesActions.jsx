// import instance from "./data";
import indicatorTypeService from "../../services/indicatorTypeService";

export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await indicatorTypeService.getAllIndicatorTypeData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_INDICATOR_TYPE',
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
  return indicatorTypeService.getAllIndicatorTypeForTblData(params).then(
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

export const getIndicatorTypeData = (params, id) =>(dispatch)=>{
  return indicatorTypeService.getIndicatorTypeData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_INDICATOR_TYPE_DATA',
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

export const deleteIndicatorTypeData = (params, id) =>(dispatch)=>{
  return indicatorTypeService.deleteIndicatorTypeData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_INDICATOR_TYPE_DATA',
          status: "success",
          msg: "Indicator category data is successfully deleted."
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
            type: 'SET_INDICATOR_TYPE_DATA_MESSAGE',
            status: "error",
            msg: errMsg,
          });
          return Promise.reject();
      }
  );
};

export const editIndicatorTypeData = (params, id) =>(dispatch)=>{
  return indicatorTypeService.editIndicatorTypeData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_INDICATOR_TYPE_DATA',
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
          type: 'SET_INDICATOR_TYPE_DATA_MESSAGE',
          status: "error",
          msg: errMsg,
        });
        return Promise.reject();
    }
  );
};

export const addIndicatorTypeData = (dataInputs) => (dispatch) => {
	return indicatorTypeService.submitIndicatorTypeData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_INDICATOR_TYPE_DATA',
				data: data,
        status: "success",
        msg: "Indicator category is successfully added."
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
				type: 'SET_INDICATOR_TYPE_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}

export const getAllActiveIndicatorTypes = (params = {}) => {
  return async (dispatch) => {
    await indicatorTypeService.getAllActiveIndicatorTypes(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_ACTIVE_DATA_INDICATOR_TYPE',
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