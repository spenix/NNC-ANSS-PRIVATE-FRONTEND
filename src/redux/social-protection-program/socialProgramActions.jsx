// import instance from "./data";
import socialProgramService from "../../services/socialProgramService";

export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await socialProgramService.getAllSocialProgramData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_SOCIAL_PROGRAM',
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
  return socialProgramService.getAllSocialProgramForTblData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FOR_TBL_DATA_SOCIAL_PROGRAM',
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

export const getSocialProtectionStatus = (params) =>(dispatch)=>{
  return socialProgramService.getSocialProtectionStatus(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_DATA_SOCIAL_PROGRAM_STATUS',
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
  return socialProgramService.searchSocialProgramForTblData(params).then(
    (response) => {
      dispatch({
        type: 'GET_ALL_FOR_TBL_DATA_SOCIAL_PROGRAM',
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

export const getSocialProgramData = (params, id) => (dispatch)=>{
  return socialProgramService.getSocialProgramData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_SOCIAL_PROGRAM_DATA',
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

export const deleteSocialProgramData = (params, id) =>(dispatch)=>{
  return socialProgramService.deleteSocialProgramData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_SOCIAL_PROGRAM_DATA',
          status: "success",
          msg: "SocialProgram data is successfully deleted."
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
          return Promise.reject();
    }
  );
};

export const SocialProgramDataApproval = (params, id) =>(dispatch)=>{
  return socialProgramService.SocialProgramDataApproval(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'SET_SOCIAL_PROGRAM_DATA_MESSAGE',
          status: "success",
          msg: `Policy and programme data successfully ${params?.data?.attributes?.remarks}.`
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
          type: 'SET_SOCIAL_PROGRAM_DATA_MESSAGE',
          status: "error",
          msg: errMsg,
        });
    }
  );
};

export const editSocialProgramData = (params, id) =>(dispatch)=>{
  return socialProgramService.editSocialProgramData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_SOCIAL_PROGRAM_DATA',
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
      let errMsg = [];
      if(respData.hasOwnProperty('errors')) {
        const respErrors = error.response.data.errors;
        for (let i = 0; i < respErrors.length; i++) {
          errMsg.push(respErrors[i]['detail']);
        }
      } else {
        errMsg.push(error.response.data.error.detail);
      }
			dispatch({
				type: 'SET_SOCIAL_PROGRAM_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      
          return Promise.reject();
    }
  );
};

export const addSocialProgramData = (dataInputs) => (dispatch) => {
	return socialProgramService.submitSocialProgramData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_SOCIAL_PROGRAM_DATA',
				data: data,
        status: "success",
        msg: "SocialProgram is successfully added."
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
          errMsg.push(respErrors[i]['detail']);
        }
      } else {
        errMsg.push(error.response.data.error.detail);
      }
			dispatch({
				type: 'SET_SOCIAL_PROGRAM_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}