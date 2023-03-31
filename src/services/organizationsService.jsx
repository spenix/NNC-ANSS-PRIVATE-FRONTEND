import axios from "axios";

import {BASE_URL} from "../utils/Constants"

import authHeader from '../auth/authHeader';

const getOrganizations = async(dataParams = {}) => {
    return await axios
        .get(BASE_URL + '/organizations', {
            headers: authHeader(),
            params: dataParams
        });

};


export default {
    getOrganizations
};