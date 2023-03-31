import { useState, useEffect, useRef  } from "react";
import { Link } from "react-router-dom";
// Redux
import { getAllForTblData } from "../../../redux/collection-period/collectionPeriodActions";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Button, Input, Table, Card, Tag, Space, Popconfirm } from "antd";
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import { Search, Delete, EditSquare } from "react-iconly";
import { RiAddBoxLine, RiErrorWarningLine, RiEyeLine } from "react-icons/ri";

// import { columns } from "./Columns";
// import AddNewAms from "./Modal";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';

export default function UsersList() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false)
  const [listParams, setListParams] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const [data, setData] = useState([])
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  // Redux
  const dispatch = useDispatch();
  const {collectionPeriod_data, collectionPeriod_links, collectionPeriod_meta, collectionPeriod_details, status, message} = useSelector((state) => state.collectionPeriod);
  // Sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleFilter = (val) => {
    setSearchTerm(val);
    // dispatch(
    //   getData({
    //     q: val,
    //   })
    // );
  };
  // Get Data 
  useEffect(() => {
    fetch(pagination);
  }, []);
  
  const processData = () => {
  const results = [];
  if(typeof collectionPeriod_data !== 'undefined'){
    for (let i = 0; i < collectionPeriod_data.length; i++) {
      results.push({
        key: collectionPeriod_data[i].id,
        collection_period: collectionPeriod_data[i]?.attributes?.name,
        status: collectionPeriod_data[i]?.attributes?.is_active,
      });
    }
    setData(results);
    if(Object.keys(collectionPeriod_meta).length){
      setPagination({
        ...listParams.pagination,
        total: collectionPeriod_meta.pagination.total, // total regardless of pagination
      });
    }
  }
  setIsDataFetched(false);
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

  const columns = [
    {
      title: "Collection Period",
      dataIndex: "collection_period",
      align: "left",
      ...getColumnSearchProps('collection_period'),
      sorter: (a, b) => a.collection_period.length - b.collection_period.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "25%",
      align: "center",
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ['descend', 'ascend'],
      render: (dataIndex) => (
        <Tag color={dataIndex ? "green" : "red"}>{dataIndex ? "Active" : "Inactive"}</Tag>
      )
    },
    {
      title: "Actions",
      dataIndex: "key",
      width: "25%",
      align: "center",
      render: (dataIndex) => (
        <Space>
              <Link
                   to={`/collection-periods/forms/view-data/${window.btoa(dataIndex)}`}
              >
                  <RiEyeLine set="broken"  size={24}
                    className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
              </Link>
              <Link
                   to={`/collection-periods/forms/edit-data/${window.btoa(dataIndex)}`}
              >
                <EditSquare set="broken"  size={24}
                    className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
            </Link>
            <Popconfirm
                placement="topLeft"
                title="Are you sure to delete this indicator category?"
                onConfirm={() => confirm(dataIndex)}
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
          </Space>
        ),
    },
  ];
  const handleTableChange = (pagination, filters, sorter) => {
    fetch(pagination);
  };

  const fetch = (params = {}) => {
    setLoading(true);
    const dataParams = {
      limit: params.pageSize,
      page: params.current
    };
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
      <div className="hp-mb-16">
        <Row gutter={[32, 32]} justify="space-between">
          <BreadCrumbs
            homePage = "Home"
            breadCrumbParent="Maintenance"
            breadCrumbActive="Collection Period"
          />

          <Col md={15} span={24}>
            <Row justify="end" align="middle" gutter={[16]}>
              <Col xs={24} md={12} xl={8}>
                <Input
                  placeholder="Search"
                  prefix={<Search set="curved" size={16} className="hp-text-color-black-80" />}
                  value={searchTerm}
                  onChange={(e) => handleFilter(e.target.value)}
                />
              </Col>

              <Col>
                <Link to={`/collection-periods/forms/add-data/${window.btoa(0)}`}>
                  <Button
                    block
                    className="hp-mt-sm-16"
                    type="primary"
                    icon={<RiAddBoxLine size={16} className="remix-icon" />}
                  >
                    ADD COLLECTION PERIOD
                  </Button>
                </Link>
              </Col>
            </Row>
          </Col>
        </Row>
        
       
      </div>

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