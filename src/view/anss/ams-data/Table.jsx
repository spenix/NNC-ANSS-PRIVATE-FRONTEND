import { useState, useEffect, useCallback } from "react";
import { useHistory, Link } from "react-router-dom";

// Redux
import {  getData, getAmsTotals, deleteAms } from "../../../redux/ams-data/amsActions";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import debounce from "lodash/debounce";
import { Row, Col, Button, Input, Table, Card, Space, Popconfirm, Tag, DatePicker } from "antd";
import { Search, Delete, EditSquare } from "react-iconly";
import { RiAddBoxLine, RiErrorWarningLine, RiFileList3Line } from "react-icons/ri";
// import { columns } from "./Columns";
import AddNewAms from "./Modal";
import FlagIcon from '../../../utils/global-components/FlagIcon';
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import Legends from '../../../utils/global-components/Legends';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../utils/LangConstants';
import {insertArrVal} from '../../../utils/global-functions/minor-functions';
export default function AmsData(props) {
  const { pageRoles } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false)
  const currYear = new Date().getFullYear();
  const [data, setData] = useState([])
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [year, setYear] = useState(currYear);
  const [columns, setColumns] = useState([]);
  let history = useHistory();
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  // Redux
  const dispatch = useDispatch();
  const ams = useSelector((state) => state.ams);
  const { myprofile : {roles, organization} } = useSelector(state => state.users);
  // Sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const handleFilter = (val) => {
    setSearchTerm(val);
    dispatch(
      getData({
        q: val,
      })
    );
  };

  // Get Data 
  useEffect(() => {
    fetch();
  }, [dispatch]);

  const processData = () => {
    let results = [];
    if(ams.amsTotals.data){
      if(ams.amsTotals.data.attributes.length > 0) {
        for (let i = 0; i < ams.amsTotals.data.attributes.length; i++) {
          results.push({
            key: ams.amsTotals.data.attributes[i].id,
            member_state: ams.amsTotals.data.attributes[i].name,
            year: ams.amsTotals.data.attributes[i].year,
            no_indecators: ams.amsTotals.data.attributes[i].totals,
            data_info: {...ams.amsTotals.data.attributes[i], pageRoles}
          });
        }
      }
    }
    setLoading(false)
    setData(results);
    setIsDataFetched(false);
  }
 

  // const confirm = (id) => {
  //   setLoading(true)
  //   dispatch(deleteAms({}, id)).then(()=> {
  //     openNotificationWithIcon("success", "Success", "AMS data is deleted successfully.")
  //     setLoading(false)
  //   });
  // }

  const setDataDetails = ({id, name, totals, year}) => {
    var parameter = {
      country : name,
      organization_id : id,
      year,
      indicator_category : "All",
      indicator_type : "All"
    }
    history.push(`/ams-data/detail/encode-data/${ window.btoa(JSON.stringify(parameter)) }`);
  }

  
const btnForAddData = () => {
  if(pageRoles.includes(ACTION_ADD)){
    return (
      <Button
                  block
                  type="primary"
                  // onClick={() => {alert("Under Development.")}}
                  onClick={toggleSidebar}
                  icon={<RiAddBoxLine size={16} className="remix-icon" />}
                >
                  ENCODE INDICATOR DATA
                </Button>
    )
  }
}

const btnForEditData = (dataIndex) => {
  if(dataIndex?.pageRoles.includes(ACTION_EDIT)){
    return (
      <Button
                type="text"
                 value={dataIndex}
                 onClick={() => {setDataDetails(dataIndex) }}
              >
                  <EditSquare set="broken"  size={24}
                      className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
            </Button>
    )
  }
}

