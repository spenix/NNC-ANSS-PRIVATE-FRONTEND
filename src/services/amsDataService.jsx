import axios from "axios";
import {BASE_URL} from "../utils/Constants"
import authHeader from '../auth/authHeader';
import authHeader2 from '../auth/AuthHeader2';


const getAmsDatas = async () => {
    return await axios
    .get(BASE_URL + '/indicators/ams', {
        headers: authHeader()
    });
}

const insertAmsData = async(amsData) => {

    return axios
    .post(BASE_URL + "/indicators/ams", {
        "data":{    
          "attributes": amsData
        }
      }, {
        headers: authHeader()
      })
    .then((response) => {
      return response.data;
    });

}

const updateAmsData = async(amsData, id) => {

    return axios
    .put(BASE_URL + `/indicators/ams/${id}`, {
        "data":{    
          "attributes": amsData
        }
      }, {
        headers: authHeader()
      })
    .then((response) => {
      return response.data;
    });

}

const getAmsDataByParams = async (dataParams) => {
  return axios
        .get(BASE_URL + '/indicators/ams-data', {
            headers: authHeader(),
            params: dataParams
        });
}

const getDataSourceByCustodian = async (dataParams) => {
  return axios
        .get(BASE_URL + '/indicators/datasources/filter-custodian', {
            headers: authHeader(),
            params: dataParams
        });
}

const getDataSourceByCustodianIntl = async (dataParams) => {
  return axios
        .get(BASE_URL + '/indicators/datasources/filter-custodian-intl', {
            headers: authHeader(),
            params: dataParams
        });
}

const getAmsTotals = async(dataParams) => {
  return axios
      .get(BASE_URL + '/indicators/ams-totals', {
          headers: authHeader(),
          params: dataParams
      });

};

const getAmsDataFilters = async(dataParams) => {
  return await axios
      .get(BASE_URL + '/indicators/ams/filter', {
          headers: authHeader(),
          params: dataParams
      });

};

const statusHandler = async(indicatorId, params) => {
  return await axios
    .post(BASE_URL + "/indicators/ams/" + indicatorId + "/status", {
        "data":{    
          "attributes": params
        }
      }, {
        headers: authHeader()
      });
}

const deleteAmsData = async (dataParams, id) => {
  return await axios
  .delete(BASE_URL + `/indicators/ams/${id}`, {
      headers: authHeader(),
      params: dataParams
  });
}

const getDataEntryProgress = async (dataParams) => {
  return await axios.get(BASE_URL + '/indicators/ams-progress', {
    headers: authHeader(),
    params: dataParams
  })
}

const ImportIndicatorData = async (dataParams) => {
  return await axios
  .post(BASE_URL + `/indicators/ams/import`, dataParams, {
    headers: authHeader2()
  });
}

const exportAms = async (filter, dataParams) => {
  return await axios
    .get(BASE_URL +  `/indicators/ams/export/${dataParams}`,  {
        headers: authHeader(),
        params: filter,
        responseType: 'blob',
    });
}

export default {
    getAmsDatas,
    insertAmsData,
    updateAmsData,
    getAmsDataByParams,
    getAmsTotals,
    statusHandler,
    getDataSourceByCustodian,
    getDataSourceByCustodianIntl,
    deleteAmsData,
    getAmsDataFilters,
    getDataEntryProgress,
    ImportIndicatorData,
    exportAms,
};