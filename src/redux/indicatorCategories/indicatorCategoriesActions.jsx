// import instance from "./data";
import indicatorCategoryService from "../../services/indicatorCategoryService";

export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await indicatorCategoryService.getAllIndicatorCategoryData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_INDICATOR_CATEGORY',
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
  return indicatorCategoryService.getAllIndicatorCategoryForTblData(params).then(
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

export const getIndicatorCategoryData = (params, id) =>(dispatch)=>{
  return indicatorCategoryService.getIndicatorCategoryData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_INDICATOR_CATEGORY_DATA',
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

export const deleteIndicatorCategoryData = (params, id) =>(dispatch)=>{
  return indicatorCategoryService.deleteIndicatorCategoryData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_INDICATOR_CATEGORY_DATA',
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
          type: 'SET_INDICATOR_CATEGORY_DATA_MESSAGE',
          status: "error",
          msg: errMsg,
        });
        return Promise.reject();
      }
  );
};

export const editIndicatorCategoryData = (params, id) =>(dispatch)=>{
  return indicatorCategoryService.editIndicatorCategoryData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_INDICATOR_CATEGORY_DATA',
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

export const addIndicatorCategoryData = (dataInputs) => (dispatch) => {
	return indicatorCategoryService.submitIndicatorCategoryData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_INDICATOR_CATEGORY_DATA',
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
				type: 'SET_INDICATOR_CATEGORY_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}