import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';
import authHeader2 from '../auth/AuthHeader2';




const getAllCustodianData = async (dataParams) => {
    return await axios
    .get(BASE_URL + `${dataParams.intl_flag ? '/indicators/datacustodians-all-intl' : '/indicators/datacustodians-all'}`, {
        headers: authHeader(),
        params: dataParams
    });
}

const getAllCustodianForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/indicators/datacustodians', {
        headers: authHeader(),
        params: dataParams
    });
}


const deleteCustodianData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/indicators/datacustodians/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}
const getCustodianData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/indicators/datacustodians/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editCustodianData = async (dataParams, id) => {
  return await axios
  .post(BASE_URL + `/indicators/datacustodians/${id}`, dataParams, {
    headers: authHeader2()
  });
}

const submitCustodianData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/indicators/datacustodians", dataInputs, {
        headers: authHeader2()
      })
    .then((response) => {
      return response.data;
    });
}

const searchCustodianForTblData = async (dataParams) => {
  return await axios
  .get(BASE_URL + '/indicators/datacustodians/search', {
      headers: authHeader(),
      params: dataParams
  });
}

export default {
    getAllCustodianData,
    submitCustodianData,
    getAllCustodianForTblData,
    getCustodianData,
    editCustodianData,
    deleteCustodianData,
    searchCustodianForTblData
};