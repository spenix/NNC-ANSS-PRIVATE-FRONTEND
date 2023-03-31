import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';
import authHeader2 from '../auth/AuthHeader2';

const getAllUserManualData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/reports/manual-all', {
        headers: authHeader(),
        params: dataParams
    });
}

const getAllUserManualForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/reports/manuals', {
        headers: authHeader(),
        params: dataParams
    });
}

const deleteUserManualData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/reports/manuals/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}
const getUserManualData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/reports/manuals/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editUserManualData = async (dataParams, id) => {
  return await axios
  .put(BASE_URL + `/reports/manuals/${id}`, {
      "data":{
        "attributes": dataParams
      }
  }, {
    headers: authHeader2()
  });
}

const submitUserManualData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/reports/manuals", dataInputs, {
        headers: authHeader2()
      })
    .then((response) => {
      return response.data;
    });
}

const getLatestManual = async (dataParams) => {
  return await axios
  .get(BASE_URL + `/reports/manual-latest`, {
      headers: authHeader(),
      params: dataParams
  });
}

export default {
    getAllUserManualData,
    submitUserManualData,
    getAllUserManualForTblData,
    getUserManualData,
    editUserManualData,
    deleteUserManualData,
    getLatestManual
};