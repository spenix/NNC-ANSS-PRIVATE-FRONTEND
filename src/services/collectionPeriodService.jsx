import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';




const getAllCollectionPeriodData = async (dataParams) => {
    return await axios
    .get(BASE_URL + '/indicators/collection-period-all', {
        headers: authHeader(),
        params: dataParams
    });
}
const getAllCollectionPeriodDataForTbl = async (dataParams) => {
  return axios
  .get(BASE_URL + '/indicators/collection-period', {
      headers: authHeader(),
      params: dataParams
  });
}

const submitCollectionPeriodData = async(dataInputs) => {
    return axios
    .post(BASE_URL + "/indicators/collection-period", {
        "data":{    
          "attributes": dataInputs
        }
      }, {
        headers: authHeader()
      })
    .then((response) => {
      return response.data;
    });

}

export default {
    getAllCollectionPeriodData,
    submitCollectionPeriodData,
    getAllCollectionPeriodDataForTbl
};