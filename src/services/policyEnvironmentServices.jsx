import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';




const getAllPolicyEnvironmentData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/policy/environments-all', {
        headers: authHeader(),
        params: dataParams
    });
}

const getAllPolicyEnvironmentForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/policy/environments/search', {
        headers: authHeader(),
        params: dataParams
    });
}


const deletePolicyEnvironmentData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/policy/environments/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}
const getPolicyEnvironmentData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/policy/environments/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editPolicyEnvironmentData = async (dataParams, id) => {
  return await axios
  .put(BASE_URL + `/policy/environments/${id}`, {
      "data":{
        "attributes": dataParams
      }
  }, {
    headers: authHeader()
  });
}

const submitPolicyEnvironmentData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/policy/environments", {
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
    getAllPolicyEnvironmentData,
    submitPolicyEnvironmentData,
    getAllPolicyEnvironmentForTblData,
    getPolicyEnvironmentData,
    editPolicyEnvironmentData,
    deletePolicyEnvironmentData
};