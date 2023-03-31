import instance from "./data";
import organizationsService from "../../services/organizationsService";

export const getAllData = (params = {}) =>(dispatch) => {
  return async (dispatch) => {
    await instance.get("/api/countries/list/all-data").then((response) => {
      dispatch({
        type: "GET_ALL_ASIAN_COUNTRIES",
        data: response.data,
      });
    });
  };
 
};
export const getAllOrganizationData = (params = {}) => {
  return async (dispatch) => {
    await organizationsService.getOrganizations(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_ASIAN_COUNTRIES_V2',
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

export const getData = (params) => {
  return async (dispatch) => {
    await instance.get("/api/countries/list/data", params).then((response) => {
      dispatch({
        type: "GET_ASIAN_COUNTRIES",
        data: response.data.asianCountries,
      });
    });
  };
};

export const getCountry = (id) => {
  return async (dispatch) => {
    await instance
      .get("/api/countries/country", {
        id,
      })
      .then((response) => {
        dispatch({
          type: "GET_ASIAN_COUNTRY",
          selectedCountry: response.data.country,
        });
      })
      .catch((err) => console.log(err));
  };
};



export const addCountry = (country) => {
  return (dispatch, getState) => {
    instance
      .post("/apps/countries/add-country", country)
      .then((response) => {
        dispatch({
          type: "ADD_ASIAN_COUNTRY",
          country,
        });
      })
      .then(() => {
        dispatch(getData(getState().asianCountries.params));
        dispatch(getAllData());
      })
      .catch((err) => console.log(err));
  };
};

export const deleteCountry = (id) => {
  return (dispatch, getState) => {
    instance
      .delete("/apps/countries/delete", {
        id,
      })
      .then(() => {
        dispatch({
          type: "DELETE_ASIAN_COUNTRY",
        });
      })
      .then(() => {
        dispatch(getData(getState().asianCountries.params));
        dispatch(getAllData());
      });
  };
};