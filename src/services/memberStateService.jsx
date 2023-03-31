import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';




const getAllMemberStateData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/member-states', {
        headers: authHeader(),
        params: dataParams
    });
}

const getAllMemberStateForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/organizations/search', {
        headers: authHeader(),
        params: dataParams
    });
}


const deleteMemberStateData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/organizations/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}
const getMemberStateData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/organizations/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editMemberStateData = async (dataParams, id) => {
  return await axios
  .put(BASE_URL + `/organizations/${id}`, {
      "data":{
        "attributes": dataParams
      }
  }, {
    headers: authHeader()
  });
}

const submitMemberStateData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/organizations", {
        "data":{    
          "attributes": dataInputs
        }
      }, {
        headers: authHeader()
      })
    .then((response) => {
      return response.data;
    });

}

export default {
    getAllMemberStateData,
    submitMemberStateData,
    getAllMemberStateForTblData,
    getMemberStateData,
    editMemberStateData,
    deleteMemberStateData
};