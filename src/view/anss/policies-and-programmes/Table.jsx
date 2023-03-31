import { useState, useEffect, useRef, useCallback  } from "react";
import { Link, useHistory } from "react-router-dom";
import debounce from "lodash/debounce";
import FlagIcon from '../../../utils/global-components/FlagIcon';
// Redux
import {getAllForTblData, deletePolicyProgrammesData, PolicyProgrammesDataApproval, searchDataList } from "../../../redux/policy-programmes/policyProgrammesActions";
import { getAllData as getAllOrganizationsData } from "../../../redux/asian-countries/asianCountriesAction2";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Button, Input, Table, Card, Menu, Space, Popconfirm, Dropdown, Modal, Tag, List, Avatar, Select, Form } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import { Search, Delete, EditSquare } from "react-iconly";
import { RiAddBoxLine, RiErrorWarningLine, RiEyeLine, RiInformationLine, RiFileList3Line, RiDraftLine  } from "react-icons/ri";
import moment from "moment-timezone";
// import { columns } from "./Columns";
// import AddNewAms from "./Modal";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {legends_list} from '../../../utils/common';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD, FOCAL, FSA, MANAGER, SECRETARIAT} from '../../../utils/LangConstants';
import {callNotif} from '../../../utils/global-functions/minor-functions';
import ApprovalModal from "./ApprovalModal";
export default function UsersList(props) {
  const {pageRoles} = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false)
  const [listParams, setListParams] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const { confirm } = Modal;
  const [sorter, setSorter] = useState({})
  const [filters, setFilters] = useState({})
  const [data, setData] = useState([])
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchText, setSearchText] = useState('');
  const [remarks, setRemarks] = useState({remarks: ''});
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [form] = Form.useForm();
  const history = useHistory();

  // for approval data set
  const [successTrans, setSuccessTrans] = useState(false);
  const [dataSelected, setDataSelected] = useState([]);
  const [actionSelected, setActionSelected] = useState("");
  // Redux
  const dispatch = useDispatch();
  const {programmes_data, programmes_links, programmes_meta, programmes_details, status, message} = useSelector((state) => state.policyProgrammes);
  const {memberState_data} = useSelector((state) => state.asianCountries);
  const { myprofile: {organization, roles}  } = useSelector(state => state.users);
  const [ dataSeletor, setDataSelector ] = useState({
    organization_id: 0,
    remarks: '',
    program_status: roles?.includes(FOCAL) ? "submitted" : 'all'
  }); 

  // Sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleFilter = (val) => {
    setSearchTerm(val);
    // delayedSearch(val);
    fetch(pagination, filters, sorter, val);
  };


  const openNotificationWithIcon = (type, title = "", msg = "") => {
    callNotif(title, msg, type);
  };

  const errMsg = () => {
    if(typeof status == "string" && status == "error"){
        if(message != ""){
          if(typeof message == "object"){
              message.forEach(item => {
                  openNotificationWithIcon(status, "Error", item)
              });
          }else{
            if(message){
              openNotificationWithIcon(status, "Error", message)
            }
          }
          clearErrMessage()
        }
    }
}
const clearErrMessage = () => {
  dispatch({
      type: 'SET_PROGRAMMES_DATA_MESSAGE',
      status: '',
      msg: '',
  });
}

useEffect(()=> {
  if(successTrans){
    setSidebarOpen(false);
    setDataSelected([]);
    setActionSelected("");
    setSuccessTrans(false);
    fetch(pagination, filters, sorter, searchTerm);
  }
}, [successTrans])

