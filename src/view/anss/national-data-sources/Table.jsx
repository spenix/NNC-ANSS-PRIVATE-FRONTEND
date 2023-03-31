import { useState, useEffect, useRef  } from "react";
import { Link, useHistory} from "react-router-dom";
import moment from "moment";
import FlagIcon from '../../../utils/global-components/FlagIcon';
// Redux
import { getAllData, getAllForTblData, deleteDataSourceData } from "../../../redux/dataSources/dataSourcesActions";
import { getAllData as getAllOrganizationsData } from "../../../redux/asian-countries/asianCountriesAction2";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Button, Input, Table, Card, Tag, Space, Popconfirm, notification, Select, Modal, Dropdown, Menu, Form, Avatar } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Search, Delete, EditSquare } from "react-iconly";
import { RiAddBoxLine, RiErrorWarningLine, RiEyeLine, RiInformationLine, RiDraftLine } from "react-icons/ri";

// import { columns } from "./Columns";
// import AddNewAms from "./Modal";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD, DELETED_DATA, FOCAL, FSA, MANAGER, SECRETARIAT} from '../../../utils/LangConstants';
import {callNotif} from '../../../utils/global-functions/minor-functions';
export default function TableList(props) {
  const {pageRoles} = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [listParams, setListParams] = useState(false)
  const [form] = Form.useForm();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const [ dataSeletor, setDataSelector ] = useState({
    organization_id: 0,
  });
  const { confirm } = Modal;
  const history = useHistory();
  const [sorter, setSorter] = useState({})
  const [filters, setFilters] = useState({})
  const [data, setData] = useState([])
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  // Redux
  const dispatch = useDispatch();
  const {dataSource_data, dataSource_links, dataSource_meta, dataSource_details, status, message} = useSelector((state) => state.dataSources);
  const {memberState_data} = useSelector((state) => state.asianCountries);
  const { myprofile: {roles, organization} } = useSelector((state) => state.users);
  // Sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleFilter = (val) => {
    setSearchTerm(val);
    fetch(pagination, filters, sorter, val);
  };
  const openNotificationWithIcon = (type, title = "", msg = "") => {
    callNotif(title, msg, type);
  };

  // Get Data 
  useEffect(() => {
    fetch(pagination);
    dispatch(getAllOrganizationsData());
  }, []);


  // Get Data 
  useEffect(() => {
    fetch(pagination);
  }, [dataSeletor]);

  useEffect(() => {
    errMsg();
  }, [status]);

  const clearErrMessage = () => {
    dispatch({
        type: 'SET_SOURCE_DATA_MESSAGE',
        status: '',
        msg: '',
    });
  }

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
          }
          clearErrMessage();
    }
  }
  useEffect(() => {
    var localData = localStorage.getItem('datasources') ? JSON.parse(localStorage.getItem('datasources')) : null;
    var params = {
      organization_id: localData ?  localData?.key : (organization?.party_id ?? 0),
    }
    form.setFieldsValue(params)
    setDataSelector(params);
  }, [form, organization])

  const processData = () => {
    const results = [];
    if(typeof dataSource_data !== 'undefined'){
      for (let i = 0; i < dataSource_data.length; i++) {
        results.push({
          key: dataSource_data[i].id,
          datasource_type: dataSource_data[i]?.attributes?.datasource_type?.name,
          custodian: dataSource_data[i]?.attributes?.custodian?.name,
          title: dataSource_data[i]?.attributes?.title,
          publication_date: dataSource_data[i]?.attributes?.publication_date ?? "N/A",
          other_details: dataSource_data[i]?.attributes
        });
      }

      setData(results);
      if(Object.keys(dataSource_meta).length){
        setPagination({
          ...listParams.pagination,
          total: dataSource_meta.pagination.total, // total regardless of pagination
        });
      }
    }
    setIsDataFetched(false);
  }

  const confirmDel = (id) => {
    if(pageRoles.includes(ACTION_DELETE)){
      dispatch(deleteDataSourceData({}, id))
      .then(()=> {
        openNotificationWithIcon("success", "Success", `National Datasource ${DELETED_DATA}`)
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
        <Col className="gutter-row" span={7}>
        <Link to={`/national-data-sources/forms/add-data/${window.btoa(JSON.stringify({ id: 0, org_id: dataSeletor?.organization_id }))}`}>
                  <Button
                    block
                    className="hp-mt-sm-16"
                    type="primary"
                    icon={<RiAddBoxLine size={16} className="remix-icon" />}
                  >
                    ADD NATIONAL DATA SOURCE
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
                   to={`/national-data-sources/forms/edit-data/${window.btoa(dataIndex)}`}
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
                title="Are you sure to delete this National Data Source?"
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

  const viewDataDetails = (detail) => {
    Modal.info({
      icon: (
          <RiDraftLine className="remix-icon"/>
      ),
      title: (
        <h5 className="hp-mb-0 hp-font-weight-500">View National Data Source</h5>
      ),
      width:800,
      content: (
        <ul style={{ listStyle:"none" }}>
        <li><b>Source Type: </b>{detail?.datasource_type}</li>
        <li><b>Custodian: </b>{detail?.custodian}</li>
        <li><b>Title: </b>{detail?.title}</li>
        <li><b>Publication / Coverage Date: </b>{detail?.publication_date}</li>
        {detail?.other_details?.url ? (<li><b>Link: </b>{detail?.other_details?.url}</li>): ""}
            {
              detail?.other_details?.document_url ? (
                <>
                  <li>
                    <b>Document: </b>
                      <Button size="small"  onClick={() => window.open(detail?.other_details?.document_url, '_blank')}>View Document</Button>
                  </li>
                  <li><b>Language: </b>{detail?.other_details?.language}</li>
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

  const btnForViewData = (dataIndex) => {
    if(pageRoles.includes(ACTION_VIEW)){
      return (
              <a
                  onClick={() => viewDataDetails(dataIndex)}
              >
                  <RiEyeLine set="broken"  size={24}
                    className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
              </a>
      )
      
    }
  }

  const handleButtonClick = (e, detail) => {
    if(e?.key == ACTION_DELETE){
      confirm({
        title: (
          <>
            <h5 className="hp-mb-0 hp-font-weight-500">
            Are you sure you want to delete this national data source?
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
      history.push(`/national-data-sources/forms/${e.key}-data/${window.btoa(detail?.key)}`)
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
      )
    // }else{
    //   return (
    //     <>
    //           {btnForViewData(dataIndex)}
    //           {btnForEditData(dataIndex?.key)}
    //           {btnForDeleteData(dataIndex?.key)}
    //     </>
    //   )
    // }
  }

  const columns = [
    {
      title: "Source Type",
      dataIndex: "datasource_type",
      align: "left",
      sorter: true
      // ...getColumnSearchProps('datasource_type'),
      // sorter: (a, b) => a.datasource_type.localeCompare(b.datasource_type),
      //  sortDirections: ['descend', 'ascend'],
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
      title: "Title",
      dataIndex: "title",
      align: "left",
      sorter: true
      // ...getColumnSearchProps('title'),
      // sorter: (a, b) => a.title.localeCompare(b.title),
      //  sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Publication/Coverage",
      dataIndex: "publication_date",
      align: "center",
      sorter: true
      // ...getColumnSearchProps('publication_date'),
      // sorter: (a, b) => a.publication_date - b.publication_date,
      //  sortDirections: ['descend', 'ascend'],
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   width: "15%",
    //   align: "center",
    //   sorter: (a, b) => a.status.length - b.status.length,
    //   sortDirections: ['descend', 'ascend'],
    //   render: (dataIndex) => (
    //     <Tag color={dataIndex ? "green" : "red"}>{dataIndex ? "Active" : "Inactive"}</Tag>
    //   )
    // },
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
      limit: params.pageSize,
      page: params.current,
      intl_flag:false
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
    dataParams['organization_id'] = dataSeletor?.organization_id ?? organization?.party_id
    if(dataParams['organization_id']){
      dispatch(getAllForTblData(dataParams))
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
  const style = {
    background: '#0092ff',
    padding: '8px 0',
  };

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
              breadCrumbActive={`National Data Source`}
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