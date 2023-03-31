// import instance from "./data";
import activityLogService from "../../services/activityLogService";

export const getAllForTblData = (params) => (dispatch)=>{
  return activityLogService.getAllForTblActivityLogData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FOR_TBL_ACTIVITY_LOG',
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

export const searchDataList = (params) =>(dispatch)=>{
    return activityLogService.searchContactUsForTblData(params).then(
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

  export const getActivityLogData = (id) => (dispatch) => {
    return activityLogService.getActivityLogData(id).then(
      (response) => {
        dispatch({
          type: 'GET_ACTIVITY_LOG_DATA',
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
    )
  }