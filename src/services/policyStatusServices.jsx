import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';




const getAllPolicyStatusData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/policy/statuses-all', {
        headers: authHeader(),
        params: dataParams
    });
}

const getAllPolicyStatusForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/policy/statuses', {
        headers: authHeader(),
        params: dataParams
    });
}


const deletePolicyStatusData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/policy/statuses/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}
const getPolicyStatusData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/policy/statuses/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editPolicyStatusData = async (dataParams, id) => {
  return await axios
  .put(BASE_URL + `/policy/statuses/${id}`, {
      "data":{
        "attributes": dataParams
      }
  }, {
    headers: authHeader()
  });
}

const submitPolicyStatusData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/policy/statuses", {
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
    getAllPolicyStatusData,
    submitPolicyStatusData,
    getAllPolicyStatusForTblData,
    getPolicyStatusData,
    editPolicyStatusData,
    deletePolicyStatusData
};