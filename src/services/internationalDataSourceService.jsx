import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';

const getAllIDSData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/indicators/datasources-all', {
        headers: authHeader(),
        params: dataParams
    });
}

const getAllIDSForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/indicators/datasources', {
        headers: authHeader(),
        params: dataParams
    });
}

const deleteIDSData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/indicators/datasources/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}
const getIDSData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/indicators/datasources/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editIDSData = async (dataParams, id) => {
  return await axios
  .post(BASE_URL + `/indicators/datasources/${id}`, {
      "data":{
        "attributes": dataParams
      }
  }, {
    headers: authHeader()
  });
}

const submitIDSData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/indicators/datasources", {
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
    getAllIDSData,
    submitIDSData,
    getAllIDSForTblData,
    getIDSData,
    editIDSData,
    deleteIDSData
};