import { Table, Card, Progress, Space, Row, Col, Tag } from 'antd';
import { useHistory } from "react-router-dom";
import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from "react-redux";
import FlagIcon from '../../../../utils/global-components/FlagIcon';

import {getPolicyProgrammesStatus } from "../../../../redux/policy-programmes/policyProgrammesActions";
import {callNotif} from '../../../../utils/global-functions/minor-functions';
export default function PolicyAndProgrammes() {
    const [loading, setLoading] = useState(false)
    const [columns, setColumns] = useState([]);
    const [data, setData] = useState([]);
    const dispatch = useDispatch();
    const history = useHistory();
    const {programmes_status, status, message} = useSelector((state) => state.policyProgrammes);
    const { myprofile : {roles} } = useSelector(state => state.users);
    useEffect(() => {
        setLoading(true);
        dispatch(getPolicyProgrammesStatus()).then(() => {
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
        localStorage.removeItem('program-totals');
    }, [])

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

    useEffect(() => {
        if(Object.keys(programmes_status).length){
            const {attributes, type} = programmes_status
            var dataRes = [];

            for (let index = 0; index < attributes.length; index++) {
                dataRes.push({ 
                    key: attributes[index]?.id,
                    name: attributes[index]?.name,
                    totals: attributes[index]?.totals,
                    type
                 })
            }
            setData(dataRes)
        }
    }, [programmes_status])

    const redirectRoute = (status = 'all', dataIndex, countryOnly = false) => {
      dataIndex['status'] = status
      dataIndex['countryOnly'] = countryOnly
      localStorage.setItem(dataIndex?.type, JSON.stringify(dataIndex) )
      history.push('/policies-and-programmes');
    }

    useEffect(() => {
      if(typeof roles == 'object'){
        var cols = [
          {
            title: "Country",
            dataIndex: "name",
            width:"35%",
            render: (_, dataIndex) =>{
                 return (<>
                      <Space>
                        
                          <FlagIcon country={dataIndex.name}/>
                        <a onClick={() => redirectRoute('all', dataIndex, true)}>
                          <span>{dataIndex.name}</span>
                        </a>
                      </Space>
                  </>)
            }
          },
          {
            title: "No. of Records",
            dataIndex: "totals",
            width:"55%",
            render: (_, dataIndex) =>{
              return (
                <>
                  <a onClick={() => redirectRoute('draft', dataIndex)}>
                    <Tag  style={{ width: '42px', fontWeight: "bold"}} color="#59edff">{dataIndex?.totals?.draft}</Tag>
                  </a>
                  <a onClick={() => redirectRoute('submitted', dataIndex)}>
                    <Tag  style={{ width: '42px', fontWeight: "bold"}} color="#108ee9">{dataIndex?.totals?.submitted}</Tag>
                  </a>
                  <a onClick={() => redirectRoute('approved', dataIndex)}>
                    <Tag  style={{ width: '42px', fontWeight: "bold"}} color="#87d068">{dataIndex?.totals?.approved}</Tag>
                  </a>
                  <a onClick={() => redirectRoute('returned', dataIndex)}>
                    <Tag  style={{ width: '42px', fontWeight: "bold"}} color="#f50">{dataIndex?.totals?.returned}</Tag>
                  </a>
                </>
              );
            }
          },
          {
            title: "Total",
            dataIndex: "totals",
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
      }
      setColumns(cols);
    }
    }, [roles]) 
   
  return (
    <Table
      columns={columns} 
      dataSource={data} 
      size="small" 
      loading={loading}
      pagination={{ defaultPageSize: 5 }}
      // scroll={{ x: 'calc(350px + 50%)' }}
    />
  )
}
