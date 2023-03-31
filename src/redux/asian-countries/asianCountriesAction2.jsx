// import instance from "./data";
import memberStateService from "../../services/memberStateService";

export const getAllData = (params = {}) => {
  return async (dispatch) => {
    await memberStateService.getAllMemberStateData(params).then(
      (response) => {
        dispatch({
          type: 'GET_ALL_DATA_MEMBER_STATE',
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
  return memberStateService.getAllMemberStateForTblData(params).then(
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

export const getMemberStateData = (params, id) =>(dispatch)=>{
  return memberStateService.getMemberStateData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_MEMBER_STATE_DATA',
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

export const deleteMemberStateData = (params, id) =>(dispatch)=>{
  return memberStateService.deleteMemberStateData(params, id).then(
    (response) => {
      if(response){
        dispatch({
          type: 'DELETE_MEMBER_STATE_DATA',
          status: "success",
          msg: "MemberState data is successfully deleted."
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
        console.log(errMsg);
        dispatch({
          type: 'SET_MEMBER_STATE_DATA_MESSAGE',
          status: "error",
          msg: errMsg,
        });
        return Promise.reject();
      }
  );
};

export const editMemberStateData = (params, id) =>(dispatch)=>{
  return memberStateService.editMemberStateData(params, id).then(
    (response) => {
      dispatch({
        type: 'GET_MEMBER_STATE_DATA',
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

export const addMemberStateData = (dataInputs) => (dispatch) => {
	return memberStateService.submitMemberStateData(dataInputs).then(
		(data) => {
			dispatch({
				type: 'ADD_MEMBER_STATE_DATA',
				data: data,
        status: "success",
        msg: "MemberState is successfully added."
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
				type: 'SET_MEMBER_STATE_DATA_MESSAGE',
				status: "error",
				msg: errMsg,
			});
      return Promise.reject();
		}
  );
}