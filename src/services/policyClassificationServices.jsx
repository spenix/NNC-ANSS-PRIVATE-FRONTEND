import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';




const getAllPolicyClassificationData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/policy/classifications-all', {
        headers: authHeader(),
        params: dataParams
    });
}

const getAllPolicyClassificationForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/policy/classifications/search', {
        headers: authHeader(),
        params: dataParams
    });
}


const deletePolicyClassificationData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/policy/classifications/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}
const getPolicyClassificationData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/policy/classifications/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editPolicyClassificationData = async (dataParams, id) => {
  return await axios
  .put(BASE_URL + `/policy/classifications/${id}`, {
      "data":{
        "attributes": dataParams
      }
  }, {
    headers: authHeader()
  });
}

const submitPolicyClassificationData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/policy/classifications", {
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
    getAllPolicyClassificationData,
    submitPolicyClassificationData,
    getAllPolicyClassificationForTblData,
    getPolicyClassificationData,
    editPolicyClassificationData,
    deletePolicyClassificationData
};