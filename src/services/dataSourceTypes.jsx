import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';




const getAllDataSourceTypeData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/indicators/datasource-types-all', {
        headers: authHeader(),
        params: dataParams
    });
}

const getAllDataSourceTypeForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/indicators/datasource-types', {
        headers: authHeader(),
        params: dataParams
    });
}


const deleteDataSourceTypeData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/indicators/datasource-types/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}
const getDataSourceTypeData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/indicators/datasource-types/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editDataSourceTypeData = async (dataParams, id) => {
  return await axios
  .put(BASE_URL + `/indicators/datasource-types/${id}`, {
      "data":{
        "attributes": dataParams
      }
  }, {
    headers: authHeader()
  });
}

const submitDataSourceTypeData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/indicators/datasource-types", {
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
    getAllDataSourceTypeData,
    submitDataSourceTypeData,
    getAllDataSourceTypeForTblData,
    getDataSourceTypeData,
    editDataSourceTypeData,
    deleteDataSourceTypeData
};