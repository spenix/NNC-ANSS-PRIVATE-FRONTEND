import IndicatorServices from "../../../services/indicatorServices";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { DownOutlined } from '@ant-design/icons';
import {BASE_URL} from "../../../utils/Constants"
import moment from "moment-timezone";
import {
  // RiArrowLeftSLine,
  RiFileList3Line,
  RiDraftLine,
  RiPrinterLine,
  RiAddBoxLine,
  RiFileUploadLine,
  RiInformationLine,
  RiSendPlaneLine
} from "react-icons/ri";

import {Delete } from "react-iconly";
// Redux
import debounce from "lodash/debounce";
import { getIndicator } from "../../../redux/indicators-approval/inidicatorsApprovalAction";
import { getAllActiveIndicatorTypes as getAllIndicatorTypesData } from "../../../redux/indicatorTypes/indicatorTypesActions";
import {getAllData as getAllIndicatorCategoryData} from "../../../redux/indicatorCategories/indicatorCategoriesActions";
import { getAllData as getAllOrganizationsData } from "../../../redux/asian-countries/asianCountriesAction2";
import {  getAmsDataFilters, deleteAms, statusHandler, updateAmsData, exportAms } from "../../../redux/ams-data/amsActions";
import { useDispatch, useSelector } from "react-redux";
import { Layout, Row, Col, Avatar,  Space, Tag, Form, Select, Dropdown, Table, Menu, Button, Modal, List, DatePicker, Popconfirm} from "antd";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import FlagIcon from '../../../utils/global-components/FlagIcon';
import AmsModal from './Modal';
import UploadFileModal from './UploadFileModal';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD, DELETED_DATA, FOCAL, FSA, MANAGER, SECRETARIAT } from '../../../utils/LangConstants';
import {errorMsg, infoMsg, warningMsg, callNotif} from '../../../utils/global-functions/minor-functions';
export default function Detail(props) {
  let history = useHistory();
  const {pageRoles} = props;
  const dtYr = new Date().getFullYear();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [disableBulkBtn, setDisableBulkBtn] = useState(false);
  const [form] = Form.useForm();
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleImport = () => setImportOpen(!importOpen);

  const [sorter, setSorter] = useState({})
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(false)
  const [listParams, setListParams] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const { confirm } = Modal;
  const ActionVal = useRef('');
  const [data, setData] = useState([])
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isFileFetch, setIsFileFetch] = useState(false);
  const dispatch = useDispatch();
  // const { key } = useParams();
  const [indicatorSelected, setIndicatorSelected] = useState([]);
  const [successTrans, setSuccessTrans] = useState(false);
  // const [organization_id, setOrganizationId] = useState(0);
  // const [year, setYear] = useState(dtYr);

  // const { organization_id, year } = JSON.parse(window.atob(key))
  const [columns, setColumns] = useState([]);
  const [fields, setFields] = useState([]);
  const legends_list = [
      {stat: "Draft", stat_color: "#59edff"}, 
      {stat: "Submitted", stat_color: "#108ee9"}, 
      {stat: "Approved", stat_color: "#87d068"}, 
      {stat: "Returned", stat_color: "#f50"}
  ];
  const [ dataSeletor, setDataSelector ] = useState({
    organization_id: 0,
    category_id: 0,
    type_id:0,
    year:dtYr,
    status:"submitted"
  }); 
