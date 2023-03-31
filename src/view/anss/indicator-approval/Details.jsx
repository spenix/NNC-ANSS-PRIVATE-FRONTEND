import IndicatorServices from "../../../services/indicatorServices";
import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { DownOutlined } from '@ant-design/icons';
import moment from "moment";
import {
  RiArrowLeftSLine,
  RiFileList3Line,
  RiPrinterLine
} from "react-icons/ri";
// Redux
import debounce from "lodash/debounce";
import { getIndicator } from "../../../redux/indicators-approval/inidicatorsApprovalAction";
import { getAllData as getAllIndicatorTypesData } from "../../../redux/indicatorTypes/indicatorTypesActions";
import {getAllData as getAllIndicatorCategoryData} from "../../../redux/indicatorCategories/indicatorCategoriesActions";
import {  getAmsDataFilters } from "../../../redux/ams-data/amsActions";
import { useDispatch, useSelector } from "react-redux";
import { Layout, Row, Col, Avatar,  Space, Tag, Form, Select, Dropdown, Table, Menu, Button, Modal, List} from "antd";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import FlagIcon from '../../../utils/global-components/FlagIcon';
import AmsModal from './Modal';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../utils/LangConstants';
import {legends_list} from '../../../utils/common';
import {errorMsg, infoMsg, warningMsg, callNotif} from '../../../utils/global-functions/minor-functions';
export default function Detail(props) {
  const {pageRoles} = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const [loading, setLoading] = useState(false)
  const [listParams, setListParams] = useState(false)
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  })
  const ActionVal = useRef('');
  const [data, setData] = useState([])
  const [isDataFetched, setIsDataFetched] = useState(false);
  const dispatch = useDispatch();
  const { key } = useParams();
  const [indicatorSelected, setIndicatorSelected] = useState([]);
  const [successTrans, setSuccessTrans] = useState(false);
  const { organization_id, year } = JSON.parse(window.atob(key))
  const [columns, setColumns] = useState([]);
  const [fields, setFields] = useState([
    {
      name: ['type_id'],
      value: "All",
    },
    {
      name: ['category_id'],
      value: "All",
    },
    {
      name: ['status'],
      value: "submitted",
    },
  ]);
  const [ dataSeletor, setDataSelector ] = useState({
    category_id: 0,
    type_id:0,
    status:"submitted"
  }); 
const { myprofile: {organization, roles}  } = useSelector(state => state.users);
const {amsData_data, amsData_meta, amsData_links, message, status} = useSelector((state) => state.ams);
// const indicatorsApproval = useSelector(state => state.indicatorsApproval);
const {indicatorType_data} = useSelector((state) => state.indicatorTypes);
const {indicatorCategory_data} = useSelector((state) => state.indicatorCategories);

  useEffect(() => {
    dispatch(getAllIndicatorTypesData());
    dispatch(getAllIndicatorCategoryData());
  }, [dispatch])

  useEffect(() => {
    delayedSearch(pagination);
  }, [dataSeletor])

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

  const delayedSearch = useCallback(
    debounce((q) => fetch(q), 500),
    [dataSeletor]
  );

  const processData = () => {
    const results = [];
    if(typeof amsData_data !== 'undefined'){
      for (let i = 0; i < amsData_data.length; i++) {
        results.push({
          key:amsData_data[i].id,
          repository_code:amsData_data[i]?.attributes?.repository?.code,
          repository_name:amsData_data[i]?.attributes?.repository?.name,
          national_data:amsData_data[i]?.attributes?.national_data,
          datasource:amsData_data[i]?.attributes?.datasource?.title,
          remarks:amsData_data[i]?.attributes?.remarks,
          status: amsData_data[i]?.attributes?.status,
          amsData_data
        });
      }
      setData(results);
      if(Object.keys(amsData_meta).length){
      
        setPagination({
          ...listParams,
          total: amsData_meta.pagination.total, // total regardless of pagination
        });
      }
    }
    setIsDataFetched(false);
  }

  const fetch = (params = {}) => {
    setLoading(true);
    const dataParams = {
      limit: params.pageSize,
      page: params.current,
      year,
      organization_id,
    }
    if(dataSeletor.category_id){
      dataParams['category_id'] = dataSeletor.category_id;
    }
    if(dataSeletor.type_id){
      dataParams['type_id'] = dataSeletor.type_id;

    }
    if(dataSeletor.status){
      dataParams['status'] = dataSeletor.status;
    }
    dispatch(getAmsDataFilters(dataParams))
      .then(() => {
        setLoading(false)
        setListParams(params);
        setIsDataFetched(true);
      }).catch(() => {
        errMsg();
        setLoading(false)
        setIsDataFetched(false);
      })
  }
  if(isDataFetched) {
    processData();
  }

  useEffect(()=> {
    if(successTrans){
      toggleSidebar();
      setIndicatorSelected([]);
      ActionVal.current = '';
      setSuccessTrans(false);
      fetch({
        current: 1,
        pageSize: 10,
      });
    }
  }, [successTrans])
    
      
