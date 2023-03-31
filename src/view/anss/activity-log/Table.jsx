import { Row, Col, Button, Input, Table, Card, Tag, Space, Popconfirm, notification, Dropdown, Menu, Modal } from "antd";
import { useState, useEffect, useRef  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { SearchOutlined, DownOutlined } from '@ant-design/icons';
import { Search, Delete, EditSquare } from "react-iconly";
import { RiAddBoxLine, RiErrorWarningLine, RiEyeLine, RiDraftLine, RiInformationLine } from "react-icons/ri";

import { ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../utils/LangConstants';
import { getAllForTblData, searchDataList, getActivityLogData } from "../../../redux/activity-log/activityLogActions";
import { callNotif } from '../../../utils/global-functions/minor-functions';

import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import Highlighter from 'react-highlight-words';
import moment from 'moment-timezone';

export default function TableList(props) {
  const {pageRoles} = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
  const [isActivityFetched, setIsActivityFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  // Redux
  const dispatch = useDispatch();
  const { activityLog_data, activityLog_meta, activityLog_details } = useSelector((state) => state.activityLog);
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
  }, []);

  const processData = () => {
    console.log(activityLog_data);
    const results = [];
    if(typeof activityLog_data !== 'undefined'){
        for (let i = 0; i < activityLog_data.length; i++) {
          results.push({
            key: activityLog_data[i].id,
            user: activityLog_data[i]?.attributes?.user,
            module: activityLog_data[i]?.attributes?.model,
            activity: activityLog_data[i]?.attributes?.message,
            properties: activityLog_data[i]?.attributes?.properties,
            datetime_posted:moment(activityLog_data[i]?.attributes?.created_at).tz('Asia/Manila').format('LLL z'),
          });
        }
        setData(results);
        if(Object.keys(activityLog_meta).length){
          setPagination({
            ...listParams.pagination,
            total: activityLog_meta.pagination.total, // total regardless of pagination
          });
        }
    }
    setIsDataFetched(false);
  }

  const viewDataDetails = () => {
    const columns = [
      {
        title: 'Column Name',
        width: "30%",
        dataIndex: 'name',
        key: 'name',
        fixed: 'left',
      },
      {
        title: 'Old value',
        width: "30%",
        dataIndex: 'old_value',
        key: 'old_value',
        fixed: 'left',
      },
      {
        title: 'Value',
        width: "30%",
        dataIndex: 'value',
        key: 'value',
        fixed: 'left',
      },
    ]

    const data = [];
    {
      Object.keys(activityLog_details?.attributes?.activity?.attributes).map((key) => (
          data.push({
            name: key,
            value: activityLog_details?.attributes?.activity?.attributes[key],
            old_value: activityLog_details?.attributes?.activity?.old ? activityLog_details?.attributes?.activity?.old[key] : "",
          })
      ))
    }

    Modal.info({
      icon: (
          <RiDraftLine className="remix-icon"/>
      ),
      title: (
        <h5 className="hp-mb-0 hp-font-weight-500">View Activity Details</h5>
      ),
      width:800,
      height:300,
      content: (
      <div>
        <Row>
        <Col span={24}>
          <div>
            <b>USER</b><p>{activityLog_details?.attributes?.user}</p>
            <b>MODULE</b><p>{activityLog_details?.attributes?.model}</p>
            <b>ACTIVITY</b><p>{activityLog_details?.attributes?.message}</p>
            <b>DATE/TIME</b><p>{moment(activityLog_details?.attributes?.created_at).tz('Asia/Manila').format('LLL z')}</p>
          </div>
        </Col>
        <Col span={24}>
          <Table 
            pagination={{ defaultPageSize: 5 }}
            dataSource={data}
            columns={columns}
          />
        </Col>
        </Row>
      </div>
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
            Are you sure you want to delete this Inquiry?
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
      dispatch(getActivityLogData(detail?.key)).then(()=> {
        setIsActivityFetched(true);
      }).catch((e) => {
      });
    }
  }

  if(isActivityFetched) {
    viewDataDetails();
    setIsActivityFetched(false);
}
  
  const showBtnForAction = (dataIndex) => {
      return (
        <Dropdown.Button
              key={dataIndex.key}
              size="small"
              icon={<DownOutlined />}
              overlay={
                <Menu onClick={(e) =>{handleButtonClick(e, dataIndex)}}>
                  {
                    ['view'].map(item => {
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
  }

  const columns = [
    {
      title: "User",
      dataIndex: "user",
      width: "15%",
      align: "left",
      sorter: true,
    },
    {
        title: "Module",
        dataIndex: "module",
        width: "5%",
        align: "left",
        sorter: true,
    },
    {
        title: "Activity",
        dataIndex: "activity",
        width: "40%",
        align: "left",
        sorter: true,
    },
    {
      title: "Date/Time of Activity",
      dataIndex: "datetime_posted",
      width: "15%",
      align: "left",
      sorter: true,
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

  const fetch = (params = {}, filters={},  sorter={}, search_key="") => {
    setLoading(true);
    const dataParams = {
      limit: params.pageSize,
      page: params.current
    };
    if(Object.keys(sorter).length){
      dataParams['sort_key'] = sorter?.field
      dataParams['order'] = sorter?.order == "descend" ? "desc" : "asc"
    }
    if(search_key != ''){
      dataParams['search_key'] = search_key
    }
    dispatch(getAllForTblData(dataParams))
      .then(() => {
        setLoading(false)
        setListParams(params);
        setIsDataFetched(true);
      })
  }
  
  if(isDataFetched) {
    processData();
  }

  return (
    <>
      <Row
        className="hp-mb-16"
	      justify="space-between"
        gutter={{
          xs: 4,
          sm: 6,
          md: 16,
          lg: 24,
        }}
      >
        <Col className="gutter-row" span={12}>
          <BreadCrumbs
              homePage = "Home"
              breadCrumbActive="Activity Log"
            />
        </Col>
        <Col className="gutter-row" span={5}>
              <Input
                  placeholder="Search"
                  prefix={<Search set="curved" size={16} className="hp-text-color-black-80" />}
                  value={searchTerm}
                  onChange={(e) => handleFilter(e.target.value)}
                />
        </Col>
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
      </Card>
    </>
  );
};