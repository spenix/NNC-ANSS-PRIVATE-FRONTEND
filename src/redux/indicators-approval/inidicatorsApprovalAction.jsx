import instance from "./data";

export const getAllData = (params) =>(dispatch) => {
  return async (dispatch) => {
    await instance.get("/api/country-indicators/list/all-data").then((response) => {
      dispatch({
        type: "GET_ALL_INDICATORS_DATA",
        data: response.data,
      });
    });
  };
 
};

export const getData = (params) => {
  return async (dispatch) => {
    await instance.get("/api/country-indicators/list/data", params).then((response) => {
      dispatch({
        type: "GET_INDICATORS_DATA",
        data: response.data.indicatorsDataRecords,
      });
    });
  };
};

export const getIndicator = (id) => {
  return async (dispatch) => {
    await instance
      .get("/api/country-indicators/indicator", {
        id,
      })
      .then((response) => {
        dispatch({
          type: "GET_INDICATOR_DATA",
          selectedIndicator: response.data.indicator,
        });
      })
      .catch((err) => console.log(err));
  };
};



export const addCountry = (indicator) => {
  return (dispatch, getState) => {
    instance
      .post("/apps/country-indicators/add-indicator", indicator)
      .then((response) => {
        dispatch({
          type: "ADD_INDICATOR_DATA",
          indicator,
        });
      })
      .then(() => {
        dispatch(getData(getState().indicatorsDataRecords.params));
        dispatch(getAllData());
      })
      .catch((err) => console.log(err));
  };
};

export const deleteIndicator = (id) => {
  return (dispatch, getState) => {
    instance
      .delete("/apps/country-indicators/delete", {
        id,
      })
      .then(() => {
        dispatch({
          type: "DELETE_INDICATOR_DATA",
        });
      })
      .then(() => {
        dispatch(getData(getState().indicatorsApproval.params));
        dispatch(getAllData());
      });
  };
};
