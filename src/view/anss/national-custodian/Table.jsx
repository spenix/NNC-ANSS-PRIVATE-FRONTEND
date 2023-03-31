import { useState, useEffect, useRef, useCallback  } from "react";
import { Link, useHistory } from "react-router-dom";
import debounce from "lodash/debounce";
import FlagIcon from '../../../utils/global-components/FlagIcon';
// Redux
import { getAllData, getAllForTblData, deleteCustodianData, searchDataList } from "../../../redux/custodian/custodianActions";
import { getAllData as getAllOrganizationsData } from "../../../redux/asian-countries/asianCountriesAction2";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Button, Input, Table, Card, Tag, Space, Popconfirm, notification, Avatar, Form, Select, Dropdown, Menu, Modal, Image } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DownOutlined, ExclamationCircleOutlined  } from '@ant-design/icons';
import { Search, Delete, EditSquare, User } from "react-iconly";
import { RiAddBoxLine, RiErrorWarningLine, RiEyeLine, RiImage2Line, RiInformationLine, RiDraftLine } from "react-icons/ri";

// import { columns } from "./Columns";
// import AddNewAms from "./Modal";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD, DELETED_DATA, FOCAL, FSA, MANAGER, SECRETARIAT} from '../../../utils/LangConstants';
import {callNotif} from '../../../utils/global-functions/minor-functions';
export default function TableList(props) {
  const { pageRoles } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [listParams, setListParams] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const {confirm} = Modal;
  const [sorter, setSorter] = useState({})
  const [filters, setFilters] = useState({})
  const [data, setData] = useState([])
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [form] = Form.useForm();

  // Redux
  const history = useHistory();
  const dispatch = useDispatch();
  const {custodian_data, custodian_links, custodian_meta, custodian_details, status, message} = useSelector((state) => state.custodian);
  const {memberState_data} = useSelector((state) => state.asianCountries);
  const { myprofile: {roles, organization} } = useSelector((state) => state.users);

  const [ dataSeletor, setDataSelector ] = useState({
    organization_id: 0,
  });

  // Sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleFilter = (val) => {
    setSearchTerm(val);
    fetch(pagination, filters, sorter, val);
  };
  const openNotificationWithIcon = (type, title = "", msg = "") => {
    callNotif(title, msg, type);
  };

  const clearErrMessage = () => {
    dispatch({
        type: 'SET_CUSTODIAN_DATA_MESSAGE',
        status: '',
        msg: '',
    });
  }

  useEffect(() => {
    errMsg();
  }, [status]);

  const errMsg = () => {
    if(typeof status == "string" && status == "error"){
        if(message != "") {
            if(typeof message == "object"){
              message.forEach(item => {
                  openNotificationWithIcon(status, "Error", item)
              });
            }else{
                openNotificationWithIcon(status, "Error", message)
            }
            clearErrMessage();
          }
    }
  }
  
  // Get Data 
  useEffect(() => {
    fetch(pagination);
  }, [dataSeletor]);

  useEffect(() => {
    var localData = localStorage.getItem('custodians') ? JSON.parse(localStorage.getItem('custodians')) : null;
    var params = {
      organization_id: localData ?  localData?.key : (organization?.party_id ?? 0),
    }
    form.setFieldsValue(params)
    setDataSelector(params);
  }, [form, organization])

  useEffect(() => {
    dispatch(getAllOrganizationsData());
  }, [dispatch]);

  const queryDataList = (search_key = '', sort_key = '', order = 'asc') => {
    setLoading(true);
    var params = {
      intl_flag:false
    };
    if(search_key != ''){
      params['search_key'] = search_key 
    }

    if(sort_key != ''){
      params['sort_key'] = sort_key 
    }

    if(order != ''){
      params['order'] = order 
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
    if(typeof custodian_data !== 'undefined'){
      for (let i = 0; i < custodian_data.length; i++) {
        results.push({
          key: custodian_data[i].id,
          custodian: custodian_data[i]?.attributes?.name,
          is_active: custodian_data[i]?.attributes?.is_active,
          thumbnail: custodian_data[i]?.attributes?.thumbnail
        });
      }
      setData(results);
      if(Object.keys(custodian_meta).length){
        setPagination({
          ...listParams.pagination,
          total: custodian_meta.pagination.total, // total regardless of pagination
        });
      }
    }
    setIsDataFetched(false);
  }

  const confirmDel = (id) => {
    if(pageRoles.includes(ACTION_DELETE)){
      dispatch(deleteCustodianData({}, id))
      .then(()=> {
        openNotificationWithIcon("success", "Success", `National Custodian ${DELETED_DATA}`)
        fetch(pagination);
      }).catch((e) => {
        errMsg();
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

  const btnForAddData = () => {
    if(pageRoles.includes(ACTION_ADD)){
      return (
        <Col className="gutter-row" md={7} sm={24} span={24}>
        <Link to={`/national-custodians/forms/add-data/${window.btoa(JSON.stringify({ id: 0, org_id: dataSeletor?.organization_id }))}`}>
                  <Button
                    block
                    className="hp-mt-sm-16"
                    type="primary"
                    icon={<RiAddBoxLine size={16} className="remix-icon" />}
                  >
                    ADD NATIONAL CUSTODIAN
                  </Button>
                </Link>
        </Col>
      )
    }
  }

  const btnForEditData = (dataIndex) => {
    if(pageRoles.includes(ACTION_EDIT)){
      return (
        <Link
                   to={`/national-custodians/forms/edit-data/${window.btoa(dataIndex)}`}
              >
                <EditSquare set="broken"  size={24}
                    className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
            </Link>
      )
    }
  }
  const btnForDeleteData = (dataIndex) => {
    if(pageRoles.includes(ACTION_DELETE)){
      return (
        <Popconfirm
          placement="topLeft"
          title="Are you sure you want to delete this national custodian?"
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
  const btnForViewData = (dataIndex) => {
    if(pageRoles.includes(ACTION_VIEW)){
      return (
        <Link
                   to={`/national-custodians/forms/view-data/${window.btoa(dataIndex)}`}
              >
                  <RiEyeLine set="broken"  size={24}
                    className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
              </Link>
      )
    }
  }

  const viewDataDetails = (detail) => {
    Modal.info({
      icon: (
          <RiDraftLine className="remix-icon"/>
      ),
      title: (
        <h5 className="hp-mb-0 hp-font-weight-500">View National Custodian Details</h5>
      ),
      width:800,
      content: (
        <ul style={{ listStyle:"none" }}>
          <li><b>Logo: </b><Image width={100} height={80} src={detail?.thumbnail} /></li>
          <li><b>Custodian: </b>{detail?.custodian}</li>
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

  const handleButtonClick = (e, detail) => {
    if(e?.key == ACTION_DELETE){
      confirm({
        title: (
          <>
            <h5 className="hp-mb-0 hp-font-weight-500">
            Are you sure you want to delete this national custodian?
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
          confirmDel(detail?.key);
        },
        onCancel() {},
      });
    }
    else if(e?.key == ACTION_VIEW) {
      viewDataDetails(detail)
    }
    else{
      history.push(`/national-custodians/forms/${e.key}-data/${window.btoa(detail?.key)}`)
    }
    
  }

  const showBtnForAction = (dataIndex) => {
    // if(roles?.includes(MANAGER)){
      return (
        <Dropdown.Button
              key={dataIndex.key}
              size="small"
              icon={<DownOutlined />}
              overlay={
                <Menu onClick={(e) =>{handleButtonClick(e, dataIndex)}}>
                  {
                    ['view', 'edit', 'delete'].map(item => {
                        if(pageRoles.includes(item)){  
                          return <Menu.Item key={item} value={dataIndex}>{item.toUpperCase()}</Menu.Item>
                        }
                    })
                  }
                </Menu>
              }
            >
              Action
            </Dropdown.Button>
      );
    // }else{
    //   return (
    //     <>
    //           {btnForViewData(dataIndex.key)}
    //           {btnForEditData(dataIndex.key)}
    //           {btnForDeleteData(dataIndex.key)}
    //     </>
    //   )
    // }
  }

  const columns = [
    {
      title: "Logo",
      dataIndex: "thumbnail",
      align: "left",
      render: (dataIndex) => {
        if(dataIndex){
          return (
            <Avatar
              size={50}
              src={dataIndex}
              style={{cursor:"pointer"}}
              onClick={() => { window.open(dataIndex, "_blank") }}
            />
          )
        }else{
          return (
            <Avatar
            size={50} 
            // style={{cursor:"pointer"}}
            // onClick={() => { window.open(dataIndex, "_blank") }}
            icon={<RiImage2Line />} />
          )
        }
          
      }
    },
    {
      title: "Custodian",
      dataIndex: "custodian",
      align: "left",
      sorter: true
      // ...getColumnSearchProps('custodian'),
      // sorter: (a, b) => a.custodian.localeCompare(b.custodian),
      //  sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Status",
      dataIndex: "is_active",
      width: "15%",
      align: "center",
      sorter: true,
      // sorter: (a, b) => a.status.length - b.status.length,
      // sortDirections: ['descend', 'ascend'],
      render: (dataIndex) => (
        <Tag color={dataIndex ? "green" : "red"}>{dataIndex ? "Active" : "Inactive"}</Tag>
      )
    },
    {
      title: "Actions",
      dataIndex: "key",
      width: "15%",
      align: "center",
      render: (_, dataIndex) => (
          <Space>
              {showBtnForAction(dataIndex)}
          </Space>
        ),
    },
  ];

  const handleTableChange = (pagination, filters, sorter) => {
    setSorter(sorter);
    setFilters(filters);
    fetch(pagination, filters, sorter, searchTerm);
  };

  const fetch = (params = {}, filters={},  sorter={}, search_key="", org_id = null) => {
    setLoading(true);
    const dataParams = {
      intl_flag:false,
      limit: params.pageSize,
      page: params.current
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
    dataParams['organization_id'] = dataSeletor.organization_id ?? organization?.party_id
    if(dataParams['organization_id']){
      dispatch(searchDataList(dataParams))
      .then(() => {
          setLoading(false)
          setListParams(params);
          setIsDataFetched(true);
      })
    }
    
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
              breadCrumbActive={`National Custodian`}
            />
              {
                !roles?.includes(FSA) && !roles?.includes(SECRETARIAT) ? 
                (
                  <Space>
                    <Avatar size={35} icon={<FlagIcon country={organization?.name} />} className="hp-m-auto" />
                    <h3 style={{marginTop:"15px"}}>{organization?.name}</h3>
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

        {/* <AddNewAms open={sidebarOpen} toggleSidebar={toggleSidebar} /> */}
      </Card>
    </>
  );
};
//sample