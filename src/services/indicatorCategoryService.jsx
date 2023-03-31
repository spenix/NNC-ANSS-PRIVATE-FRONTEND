import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';

const getAllIndicatorCategoryData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/indicators/categories', {
        headers: authHeader(),
        params: dataParams
    });
}

const getAllIndicatorCategoryForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/indicators/categories/search', {
        headers: authHeader(),
        params: dataParams
    });
}


const deleteIndicatorCategoryData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/indicators/categories/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}
const getIndicatorCategoryData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/indicators/categories/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editIndicatorCategoryData = async (dataParams, id) => {
  return await axios
  .put(BASE_URL + `/indicators/categories/${id}`, {
      "data":{
        "attributes": dataParams
      }
  }, {
    headers: authHeader()
  });
}

const submitIndicatorCategoryData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/indicators/categories", {
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
    getAllIndicatorCategoryData,
    submitIndicatorCategoryData,
    getAllIndicatorCategoryForTblData,
    getIndicatorCategoryData,
    editIndicatorCategoryData,
    deleteIndicatorCategoryData
};