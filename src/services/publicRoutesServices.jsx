import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';




const getAllLanguages = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/public/languages', {
        headers: authHeader(),
        params: dataParams
    });
}


export default {
  getAllLanguages
};