const { myprofile: {organization, roles}  } = useSelector(state => state.users);
const {amsData_data, amsData_meta, amsData_links, message, status, fileData} = useSelector((state) => state.ams);
const {memberState_data} = useSelector((state) => state.asianCountries);
// const indicatorsApproval = useSelector(state => state.indicatorsApproval);
const {indicatorType_data} = useSelector((state) => state.indicatorTypes);
const {indicatorCategory_data} = useSelector((state) => state.indicatorCategories);

  const handleTableChange = (pagination, filters, sorter) => {
    setSorter(sorter);
    setFilters(filters);
    fetch(pagination);    
  };

  useEffect(() => {
    dispatch(getAllIndicatorTypesData());
    dispatch(getAllIndicatorCategoryData());
    dispatch(getAllOrganizationsData());
  }, [dispatch])

  useEffect(() => {
    if(typeof organization != 'undefined'){
      setDataSelector(prevState => ({...prevState, organization_id: organization?.party_id, country: organization?.name}));
      setFields([
        {
          name: ['year'],
          value: moment(`${dtYr}-1-1`),
        },
        {
          name: ['type_id'],
          value: "All",
        },
        {
          name: ['category_id'],
          value: "All",
        },
        {
          name: ['status'],
          value: roles.includes('data_manager') || roles.includes('secretariat') ? "All" : "submitted",
        },
      ])
      setDataSelector(prevState => ({...prevState, status:  roles.includes('data_manager') || roles.includes('secretariat') ? "all" : "submitted"}))
    }
  }, [organization])

  useEffect(() => {
      delayedSearch(pagination);
  }, [dataSeletor])

  useEffect(() => {
    errMsg();
}, [status]);

