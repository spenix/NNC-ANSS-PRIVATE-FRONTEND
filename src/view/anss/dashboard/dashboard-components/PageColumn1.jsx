import { Table, Space, Tag } from 'antd';
import { useState, useEffect } from "react";
import { getAllData, getAmsTotals } from "../../../../redux/ams-data/amsActions";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import FlagIcon from '../../../../utils/global-components/FlagIcon';

import {callNotif} from '../../../../utils/global-functions/minor-functions';
const PageColumn1 = ({setSelectedOrg, allowCountrySelect, currYear}) => { 
  let history = useHistory();
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  // get data from storage
  const dispatch = useDispatch();
  const ams = useSelector((state) => state.ams);
  const { myprofile : {roles} } = useSelector(state => state.users);
  useEffect(() => {
    setLoading(true)
    // dispatch(getAllData());
    dispatch(getAmsTotals({year: currYear})).then(() =>{setLoading(false)});
  }, [dispatch, currYear]);
  const data = [];
  if(ams.amsTotals.data){
    if(ams.amsTotals.data.attributes.length > 0) {
      for (let i = 0; i < ams.amsTotals.data.attributes.length; i++) {
        data.push({
          key: i,
          country: ams.amsTotals.data.attributes[i].name,
          year: ams.amsTotals.data.attributes[i].year,
          no_indecators: ams.amsTotals.data.attributes[i].totals,
          details: ams.amsTotals.data.attributes[i],
          allowCountrySelect,
        });
      }
    }
  }

  const redirectRoute = (stat, detail) => {
    var paramsData = {
      country: detail?.details?.country, 
      indicator_category: 'all', 
      indicator_type: 'all', 
      year: detail?.year, 
      organization_id: detail?.details?.id,
      dataStatus: stat,
      dataIndex: 0,
      repository_id: 0
    };
    history.push(`/data-entry/detail/${window.btoa(JSON.stringify(paramsData))}`);
  }

  useEffect(() => {
    if(typeof roles == 'object'){
        var cols = [
          {
            title: "Country",
            dataIndex: "details",
            width:"35%",
            render: (_, dataIndex) =>{
              if(dataIndex.allowCountrySelect)
                return (
                  <>
                    <a onClick={() => {setSelectedOrg({organization_id: dataIndex?.details?.id, organization: dataIndex?.country})}}>
                      <Space>
                        <FlagIcon country={dataIndex.country}/>
                        <span>{dataIndex.country}</span>
                      </Space>
                    </a>
                  </>
                )
              else
                return (
                  <>
                      <Space>
                        <FlagIcon country={dataIndex.country}/>
                        <span>{dataIndex.country}</span>
                      </Space>
                  </>
                )
            }
          },
          {
            title: "No. of Indicators",
            dataIndex: "no_indecators",
            width:"55%",
            render: (_, dataIndex) =>{
              return (
                <>
                  <a onClick={() => dataIndex?.no_indecators?.draft ? redirectRoute('draft', dataIndex) : callNotif("Information", "No data found.", "info")}>
                    <Tag  style={{ width: '42px', fontWeight: "bold"}} justify="space-between" color="#59edff">{dataIndex?.no_indecators?.draft}</Tag>
                  </a>
                  <a onClick={() => dataIndex?.no_indecators?.submitted ? redirectRoute('submitted', dataIndex) : callNotif("Information", "No data found.", "info")}>
                    <Tag  style={{ width: '42px', fontWeight: "bold" }} color="#108ee9">{dataIndex?.no_indecators?.submitted}</Tag>
                  </a>
                  <a onClick={() => dataIndex?.no_indecators?.approved ? redirectRoute('approved', dataIndex)  : callNotif("Information", "No data found.", "info")}>
                    <Tag  style={{ width: '42px', fontWeight: "bold" }} color="#87d068">{dataIndex?.no_indecators?.approved}</Tag>
                  </a>
                  <a onClick={() => dataIndex?.no_indecators?.returned ? redirectRoute('returned', dataIndex)  : callNotif("Information", "No data found.", "info")}>
                    <Tag  style={{ width: '42px', fontWeight: "bold" }} color="#f50">{dataIndex?.no_indecators?.returned}</Tag>
                  </a>
                </>
              );
            }
          },
          {
            title: "Total",
            dataIndex: "no_indecators",
            align: "center",
            width:"15%",
            render: (dataIndex) =>{
              return (
                <>
                {dataIndex.draft + dataIndex.submitted + dataIndex.approved + dataIndex.returned}
                </>
              );
            }
          },
        ]
      if(!roles.includes('system_administrator') && !roles.includes('secretariat')){
        cols.splice(0, 1);
        cols.unshift({
          title: "Reporting Year",
          dataIndex: "year",
        });
      }
      setColumns(cols);
    }
  }, [roles])

  return (
      <>
        <Table 
        columns={columns} 
        dataSource={data} 
        loading={loading}
        size="small"
        // scroll={{ x: 800 }}
        pagination={{ defaultPageSize: 6 }} />
      </>
    );
  };

export default PageColumn1;
