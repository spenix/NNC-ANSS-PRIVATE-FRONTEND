import { Table, Card, Progress, Space, Row, Col, Tag } from 'antd';

import { getDataEntryProgress } from '../../../../redux/ams-data/amsActions';
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {successMsg, errorMsg, warningMsg, infoMsg, callNotif} from '../../../../utils/global-functions/minor-functions';
const PageColumn2 = ({selectedYear, selectedOrg: {organization_id, organization}}) => {
  const color = ["red", "blue", "green"];
  const [isFetched, setIsFetched] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch();
  const {amsDataEntryProg, message, status} = useSelector((state) => state.ams)
  const { myprofile : {roles} } = useSelector(state => state.users);
  useEffect(() => {
    // if(organization_id){
      fetch();
    // }
   
  }, [dispatch, selectedYear, organization_id]);

  useEffect(() => {
    errMsg();
}, [status]);

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
      }
        
    }
}

  const fetch = () => {
        setLoading(true);
        dispatch(
          getDataEntryProgress({year: selectedYear, organization_id})
          )
        .then(() => {
          setIsFetched(true);
          setLoading(false);
        }).catch(() => {
          errMsg();
        });
  }

  const randomColor = (percent) => {
    var active_color = "";
    if(percent <= 49 &&  percent >= 1)
            active_color = color[0];
    else if(percent <= 74 && percent >= 50 )
            active_color = color[1];
    else
            active_color = color[2];
    return active_color;
  }

  const processTblData = () => {
    const dataResults = [];
    
    if(typeof amsDataEntryProg?.attributes !== 'undefined'){
      for (let i = 0; i < amsDataEntryProg?.attributes.length; i++) {
        dataResults.push({
          key: amsDataEntryProg?.attributes[i]?.id,
          detail:  amsDataEntryProg?.attributes[i],
          name:  amsDataEntryProg?.attributes[i]?.name
        });
    }
    }
    setData(dataResults);
    setIsFetched(false);
  }

  if(isFetched){
    processTblData();
  }

  const columns = [
    {
      title: "Category",
      dataIndex: "detail",
      render: (_, {detail}) => {
        var percent = Math.round((detail?.encoded / detail?.notEncoded) * 100);
          return (
            <>
               <Card size="small" style={{ width: "100%" }}>
                 <Row justify="space-between" gutter={[8, 8]}>
                   <Col md={15} xs={24} span={24}>{detail?.name}</Col>
                   <Col md={9} xs={24} span={24} align="end"><small>{ `${detail?.encoded}/${detail?.notEncoded} Indicators` }</small></Col>
                 </Row>
                 <Progress
                 key={detail?.id}
                  strokeColor={randomColor(percent)}
                  percent={percent}
                  showInfo={false}
                />
               </Card>
            </>
          );
      }
    },
    {
      title: "Approval Status",
      dataIndex: "detail",
      align: "right",
      width: '35%',
      render: (_, {detail: {totals : {returned, approved, draft, submitted}}}) => {
        var dataArr = {
          draft: {title:'Draft', data: draft, color: '#59edff'}, 
          submitted: {title: 'Submitted', data: submitted, color: '#108ee9'}, 
          returned: {title: 'Returned', data: returned, color: '#f50'}, 
          approved: {title: 'Approved', data: approved, color: '#87d068'} 
        };
        return Object.keys(dataArr).map(item => {
          return (
            <Row 
            key={item}
            justify="space-between" 
            className="hp-mb-6"
            gutter={{
              xs: 2,
              sm: 4,
              md: 8,
              lg: 16,
            }} 
            >
                <Col md={16} xs={24} span={24} align="end">
                      <label style={{marginRight:"5px"}}>{dataArr[item]?.title}</label>
                </Col>
                <Col md={8} xs={24} span={24} align="end">
                      <Tag style={{minWidth:"100%", fontWeight: "bold"}} color={dataArr[item]?.color}>{dataArr[item]?.data}</Tag>
                </Col>
            </Row>
          );
        })
        
      }
    },
    
  ];
return (
    <>
      <Table 
      columns={columns} 
      dataSource={data} 
      size="small" 
      loading={loading}
      pagination={{ defaultPageSize: 2 }} />
    </>
  );
};

export default PageColumn2;
