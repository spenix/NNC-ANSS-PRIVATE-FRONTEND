import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';
import authHeader2 from '../auth/AuthHeader2';




const getAllPageSetupData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/cms/pages-all', {
        headers: authHeader(),
        params: dataParams
    });
}

const getAllPageSetupForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/cms/pages/content/search', {
        headers: authHeader(),
        params: dataParams
    });
}


const deletePageSetupData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/cms/pages/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}
const getContentTypes = async (dataParams) => {
  return await axios
  .get(BASE_URL + `/cms/pages/content-types/all`, {
      headers: authHeader(),
      params: dataParams
  });
}

const getPageSetupData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/cms/pages/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editPageSetupData = async (dataParams, id) => {
  return await axios
  .post(BASE_URL + `/cms/pages/${id}`, dataParams, {
    headers: authHeader2()
  });
}

const submitPageSetupData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/cms/pages", dataInputs, {
        headers: authHeader2()
      })
    .then((response) => {
      return response.data;
    });

}
const getPageOptions = async (dataParams) => {
  return await axios
  .get(BASE_URL + `/cms/page-options`, {
      headers: authHeader(),
      params: dataParams
  });
}
export default {
    getAllPageSetupData,
    submitPageSetupData,
    getAllPageSetupForTblData,
    getPageSetupData,
    editPageSetupData,
    deletePageSetupData,
    getContentTypes,
    getPageOptions
};