const handleButtonClick = (e, arrData) => {
  if(pageRoles.includes(ACTION_EDIT)){
    var data = e.key.split("_");
    if(data.length){
      var res = arrData.filter(item => { if(item.id == data[1]){ return item } });
      if(res.length){
        ActionVal.current = data[0];
        var results = [];
        for (let i = 0; i < res.length; i++) {
          results.push({
            key:res[i].id,
            repository_code:res[i]?.attributes?.repository.code,
            repository_name:res[i]?.attributes?.repository.name,
            national_data:res[i]?.attributes?.national_data,
            datasource:res[i]?.attributes?.datasource?.title,
            remarks:res[i]?.attributes?.remarks,
            status: res[i]?.attributes?.status
          });
        } 
        setIndicatorSelected(results);
        toggleSidebar();
      }else{
        warningMsg("Oops!, something went wrong...");
      }
    }else{
      warningMsg("Oops!, something went wrong...");
    }
  }else{
    errorMsg(`Oops! can't execute, you don't have permission.`);
  }
};

  const viewRemarksMd = (dataIndex) => {
    const {remarks, repository_code} = dataIndex
    Modal.info({
      icon: (
          <RiFileList3Line className="remix-icon"/>
      ),
      title: (
        <h5 className="hp-mb-0 hp-font-weight-500">[{repository_code}] Remarks</h5>
      ),
      content: (
        <List
          itemLayout="horizontal"
          dataSource={remarks}
          renderItem={(item, index) => (
            <List.Item key={index} style={{border: '1px solid #DCDCDC', padding: '10px', borderRadius: '10px', margin: '5px', boxShadow:'10px'}}>
              <List.Item.Meta
                title={item.remarks}
                description={(
                  <ul style={{listStyle:"none", marginLeft: 0, paddingLeft: 0}}>
                    <li>
                      <small>
                        <b>Status:</b> {item.status}
                      </small>
                    </li>
                    <li>
                      <small>
                        <b>Submitted Date:</b> {moment(item.created_at).format('LL')}
                      </small>
                    </li>
                  </ul>
              )}
              />
            </List.Item>
          )}
        />
       
      ),
      onOk() {},
    });
  }

  useEffect(() => {
    if(roles){
      var cols = [
        {
          title: 'Code',
          dataIndex: 'repository_code',
          width:'8%',
        },
        {
            title: 'Indicator Name',
            dataIndex: 'repository_name',
            width:'15%',
        },
        {
            title: 'National Data',
            dataIndex: 'national_data',
            align:'center',
            width:'15%',
          //   ellipsis: true,
        },
        {
          title: 'Data Source',
          dataIndex: 'datasource',
          width:'15%'
        },
        {
          title: 'Remarks',
          dataIndex: 'remarks',
          width:'15%',
          render: (_, dataIndex) => (
            <Button size="small" onClick={() => viewRemarksMd(dataIndex)} disabled={dataIndex?.remarks.length ? false : true}><RiFileList3Line/> &nbsp; Remarks</Button>
          )
        },
        {
          title: 'Status',
          dataIndex: 'status',
          align:'center',
          width:'10%',
          render: (dataIndex) => (
            legends_list.map((item, i) => {
              if(item.stat.toLowerCase() == dataIndex)
                  return <Tag key={i} color={item.stat_color}>{  dataIndex.toUpperCase()}</Tag>
            })
          )
        }
      ];
    if(pageRoles.length){
      cols.push({
        title: 'Actions',
          dataIndex: 'key',
          align:'center',
          width:'15%',
          render: (_, {key, status, amsData_data}) => (
              <Dropdown.Button
                key={key}
                size="small"
                disabled={status == "approved"}
                icon={<DownOutlined />}
                overlay={
                  <Menu onClick={(e) => handleButtonClick(e, amsData_data)}>
                    {
                      ['approve', 'return'].map(item => {
                        return <Menu.Item key={item+"_"+key} value={key}>{item.toUpperCase()}</Menu.Item>
                      })
                    }
                  </Menu>
                }
              >
                Action
              </Dropdown.Button>
              
            )
      })
    }
    setColumns(cols);
  }
  }, [roles, pageRoles])
  

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setIndicatorSelected(selectedRows);
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record?.status === 'approved' || record?.status === 'returned',
      name: record.key,
    }),
  };

  const openAmsModal = () => {
    if(pageRoles.includes(ACTION_EDIT)){
      if(!indicatorSelected.length) {
        infoMsg('Please select atleast one data.');
      }
      else if(ActionVal.current == ''){
        infoMsg('Please select action you want to excute.');
      }
      else{
        toggleSidebar();
      }
    }else{
      infoMsg('Please select action you want to excute.');
    }
  }

  const setFieldsChanges = (field) => {
    var val = {};
    for (let index = 0; index < field.length; index++) {
      const {name, value} = field[index];
      val[name[0]] =  value == 'All' ? 0 : value;
    }
    setDataSelector(val);
  }
  const customise = useSelector(state => state.customise);
  return (
    <>
     <div className="hp-mb-1" style={{ borderBottom: "2px solid black" }}>
     <Form

      layout="vertical"
      fields={fields}
      onFieldsChange={(_, allFields) => {
        setFieldsChanges(allFields);
      }}
      >
        <Row gutter={[5, 5]} justify="space-between" style={{ marginBottom:"-10px"}}>
          <Col md={11} span={24}>
              <BreadCrumbs
                breadCrumbActive={pageRoles.length ? "Indicators Approval" : "List View"}
              />
              <Col>
                <Space >
                    <Avatar size={40} icon={<FlagIcon country={organization?.name} />} className="hp-m-auto" />
                    <h3>{organization?.name}</h3>
                </Space>
              </Col>
           </Col>
          <Col md={2} span={24}>
            <label>Year <br/><h4 style={{ marginTop:'10px' }}>{year}</h4></label>
          </Col>
          <Col md={4} span={24}>
              <Form.Item label="Indicator Type" name="type_id" rules={[{ required: false, message: 'This is required!' }]}>
                <Select
                  placeholder="Select Indicator Type"
                  allowClear
                >
                  <Select.Option value="All">All</Select.Option>
                    {
                      indicatorType_data.map(item =>{
                        return (
                          <Select.Option key={item.id} value={item.id}>{item.attributes.name}</Select.Option>
                        )
                      })
                    }
            </Select>
            </Form.Item>
          </Col>
          <Col md={4} span={24}>
            <Form.Item label="Indicator Category" name="category_id" rules={[{ required: false, message: 'This is required!' }]}>
            <Select
              placeholder="Select Indicator Category"
              allowClear
            >
               <Select.Option value="All">All</Select.Option>
                    {
                      indicatorCategory_data.map(item =>{
                        return (
                          <Select.Option key={item.id} value={item.id}>{item.attributes.name}</Select.Option>
                        )
                      })
                    }
            </Select>
            </Form.Item>
          </Col>
          <Col md={3} span={24}>
            <Form.Item label="Status" name="status" rules={[{ required: false, message: 'This is required!' }]}>
            <Select
              placeholder="Select Status"
              allowClear
            >
              <Select.Option value="All">All</Select.Option>
              {
                legends_list.map(item => {
                  return (<Select.Option key={item.stat} value={item.stat.toLowerCase()}>{item.stat_name}</Select.Option>)
                })
              }
            </Select>
            </Form.Item>
          </Col>
        </Row>
        </Form>
      </div>
    <Row justify="space-between" gutter={[16, 16]} >
      <Col span={24} md={16} style={{marginBottom:"-20px"}}>
        {
          pageRoles.length ? 
          (
            <Form
            // form={form}
            layout="horizontal"
            >
               <Row justify="start" gutter={[16, 16]} style={{marginTop:"10px"}}>
                <Col md={12} span={24}>
                  <Form.Item label="Action" name="indicatorsAction" rules={[{ required: false, message: 'This is required!' }]}>
                      <Select
                        placeholder="Select Action"
                        allowClear
                        onChange={(e) => {ActionVal.current = e}}
                        disabled={data.length ? false: true}
                      >
                        {
                            ['approve', 'return'].map(item => {
                              return (<Select.Option key={item} value={item}>{item+" Indicators Data"}</Select.Option>)
                            })
                          }
                      </Select> 
                    </Form.Item>
                  </Col>
                  <Col md={12} span={24}>
                    <Button type="primary" onClick={openAmsModal} disabled={data.length ? false: true}>Apply to selected item(s)</Button>
                  </Col>
                </Row>
                
              </Form>
          ) : (
            <Button type="primary" size="small" onClick={() => alert("Under development! :)")} style={{ marginTop:"10px"}} disabled={data.length ? false: true}><RiPrinterLine size={24}/> Print Data</Button>
          )
        }
       
      </Col>
      <Col span={24} md={8} style={{ marginTop:"10px"}} align="end">
                        <Link to={ pageRoles.length ? '/indicator-approval' : "/ams-data"}>
                              <Button
                              type="text"
                              shape="square"
                              style={{backgroundColor:"#F0F8FF"}}
                              ><RiArrowLeftSLine size={24} />Return</Button>
                          </Link>
      </Col>
      <Col span={24}>
      <Table
        rowSelection={pageRoles.length ? {
          type: 'checkbox',
          ...rowSelection,
        }: ""}
        loading={loading}
        columns={columns}
        dataSource={data}
        pagination={{ defaultPageSize: 6 }}
        scroll={{ x: 'calc(500px + 50%)' }}
      />
      </Col>
    </Row>
    <AmsModal open={sidebarOpen} toggleSidebar={toggleSidebar} indicatorSelected={indicatorSelected} ActionVal={ActionVal.current} setSuccessTrans={setSuccessTrans} />
    </>
  )
};