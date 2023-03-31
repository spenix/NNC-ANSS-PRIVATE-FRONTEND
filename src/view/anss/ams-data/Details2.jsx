import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import debounce from "lodash/debounce";
import moment from "moment";
// Redux
import { getAllOrganizations } from "../../../redux/organizations/organizationsAction";
import { getAllData as getAllIndicatorTypesData } from "../../../redux/indicatorTypes/indicatorTypesActions";
import {getAllData as getAllIndicatorCategoryData} from "../../../redux/indicatorCategories/indicatorCategoriesActions";
import {getAllData as getAllIndicatorsData, filterIndicatorsData } from "../../../redux/indicators/indicatorsActions2";
import { getAllData as getAllOrganizationsData } from "../../../redux/asian-countries/asianCountriesAction2";
import { useDispatch, useSelector } from "react-redux";

import { Layout, Row, Col, Avatar, Button, Divider, Card, Space, Tag, Form, Select, Input, DatePicker } from "antd";
import {
  RiArrowLeftSLine,
} from "react-icons/ri";

import Legends from '../../../utils/global-components/Legends';
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import FlagIcon from '../../../utils/global-components/FlagIcon';
import DetailIndicatorsList from './DetailIndicatorsList';
import DetailForm from "./DetailForm";
const { Sider, Content } = Layout;
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../utils/LangConstants';
import {legends_list} from '../../../utils/common';
export default function Detail(props) {
  const { pageRoles } = props;
  const dtYr = new Date().getFullYear();
  const history = useHistory();
  const dispatch = useDispatch();
  // const { type, parameter } = useParams();
  // const {country, indicator_category, indicator_type, year, organization_id} = JSON.parse(window.atob(parameter))
  const [indicator, setIndicator] = useState({});
  const [indicatorIndex, setIndicatorIndex] = useState(0);
  const [indicatorStatus, setIndicatorStatus] = useState('default');
  const [form] = Form.useForm();
 
  const [dataSelector, setDataSelector] = useState({
        indicatorType:'all',
        indicatorCategory:'all',
        status:'all',
        year: dtYr,
  });


// get values from redux
  const { myprofile: {organization, roles}  } = useSelector(state => state.users);
  const {indicatorType_data} = useSelector((state) => state.indicatorTypes);
  const {indicatorCategory_data} = useSelector((state) => state.indicatorCategories);
  const {memberState_data} = useSelector((state) => state.asianCountries);
  const {indicator_data} = useSelector((state) => state.indicators);
  const {amsData } = useSelector(state => state.ams);

  // console.log("organization",  organization);
  useEffect(() => {
    dispatch(getAllIndicatorTypesData());
    dispatch(getAllIndicatorCategoryData());
    dispatch(getAllOrganizationsData());
  }, [dispatch])

  useEffect(() => {
    if(Object.keys(amsData).length){
      const {attributes, id, types} = amsData?.data;
      setIndicatorStatus( attributes?.status ? attributes?.status : 'default');
    }else{
      setIndicatorStatus('default');
    }
  }, [amsData])

  useEffect(() => {
    if(typeof organization != 'undefined'){
      setDataSelector(prevState => ({...prevState, organization_id: organization?.party_id, country: organization.name}));
    }
  }, [organization])

  useEffect(() => {
    delayedSearch(dataSelector);
  }, [dataSelector])

  const delayedSearch = useCallback(
    debounce((q) => fetch(q), 500),
    [dataSelector]
  );

  const statusViewer = () => {
    var stat_data = legends_list.filter((item, i) => { 
        if(item.stat_name == indicatorStatus) 
                  return item
      })[0];
    return (<Tag style={{ marginLeft: '10px' }}color={stat_data?.stat_color}>{stat_data?.stat}</Tag>);
  }


  const fetch = (param = {}) => {
    var paramsData = {};
    if(param?.indicatorCategory != null && typeof param?.indicatorCategory == "number"){
      paramsData['category_id'] = param?.indicatorCategory;
    }
    if(param?.indicatorType != null && typeof param?.indicatorType == "number"){
      paramsData['type_id'] = param?.indicatorType;
    }
    if(param?.status != null && param?.status != 'all'){
      paramsData['status'] = param?.status;
    }
    if(Object.keys(paramsData).length){
      paramsData['year'] = param?.year;
      paramsData['organization_id'] = param?.organization_id;
      dispatch(filterIndicatorsData({...paramsData}))
    }else{
      dispatch(getAllIndicatorsData());
    }
  }

 
  useEffect(() =>{
    form.setFieldsValue({
      indicatorType:dataSelector?.indicatorType,
      indicatorCategory:dataSelector?.indicatorCategory,
      status: dataSelector?.status,
      year: moment(`${dataSelector?.year}-1-1`)
    })
  }, [form]);

  const setFieldsChanges = (field) => {
    var val = {};
    for (let index = 0; index < Object.keys(field).length; index++) {
      if( Object.keys(field)[index] != 'year'){
        val[Object.keys(field)[index]] =  field[Object.keys(field)[index]];
      }
    }

    console.log(val);
    setDataSelector(prevState => ({...prevState, ...val}));
  }
  console.log('dataSeletor', dataSelector);
 const customise = useSelector(state => state.customise);
  return (
    <>
     <div className="hp-mb-2">
     <Form
      form={form}
      layout="vertical"
      onValuesChange={(_, field) => { setFieldsChanges(field) }}
      >
        <Row gutter={[5, 5]} justify="space-between">
          <Col md={11} xs={24} span={24}>
              <BreadCrumbs
                breadCrumbActive="Data Entry"
              />
              <Col>
                {/* <Space >
                    <Avatar size={window.screen.width > 800 ? 40 : 24} icon={<FlagIcon country={country} />} className="hp-m-auto" />
                    {window.screen.width > 800 ? (<h4>{country}</h4>) : (<h5>{country}</h5>)}
                </Space> */}
                {
                  roles?.includes("system_administrator") ? 
                  (
                    <Select placeholder="Select Country" defaultValue={organization?.party_id} onChange={(e) => {setDataSelector(prevState => ({...prevState, organization_id: e}))}} style={{ width: (window.screen.width > 800 ? "50%" : "100%")}}>
                    {
                      memberState_data.map(item =>{
                        return (
                          <Select.Option key={item.id} value={item.id}><FlagIcon country={item.attributes.name} /> {item.attributes.name}</Select.Option>
                        )
                      })
                    }
                  </Select>
                  ) : (
                    <Space>
                      <Avatar size={40} icon={<FlagIcon country={organization?.name} />} className="hp-m-auto" />
                      <h3>{organization?.name}</h3>
                  </Space>
                  )
                }

              </Col>
           </Col>
          <Col md={2} xs={24} span={24}>
              <Form.Item name="year" label="Year">
                  <DatePicker picker="year" onChange={(date, dateString) => ( setDataSelector(prevState => ({...prevState, year: moment(dateString).format('Y')})) )} allowClear={false}/>
                </Form.Item>
            {/* <label>Year <br/><h4 style={{ marginTop:'8px' }}>{year}</h4></label> */}
          </Col>
          <Col md={4} xs={24} span={24}>
              <Form.Item label="Indicator Type" name="indicatorType" rules={[{ required: true, message: 'This is required!' }]}>
                <Select
                  placeholder="Select Indicator Type"
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
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
          <Col md={4} xs={24} span={24}>
              <Form.Item label="Indicator Category" name="indicatorCategory" rules={[{ required: true, message: 'This is required!' }]}>
              <Select
                placeholder="Select Indicator Category"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
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
          <Col md={3} xs={24} span={24}>
            <Form.Item label="Status" name="status" rules={[{ required: false, message: 'This is required!' }]}>
              <Select
                placeholder="Select Status"
                allowClear
              >
                {
                  ['All', 'Submitted', 'Approved', 'Returned'].map((item, index) => {
                    return (<Select.Option key={index} value={item.toLowerCase()}>{item}</Select.Option>)
                  })
                }
              </Select>
            </Form.Item>
          </Col>
        </Row>
        </Form>
      </div>
    <Row justify="space-between" gutter={[16, 16]} >
      <Col md={5} xs={24} span={24}>
        <DetailIndicatorsList year={dataSelector?.year} setIndicatorIndex={setIndicatorIndex} setIndicator={setIndicator} indicatorIndex={indicatorIndex} organization_id={dataSelector?.organization_id} />
      </Col>
      <Col md={19} xs={24} span={24}>
        <Card className="hp-contact-detail hp-mb-32">
        <Layout className="hp-flex-wrap">
          <Sider
            className="hp-p-24"
            theme={customise.theme == "light" ? "light" : "dark"}
            width={20}
          >
            <Row className="hp-h-100">
              <Col span={24}>
                <Row>
                  <Col span={24}>
                    <Link to="/ams-data">
                      <Button
                        type="text"
                        shape="square"
                        style={{backgroundColor:"#F0F8FF"}}
                        icon={<RiArrowLeftSLine size={24} />}
                      ></Button>
                    </Link>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Sider>

          <Content className="hp-bg-color-black-0 hp-bg-color-dark-100 hp-p-24">
            
            <Row align="middle" justify="space-between">
              <Col md={24} span={24}>
                <Space>
                  <label>Legend:</label>
                  <Legends no_indecators={[]} view_stat={true}/>
                </Space>
              </Col>
              <Divider />
              <Col md={24} span={24}>
                <label>Indicator Code: <span style={{ fontWeight: 'bold' }}>{Object.keys(indicator).length ? indicator?.item?.attributes?.code : dataSelector?.name}</span></label> 
                {statusViewer()}
              </Col>
              <Col md={24} span={24}>
                <h3>{Object.keys(indicator).length ? indicator?.item?.attributes?.name : dataSelector?.name}</h3>
              </Col>
              <Col
                span={24}
                className="hp-profile-content-list hp-mt-8 hp-pb-sm-0 hp-pb-20"
              >
                <p>{Object.keys(indicator).length ? indicator?.item?.attributes?.description : dataSelector?.name}</p>
              </Col>
              
              <Col md={24} span={24}>
                <DetailForm setIndicatorIndex={setIndicatorIndex} indicatorIndex={indicatorIndex} year={dataSelector?.year} indicator={indicator} organization_id={dataSelector?.organization_id} country={dataSelector?.country}/>
              </Col>
            </Row>
          </Content>
        </Layout>
      </Card>
      </Col>
    </Row>
    </>
  )
};