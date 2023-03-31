import { useState, useEffect, useRef, useCallback  } from "react";
import { Link, useHistory } from "react-router-dom";
import debounce from "lodash/debounce";
import FlagIcon from '../../../utils/global-components/FlagIcon';
// Redux
import { SocialProgramDataApproval, getAllForTblData, deleteSocialProgramData, searchDataList } from "../../../redux/social-protection-program/socialProgramActions";
import { getAllData as getAllOrganizationsData } from "../../../redux/asian-countries/asianCountriesAction2";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Button, Input, Table, Card, Menu, Space, Popconfirm, notification, Dropdown, Modal, Tag, List, Form, Select, Avatar  } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import { Search, Delete, EditSquare } from "react-iconly";
import { RiAddBoxLine, RiErrorWarningLine, RiEyeLine,RiInformationLine, RiFileList3Line, RiDraftLine  } from "react-icons/ri";
import moment from "moment-timezone";
// import { columns } from "./Columns";
// import AddNewAms from "./Modal";
import {legends_list} from '../../../utils/common';
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD, DELETED_DATA, FOCAL, FSA, MANAGER, SECRETARIAT } from '../../../utils/LangConstants';
import {callNotif} from '../../../utils/global-functions/minor-functions';
import ApprovalModal from "./ApprovalModal";
export default function UsersList(props) {
  const {pageRoles} = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [listParams, setListParams] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const { confirm } = Modal;
  const [columns, setColumns] = useState([]);
  const [sorter, setSorter] = useState({})
  const [filters, setFilters] = useState({})
  const [data, setData] = useState([])
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchText, setSearchText] = useState('');
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
  const {socialProgram_data, socialProgram_links, socialProgram_meta, socialProgram_details, status, message} = useSelector((state) => state.socialProgram);
  const {memberState_data} = useSelector((state) => state.asianCountries);
  const { myprofile: {organization, roles}  } = useSelector(state => state.users);

  const [ dataSeletor, setDataSelector ] = useState({
    organization_id: 0,
    status: roles?.includes(FOCAL) ? "submitted" : 'all'
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
  useEffect(() => {
    var localData = localStorage.getItem('social-totals') ? JSON.parse(localStorage.getItem('social-totals')) : null;
    var params = {
      organization_id: localData ?  localData?.key : (organization?.party_id ?? 0),
      status: localData ? localData?.status : (roles?.includes(FOCAL) ? "submitted" : 'all')
    }
    form.setFieldsValue(params)
    setDataSelector(params);
    
  }, [form, organization])

  useEffect(() => {
    fetch(pagination);
  }, [dataSeletor])

  // Get Data 
  useEffect(() => {
    dispatch(getAllOrganizationsData());
  }, [dispatch]);
  // useEffect(() => {
  //   fetch(pagination);
  // }, []);

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
    });
  }

  const delayedSearch = useCallback(
    debounce((q) => queryDataList(q, '', 'asc'), 500),
    [searchTerm]
  );

  const processData = () => {
    const results = [];
    if(typeof socialProgram_data !== 'undefined'){
      for (let i = 0; i < socialProgram_data.length; i++) {
        results.push({
          key: socialProgram_data[i].id,
          name: socialProgram_data[i]?.attributes?.name,
          description: socialProgram_data[i]?.attributes?.description,
          status: socialProgram_data[i]?.attributes?.status,
          remarks: socialProgram_data[i]?.attributes?.remarks,
          ...socialProgram_data[i]?.attributes,
          detail: socialProgram_data[i],
          socialProgram_data,
          dataIndex: i
        });
      }
      setData(results);
      if(Object.keys(socialProgram_meta).length){
        setPagination({
          ...listParams.pagination,
          total: socialProgram_meta.pagination.total, // total regardless of pagination
        });
      }
    }
    setIsDataFetched(false);
  }

  const confirmDel = (id, org_id = 0) => {
    if(pageRoles.includes(ACTION_DELETE)){
      dispatch(deleteSocialProgramData({}, id))
      .then(()=> {
        openNotificationWithIcon("success", "Success", `Social Protection Programme ${DELETED_DATA}`)
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
    history.push(`/social-protection-program/forms/add-data/${window.btoa(JSON.stringify({ id: 0, org_id: dataSeletor?.organization_id }))}`)
  }

  const btnForAddData = () => {
    if(pageRoles.includes(ACTION_ADD)){
      return (
        <Col className="gutter-row" md={8} sm={24} span={24}>
                  <Button
                    block
                    className="hp-mt-sm-16"
                    type="primary"
                    onClick={() => addDataAction()}
                    icon={<RiAddBoxLine size={16} className="remix-icon" />}
                  >
                    ADD SOCIAL PROTECTION PROGRAMME

                  </Button>
        </Col>
      )
    }
  }

  const btnForEditData = (dataIndex, org_id) => {
    console.log({id: dataIndex, org_id});
    if(pageRoles.includes(ACTION_EDIT)){
      return (
        <Link
                   to={`/social-protection-program/forms/edit-data/${window.btoa(JSON.stringify({id: dataIndex, org_id}))}`}
              >
                <EditSquare set="broken"  size={24}
                    className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
            </Link>
      )
    }
  }
  
  const btnForDeleteData = (dataIndex, org_id = 0) => {
    
    if(pageRoles.includes(ACTION_DELETE)){
      return (
        <Popconfirm
                placement="topLeft"
                title="Are you sure you want to delete this social protection programme?"
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
                   to={`/social-protection-program/forms/view-data/${window.btoa(JSON.stringify({id: dataIndex, org_id}))}`}
              >
                  <RiEyeLine set="broken"  size={24}
                    className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
              </Link>
      )
    }
  }

  const submitApprovalStatus = (details, remarksText) => {
    if(details.length){
      const data  = {
        status: details[0] == "approve" ? "approved" : "returned",
        remarks: remarksText
      }
    dispatch(SocialProgramDataApproval(data, details[1])).then(() => {
      openNotificationWithIcon("success", "Success", `Social Protection Programme data successfully ${details[0] == "approve" ? "approved" : "returned"}.`)
      fetch(pagination);
    }).catch((e) => {});
    }
    
}

const viewIndicatorDataEntry = (detail) => {
  console.log(detail);
  var country = memberState_data.filter((item) => { return item.id == dataSeletor?.organization_id });
    Modal.info({
        icon: (
            <RiDraftLine className="remix-icon"/>
        ),
        title: (
          <h5 className="hp-mb-0 hp-font-weight-500">View Social Protection Programme</h5>
        ),
        width:800,
        content: (
          <ul style={{ listStyle:"none" }}>
          {
            roles.includes('system_administrator') ? (<li><b>Member State: </b>{country.length ? country[0]?.attributes?.name : ""}</li>) : ""
          }
          <li><b>Programme Name: </b>{detail?.attributes?.name}</li>
          <li><b>Description: </b>{detail?.attributes?.description}</li>
          <li><b>Enrollment Criteria: </b>{detail?.attributes?.criteria}</li>
          <li><b>Benefits: </b>{detail?.attributes?.benefits}</li>
          <li><b>Scale: </b>{(detail?.attributes?.scale).toLowerCase() == "both" ? "Both, National & Sub-National" : detail?.attributes?.scale == "Sub-national" ? "Sub-National" : detail?.attributes?.scale}</li>
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
      history.push(`/social-protection-program/forms/edit-data/${window.btoa(JSON.stringify({id: detail?.id, org_id: detail?.attributes?.organization?.organization_id}))}`);
    }
    else if(data[0] == "delete"){
     
      confirm({
        title: (
          <>
            <h5 className="hp-mb-0 hp-font-weight-500">
              Are you sure to delete this social protection programme?
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
      console.log(dataWrapper);
      setActionSelected(data[0]);
      toggleSidebar();
    }
      
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

  useEffect(() => {
  const columns = [
    {
      title: "Programme Name",
      dataIndex: "name",
      align: "left",
      sorter:true,
      // ...getColumnSearchProps('name'),
      // sorter: (a, b, sortOrder) => a.name.localeCompare(b.name),
      //  sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Description",
      dataIndex: "description",
      // sorter: (a, b, sortOrder) => a.description.localeCompare(b.description),
      // sortDirections: ['descend', 'ascend'],
      sorter:true,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      width:"16%",
      render: (_, dataIndex) => (
        <Button size="small" onClick={() => viewRemarksMd(dataIndex)} disabled={dataIndex?.remarks.length ? false : true}><RiFileList3Line/> &nbsp; Remarks</Button>
      )
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "10%",
      align: "center",
      // sorter: (a, b, sortOrder) => a.status.length - b.status.length,
      // sortDirections: ['descend', 'ascend'],
      sorter:true,
      render: (dataIndex) => (
        legends_list.map((item, i) => {
          if(item.stat_name.toLowerCase() == dataIndex)
          {
            return <Tag key={i} color={item.stat_color}>{  dataIndex.toUpperCase()}</Tag>
          }
        })
        ),
    },
    {
      title: "Actions",
      dataIndex: "key",
      width: "15%",
      align: "center",
      render: (_, {key, status, socialProgram_data, dataIndex, detail}) => (
        <Dropdown.Button
          key={key}
          size="small"
          icon={<DownOutlined />}
          disabled={roles?.includes(FOCAL) ? status == 'draft' :false}
            overlay={
              <Menu onClick = {(e) => handleButtonClick(e, socialProgram_data, dataIndex, detail)}>
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
    },
  ];
      setColumns(columns);

  }, [roles, pageRoles])

  const handleTableChange = (pagination, filters, sorter) => {
    // queryDataList('', sorter?.field, sorter?.order == "ascend" ? 'asc' : 'desc', pagination)
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
          // className="hp-mb-16"
          justify="space-between"
          gutter={[8, 8]}
          style={{ marginBottom:"-10px"}}
        >
          <Col md={16} sm={24} span={24}>
            <BreadCrumbs
                homePage = "Home"
                breadCrumbActive="Social Protection Programmes"
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
            {
                  roles?.includes(FSA) || roles?.includes(SECRETARIAT)? 
                  (
                    <Col md={5} sm={24} span={24}>
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
                  </Col>
                  ) : ""
                }
            
          
          <Col md={3} sm={24} span={24}>
            <Form.Item label="Status" name="status"  rules={[{ required: false, message: 'This is required!' }]}>
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
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
            scroll={{ x: 'calc(500px + 50%)' }}
          />
        </Col>

        <ApprovalModal open={sidebarOpen} toggleSidebar={toggleSidebar}  setSuccessTrans={setSuccessTrans} dataSelected={dataSelected} actionSelected={actionSelected}/>
      </Card>
    </>
  );
};