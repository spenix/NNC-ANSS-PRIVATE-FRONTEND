import OrganizationsService from "../../services/organizationsService";

export const getAllOrganizations = () => (dispatch)=> {

	return OrganizationsService.getOrganizations().then(
		(response) => {
			dispatch({
				type: 'GET_ALL_ORGANIZATIONS',
				data: response.data.data,
			});
      		return Promise.resolve();
			},
		(error) => {
			const message =
				(error.response &&
				error.response.data &&
				error.response.data.message) ||
				error.message ||
				error.toString();

			dispatch({
				type: 'GET_ALL_ORGANIZATIONS_FAIL',
			});
      		return Promise.reject();
		}
	);
}

