import axios from "axios";

import {BASE_URL} from "../../utils/Constants"

import authHeader from '../../auth/authHeader';

import RoleService from "../../services/roleServices";


export const getRoles = () => (dispatch) => {
    return RoleService.getRoles().then(
		(data) => {
			dispatch({
				type: 'GET_ALL_ROLES',
				payload: { roles: data.data.data },
			});
                return Promise.resolve();
			},
		(error) => {
			console.log(error);



            return Promise.reject();
		}
  );
};