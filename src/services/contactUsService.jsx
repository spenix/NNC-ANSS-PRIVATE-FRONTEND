import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';

const getAllForTblContactUsData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/reports/inquiries', {
        headers: authHeader(),
        params: dataParams
    });
}

const deleteContactUsData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/reports/inquiry/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const searchContactUsForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/reports/inquiries/search', {
        headers: authHeader(),
        params: dataParams
    });
  }

export default {
    getAllForTblContactUsData,
    deleteContactUsData,
    searchContactUsForTblData,
};