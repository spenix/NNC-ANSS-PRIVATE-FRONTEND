// import instance from "./data";
import publicRoutesServices from "../../services/publicRoutesServices";

export const getAllLanguages = (params = {}) => {
  return async (dispatch) => {
    await publicRoutesServices.getAllLanguages(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_LANGUAGES_AVAILABLE',
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