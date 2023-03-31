import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';
import authHeader2 from '../auth/AuthHeader2';




const uploadDataFile = async (dataParams) => {
    return await axios
    .get(BASE_URL +  '/files/upload-files', {
        headers: authHeader(),
        params: dataParams
    });
}

const getUploadDataFile = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/sampleOdata', {
        headers: authHeader(),
        params: dataParams
    });
}



export default {
    uploadDataFile,
    getUploadDataFile
};