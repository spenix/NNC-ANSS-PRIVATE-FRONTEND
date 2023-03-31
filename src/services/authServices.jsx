import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';


const register = async(data) => {
  // return axios.post(BASE_URL + "/signup", {
  //   username,
  //   email,
  //   password,
  // });

	const headers = {
	'Content-Type': 'application/json'
	}
	return axios
	.post(BASE_URL + "/auth/register", {
		"data":{
			"type":"auth",
			"attributes": {
					"first_name": data.firstName,
					"last_name": data.lastName,
					"middle_name": data.middleName ? data.middleName : "",
					"verification_key": data.verificationKey,
					"password": data.password
				}
			}
		}, {
		headers: headers
		})
	.then((response) => {
		return response.data;
	});
};
const login = (username, password) => {
  const headers = {
    'Content-Type': 'application/json'
  }
  return axios
    .post(BASE_URL + "/auth/token", {
        "data":{
          "type":"users",
          "attributes":
              {
                "email":username,
                "password":password
              }
        }
      }, {
        headers: headers
      })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};
const logout = () => {
  axios.get(BASE_URL + '/auth/logout', {
      headers: authHeader(),
  });

  localStorage.removeItem("user");
};


// verify user invitation
const verifyUserInvitation = (token) => {
  return axios
          .get(BASE_URL +  "/auth/invitation" + token)
}

const forgotPassword = async(dataInputs) => {
  return axios
  .post(BASE_URL + "/auth/forgot-password", {
      "data":{    
        "attributes": dataInputs
      }
    })
  .then((response) => {
    return response.data;
  });
}

const verifyOtp = async(dataInputs) => {
  return axios
  .post(BASE_URL + "/auth/validate-otp", {
      "data":{    
        "attributes": dataInputs
      }
    })
  .then((response) => {
    return response.data;
  });
}

const changePassword = async(data) => {
	const headers = {
	'Content-Type': 'application/json'
	}
	return axios
	.post(BASE_URL + "/auth/change-password", {
		"data":{
			"type":"auth",
			"attributes": {
					"password": data.password,
					"confirm_password": data.confirm_password,
					"password_hash": data.password_hash,
				}
			}
		}, {
		headers: headers
		})
	.then((response) => {
		return response.data;
	});
};


const checkIfVerified = async (dataParams) => {
  return await axios
  .get(BASE_URL + '/auth/verification', {
      headers: authHeader(),
      params: dataParams
  });
}

const getNotifList = async () => {
  return await axios
  .get(BASE_URL + '/notifications/all', {
      headers: authHeader(),
  });
}

const clearAllNotif = async () => {
  return await axios
  .get(BASE_URL + '/notification/clear', {
      headers: authHeader(),
  });
}

export default {
  register,
  login,
  logout,
  verifyUserInvitation,
  forgotPassword,
  verifyOtp,
  changePassword,
  checkIfVerified,
  getNotifList,
  clearAllNotif,
};