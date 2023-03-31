const initialState = {
    allData: [],
    data: [],
    amsDataz:[],
    total: 1,
    params: {},
    selectedAms: null,
    amsDataInputs: {},
    amsData: {},
    amsId: null,
    amsTotals: {},
    amsStatus: "draft",
    amsOrgId: null,
    amsRepoId: null,
    dataSources:[],
    status: "",
    amsData_data: [],
    amsData_links: {},
    amsData_meta: {},
    amsData_details: {},
    amsDataEntryProg: [],
    message: "",
    reloadIndicatorList: false,
    UploadFileMsg: null,
    fileData: {}
  };
  
  const amsReducer = (state = initialState, action) => {
    switch (action.type) {
      case "GET_ALL_AMS_DATA":
        return { ...state, allData: action.data };
      case "GET_ALL_AMS_DATAZ":
          return { ...state, amsDataz: action.data };
      case "SET_UPLOAD_FILE_MSG":
        return { ...state, UploadFileMsg: action.data };
      case "GET_AMS_DATA":
        return {
          ...state,
          data: action.data,
          total: action.totalPages,
          params: action.params,
        };
      case "GET_AMS_DATA_RECORD":
        return {
          ...state,
          amsData: action.data,
          amsId: action.data.data.id,
          amsOrgId: action.data.data.attributes?.organization_id,
          amsStatus: action?.data?.data?.attributes?.status ? action?.data?.data?.attributes?.status: "draft"
        };
      case "CLEAR_AMS_DATA_RECORD":
        return {
          ...state,
          amsData: {},
          amsId: null,
          amsOrgId: null,
          amsStatus: "draft"
        };
      case "ADD_AMS_DATA_INPUTS":
        return { ...state, amsDataInputs: action?.payload};
      case "INDICATOR_LIST_TRIGGER":
        return { reloadIndicatorList: action?.trigger };
      case "ADD_AMS_DATA":
        return { ...state,
                amsData: action.payload,
                // amsId: action.payload.data.id,
                amsOrgId: action.payload.data.attributes?.organization_id,
                amsStatus: action.payload.data.attributes?.status,
                reloadIndicatorList: action?.trigger
              };


      case "STATUS_HANDLER":
        return { ...state,
                amsData: action?.data,
                // amsId: action.data.data.id,
                amsStatus: action?.status
              };

      case "STATUS_HANDLER_FAIL":
        return { ...state };

      case "UPDATE_AMS_DATA":
        return { ...state, amsData: action?.payload, reloadIndicatorList: action?.trigger };

      case "GET_AMS":
        return { ...state, selectedAms: action.selectedAms };

      case "GET_AMS_TOTALS":
        return { ...state, amsTotals: action.data };

      case "GET_AMS_TOTALS_FAIL":
        return { ...state };
  
      case "ADD_AMS":
        return { ...state };
  
      case "DELETE_AMS":
        return { ...state };
        
      case "IMPORT_AMS_INDICATOR_DATA":
        return { ...state };

      case "ADD_AMS_DATA_FAIL":
        return { ...state };
      
      case "GET_AMS_DATA_RECORD_FAIL":
        return { ...state };

      case "UPDATE_AMS_DATA_FAIL":
        return { ...state };
      case "GET_DATA_ENTRY_PROGRESS":
        return { ...state, amsDataEntryProg: action.payload.data };
      case "SET_AMS_DATA_ERROR_MESSAGE":
        return { ...state, message: action.msg, status: action.status};
      case "GET_DATA_SOURCE_BY_CUSTODIAN":
        return {...state, dataSources: action.data.data}
      case "GET_ALL_FILTERED_AMS_DATA":
        return {...state, amsData_data: action.data.data, amsData_links: action.data.links, amsData_meta: action.data.meta}
      case "EXPORT_AMS_FAIL":
        return { ...state };   
      case "EXPORT_AMS":
          return { ...state, fileData: action.data};          
      default:
        return { ...state };
    }
  };
  
  export default amsReducer;