import axios from "axios";

import {BASE_URL} from "../utils/Constants"

import authHeader from '../auth/authHeader';

const getUsers = async(dataParams) => {


    return axios
        .get(BASE_URL + '/users', {
            headers: authHeader(),
            params: dataParams
        });

};

const getUserDetails = (id) => {
    return axios
            .get(BASE_URL +  "/users/" + id,  {
                headers: authHeader()
            })
}

const getMyProfileDetails = (id) => {
  return axios
          .get(BASE_URL +  "/me",  {
              headers: authHeader()
          })
}

const updateMyProfileDetails = async(user) => {

  return axios
  .put(BASE_URL + "/me", {
      "data":{
        "type":"users",
        "attributes":
            {
              "complete_name":user.completeName,
              "mobile_number":user.mobileNumber,
              // "roles": user.roles // To be changed: should be dynamic soon
            }
      }
    }, {
      headers: authHeader()
    })
  .then((response) => {
    return response.data;
  });

}

const addUser = (user) => {
    return axios
    .post(BASE_URL + "/users", {
        "data":{
          "type":"users",
          "attributes": user
        }
      }, {
        headers: authHeader()
      })
    .then((response) => {
      return response.data;
    });
}

const changePassword = (user) => {
  return axios
  .patch(BASE_URL + "/me/password", {
      "data":{
        "type":"users",
        "attributes": 
        {
          "old_password":user.oldPassword,
          "new_password":user.newPassword,
          // "roles": user.roles // To be changed: should be dynamic soon
        }
      }
    }, {
      headers: authHeader()
    })
  .then((response) => {
    return response.data;
  });
}

const userActivation = async (dataParams, id) => {
  return await axios
  .put(BASE_URL + `/users/${dataParams?.status ? "activate" : "deactivate"}/${dataParams?.key}`,  {},{
    headers: authHeader()
  });
}

const searchUsersData = async (dataParams) => {
  return await axios
  .get(BASE_URL + '/users/search', {
      headers: authHeader(),
      params: dataParams
  });
}

const getCountryDetails  = async (country) => {
  return await axios
  .get(`https://restcountries.com/v3.1/name/${country}`);
}

const exportUsers = async (filter, params) => {
  return await axios
    .get(BASE_URL +  `/users/export/${params}`,  {
        headers: authHeader(),
        params: filter,
        responseType: 'blob',
    });
}

export default {
    getUsers,
    getUserDetails,
    addUser,
    getMyProfileDetails,
    updateMyProfileDetails,
    changePassword,
    userActivation,
    searchUsersData,
    getCountryDetails,
    exportUsers
};