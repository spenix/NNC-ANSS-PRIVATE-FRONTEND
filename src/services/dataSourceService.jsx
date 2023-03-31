import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';
import authHeader2 from '../auth/AuthHeader2';

const getAllDataSourceData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/indicators/datasources-all', {
        headers: authHeader(),
        params: dataParams
    });
}

const getAllDataSourceForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/indicators/datasources/search', {
        headers: authHeader(),
        params: dataParams
    });
}

const deleteDataSourceData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/indicators/datasources/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const getDataSourceData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/indicators/datasources/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editDataSourceData = async (dataParams, id) => {
  return await axios
  .post(BASE_URL + `/indicators/datasources/${id}`, dataParams, {
    headers: authHeader2()
  });
}

const submitDataSourceData = async(dataInputs) => {
  return axios
  .post(BASE_URL + "/indicators/datasources", dataInputs, {
      headers: authHeader2()
    })
  .then((response) => {
    return response.data;
  });
}

export default {
    getAllDataSourceData,
    submitDataSourceData,
    getAllDataSourceForTblData,
    getDataSourceData,
    editDataSourceData,
    deleteDataSourceData
};