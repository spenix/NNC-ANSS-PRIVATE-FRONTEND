import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';
import authHeader2 from '../auth/AuthHeader2';




const getAllAfnsReportData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/reports/afns-all', {
        headers: authHeader(),
        params: dataParams
    });
}

const getAllAfnsReportForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/reports/afns/content/search', {
        headers: authHeader(),
        params: dataParams
    });
}


const deleteAfnsReportData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/reports/afns/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}
const getAfnsReportData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/reports/afns/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editAfnsReportData = async (dataParams, id) => {
  // return await axios
  // .put(BASE_URL + `/reports/afns/${id}`, {
  //     "data":{
  //       "attributes": dataParams
  //     }
  // }, {
  //   headers: authHeader2()
  // });
  return await axios
  .post(BASE_URL + "/reports/afns", dataParams, {
      headers: authHeader2()
    })
  .then((response) => {
    return response.data;
  });
}

const submitAfnsReportData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/reports/afns", dataInputs, {
        headers: authHeader2()
      })
    .then((response) => {
      return response.data;
    });

}

export default {
    getAllAfnsReportData,
    submitAfnsReportData,
    getAllAfnsReportForTblData,
    getAfnsReportData,
    editAfnsReportData,
    deleteAfnsReportData
};