const errMsg = () => {
    if(typeof status == "string" && status == "error"){
      if(message != "") {
        if(typeof message == "object"){
          message.forEach(item => {
              callNotif('Error', item, status)
          });
        }else{
            callNotif('Error', message, status)
        }
      }
    }
}

  const delayedSearch = useCallback(
    debounce((q) => fetch(q), 500),
    [dataSeletor]
  );

  const processData = () => {
    const results = [];
    if(typeof amsData_data !== 'undefined'){
      var count = 0;
      for (let i = 0; i < amsData_data.length; i++) {
        results.push({
          key:amsData_data[i].id,
          repository_code:amsData_data[i]?.attributes?.repository?.code,
          repository_name:amsData_data[i]?.attributes?.repository?.name,
          national_data:amsData_data[i]?.attributes?.national_data,
          datasource:amsData_data[i]?.attributes?.datasource?.title,
          remarks:amsData_data[i]?.attributes?.remarks,
          status: amsData_data[i]?.attributes?.status,
          datail: amsData_data[i],
          amsData_data,
          dataIndex: i
        });
        count += amsData_data[i]?.attributes?.status == "draft" ? 1 : 0; 
      }
      setDisableBulkBtn(count ? false : true);
      setData(results);
      if(Object.keys(amsData_meta).length){
        setPagination({
          ...listParams,
          total: amsData_meta.pagination.total, // total regardless of pagination
        });
      }
    }
    setIsDataFetched(false);
  }

  const fetch = (params = {}) => {
    setLoading(true);
    setIndicatorSelected([]);
    const dataParams = {
      limit: params.pageSize,
      page: params.current,
    }
    
    if(typeof dataSeletor?.year != 'undefined'){
      dataParams['year'] = dataSeletor.year;
    }
    if(dataSeletor?.category_id){
      dataParams['category_id'] = dataSeletor.category_id;
    }
    if(dataSeletor?.type_id){
      dataParams['type_id'] = dataSeletor.type_id;

    }
    if(dataSeletor?.status != 'all'){
      dataParams['status'] = dataSeletor.status;
    }
    if(dataSeletor?.organization_id){
        dataParams['organization_id'] = dataSeletor.organization_id;
        dispatch(getAmsDataFilters(dataParams))
          .then(() => {
            setLoading(false)
            setListParams(params);
            setIsDataFetched(true);
          }).catch(() => {
            errMsg();
            setLoading(false)
            setIsDataFetched(false);
          })
   }
  }
  if(isDataFetched) {
    processData();
  }

  useEffect(()=> {
    if(successTrans){
      toggleSidebar();
      setIndicatorSelected([]);
      ActionVal.current = '';
      form.setFieldsValue({
        indicatorsAction: "",
        remarks: ""
      });
      setSuccessTrans(false);
      fetch({
        current: 1,
        pageSize: 10,
      });
      delayedSearch(pagination);
    }
  }, [successTrans])
  
  const pustToDataEntryV2 = (datail, dataIndex) => {
    var paramsData = {
      country: dataSeletor?.country, 
      indicator_category: datail?.attributes?.repository?.category_id, 
      indicator_type: datail?.attributes?.repository?.type_id, 
      year: datail?.attributes?.year, 
      organization_id: datail?.attributes?.organization_id,
      dataStatus: datail?.attributes?.status,
      dataIndex : datail?.attributes?.status != 'draft' ? dataIndex : 0,
      repository_id: datail?.attributes?.repository?.id,
      action: "edit"
    };
    history.push(`/data-entry/detail/${window.btoa(JSON.stringify(paramsData))}`);
  }

  const viewIndicatorDataEntry = (detail) => {
     Modal.info({
      icon: (
          <RiDraftLine className="remix-icon"/>
      ),
      title: (
        <h5 className="hp-mb-0 hp-font-weight-500">View Indicator Data</h5>
      ),
      width:800,
      content: (
       <ul style={{ listStyle:"none" }}>
        {
          roles.includes('system_administrator') ? (<li><b>Member State: </b>{dataSeletor?.country}</li>) : ""
        }
        
        <li><b>Indicator Code: </b>{detail?.attributes?.repository?.code}</li>
        <li><b>Indicator: </b>{detail?.attributes?.repository?.name}</li>
        <li><b>Description: </b>{detail?.attributes?.repository?.description}</li>
        <li><b>Origin: </b>{(detail?.attributes?.origin).toUpperCase()}</li>
        <li><b>National Data: </b>{detail?.attributes?.national_data}</li>
        <li><b>Data Type: </b>{(detail?.attributes?.repository?.datatype).toUpperCase()}</li>
        <li><b>Resource: </b>{detail?.attributes?.datasource?.intl_flag ? "International" : "National"}</li>
        <li><b>Title: </b>{detail?.attributes?.datasource?.title}</li>
        <li><b>Source Type: </b>{detail?.attributes?.datasource_type?.name}</li>
        <li><b>Year Published: </b>{detail?.attributes?.datasource?.publication_date}</li>
        {detail?.attributes?.datasource?.url ? (<li><b>Link: </b>{detail?.attributes?.datasource?.url}</li>): ""}
                  {
                    detail?.attributes?.datasource?.document_url ? (
                      <li>
                        <b>Document: </b>
                      <Button size="small"  onClick={() => window.open(`${BASE_URL}/indicators/datasources/files/` + detail?.attributes?.datasource?.document_url, '_blank')}>View Document</Button>
                      </li>
                    ) : ""
                  }
       </ul>
      ),
      okText:"Close",
      okButtonProps: {
        type:"default",
        className: 'hp-btn-outline hp-text-color-black-100 hp-border-color-black-100 hp-hover-bg-black-100'
      },
      onOk() {},
    });
  }
      
  const confirmDel = (datail) => {
    if(pageRoles.includes(ACTION_DELETE)){
      dispatch(deleteAms({}, datail?.id))
      .then(()=> {
        callNotif("Success", "Indicator Data Entry was deleted successfully.", "success")
        fetch(pagination);
      });
    }else{
      callNotif("Information", `Can't execute, you don't have ${ACTION_DELETE} permission.`, 'info');
     }
  }

