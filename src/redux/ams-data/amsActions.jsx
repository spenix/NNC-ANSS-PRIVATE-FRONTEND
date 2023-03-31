import instance from "./data";
import AmsDataServices from "../../services/amsDataService";
export const getAllData = () => {
  return async (dispatch) => {
    await instance.get("/api/ams-data/list/all-data").then((response) => { 
      dispatch({
        type: "GET_ALL_AMS_DATA",
        data: response.data,
      });
    });
  };
};

export const getData = (params) => {
  return async (dispatch) => {
    await instance.get("/api/ams-data/list/data", params).then((response) => {
      dispatch({
        type: "GET_AMS_DATA",
        data: response.data.ams,
      });
    });
  };
};

export const getAmsDatas = () => {
    return async (dispatch) => {
      await AmsDataServices.getAmsDatas().then((response) => {
        dispatch({
          type: "GET_ALL_AMS_DATAZ",
          data: response.data.ams,
        });
      });
    }
}

export const getAms = (id) => {
  return async (dispatch) => {
    await instance
      .get("/api/ams-data/ams", {
        id,
      })
      .then((response) => {
        dispatch({
          type: "GET_AMS",
          selectedAms: response.data.ams,
        });
      })
      .catch((err) => console.log(err));
  };
};

export const addAms = (ams) => {
  return (dispatch, getState) => {
    instance
      .post("/apps/ams-data/add-ams", ams)
      .then((response) => {
        dispatch({
          type: "ADD_AMS",
          ams,
        });
      })
      .then(() => {
        dispatch(getData(getState().contact.params));
        dispatch(getAllData());
      })
      .catch((err) => console.log(err));
  };
};

export const AmsDataAction = (data) => {
  return async (dispatch) => {
    dispatch({
      type: "AMS_DATA_ACTION",
      data,
    });
  }
}

export const deleteAms = (params, id) =>(dispatch)=>{
  return AmsDataServices.deleteAmsData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_AMS_DATA',
          status: "success",
          msg: "AMS data is successfully deleted."
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
				type: 'SET_AMS_DATA_ERROR_MESSAGE',
        status:"error",
				msg: errMsg,
			});
          return Promise.reject();
    }
  );
};

export const addAmsData = (amsData) => (dispatch) => {
	return AmsDataServices.insertAmsData(amsData).then(
		(data) => {
			dispatch({
				type: 'ADD_AMS_DATA',
				payload: data,
        trigger: true,
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
				type: 'ADD_AMS_DATA_FAIL',
			});
			dispatch({
				type: 'SET_AMS_DATA_ERROR_MESSAGE',
        status:"error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
};

export const getDataEntryProgress = (amsData) => (dispatch) => {
	return AmsDataServices.getDataEntryProgress(amsData).then(
		(response) => {
			dispatch({
				type: 'GET_DATA_ENTRY_PROGRESS',
				payload: response.data,
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
				type: 'ADD_AMS_DATA_FAIL',
			});
			dispatch({
				type: 'SET_AMS_DATA_ERROR_MESSAGE',
        status:"error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
};

export const updateAmsData = (amsData, id) => (dispatch) => {
	return AmsDataServices.updateAmsData(amsData, id).then(
		(data) => {
			dispatch({
				type: 'UPDATE_AMS_DATA',
				payload: data,
        trigger: true,
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
				type: 'UPDATE_AMS_DATA_FAIL',
			});
			dispatch({
				type: 'SET_AMS_DATA_ERROR_MESSAGE',
        status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
};

export const getDataSource = (params) => (dispatch)=> {
	return AmsDataServices.getDataSourceByCustodian(params).then(
		(response) => {
			dispatch({
          type: 'GET_DATA_SOURCE_BY_CUSTODIAN',
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

			dispatch({
				type: 'GET_AMS_DATA_RECORD_FAIL',
			});
      		return Promise.reject();
		}
	);
}

export const getDataSourceIntl = (params) => (dispatch)=> {
	return AmsDataServices.getDataSourceByCustodianIntl(params).then(
		(response) => {
			dispatch({
          type: 'GET_DATA_SOURCE_BY_CUSTODIAN',
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

			dispatch({
				type: 'GET_AMS_DATA_RECORD_FAIL',
			});
      		return Promise.reject();
		}
	);
}

export const getAmsDataByParams = (params) => (dispatch)=> {
	return AmsDataServices.getAmsDataByParams(params).then(
		(response) => {
			dispatch({
          type: 'GET_AMS_DATA_RECORD',
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

			dispatch({
				type: 'GET_AMS_DATA_RECORD_FAIL',
			});
      		return Promise.reject();
		}
	);
}

export const getAmsTotals = (params) => (dispatch)=> {
	return AmsDataServices.getAmsTotals(params).then(
		(response) => {
			dispatch({
				type: 'GET_AMS_TOTALS',
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

			dispatch({
				type: 'GET_AMS_TOTALS_FAIL',
			});
      		return Promise.reject();
		}
	);
}

export const getAmsDataFilters = (params) => (dispatch)=>{
  return AmsDataServices.getAmsDataFilters(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FILTERED_AMS_DATA',
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
          type: 'ADD_AMS_DATA_FAIL',
        });
        dispatch({
          type: 'SET_AMS_DATA_ERROR_MESSAGE',
          status:"error",
          msg: errMsg,
        });
        return Promise.reject();
    }
  );
};

export const ImportIndicatorData = (params) => (dispatch)=>{
  return AmsDataServices.ImportIndicatorData(params).then(
    (response) => {
      // dispatch({
      //   type: 'IMPORT_AMS_INDICATOR_DATA',
      //   status: "success",
      //   msg: "Indicator data was imported successfully."
      // });
      dispatch({
        type: 'SET_UPLOAD_FILE_MSG',
        data: response?.data?.data
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
          type: 'ADD_AMS_DATA_FAIL',
        });
        dispatch({
          type: 'SET_AMS_DATA_ERROR_MESSAGE',
          status:"error",
          msg: errMsg,
        });
        return Promise.reject();
    }
  );
};

export const statusHandler = (indicatorId, params) => (dispatch) => {
  return AmsDataServices.statusHandler(indicatorId, params).then(
    (response) => {
      dispatch({
        type: 'STATUS_HANDLER',
        data: response.data,
        status: params.status
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
          type: 'ADD_AMS_DATA_FAIL',
        });
        dispatch({
          type: 'SET_AMS_DATA_ERROR_MESSAGE',
          status:"error",
          msg: errMsg,
        });
          return Promise.reject();
    }
  );
};

export const exportAms = (filter, dataParams) => (dispatch) => {
	return AmsDataServices.exportAms(filter, dataParams).then(
		(response) => {
			dispatch({
				type: 'EXPORT_AMS',
				data: response,
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
			dispatch({
				type: 'EXPORT_AMS_FAIL',
			});
			dispatch({
				type: 'SET_AMS_DATA_ERROR_MESSAGE',
				payload: message,
			});
      		return Promise.reject();
		}
  );
};