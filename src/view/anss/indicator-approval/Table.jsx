import { Row, Col, Table, Card, Space, Tag, Button, DatePicker } from "antd";
import { useParams, useHistory, Link } from "react-router-dom";
import moment from "moment";
// import AddNewAms from "./Modal";
import { useState, useEffect, useCallback } from "react";
import debounce from "lodash/debounce";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import { EditSquare } from "react-iconly";
import {  getData, getAmsTotals, deleteAms, status, message } from "../../../redux/ams-data/amsActions";
import { useDispatch, useSelector } from "react-redux";
import Legends from '../../../utils/global-components/Legends';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../utils/LangConstants';
import FlagIcon from '../../../utils/global-components/FlagIcon';
import {insertArrVal, successMsg, errorMsg, warningMsg} from '../../../utils/global-functions/minor-functions';
export default function AmsData(props) {
  const {pageRoles} = props;
  const [searchTerm, setSearchTerm] = useState("");
  const [indicatorSelected, setIndicatorSelected] = useState({});
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const currYear = new Date().getFullYear();
  const [year, setYear] = useState(currYear);
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [columns, setColumns] = useState([]);
  const history = useHistory();
   // Redux
   const dispatch = useDispatch();
   const ams = useSelector((state) => state.ams);
   const { myprofile : {roles, organization} } = useSelector(state => state.users);
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
              key:i,
              dataz: {...ams.amsTotals.data.attributes[i], pageRoles},
              year: ams.amsTotals.data.attributes[i].year,
              no_indecators: ams.amsTotals.data.attributes[i].totals,
              member_state: ams.amsTotals.data.attributes[i].name,
            });
          }
        }
      }
      setLoading(false)
      setData(results);
      setIsDataFetched(false);
    }

    const fetch = (yr = year) => {
      setLoading(true)
      if(yr)
        dispatch(getAmsTotals({year: yr}))
          .then(() => {
            setIsDataFetched(true);
          })
      else
        setLoading(false)
    }

    if(isDataFetched) {
      processData();
    }

    const delayedSearch = useCallback(
      debounce((q) => fetch(q), 500),
      []
    );
    
    const onChangeDate = (date, dateString) => {
      setYear(dateString);
      delayedSearch(dateString);
    }
    const setDataDetails = (val) => {
      if(val?.pageRoles.includes(ACTION_EDIT)){
        var key = window.btoa(JSON.stringify({organization_id:val?.id, year:val?.year}))
        history.push(`/indicator-approval/detail/${key}`)
      }else{
        errorMsg(`Oops! can't execute, you don't have permission.`);
      }
    } 
    const btnForEditData = (dataIndex) => {
      if(dataIndex?.pageRoles.includes(ACTION_EDIT)){
        return (
          <Button
              //  to={`/indicator-approval/detail/${dataIndex}`}
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

    useEffect(() => {
      if(roles){
        var cols = [
          {
            title: "Reporting Year",
            dataIndex: "year",
            align: "left",
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
            title: "Action(s)",
            dataIndex: "dataz",
            align: "center",
            width: '15%',
            render: (dataIndex) => (
              <Space>
                  {btnForEditData(dataIndex)}
                </Space>
              ),
          },
        ]
          if(roles.includes('system_administrator')){
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
     
  return (
    <>
      <div className="hp-mb-16">
        <Row gutter={[32, 32]} justify="space-between">
          <Col md={15} xs={15} span={24} align="start">
            <BreadCrumbs
              breadCrumbActive="Indicator Data"
            />
          </Col>
          <Col md={9} xs={9} span={24} align="end">
                      <Space >
                          <FlagIcon country={organization?.name} />
                          <label style={{fontWeight: "bold", fontSize:"1.125rem"}}>{organization?.name}</label>
                      </Space>
                </Col>
         
        </Row>
      </div>
      <div className="hp-mb-16">
            <Row gutter={[32, 32]}>
                <Col md={24} xs={24} span={24} align="end">
                    <DatePicker picker="year" defaultValue={moment()} onChange={onChangeDate}/>
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
    </>
  );
};