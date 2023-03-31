// import instance from "./data";
import collectionPeriodServices from "../../services/collectionPeriodService";
export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await collectionPeriodServices.getAllCollectionPeriodData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA',
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
    return collectionPeriodServices.getAllCollectionPeriodDataForTbl(params).then(
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

export const deleteCollectionPeriodData = (id) => {
  return (dispatch, getState) => {
    collectionPeriodServices.deleteCollectionPeriodData(id).then(
      (response) => {
          if(response){
            dispatch({
              type: 'SET_COLLECTION_PERIOD_DATA_MESSAGE',
              status: "success",
              msg: "Collection Period is successfully deleted.",
            });
          }
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

export const addCollectionPeriodData = (dataInputs) => (dispatch) => {
	return collectionPeriodServices.submitCollectionPeriodData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_COLLECTION_PERIOD_DATA',
				data: data,
        status: "success",
        msg: "Collection Period is successfully added."
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
				type: 'SET_COLLECTION_PERIOD_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
};