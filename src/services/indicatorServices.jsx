import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';

const getActiveIndicators = async (dataParams) => {
  return await axios
  .get(BASE_URL + '/indicators/repositories', {
      headers: authHeader(),
      params: dataParams
  });
}
const addIndicator = async (indicator) => {
  const response = await axios
    .post(BASE_URL + "/indicators/repositories", {
      "data": {
        "attributes": {
          "type_id": indicator.type_id,
          "category_id": indicator.category_id,
          "code": indicator.code,
          "name": indicator.name,
          "description": indicator.description,
          "frequency": indicator.frequency,
          "datatype": indicator.datatype,
          "is_active": indicator.is_active,
          "wha_gnmf_flag": true,
          "sdg_flag": true,
          "afnsr_flag": true,
          "datasource_types": [1, 2] // to be changed
        }
      }
    }, {
      headers: authHeader()
    });
  return response.data;

}

const getFilterIndicatorsData = async (dataParams) => {
  return await axios
  .get(BASE_URL + '/indicators/repositories/filter', {
      headers: authHeader(),
      params: dataParams
  });
}

const getAllDataTypes = async (dataParams) => {
  return await axios
  .get(BASE_URL + '/indicators/datatypes', {
      headers: authHeader(),
      params: dataParams
  });
}

const getAllIndicatorData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/indicators/repositories-all', {
        headers: authHeader(),
        params: dataParams
    });
}

const getAllIndicatorForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/indicators/repositories/search', {
        headers: authHeader(),
        params: dataParams
    });
}


const deleteIndicatorData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/indicators/repositories/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}
const getIndicatorData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/indicators/repositories/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editIndicatorData = async (dataParams, id) => {
  return await axios
  .put(BASE_URL + `/indicators/repositories/${id}`, {
      "data":{
        "attributes": dataParams
      }
  }, {
    headers: authHeader()
  });
}

const submitIndicatorData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/indicators/repositories", {
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
    getAllIndicatorData,
    submitIndicatorData,
    getAllIndicatorForTblData,
    getIndicatorData,
    editIndicatorData,
    deleteIndicatorData,
    getActiveIndicators,
    addIndicator,
    getAllDataTypes,
    getFilterIndicatorsData
};