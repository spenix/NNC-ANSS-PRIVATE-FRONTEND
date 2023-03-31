import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import { Link, useHistory } from "react-router-dom";
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {BASE_URL} from "../../../utils/Constants"


// Redux
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Button, Input, Table, Card, Tag, Popconfirm, Space, Select, Dropdown, Menu, Modal } from "antd";
import { User, Delete, TickSquare, CloseSquare, Show } from "react-iconly";
import { RiUserAddLine, RiIndeterminateCircleLine, RiAddCircleLine, RiPrinterLine, RiDraftLine } from "react-icons/ri";

import AddNewUser from "./Modal";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';

import { getUser, getAllUsers, userActivation, searchDataList, exportUsers } from "../../../redux/users/usersActions";
import { getRoles } from "../../../redux/roles/rolesActions";

// services
import UserService from "../../../services/userServices"
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../utils/LangConstants';
import {callNotif} from '../../../utils/global-functions/minor-functions';
export default function UsersList(props) {
  const {pageRoles} = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoles, setSelectedRoles] = useState("");
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [isFileFetch, setIsFileFetch] = useState(false);
  const [listParams, setListParams] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const { confirm } = Modal;
 

  const btnForAddData = () => {
    if(pageRoles.includes(ACTION_ADD)){
      return (
        <Col className="gutter-row" md={6} sm={12} span={12}>
          <Button
                block
                className="hp-mt-sm-16"
                type="primary"
                onClick={toggleSidebar}
                icon={<RiUserAddLine size={16} className="remix-icon" />}
              >
                ADD NEW USER
          </Button>
        </Col>
      )
    }
  }

  const btnForExport = () => {
    return (
      <Col className="gutter-row" md={6} sm={12} span={12}>
            <Dropdown.Button
            // size="small"
            disabled={data.length ? false: true}
            icon={<DownOutlined />}
            overlay={
              <Menu onClick={(e) => handleExportUsers(e)}>
                {
                  ['PDF', 'EXCEL'].map(item => {
                    return <Menu.Item key={item} value={item}>{item}</Menu.Item>
                  })
                }
              </Menu>
            }
          >
            <RiPrinterLine size={24}/> EXPORT DATA
          </Dropdown.Button>
      </Col>
    )
  }

  const btnForEditData = (record) => {
    if(pageRoles.includes(ACTION_EDIT)){
      if(record.status == 'active'){
          return (
            <Popconfirm title="Are you sure you want to deactivate this user?" okText="Yes" onConfirm={() => handleActivation(record.id, false)}>
                <RiIndeterminateCircleLine
                  size={20}
                  className="hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 hp-text-color-black-80"
                />
            </Popconfirm>
          )
        }
        else{
          return (
            <Popconfirm title="Are you sure you want to activate this user?" okText="Yes" onConfirm={() => handleActivation(record.id, true)}>
              <RiAddCircleLine
                size={20}
                className="hp-cursor-pointer hp-transition hp-hover-text-color-success-1 hp-text-color-black-80"
              />
            </Popconfirm>
          )
          
        }
    }
  }

  const btnForViewData = (record) => {
    if(pageRoles.includes(ACTION_VIEW)){
      return (
        <Link
              to={`/users/user-detail/${record.id}`}
            >
              <Show
                size={24}
                className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"
              />

            </Link>
      )
    }
  }

  var displayOrg = (details) => {
    return details?.organization[Object.keys(details?.organization)[1]] ? details?.organization[Object.keys(details?.organization)[1]] : "N/A";
  }



  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'left',
      width: '20%',
      sorter: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
       sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      sorter:true,
      width: '20%',
    },
    {
      title: 'AMS',
      dataIndex: 'organization',
      sorter:true,
      width: '15%',
      render: (_, dataDetails) => {return displayOrg(dataDetails)}
    },
    {
      title: 'Role',
      dataIndex: 'roles',
      // sorter: true,
      render: (roles) => {


        return roles.map((role, i) => {
            // Return the element. Also pass key
            return <Tag key={i}>{role}</Tag>;
         })
      },
      width: '20%',
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "10%",
      align: "center",
      sorter: (a, b) => a.status.localeCompare(b.status),
       sortDirections: ['descend', 'ascend'],
      render: (dataIndex) => (
        <Tag color={dataIndex == 'active' ? "green" : "red"}>{dataIndex == 'active' ? "Active" : "Inactive"}</Tag>
      )
    },
    {
      title: 'Action',
      dataIndex: 'action_data',
      render: (_, record) => {
        return (
          <Dropdown.Button
                    key={record?.id}
                    size="small"
                    icon={<DownOutlined />}
                    overlay={
                      <Menu onClick={(e) => handleButtonClick(e, record)}>
                        {
                         (pageRoles.includes(ACTION_EDIT) ? [`${record?.status == "active" ? "Deactivate" : "Activate"}`, "View"] : ["View"]).map((item, key) => {
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
      width: '15%',
    },
  ];

  const showConfirm = (record) => {
    confirm({
      title: `Are you sure you want to ${record?.status == "active" ? "deactivate" : "activate"} this user?`,
      icon: (
        <span className="remix-icon">
          <ExclamationCircleOutlined />
        </span>
      ),
      content: '',
      okText:"Yes",
      onOk() {
        handleActivation(record?.id, record?.status == "active" ? false : true)
      },
      onCancel() {
      },
    });
  };

  const handleButtonClick = (e, record) => {
    var data = e.key.split("_");
    if(data[1] == "0"){
        showConfirm(record);
    }else{
      // history.push(`/users/user-detail/${record.id}`);
      viewDataDetails(record);
    }

  }

  const viewDataDetails = (detail) => {
    console.log(detail);
    Modal.info({
      icon: (
          <RiDraftLine className="remix-icon"/>
      ),
      title: (
        <h5 className="hp-mb-0 hp-font-weight-500">View User Details</h5>
      ),
      width:800,
      content: (
        <ul style={{ listStyle:"none" }}>
        <li><b>Name: </b>{detail?.name}</li>
        <li><b>Email: </b>{detail?.email}</li>
        <li><b>AMS: </b>{displayOrg(detail)}</li>
        <li><b>Role(s) List: </b>
          <ul>
            {
              detail?.roles?.map(item => {
                return (<li>{item}</li>);
              })

            }
          </ul>
          <li><b>Status: </b>{detail?.status == "active" ? "Active" : "Inactive"}</li>
        </li>
        
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

  // Redux
  const dispatch = useDispatch();
  const store = useSelector((state) => state.contact);
  const history = useHistory();
  const { allUsers, message, status, fileData  } = useSelector(state => state.users);
  const { roles  } = useSelector(state => state.roles);

  const handleExportUsers = (e) => {    
    dispatch(exportUsers(selectedRoles, e.key)).then((response) => {
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
    tempLink.setAttribute('download', `ANSS-USERS.${format}`);
    tempLink.click();
  }

  if(isFileFetch){
    getFileResponse();
    setIsFileFetch(false);
  }

  // Sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleFilter = (val) => {
    setSearchTerm(val);
    queryDataList(val, '', 'asc', `${selectedRoles}`)
  
  };

  const queryDataList = (search_key = '', sort_key = '', order = 'asc', roles = '', paginationV2={}) => {
   
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

    if(roles != ''){
      params['roles'] = roles 
    }
    if(paginationV2){
      params = { ...params, ...paginationV2, page : paginationV2.current }
    }
    dispatch(searchDataList(params)).then(() => {
      setLoading(false);
      setIsDataFetched(true);
    }).catch(err => {
      errMsg();
      setLoading(false);
    })
  }

  const delayedSearch = useCallback(
    debounce((q) => queryDataList(q, '', 'asc', `${selectedRoles}`), 500),
    [searchTerm]
  );

  
  useEffect(() => {
    dispatch(getRoles());
    
  }, [dispatch])

  useEffect(() => {
    fetch(pagination);
  }, [])

  useEffect(() => {
    errMsg();
}, [status])

  // const handleClickView = async(id) => {

  //   await dispatch(getUser(id));

  //   history.push("/users/user-detail/" + id);

  // }

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
            clearErrMessage()
        }
       
    }
}

const clearErrMessage = () => {
  dispatch({
      type: 'USER_ACTIVATION_MESSAGE',
      status: '',
      msg: '',
  });
}
  const handleTableChange = (pagination, filters, sorter) => {
    queryDataList(searchTerm, sorter?.field, sorter?.order == "descend" ? 'desc' : 'asc', `${selectedRoles}`, pagination)
  };

  // this is way to fetch the records
  const fetch = (params = {}) => {
    setLoading(true)
    const dataParams = {
      limit: params.pageSize,
      page: params.current
    };
    dispatch(getAllUsers(dataParams))
      .then(() => {
        setLoading(false)
        setListParams(params);
        setIsDataFetched(true);
        // processData(params);
      })
  };

  const handleActivation = (key, status) => {
    
    dispatch(userActivation({key, status}))
    .then(() => {
      fetch(pagination);
      callNotif("Success", `User Account was ${status ? 'activated': 'deactivated'} successfully.`, 'success');
    }).catch(err => {
      errMsg();
    })
  };

  const processData = () => {


    const data = allUsers.data;
    const meta = allUsers.meta;

    let results = [];
    data.forEach(function(dta) {
      let result = {
        "id": dta.id,
        "name": dta.attributes.complete_name ? dta.attributes.complete_name : (dta.attributes.first_name ? dta.attributes.first_name :'')+' '+(dta.attributes.last_name ? dta.attributes.last_name :''),
        "email": dta.attributes.email,
        "status": dta.attributes.status,
        "is_verified" : dta.attributes.is_verified,
        "roles": dta.attributes.roles,
        "organization": dta.attributes.organization,
        "action_data": {'id': dta.id, 'status': dta.attributes.status}
      };
      results.push(result);
    });


    setData(results); // this is way to set data in state.

    setPagination({
      ...listParams.pagination,
      pageSize: meta.pagination.per_page,
      total: meta.pagination.total, // total regardless of pagination
    });

    setIsDataFetched(false);
  };


  if(isDataFetched) {
    processData();
  }

  const handleSelectChange = (value) => {
    setSelectedRoles(`${value}`)
    queryDataList(searchTerm, "", "asc", `${value}`)
  }

  const roleChildren = [];
  for (let i = 0; i < roles.length; i++) {
	  roleChildren.push(<Select.Option key={roles[i].id} value={roles[i].id}>{roles[i].attributes.display_name}</Select.Option>);
  }
  
  return (
    <>
      <div className="hp-mb-8" style={{ borderBottom: "2px solid black" }}>
        <Row gutter={[8, 8]} justify="space-between hp-pb-10">
          <Col md={16} sm={24} span={24}>
            <BreadCrumbs
              // breadCrumbParent="Applications"
              breadCrumbActive="User Management"
            />
          </Col>
          <Col className="gutter-row" md={8} sm={24} span={24}>
          <Select
            mode="tags"
            style={{
              width: '100%',
            }}
            placeholder="Filter Roles"
            onChange={handleSelectChange}
            maxTagCount='responsive'
          >
            {roleChildren}
          </Select>
          </Col>
        </Row>
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
              {btnForExport()}
              <Col className="gutter-row" md={6} sm={12} span={12}>
              </Col>
              <Col className="gutter-row" md={5} sm={12} span={12}>
                <Input
                  placeholder="Search"
                  prefix={<User set="curved" size={16} className="hp-text-color-black-80" />}
                  value={searchTerm}
                  onChange={(e) => handleFilter(e.target.value)}
                />
              </Col>
              {btnForAddData()}
      </Row>
      <Card className="hp-contact-card hp-mb-32">
        <Col className="hp-contact-card hp-mt-32">
          <Table
            columns={columns}
            rowKey={record => record.id}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            onChange={handleTableChange}
            scroll={{ x: 800 }}
          />
        </Col>

        <AddNewUser open={sidebarOpen} toggleSidebar={toggleSidebar} fetch={fetch} pagination={pagination}/>
      </Card>
    </>
  );
};