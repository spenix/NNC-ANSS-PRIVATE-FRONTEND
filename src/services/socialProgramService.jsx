import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';
import authHeader2 from '../auth/AuthHeader2';

const getAllSocialProgramData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/policy/socials-all', {
        headers: authHeader(),
        params: dataParams
    });
}

const getSocialProtectionStatus = async (dataParams) => {
  return await axios
  .get(BASE_URL + '/policy/social-totals', {
      headers: authHeader(),
      params: dataParams
  });
}

const getAllSocialProgramForTblData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/policy/socials/filter', {
        headers: authHeader(),
        params: dataParams
    });
}

const searchSocialProgramForTblData = async (dataParams) => {
  return await axios
  .get(BASE_URL + '/policy/socials/search', {
      headers: authHeader(),
      params: dataParams
  });
}

const deleteSocialProgramData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/policy/socials/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}
const getSocialProgramData = async (dataParams, id) => {
  return await axios
  .get(BASE_URL + `/policy/socials/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const editSocialProgramData = async (dataParams, id) => {
  return await axios
  .post(BASE_URL + `/policy/socials/${id}`, dataParams, {
    headers: authHeader2()
  });
}

const submitSocialProgramData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/policy/socials", dataInputs, {
        headers: authHeader2()
      })
    .then((response) => {
      return response.data;
    });
}

const SocialProgramDataApproval = async (params, id) => {
  return await axios
  .post(BASE_URL + `/policy/socials/${id}/status`, {
    "data":{    
      "attributes": params
    }
  }, {
    headers: authHeader()
  });
}

export default {
    getAllSocialProgramData,
    submitSocialProgramData,
    getAllSocialProgramForTblData,
    getSocialProgramData,
    editSocialProgramData,
    deleteSocialProgramData,
    SocialProgramDataApproval,
    searchSocialProgramForTblData,
    getSocialProtectionStatus
};