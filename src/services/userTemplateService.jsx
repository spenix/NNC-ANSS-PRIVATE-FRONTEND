import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';
import authHeader2 from '../auth/AuthHeader2';

const getAllUserTemplateData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/reports/template-all', {
        headers: authHeader(),
        params: dataParams
    });
}

const getAllUserTemplateForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/reports/templates', {
        headers: authHeader(),
        params: dataParams
    });
}

const deleteUserTemplateData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/reports/templates/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}
const getUserTemplateData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/reports/templates/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editUserTemplateData = async (dataParams, id) => {
  return await axios
  .put(BASE_URL + `/reports/templates/${id}`, {
      "data":{
        "attributes": dataParams
      }
  }, {
    headers: authHeader2()
  });
}

const submitUserTemplateData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/reports/templates", dataInputs, {
        headers: authHeader2()
      })
    .then((response) => {
      return response.data;
    });
}

const getLatestTemplate = async (dataParams) => {
  return await axios
  .get(BASE_URL + `/reports/template-latest`, {
      headers: authHeader(),
      params: dataParams
  });
}

const showFile = async (fileName) => {
  return await axios
  .get(BASE_URL + `/reports/templates/files/${fileName}`, {
      headers: authHeader(),
      responseType: 'blob',
  });
}

export default {
    getAllUserTemplateData,
    submitUserTemplateData,
    getAllUserTemplateForTblData,
    getUserTemplateData,
    editUserTemplateData,
    deleteUserTemplateData,
    getLatestTemplate,
    showFile
};