useEffect(() => {
  fetch(pagination, filters, sorter, searchTerm);
}, [dataSeletor])

  useEffect(() => {
    errMsg();
  }, [status])

  useEffect(() => {
    var localData = localStorage.getItem('program-totals') ? JSON.parse(localStorage.getItem('program-totals')) : null;
    var params = {
      organization_id: localData ?  localData?.key : (organization?.party_id ?? 0),
      program_status: localData ? localData?.status : (roles?.includes(FOCAL) ? "submitted" : 'all')
    }
    form.setFieldsValue(params)
    setDataSelector(params);
    
  }, [form, organization])

  // Get Data 
  useEffect(() => {
    dispatch(getAllOrganizationsData());
  }, [dispatch]);

  const queryDataList = (search_key = '', sort_key = '', order = 'asc', paginationV2={}) => {
    setLoading(true);
    var params = {};
    if(search_key != ''){
      params['search_key'] = search_key 
    }
    if(sort_key != ''){
      params['sort_key'] = sort_key 
    }
    if(order != ''){
      params['order'] = order 
    }
    if(paginationV2){
      params = { ...params, ...paginationV2, page : paginationV2.current }
    }
    params['organization_id'] =  organization?.party_id ?? 0,
    dispatch(searchDataList(params)).then(() => {
      setLoading(false);
      setIsDataFetched(true);
      setPagination({
        current: 1,
        pageSize: 10,
      })
    });
  }

  const delayedSearch = useCallback(
    debounce((q) => queryDataList(q, '', 'asc'), 500),
    [searchTerm]
  );

  const processData = () => {
    const results = [];
    if(typeof programmes_data !== 'undefined'){
      for (let i = 0; i < programmes_data.length; i++) {
        results.push({
          key: programmes_data[i].id,
          classification_id: programmes_data[i]?.attributes?.classification?.section,
          environment_id: programmes_data[i]?.attributes?.environment?.indicator,
          name: programmes_data[i]?.attributes?.name,
          technical_notes: programmes_data[i]?.attributes?.technical_notes,
          policy_status: programmes_data[i]?.attributes?.status?.display_name,
          details: programmes_data[i]?.attributes?.details,
          program_status:programmes_data[i]?.attributes?.program_status,
          remarks: programmes_data[i]?.attributes?.remarks,
          ...programmes_data[i]?.attributes,
          detail: programmes_data[i],
          programmes_data,
          dataIndex: i
        });
      }
      // var new_res = results.filter(item => {
      //   return roles.includes(FOCAL) ? (item?.program_status != 'draft' ? item : null) : item;
      // })
      setData(results);
      if(Object.keys(programmes_meta).length){
        setPagination({
          ...listParams.pagination,
          total: programmes_meta.pagination.total, // total regardless of pagination
        });
      }
    }
    setIsDataFetched(false);
  }

  const confirmDel = (id, org_id = 0) => {
    if(pageRoles.includes(ACTION_DELETE)){
      dispatch(deletePolicyProgrammesData({}, id))
      .then(()=> {
        openNotificationWithIcon("success", "Success", "Policy and program data is deleted successfully.")
        fetch(pagination);
      });
    }else{
       openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have ${ACTION_DELETE} permission.`);
     }
  }


  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };
  


  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  

  const addDataAction = () => {
    history.push(`/policies-and-programmes/forms/add-data/${window.btoa(JSON.stringify({ id: 0, org_id: dataSeletor?.organization_id }))}`)
  }

  const btnForAddData = () => {
    if(pageRoles.includes(ACTION_ADD)){
      return (
        <Col className="gutter-row" md={7} sm={24} span={24}>
                  <Button
                    block
                    className="hp-mt-sm-16"
                    type="primary"
                    onClick={() => addDataAction()}
                    icon={<RiAddBoxLine size={16} className="remix-icon" />}
                  >
                    ADD POLICY AND PROGRAMME
                  </Button>
        </Col>
      )
    }
  }

  const btnForEditData = (dataIndex, org_id) => {
    if(pageRoles.includes(ACTION_EDIT)){
      return (
        <Link
                   to={`/policies-and-programmes/forms/edit-data/${window.btoa(JSON.stringify({id: dataIndex, org_id}))}`}
              >
                <EditSquare set="broken"  size={24}
                    className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
            </Link>
      )
    }
  }
  const btnForDeleteData = (dataIndex, org_id) => {
    if(pageRoles.includes(ACTION_DELETE)){
      return (
        <Popconfirm
                placement="topLeft"
                title="Are you sure you want to delete this policy and program?"
                onConfirm={() => confirmDel(dataIndex)}
                okText="Yes"
                cancelText="No"
                icon={
                <RiErrorWarningLine className="remix-icon hp-text-color-primary-1" />
                }
            >
                <Delete
                    size={24}
                    className="hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 hp-text-color-black-80"
                />
            </Popconfirm>
      )
    }
  }
  const btnForViewData = (dataIndex, org_id) => {
    if(pageRoles.includes(ACTION_VIEW)){
      return (
        <Link
                   to={`/policies-and-programmes/forms/view-data/${window.btoa(JSON.stringify({id: dataIndex, org_id}))}`}
              >
                  <RiEyeLine set="broken"  size={24}
                    className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
              </Link>
      )
    }
  }

  const submitApprovalStatus = (details, remarksText) => {
      const data  = {
        status: details[0] == "approve" ? "approved" : "returned",
        remarks: remarksText
      }
    dispatch(PolicyProgrammesDataApproval(data, details[1])).then(() => {
      openNotificationWithIcon("success", "Success", `Policy and programme data successfully ${details[0] == "approve" ? "approved" : "returned"}.`)
      fetch(pagination);
    }).catch((e) => {});
  }


const viewIndicatorDataEntry = (detail) => {
  var country = memberState_data.filter((item) => { return item.id == dataSeletor?.organization_id });
    Modal.info({
        icon: (
            <RiDraftLine className="remix-icon"/>
        ),
        title: (
          <h5 className="hp-mb-0 hp-font-weight-500">View Policy and Programme</h5>
        ),
        width:800,
        content: (
          <ul style={{ listStyle:"none" }}>
          {
            roles.includes('system_administrator') ? (<li><b>Member State: </b>{country.length ? country[0]?.attributes?.name : ""}</li>) : ""
          }
          <li><b>Policy Classifcation: </b>{detail?.attributes?.classification?.section}</li>
          <li><b>Policy Indicator: </b>{detail?.attributes?.environment?.indicator}</li>
          <li><b>Policy Name: </b>{detail?.attributes?.name}</li>
          <li><b>Policy Details: </b>{detail?.attributes?.details}</li>
          <li><b>Policy Status: </b>{detail?.attributes?.status?.display_name}</li>
          <li><b>Service Scale: </b>{(detail?.attributes?.service_scale).toLowerCase() == "both" ? "Both, National & Sub-National" : detail?.attributes?.service_scale == "Sub-national" ? "Sub-National" : detail?.attributes?.service_scale}</li>
          <li><b>Coverage (%): </b>{detail?.attributes?.coverage}</li>
          {detail?.attributes?.url ? (<li><b>Link: </b><a href={detail?.attributes?.url} target="_blank">{detail?.attributes?.url}</a></li>): ""}
            {
              detail?.attributes?.document_url ? (
                <>
                  <li>
                    <b>Document: </b>
                    <a href={detail?.attributes?.document_url} target="_blank">View document</a>
                  </li>
                  <li>
                    <b>Language Availability: </b>
                    {
                      detail?.attributes?.language ?? "N/A"
                    }
                  </li>
                </>
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

  const handleButtonClick = (e, arrData, dataIndex, detail) => {
    console.log(detail);
    var data = e.key.split("_");
    if(data[0] == "view"){
      viewIndicatorDataEntry(detail);
    }
    else if(data[0] == "edit"){
      history.push(`/policies-and-programmes/forms/edit-data/${window.btoa(JSON.stringify({id: detail?.id, org_id : detail?.attributes?.organization?.party_id })) }`);
    }
    else if(data[0] == "delete"){
      confirm({
        title: (
          <>
            <h5 className="hp-mb-0 hp-font-weight-500">
                Are you sure you want to delete this policy and program?
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
          confirmDel(detail?.id, detail?.attributes?.organization_id);
        },
        onCancel() {},
      });
    }
    else{
      var dataWrapper = [];
      dataWrapper.push(detail);
      setDataSelected(dataWrapper);
      setActionSelected(data[0]);
      toggleSidebar();
      // confirm({
      //   title: (
      //     <>
      //       <h5 className="hp-mb-0 hp-font-weight-500">
      //       POLICY AND PROGRAMME TO BE {data[0].toUpperCase() == "APPROVE" ? "APPROVED" : "RETURNED"}
      //       </h5>
           
      //     </>
      //   ),
      //   icon: (
      //     <span className="remix-icon">
      //       <RiInformationLine />
      //     </span>
      //   ),
      //   width:800,
      //   content: (
      //     <>
      //     <Card style={{ width: "100%" }}>
      //       <ul style={{ listStyle: "none"}}>
              // <li><b>Policy Classifcation: </b>{detail?.attributes?.classification_id}</li>
              // <li><b>Policy Indicator: </b>{detail?.attributes?.environment_id}</li>
              // <li><b>Policy Name: </b>{detail?.attributes?.name}</li>
              // <li><b>Policy Details: </b>{detail?.attributes?.details}</li>
              // <li><b>Status: </b>{detail?.attributes?.status?.display_name}</li>
              // <li><b>Service Scale: </b>{detail?.attributes?.service_scale}</li>
              // <li><b>Coverage (%): </b>{detail?.attributes?.coverage}</li>
              // {detail?.attributes?.url ? (<li><b>Link: </b><a href={detail?.attributes?.url} target="_blank">{detail?.attributes?.url}</a></li>): ""}
              //     {
              //       detail?.attributes?.document_url ? (
              //         <li>
              //           <b>Document: </b>
              //         <a href={detail?.attributes?.document_url} target="_blank">View document</a>
              //         </li>
              //       ) : ""
              //     }
      //       </ul>
      //     </Card>

      //     <Form
      //       layout="vertical"
      //       form={form}
      //     >
      //       <Form.Item
      //           name="remarks"
      //           label="remarks"
      //           rules={[{ required: true, message: 'This is required!' }]}
      //       >
      //           <Input.TextArea rows={4} placeholder="Remarks"/>
      //       </Form.Item>
      //     </Form>
      //     </>
      //   ),
      //   okText: data[0].toUpperCase(),
      //   okButtonProps: {
      //     type:"primary",
      //     className : data[0].toUpperCase() == "RETURN" ? "hp-bg-danger-1 hp-border-color-danger-1 hp-hover-bg-danger-2 hp-hover-border-color-danger-2" : "hp-bg-primary-1 hp-border-color-primary-1 hp-hover-bg-primary-2 hp-hover-border-color-primary-2",
      //   },
      //   okType: "primary",
      //   cancelText: "Cancel",
      //   onOk() {
      //     var remarksText = document.getElementById("remarks").value
      //     if(remarksText == "" || remarksText == null){
      //       openNotificationWithIcon("error", "Error", "Oops, Remarks is required!")
      //     }else{
      //       confirm({
      //         title: `Are you sure you want to ${data[0]} this policy and programme?`,
      //         icon: (
      //           <span className="remix-icon">
      //               <RiInformationLine />
      //             </span>
      //         ),
      //         content: `This action will tag this as ${data[0]} and cannot be undone.`,
      //         okText:"Yes",
      //         onOk() {
      //           submitApprovalStatus(data, remarksText);
      //         },
      //       });
      //     }
          
      //   },
      //   onCancel() {},
      // });
    }
  }

  const viewRemarksMd = (dataIndex) => {
    const {remarks, name} = dataIndex
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
                        <b>STATUS:</b> {(item.status).toLowerCase() == "approved" ? "Approved" : "Returned"}
                      </small>
                    </li>
                    <li>
                      <small>
                        <b>{`${(item.status).toUpperCase()} DATE:`}</b> {moment(item.created_at).tz('Asia/Manila').format('LLL z')}
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

  useEffect( () => {
    var columns = [
      {
        title: "Policy Classifcation",
        dataIndex: "classification_id",
        align: "left",
        sorter: true
      },
      {
        title: "Policy Indicator",
        dataIndex: "environment_id",
        align: "left",
        sorter: true,
      },
      {
        title: "Policy Name",
        dataIndex: "name",
        align: "left",
        sorter: true,
      },
      {
        title: "Policy Status",
        dataIndex: "policy_status",
        align: "left",
        sorter: true,
      },
      {
        title: 'Remarks',
        dataIndex: 'remarks',
        width:"13%",
        render: (_, dataIndex) => (
          <Button size="small" onClick={() => viewRemarksMd(dataIndex)} disabled={dataIndex?.remarks.length ? false : true}><RiFileList3Line/> &nbsp; Remarks</Button>
        )
      },
      {
        title: "Approval Status",
        dataIndex: "program_status",
        align: "center",
        sorter: true,
        render: (dataIndex) => (
          legends_list.map((item, i) => {
            if(item.stat_name.toLowerCase() == dataIndex)
            {
              return <Tag key={i} color={item.stat_color}>{  dataIndex.toUpperCase()}</Tag>
            }
          })
          ),
      }
    ];
    if(pageRoles.length) {
      columns.push({
      title: "Actions",
      dataIndex: "key",
      align: "center",
      render: (_, {key, program_status, programmes_data, dataIndex, detail}) => (
        <Dropdown.Button
          key={key}
          size="small"
          icon={<DownOutlined />}
          disabled={roles?.includes(FOCAL) ? status == 'draft' :false}
            overlay={
              <Menu onClick = {(e) => handleButtonClick(e, programmes_data, dataIndex, detail)}>
                {
                  (roles.includes(SECRETARIAT) ? 
                    ['view'] : 
                      (program_status == "submitted" ? 
                        (roles?.includes(FOCAL) || roles.includes(FSA) ? 
                          ['approve', 'return', 'view'] : 
                          ['view']) : 
                        (program_status == "returned" || program_status == "draft"  ? 
                        ( roles.includes(FSA) || roles.includes(MANAGER) ? 
                          ['edit', 'view', 'delete'] : 
                          ['view']) : 
                        program_status == "approved" ? 
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
    setColumns(columns);

  }, [roles, pageRoles])


  const handleTableChange = (pagination, filters, sorter) => {
    setSorter(sorter);
    setFilters(filters);
    fetch(pagination, filters, sorter, searchTerm);
  };

  const fetch = (params = {}, filters={},  sorter={}, search_key="") => {
    setLoading(true);
    var dataParams = {
      limit: params.pageSize ?? 10,
      page: params.current ?? 1
    };
    Object.keys(dataSeletor).forEach(item => {
      if(!['all'].includes((dataSeletor[item]).toString())){
        dataParams[item] = dataSeletor[item]
      }
    })
    if(Object.keys(sorter).length){
      dataParams['sort_key'] = sorter?.field
      dataParams['order'] = sorter?.order == "descend" ? "desc" : "asc"
    }
    if(search_key != ''){
      dataParams['search_key'] = search_key
    }
    dispatch(searchDataList(dataParams))
      .then(() => {
        setLoading(false)
        setListParams(params);
        setIsDataFetched(true);
      })
  }
  if(isDataFetched) {
    processData();
  }

  const setFieldsChanges = (fields) => {
    var val = {};
    for (let index = 0; index < fields.length; index++) {
      const {name, value} = fields[index];
        val[name[0]] =  value;
    }
    setDataSelector(prevState => ({...prevState, ...val}));
  }

  return (
    <>
    <div className="hp-mb-1" style={{ borderBottom: "2px solid black" }}>
    <Form
      layout="vertical"
      form={form}
      onFieldsChange={(_, allFields) => {
        setFieldsChanges(allFields);
      }}

    >
      <Row
        justify="space-between"
        gutter={[8, 8]}
        style={{ marginBottom:"-10px"}}
      >
        <Col md={16} sm={24} span={24}>
            <BreadCrumbs
              homePage = "Home"
              breadCrumbActive="Policies & Programmes"
            />
             {
                 !roles?.includes(FSA) && !roles?.includes(SECRETARIAT) ? 
                  (
                    <Space>
                      <Avatar size={35} icon={<FlagIcon country={organization?.name} />} className="hp-m-auto" />
                      <h3 style={{marginTop:"10px"}}>{organization?.name}</h3>
                  </Space>
                  ) :""
                }
          </Col>
          <Col md={5} sm={24} span={24}>
            {
                   roles?.includes(FSA) || roles?.includes(SECRETARIAT) ? 
                  (
                    <Form.Item label="Select Country" name="organization_id" rules={[{ required: false, message: 'This is required!' }]}>
                      <Select 
                      placeholder="Select Country" 
                      // defaultValue={organization?.party_id}
                      >
                      {
                        memberState_data.map((item, index) =>{
                          return (
                            <Select.Option key={index} value={item.id}><FlagIcon country={item.attributes.name} /> {item.attributes.name}</Select.Option>
                          )
                        })
                      }
                    </Select>
                  </Form.Item>
                  ) : ""
                }
          </Col>
          <Col md={3} sm={24} span={24}>
            <Form.Item label="Status" name="program_status"  rules={[{ required: false, message: 'This is required!' }]}>
            <Select
              placeholder="Select Status"
              allowClear={false}
              // defaultValue="all"
            >
              <Select.Option value="all">All</Select.Option>
              {
                (roles?.includes(FOCAL) ? ['Submitted', 'Approved', 'Returned'] : ['Draft', 'Submitted', 'Approved', 'Returned']).map((item, index) => {
                  return (<Select.Option key={index} value={item.toLowerCase()}>{item}</Select.Option>)
                })
              }
            </Select>
            </Form.Item>
          </Col>
      </Row>
    </Form>
    </div>
    
      <Row
        className="hp-mb-8 hp-mt-8"
        justify="end"
        gutter={{
          xs: 4,
          sm: 6,
          md: 16,
          lg: 24,
        }}
      >
        <Col className="gutter-row" md={5} sm={24} span={24}>
              <Input
                  placeholder="Search"
                  prefix={<Search set="curved" size={16} className="hp-text-color-black-80" />}
                  value={searchTerm}
                  onChange={(e) => handleFilter(e.target.value)}
                />
        </Col>
        
            {btnForAddData()}
      </Row>

      <Card className="hp-contact-card hp-mb-32">
        <Col className="hp-contact-card hp-mt-32">
          <Table
            rowKey={record => record.key}
            columns={columns}
            // expandable={{
            //   expandedRowRender: record => <p style={{align: 'left', margin: 0 }} >{record.details}</p>,
            //   rowExpandable: record => record.details !== '',
            // }}
            
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
            scroll={{ x: 'calc(800px + 50%)' }}
          />
        </Col>

        <ApprovalModal open={sidebarOpen} toggleSidebar={toggleSidebar}  setSuccessTrans={setSuccessTrans} dataSelected={dataSelected} actionSelected={actionSelected}/>
      </Card>
    </>
  );
};