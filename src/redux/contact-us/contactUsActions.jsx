// import instance from "./data";
import contactUsService from "../../services/contactUsService";

export const getAllForTblData = (params) => (dispatch)=>{
  return contactUsService.getAllForTblContactUsData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FOR_TBL_CONTACT_US',
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

export const deleteContactUsData = (params, id) =>(dispatch)=>{
  return contactUsService.deleteContactUsData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_CONTACT_US_DATA',
          status: "success",
          msg: "Inquiry data is successfully deleted."
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

export const searchDataList = (params) =>(dispatch)=>{
    return contactUsService.searchContactUsForTblData(params).then(
      (response) => {
        dispatch({
          type: 'SEARCH_CONTACT_US_FOR_TABLE_DATA',
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