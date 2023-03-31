// import instance from "./data";
import exportDataServices from "../../services/exportDataServices";

export const uploadDataFile = (params = {}) => {
  return async (dispatch) => {
    await exportDataServices.uploadDataFile(params).then(
      (response) => {
        dispatch({
          type: 'SET_EXPORT_DATA_MESSAGE',
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


export const getUploadDataFile = (params) => (dispatch)=>{
  return exportDataServices.getUploadDataFile(params).then(
    (response) => {
      dispatch({
        type: 'GET_EXPORT_DATA',
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



