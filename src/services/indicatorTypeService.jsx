import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';

const getAllIndicatorTypeData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/indicators/types', {
        headers: authHeader(),
        params: dataParams
    });
}

const getAllIndicatorTypeForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/indicators/types/search', {
        headers: authHeader(),
        params: dataParams
    });
}


const deleteIndicatorTypeData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/indicators/types/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}
const getIndicatorTypeData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/indicators/types/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editIndicatorTypeData = async (dataParams, id) => {
  return await axios
  .put(BASE_URL + `/indicators/types/${id}`, {
      "data":{
        "attributes": dataParams
      }
  }, {
    headers: authHeader()
  });
}

const submitIndicatorTypeData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/indicators/types", {
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

const getAllActiveIndicatorTypes = async () => {
  return await axios
  .get(BASE_URL + '/indicators/types/allActive', {
      headers: authHeader(),
  });
}



export default {
    getAllIndicatorTypeData,
    submitIndicatorTypeData,
    getAllIndicatorTypeForTblData,
    getIndicatorTypeData,
    editIndicatorTypeData,
    deleteIndicatorTypeData,
    getAllActiveIndicatorTypes
};