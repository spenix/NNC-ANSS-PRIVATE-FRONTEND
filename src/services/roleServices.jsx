import axios from "axios";

import {BASE_URL} from "../utils/Constants"

import authHeader from '../auth/authHeader';

const getRoles = () => {


    return axios
        .get(BASE_URL + '/roles', {
            headers: authHeader()
        });

};

export default {
    getRoles,
};
