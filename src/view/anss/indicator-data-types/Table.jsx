import { useState, useEffect, useRef  } from "react";
// Redux
import { getAllDataTypes} from "../../../redux/indicators/indicatorsActions2";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Input, Table, Card, Space, Button  } from "antd";
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

// import { columns } from "./Columns";
// import AddNewAms from "./Modal";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';

export default function UsersList() {
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [loading, setLoading] = useState(false);
  const searchInput = useRef(null);
  // Redux
  const dispatch = useDispatch();
  const {data_types} = useSelector((state) => state.indicators);

  var data = [];
  for (let index = 0; index < data_types.length; index++) {
    data.push({
      key : data_types[index].id,
      name : data_types[index].attributes.name,
      description : data_types[index].attributes.description ? data_types[index].attributes.description : "N/A",
    });
    
  }
  // Get Data 
  useEffect(() => {
    setLoading(true);
    dispatch(getAllDataTypes()).then(() => {setLoading(false)});
  }, []);

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
      title: "Data Type",
      dataIndex: "name",
      align: "left",
      ...getColumnSearchProps('name'),
      sorter: (a, b) => a.name.length - b.name.length,
       sortDirections: ['descend', 'ascend'],
    },
    {
        title: "Description",
        dataIndex: "description",
        width:"60%"
    },
  ];

  return (
    <>
      <div className="hp-mb-16">
        <Row gutter={[32, 32]} justify="space-between">
          <BreadCrumbs
            homePage = "Home"
            breadCrumbParent="Maintenance"
            breadCrumbActive="Indicator Data Type"
          />
        </Row>
      </div>
      <Card className="hp-contact-card hp-mb-32">
        <Col className="hp-contact-card hp-mt-32">
          <Table
            pagination={{ defaultPageSize: 10 }}
            columns={columns}
            dataSource={data}
            loading={loading}
            scroll={{ x: 'calc(500px + 50%)' }}
          />
        </Col>

        {/* <AddNewAms open={sidebarOpen} toggleSidebar={toggleSidebar} /> */}
      </Card>
    </>
  );
};