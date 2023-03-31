import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';
import authHeader2 from '../auth/AuthHeader2';




const getAllPolicyProgrammesData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/policy/programs-all', {
        headers: authHeader(),
        params: dataParams
    });
}

const getPolicyProgrammesStatus = async (dataParams) => {
  return await axios
  .get(BASE_URL + '/policy/program-totals', {
      headers: authHeader(),
      params: dataParams
  });
}

const getAllPolicyProgrammesForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/policy/programs/filter', {
        headers: authHeader(),
        params: dataParams
    });
}

const searchPolicyProgrammesForTblData = async (dataParams) => {
  return await axios
    .get(BASE_URL + '/policy/programs/search', {
        headers: authHeader(),
        params: dataParams
    });
}


const deletePolicyProgrammesData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/policy/programs/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}
const getPolicyProgrammesData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/policy/programs/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editPolicyProgrammesData = async (dataParams, id) => {
  return await axios
  .post(BASE_URL + `/policy/programs/${id}`, dataParams, {
    headers: authHeader2()
  });
}

const submitPolicyProgrammesData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/policy/programs", dataInputs, {
        headers: authHeader2()
      })
    .then((response) => {
      return response.data;
    });

}

const PolicyProgrammesDataApproval = async (params, id) => {
  return await axios
  .post(BASE_URL + `/policy/programs/${id}/status`, {
    "data":{    
      "attributes": params
    }
  }, {
    headers: authHeader()
  });
}

export default {
    getAllPolicyProgrammesData,
    submitPolicyProgrammesData,
    getAllPolicyProgrammesForTblData,
    getPolicyProgrammesData,
    editPolicyProgrammesData,
    deletePolicyProgrammesData,
    PolicyProgrammesDataApproval,
    searchPolicyProgrammesForTblData,
    getPolicyProgrammesStatus
};