const btnForViewData = (dataIndex) => {
  if(dataIndex?.pageRoles.includes(ACTION_VIEW)){
    return (
      <Link
                 to={`/indicator-approval/detail/${window.btoa(JSON.stringify({organization_id:dataIndex?.id, year:dataIndex?.year}))}`}
            >
                <RiFileList3Line set="broken"  size={24}
                  className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
            </Link>
    )
  }
}


 useEffect(() => {
  if(roles){
    var cols = [
      {
        title: "Reporting Year",
        dataIndex: "year",
        align: "left",
        sorter: (a, b) => a.year.length - b.year.length,
        sortDirections: ['descend', 'ascend'],
      },
      
      {
        title: "No. of Indicators",
        dataIndex: "no_indecators",
        render: (dataIndex) =>{
          return (
            <>
              <Tag  color="#59edff">{dataIndex.draft}</Tag>
              <Tag  color="#0010f7">{dataIndex.submitted}</Tag>
              <Tag  color="#87d068">{dataIndex.approved}</Tag>
              <Tag  color="#f50">{dataIndex.returned}</Tag>
            </>
          );
        }
      },
      {
        title: "ACTIONS",
        dataIndex: "data_info",
        align: "center",
        render: (dataIndex) => (
          <Space>
            {btnForViewData(dataIndex)}
            {btnForEditData(dataIndex)}
          </Space>
        ),
      }
      ];

      if(roles?.includes('system_administrator')){
        cols = insertArrVal(cols, 1, {
            title: "Member State",
            dataIndex: "member_state",
            align: "left",
            sorter: (a, b) => a.member_state.length - b.member_state.length,
            sortDirections: ['descend', 'ascend'],
          })
      }
      setColumns(cols);
    }
 }, [roles])
  
  const delayedSearch = useCallback(
    debounce((q) => fetch(q), 500),
    [year]
  );
  const fetch = (yr = year) => {
    setLoading(true)
    if(yr)
      dispatch(getAmsTotals({year:yr}))
        .then(() => {
          setIsDataFetched(true);
        })
    else
      setLoading(false)
  }
  if(isDataFetched) {
    processData();
  }

  const onChangeDate = (date, dateString) => {
    setYear(dateString);
    delayedSearch(dateString);
  }
  return (
    <>
      <div className="hp-mb-16">
        <Row gutter={[8, 8]} style={{marginBottom:"10px"}} justify="space-between">
          <Col md={16} xs={16} span={24}>          
            <BreadCrumbs
              breadCrumbActive="Indicator Data"
            />
          </Col>
          <Col md={8} xs={8} span={24} align="end">
                <Space >
                    <FlagIcon country={organization?.name} />
                    <label style={{fontWeight: "bold", fontSize:"1.125rem"}}>{organization?.name}</label>
                </Space>
          </Col>
        </Row>
        <Row justify="end">
          <Col md={16} xs={24} span={24}>
              <Row justify="end" align="middle" gutter={[16]}>
                <Col xs={24} md={6} xl={6} align="end" className="hp-mb-10">
                  <DatePicker picker="year" defaultValue={moment()} onChange={onChangeDate} allowClear={false}/>
                </Col>
                <Col xs={24} md={10} xl={10} className="hp-mb-10">
                  <Input
                    placeholder="Search"
                    prefix={<Search set="curved" size={16} className="hp-text-color-black-80" />}
                    value={searchTerm}
                    onChange={(e) => handleFilter(e.target.value)}
                  />
                </Col>
                <Col xs={24} md={8} xl={8} className="hp-mb-10">
                  {btnForAddData()}
                </Col>
              </Row>
          </Col>
        </Row>
      </div>

      <Card style={{ width: "100%" }} className="hp-mb-32">
        <Row className="hp-mb-10">
            <Col span={24} className="hp-mb-10">
                  <Space>
                    <label style={{fontWeight: "bold" }}>Legend:</label>
                    <Legends no_indecators={[]} view_stat={true}/>
                  </Space>
            </Col>
            <Col span={24}>
                  <Table
                    pagination={{ defaultPageSize: 10 }}
                    columns={columns}
                    dataSource={data}
                    loading={loading}
                    size="small"
                    scroll={window.screen.width > 800 ? { x: 'calc(500px + 50%)' } : { x: 'calc(800px + 50%)' }}
                  />
            </Col>
        </Row>
      </Card>
      <AddNewAms open={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};