// import instance from "./data";
import indicatorServices from "../../services/indicatorServices";

export const getActiveIndicatorsList = (params) => (dispatch) => {
  return indicatorServices.getActiveIndicators(params).then(
    (response) => {
      dispatch({
        type: 'GET_INDICATORS_LIST',
        indicatorsList: response.data,
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
}

export const getAllData = (params) => {
return async (dispatch) => {
  await indicatorServices.getAllIndicatorData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_DATA_INDICATOR',
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

export const filterIndicatorsData = (params = {}) => (dispatch) => {
  return  indicatorServices.getFilterIndicatorsData(params).then(
      (response) => {
          dispatch({
            type: 'FILTER_INDICATOR_DATA',
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

export const getData = (params) => {
  return async (dispatch) => {
    await indicatorServices.getActiveIndicators("").then(
      (response) => {
        dispatch({
          type: 'GET_DATA',
          data: response.data.data,
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


export const getAllData2 = (params = {}) => {
  return async (dispatch) => {
    await indicatorServices.getAllIndicatorData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_INDICATOR',
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

export const getAllDataTypes = (params = {}) => {
  return async (dispatch) => {
    await indicatorServices.getAllDataTypes(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_TYPES_INDICATOR',
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
  return indicatorServices.getAllIndicatorForTblData(params).then(
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

export const getIndicatorData = (params, id) =>(dispatch)=>{
  return indicatorServices.getIndicatorData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_INDICATOR_DATA',
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

export const deleteIndicatorData = (params, id) =>(dispatch)=>{
  return indicatorServices.deleteIndicatorData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_INDICATOR_DATA',
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
          type: 'SET_INDICATOR_DATA_MESSAGE',
          status: "error",
          msg: errMsg,
        });
        return Promise.reject();
      }
  );
};

export const editIndicatorData = (params, id) =>(dispatch)=>{
  return indicatorServices.editIndicatorData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_INDICATOR_DATA',
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

export const addIndicatorData = (dataInputs) => (dispatch) => {
	return indicatorServices.submitIndicatorData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_INDICATOR_DATA',
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
      let errMsg = [];
      if(respData.hasOwnProperty('errors')) {
        const respErrors = error.response.data.errors;
        for (let i = 0; i < respErrors.length; i++) {
          // if(i > 0) {
          //   errMsg = errMsg + ", ";
          // }
          // errMsg = errMsg + respErrors[i]['detail'];
          errMsg.push(respErrors[i]['detail']);
        }
      } else {
        // errMsg =   error.response.data.error.detail;
        errMsg.push(error.response.data.error.detail);
      }
        
			dispatch({
				type: 'SET_INDICATOR_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}