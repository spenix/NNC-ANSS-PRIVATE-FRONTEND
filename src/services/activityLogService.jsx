import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';

const getAllForTblActivityLogData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/activity-log/all', {
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

const getActivityLogData = async (id) => {
    return await axios
    .get(BASE_URL + `/activity-log/show/${id}`, {
        headers: authHeader(),
    });
}

export default {
    getAllForTblActivityLogData,
    searchContactUsForTblData,
    getActivityLogData,
};