const handleButtonClick = (e, arrData, dataIndex, datail) => {
  if(pageRoles.includes(ACTION_EDIT) || pageRoles.includes(ACTION_VIEW)){
    var data = e.key.split("_");
    if(data.length){
      if(data[0] == 'edit'){
        pustToDataEntryV2(datail, dataIndex);
      }
      else if(data[0] == "view"){
        viewIndicatorDataEntry(datail);
      }
      else if(data[0] == "delete"){
        confirm({
          title: (
            <>
              <h5 className="hp-mb-0 hp-font-weight-500">
                  Are you sure you want to delete this indicator data entry?
              </h5>
            </>
          ),
          icon: (
            <span className="remix-icon">
              <RiInformationLine />
            </span>
          ),
          content: (""),
          okText: "Yes",
          okType: "primary",
          cancelText: "No",
          onOk() {
            confirmDel(datail);
          },
          onCancel() {},
        });
       
      }
      else{
          var res = arrData.filter(item => { if(item.id == data[1]){ return item } });
          if(res.length){
            ActionVal.current = data[0];
            var results = [];
            for (let i = 0; i < res.length; i++) {
              results.push({
                key:res[i].id,
                repository_code:res[i]?.attributes?.repository.code,
                repository_name:res[i]?.attributes?.repository.name,
                national_data:res[i]?.attributes?.national_data,
                datasource:res[i]?.attributes?.datasource?.title,
                remarks:res[i]?.attributes?.remarks,
                status: res[i]?.attributes?.status
              });
            } 
            setIndicatorSelected(results);
            toggleSidebar();
          }else{
            warningMsg("Something went wrong...");
          }
      }
    }else{
      warningMsg("Something went wrong...");
    }
  }else{
    errorMsg(`Can't execute, You don't have permission.`);
  }
};

  const viewRemarksMd = (dataIndex) => {
    const {remarks, repository_code} = dataIndex
    Modal.info({
      icon: (
          <RiFileList3Line className="remix-icon"/>
      ),
      title: (
        <h5 className="hp-mb-0 hp-font-weight-500">View Remarks</h5>
      ),
      width: 600,
      content: (
        <List
          itemLayout="horizontal"
          dataSource={remarks}
          renderItem={(item, index) => (
            <List.Item key={index} style={{border: '1px solid #DCDCDC', padding: '10px', borderRadius: '10px', margin: '5px', boxShadow:'10px'}}>
              <List.Item.Meta
                title={item.remarks}
                description={(
                  <ul style={{listStyle:"none", marginLeft: 0, paddingLeft: 0}}>
                    <li>
                      <small>
                        <b>STATUS:</b> {item.status == "returned"? "Returned": "Approved"}
                      </small>
                    </li>
                    <li>
                      <small>
                        <b>{(item.status).toUpperCase()} DATE:</b> {moment(item.created_at).tz('Asia/Manila').format('LLL z')}
                      </small>
                    </li>
                  </ul>
              )}
              />
            </List.Item>
          )}
        />
       
      ),
      okText: "Cancel",
      okButtonProps: {
        type:"default",
        className: 'hp-btn-outline hp-text-color-black-100 hp-border-color-black-100 hp-hover-bg-black-100'
      },
      onOk() {},
    });
  }

  const getStatusData = (dataIndex) => {
    // var count = 0;
    var res = legends_list.map((item, i) => {
      if(item.stat.toLowerCase() == dataIndex)
      {
        // count++;
        return <Tag key={i} color={item.stat_color}>{  dataIndex.toUpperCase()}</Tag>
      }
    })
    // if(count){
      return res
    // }else{
    //   return <Tag color={dataIndex.toLowerCase() == 'draft' ? 'rgb(89, 237, 255)' : 'rgb(169, 169, 169)'}>{ dataIndex.toUpperCase()}</Tag>
    // }
    
  }

  useEffect(() => {
    if(roles){
      var cols = [
        {
          title: 'Code',
          dataIndex: 'repository_code',
          width:'8%',
        },
        {
            title: 'Indicator Name',
            dataIndex: 'repository_name',
            width:'15%',
        },
        {
            title: 'National Data',
            dataIndex: 'national_data',
            align:'center',
            width:'15%',
          //   ellipsis: true,
        },
        {
          title: 'Title',
          dataIndex: 'datasource',
          width:'15%'
        },
        {
          title: 'Remarks',
          dataIndex: 'remarks',
          width:'13%',
          render: (_, dataIndex) => (
            <Button size="small" onClick={() => viewRemarksMd(dataIndex)} disabled={dataIndex?.remarks.length ? false : true}><RiFileList3Line/> &nbsp; Remarks</Button>
          )
        },
        {
          title: 'Status',
          dataIndex: 'status',
          align:'center',
          width:'10%',
          render: (dataIndex) => (
            legends_list.map((item, i) => {
              if(item.stat.toLowerCase() == dataIndex)
              {
                return <Tag key={i} color={item.stat_color}>{  dataIndex.toUpperCase()}</Tag>
              }
            })
          )
        }
      ];
        if(pageRoles.length){
          cols.push({
            title: 'Actions',
              dataIndex: 'key',
              align:'center',
              width:'15%',
              render: (_, {key, status, amsData_data, dataIndex, datail}) => (
                  <Dropdown.Button
                    key={key}
                    size="small"
                    disabled={roles?.includes("data_managerr") ? status == 'submitted' : (roles?.includes("focal_point") ? status == 'draft' : (roles?.includes("secretariat") ? status == 'draft' : false))}
                    icon={<DownOutlined />}
                    overlay={
                      <Menu onClick={(e) => handleButtonClick(e, amsData_data, dataIndex, datail)}>
                        {
                          (roles.includes(SECRETARIAT) ? 
                            ['view'] : 
                              (status == "submitted" ? 
                                (roles?.includes(FOCAL) || roles.includes(FSA) ? 
                                  ['approve', 'return', 'view'] : 
                                  ['view']) : 
                                (status == "returned" || status == "draft"  ? 
                                ( roles.includes(FSA) || roles.includes(MANAGER) ? 
                                  ['edit', 'view', 'delete'] : 
                                  ['view']) : 
                                status == "approved" ? 
                                (roles?.includes(FOCAL) || roles.includes(FSA) ? 
                                  ['return', 'view'] : 
                                  ['view']) :['view']
                                )
                              )
                            ).map(item => {
                            return <Menu.Item key={item+"_"+key} value={key}>{item.toUpperCase()}</Menu.Item>
                          })
                        }
                      </Menu>
                    }
                  >
                    Action
                  </Dropdown.Button>
                )
          })
      }
    
    setColumns(cols);
  }
  }, [roles, pageRoles])
  
  const rowSelection = {
    selectedRowKeys: indicatorSelected.map(item => {
      return item.key
    }),
    onChange: (selectedRowKeys, selectedRows) => {
      setIndicatorSelected(selectedRows);
      // console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record?.status === 'approved' || record?.status === 'returned' || record?.status === 'draft',
      name: record.key,
    }),
  };


  const openAmsModal = () => {
    if(pageRoles.includes(ACTION_EDIT)){
      if(!indicatorSelected.length) {
        infoMsg('Please select atleast one data.');
      }
      else if(ActionVal.current == ''){
        infoMsg('Please select action you want to excute.');
      }
      else{
        toggleSidebar();
      }
    }else{
      infoMsg('Please select action you want to excute.');
    }
  }

  const setFieldsChanges = (field) => {
    var val = {};
    for (let index = 0; index < field.length; index++) {
      const {name, value} = field[index];
      if(name[0] != 'year'){
        val[name[0]] =  value == 'All' ? (name[0] == 'status' ? 'all' : 0) : value;
      }
    }
    setDataSelector(prevState => ({...prevState, ...val}));
  }

  const pustToDataEntry = (dataIndex = 0, btnView = false) => {
    if(pageRoles.includes(ACTION_ADD)){
      var paramsData = {
        country: dataSeletor?.country, 
        indicator_category: dataSeletor?.category_id ? dataSeletor?.category_id : 'all', 
        indicator_type: dataSeletor?.type_id ? dataSeletor?.type_id : 'all', 
        year: dataSeletor?.year, 
        organization_id: dataSeletor?.organization_id,
        dataStatus: btnView ? dataSeletor?.status : 'all',
        dataIndex,
        repository_id: 0,
        action: "add"
      };
      history.push(`/data-entry/detail/${window.btoa(JSON.stringify(paramsData))}`);
    }else{
      infoMsg(`Oops!, sorry you have no permission to access this action. :'(`);
    }
    
  }

  const openConfirmation = () => {
    confirm({
      title: (
        <>
          <h5 className="hp-mb-0 hp-font-weight-500">
              Are you sure you want to {roles?.includes(FSA) ? "approve" : "submit"} all draft indicator data?
          </h5>
        </>
      ),
      icon: (
        <span className="remix-icon">
          <RiInformationLine />
        </span>
      ),
      content: (""),
      okText: "Yes",
      okType: "primary",
      cancelText: "No",
      onOk() {
        submitDraftDataInBulk();
      },
      onCancel() {},
    })
  }
  
  const submitDraftDataInBulk = () => {
   const dataV2 = data.filter(d => {
      return d.status == "draft" ? true : false;
    });
    var count = 0;
    for (let index = 0; index < dataV2.length; index++) {
       var params = {
        status: roles?.includes(FSA) ? "approved" : "submitted",
        remarks: "N/A"
      }

      var updateParams = {
        status: "submitted",
      }

      if (roles?.includes(FSA)) {
        dispatch(
          statusHandler(dataV2[index]?.key, params)
          ).catch(() => {
            errMsg();
          });
      } else 
      {
        dispatch(
          updateAmsData(updateParams, dataV2[index]?.key)
          ).catch(() => {
            errMsg();
          });
      }
        count++;
    }
    if(count == dataV2.length){
          fetch(pagination);
          callNotif("Success", `Indicator Data Entry was successfully ${roles?.includes(FSA) ? "approved" : "submitted"}.`, "success");
    }
  }

  const printBtn = (data) => {
    return (
      <Space>
        {
          roles?.includes("data_manager") || roles?.includes("system_administrator") ? (
            <Button type="primary" style={{ marginTop:"5px", marginBottom:"5px"}} onClick={() => toggleImport()} icon={<RiFileUploadLine size={22} className="remix-icon" />} loading={loading} > IMPORT INDICATOR DATA</Button>
          ) : ""
        }
        {
          roles?.includes("data_manager") || roles?.includes("system_administrator") ? (
            <Button type="primary" style={{ marginTop:"5px", marginBottom:"5px"}} onClick={() => openConfirmation()} icon={<RiSendPlaneLine size={22} className="remix-icon" />} loading={loading} disabled={disableBulkBtn}>SUBMIT ALL DRAFT INDICATOR DATA</Button>
          ) : ""
        }
        {
            roles?.includes("system_administrator") || roles?.includes("data_manager") ?
            (
              <Button type="primary" onClick={() => pustToDataEntry()} icon={<RiAddBoxLine size={22} className="remix-icon" />} loading={loading}> ENCODE INDICATOR DATA</Button>
            ) : ""
        }
      </Space>
    );
  }

  const printBtnv2 = (data) => {
    return (
      <Space>
        {
          !roles?.includes("secretariat") ? (
            <Dropdown.Button
            // size="small"
            disabled={data.length ? false: true}
            icon={<DownOutlined />}
            overlay={
              <Menu onClick={(e) => handleExportAms(e)}>
                {
                  ['PDF', 'EXCEL'].map(item => {
                    return <Menu.Item key={item} value={item}>{item}</Menu.Item>
                  })
                }
              </Menu>
            }
          >
            <RiPrinterLine size={22}/> PRINT DATA
          </Dropdown.Button>
          ) : ""
        }
        {
          roles?.includes("data_manager") || roles?.includes("system_administrator") ? (
            <Button type="primary" style={{ marginTop:"5px", marginBottom:"5px"}} onClick={() => toggleImport()} icon={<RiFileUploadLine size={22} className="remix-icon" />} loading={loading} > IMPORT INDICATOR DATA</Button>
          ) : ""
        }
        {
          roles?.includes("data_manager") || roles?.includes("system_administrator") ? (
            <Button type="primary" style={{ marginTop:"5px", marginBottom:"5px"}} onClick={() => openConfirmation()} icon={<RiSendPlaneLine size={22} className="remix-icon" />} loading={loading} disabled={disableBulkBtn}>SUBMIT ALL DRAFT INDICATOR DATA</Button>
          ) : ""
        }
        {
            roles?.includes("system_administrator") || roles?.includes("data_manager") ?
            (
              <Button type="primary" onClick={() => pustToDataEntry()} icon={<RiAddBoxLine size={22} className="remix-icon" />} loading={loading}> ENCODE INDICATOR DATA</Button>
            ) : ""
        }
      </Space>
    );
  }

  const handleExportAms = (e) => {
    const filter = {
      organization_id: dataSeletor?.organization_id,
      category_id: dataSeletor?.category_id,
      type_id: dataSeletor?.type_id,
      status: dataSeletor?.status,
      year: dataSeletor?.year
    }

    dispatch(exportAms(filter, e.key)).then((response) => {
      setIsFileFetch(true);
    })
  }

  const getFileResponse = () => {
    var blob = new Blob([fileData.data], {type: fileData.headers["content-type"]});
    var objectUrl = window.URL.createObjectURL(blob);
    var url = fileData?.config?.url;
    var formatSplitted = url.split('/');
    var format = formatSplitted.pop() === 'PDF' ? 'pdf' : 'xlsx';

    var tempLink = document.createElement('a');
    tempLink.href = objectUrl;
    tempLink.setAttribute('download', `ANSS-AMS.${format}`);
    tempLink.click();
  }

  if(isFileFetch){
    getFileResponse();
    setIsFileFetch(false);
  }

  const customise = useSelector(state => state.customise);
  return (
    <>
    <div className="hp-mb-1" style={{ borderBottom: "2px solid black" }}>
      <Form
        layout="vertical"
        fields={fields}
        onFieldsChange={(_, allFields) => {
          setFieldsChanges(allFields);
        }}
        >
        <Row justify="space-between" gutter={[4, 4]} style={{ marginBottom:"-10px"}} align="end">
          <Col md={10} sm={24} span={24}>
              <BreadCrumbs
                breadCrumbActive={roles?.includes("system_administrator") || roles?.includes("data_manager") ? "Indicator Data Entry": "Indicators Approval"}
              />
              <Col>
                {
                  roles?.includes("system_administrator") ||  roles?.includes("secretariat") ? 
                  (
                    <Select placeholder="Select Country" defaultValue={organization?.party_id} onChange={(e) => {setDataSelector(prevState => ({...prevState, organization_id: e}))}} style={{ width: (window.screen.width > 800 ? "55%" : "100%")}}>
                    {
                      memberState_data.map(item =>{
                        return (
                          <Select.Option key={item.id} value={item.id}><FlagIcon country={item.attributes.name} /> {item.attributes.name}</Select.Option>
                        )
                      })
                    }
                  </Select>
                  ) : (
                    <Space>
                      <Avatar size={40} icon={<FlagIcon country={organization?.name} />} className="hp-m-auto" />
                      <h3 style={{marginTop:"10px"}}>{organization?.name}</h3>
                  </Space>
                  )
                }
              </Col>
          </Col>
          <Col md={3} sm={24} span={24}>
                <Form.Item name="year" label="Year"
              tooltip ="year the indicator data was reported">
                  <DatePicker picker="year" onChange={(date, dateString) => ( setDataSelector(prevState => ({...prevState, year: moment(dateString).format('Y')})) )} allowClear={false}/>
                </Form.Item>
            
          </Col>
          <Col md={4} sm={24} span={24}>
              <Form.Item label="Indicator Type" name="type_id" rules={[{ required: false, message: 'This is required!' }]}
                tooltip="The classification of nutrition indicators in terms of its importance as a reporting measure defined by ANSS team based on specific criteria. (i.e. Primary Outcome, Intermediate Outcome, Process/Output,  and Others)">
                <Select
                  placeholder="Select Indicator Type"
                  allowClear={false}
                >
                  <Select.Option value="All">All</Select.Option>
                    {
                      indicatorType_data.map(item =>{
                        return (
                          <Select.Option key={item.id} value={item.id}>{item.attributes.name}</Select.Option>
                        )
                      })
                    }
            </Select>
            </Form.Item>
          </Col>
          <Col md={4} sm={24} span={24}>
            <Form.Item label="Indicator Category" name="category_id" rules={[{ required: false, message: 'This is required!' }]}
              tooltip="the classification of nutrition indicators based on related forms and causes of malnutrition (e.g. Anthropometry, Micronutrients and Diseases, Dietary and Lifestyle, etc…)">
            <Select
              placeholder="Select Indicator Category"
              allowClear={false}
            >
               <Select.Option value="All">All</Select.Option>
                    {
                      indicatorCategory_data.map(item =>{
                        return (
                          <Select.Option key={item.id} value={item.id}>{item.attributes.name}</Select.Option>
                        )
                      })
                    }
            </Select>
            </Form.Item>
          </Col>
          <Col md={3} sm={24} span={24}>
            <Form.Item label="Status" name="status" rules={[{ required: false, message: 'This is required!' }]}>
            <Select
              placeholder="Select Status"
              allowClear={false}
            >
              <Select.Option value="All">All</Select.Option>
              {
                legends_list.map(item => {
                  return (<Select.Option key={item.stat} value={item.stat.toLowerCase()}>{item.stat}</Select.Option>)
                })
              }
            </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
    <Row justify="space-between">
      <Col span={24} md={24} align="end">
        {
          roles?.includes("system_administrator") || roles?.includes("focal_point") ? 
          (
              <Form
              form={form}
              layout="horizontal"
              >
               <Row justify="start" gutter={[8, 8]} style={{marginTop:"10px"}}>
                <Col md={8} span={24}>
                  <Form.Item label="Action" name="indicatorsAction" rules={[{ required: false, message: 'This is required!' }]}>
                      <Select
                        placeholder="Select Action"
                        allowClear={false}
                        onChange={(e) => {ActionVal.current = e}}
                        disabled={data.length ? loading: true}
                      >
                        {
                            ['approve', 'return'].map(item => {
                              return (<Select.Option key={item} value={item}>{(item).toUpperCase() +" INDICATOR DATA"}</Select.Option>)
                            })
                          }
                      </Select> 
                    </Form.Item>
                </Col>
                <Col md={6} span={24} align="left">
                    <Button type="primary" onClick={openAmsModal} loading={loading} disabled={data.length ? false: true} >Apply to selected item(s)</Button>
                </Col>
                <Col md={10} span={24}>
                {
                  !roles?.includes("secretariat") ? (
                    <Dropdown.Button
                    // size="small"
                    disabled={data.length ? false: true}
                    icon={<DownOutlined />}
                    overlay={
                      <Menu onClick={(e) => handleExportAms(e)}>
                        {
                          ['PDF', 'EXCEL'].map(item => {
                            return <Menu.Item key={item} value={item}>{item}</Menu.Item>
                          })
                        }
                      </Menu>
                    }
                  >
                    <RiPrinterLine size={22}/> PRINT DATA
                  </Dropdown.Button>
                  ) : ""
                }
                </Col>
               </Row>
              </Form>
          ) : printBtnv2(data)
        }
      </Col>
      <Col span={24} md={24} align="end">
        {
          roles?.includes("system_administrator") || roles?.includes("focal_point")  ? printBtn(data) : " "
        }
      </Col>
      <Col span={24}>
      <Table
        rowSelection={roles?.includes("system_administrator") || roles?.includes("focal_point") ? {
          type: 'checkbox',
          ...rowSelection,
        }: ""}
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={pagination}
        onChange={handleTableChange}
        scroll={{ x: 'calc(500px + 50%)' }}
      />
      </Col>
    </Row>
    {
      (<UploadFileModal open={importOpen} toggleImport={toggleImport}/>)
    }
    {
      (<AmsModal open={sidebarOpen} toggleSidebar={toggleSidebar} indicatorSelected={indicatorSelected} ActionVal={ActionVal.current} setSuccessTrans={setSuccessTrans} />)
    }
    
    </>
  )
};