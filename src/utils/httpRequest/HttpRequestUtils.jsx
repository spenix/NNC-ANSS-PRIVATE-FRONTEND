import axios from 'axios'
import {BASE_URL} from "../Constants"
const { REACT_APP_API_URL } = process.env;

const http = axios.create({
    baseURL: `${BASE_URL}/`,
    // baseURL: `${REACT_APP_API_URL}/v1/`,
    // timeout: 1000,
})

http.interceptors.response.use(
  response => response,
  error => {
    // console.log(error);
    if (error?.response?.status >= 500) {
      console.log(error.message)
    }else{
      console.log(`${error?.response?.status} ${error?.response?.data?.title} \n ${error?.response?.data?.error?.detail}`)
    }
    return Promise.reject(error)
  }
)

export default http