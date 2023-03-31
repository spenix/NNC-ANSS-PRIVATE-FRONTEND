import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
// import debounce from "lodash/debounce";

import moment from "moment";

// Redux
import { getAllActiveIndicatorTypes as getAllIndicatorTypesData } from "../../../../redux/indicatorTypes/indicatorTypesActions";
import {getAllData as getAllIndicatorCategoryData} from "../../../../redux/indicatorCategories/indicatorCategoriesActions";
import {getAllData as getAllIndicatorsData, filterIndicatorsData } from "../../../../redux/indicators/indicatorsActions2";
import { getAllData as getAllOrganizationsData } from "../../../../redux/asian-countries/asianCountriesAction2";
import { useDispatch, useSelector } from "react-redux";

import { Layout, Row, Col, Avatar, Button, Divider, Card, Space, Tag, Form, Select, Input, DatePicker } from "antd";
import {
  RiArrowLeftSLine
} from "react-icons/ri";

import Legends from '../../../../utils/global-components/Legends';
import BreadCrumbs from '../../../../layout/components/content/breadcrumbs';
import FlagIcon from '../../../../utils/global-components/FlagIcon';
import DetailIndicatorsList from './DetailIndicatorsList';
import {legends_list} from '../../../../utils/common';
import DetailForm from "./DetailForm";
const { Sider, Content } = Layout;
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../../utils/LangConstants';
export default function Detail(props) {
  const { pageRoles } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const { key } = useParams();
  const {country, indicator_category, indicator_type, dataStatus, dataIndex, year, organization_id, repository_id, action} = JSON.parse(window.atob(key))
  const [indicator, setIndicator] = useState({});
  const [indicatorIndex, setIndicatorIndex] = useState(dataIndex);
  const [indicatorStatus, setIndicatorStatus] = useState('default');
  const [reloadIndicatorList, setReloadIndicatorList] = useState(false);
  const [form] = Form.useForm();
const [ dataSeletor, setDataSelector ] = useState({
  organization_id,
  indicatorCategory: indicator_category,
  indicatorType:indicator_type,
  year,
  status: dataStatus
}); 
// get values from redux
  const {indicatorType_data} = useSelector((state) => state.indicatorTypes);
  const {indicatorCategory_data} = useSelector((state) => state.indicatorCategories);
  const {indicator_data} = useSelector((state) => state.indicators);
  const {amsData } = useSelector(state => state.ams);
  const { myprofile: {organization, roles}  } = useSelector(state => state.users);
  const {memberState_data} = useSelector((state) => state.asianCountries);

  useEffect(() => {
    dispatch(getAllIndicatorTypesData());
    dispatch(getAllIndicatorCategoryData());
    if(!memberState_data.length){
      dispatch(getAllOrganizationsData());
    }

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
    if(reloadIndicatorList){
      setIndicatorSelector();
    }
  }, [reloadIndicatorList])

  useEffect(() => {
    setIndicatorSelector();
  }, [dataSeletor])

  const statusViewer = () => {
    var stat_data = legends_list.filter((item, i) => { 
        if(item.stat_name == indicatorStatus) 
                  return item
      })[0];
    return (<Tag style={{ marginLeft: '10px' }}color={stat_data?.stat_color}>{stat_data?.stat}</Tag>);
  }

  const setIndicatorSelector = () => {
      var paramsData = {};
      if(dataSeletor?.indicatorCategory != null && typeof dataSeletor?.indicatorCategory == "number"){
        paramsData['category_id'] = dataSeletor?.indicatorCategory;
      }
      if(dataSeletor?.indicatorType != null && typeof dataSeletor?.indicatorType == "number"){
        paramsData['type_id'] = dataSeletor?.indicatorType;
      }
      if(dataSeletor?.status != null && dataSeletor?.status != 'all'){
        paramsData['status'] = dataSeletor?.status;
      }
      if(Object.keys(paramsData).length){
        paramsData['year'] = dataSeletor?.year;
        paramsData['organization_id'] = dataSeletor?.organization_id;
        dispatch(filterIndicatorsData({...paramsData}))
      }else{
        paramsData['year'] = dataSeletor?.year;
        paramsData['organization_id'] = dataSeletor?.organization_id;
        dispatch(getAllIndicatorsData({...paramsData}));
      }
      setReloadIndicatorList(false);
  }


 
  useEffect(() =>{
    form.setFieldsValue({
      indicatorType:indicator_type,
      indicatorCategory:indicator_category,
      status: dataStatus,
      year: moment(`${year}-1-1`)
    })
  }, [form]);

  const setFieldsChanges = (field) => {
    var val = {};
    for (let index = 0; index < Object.keys(field).length; index++) {
      if( Object.keys(field)[index] != 'year'){
        val[Object.keys(field)[index]] =  field[Object.keys(field)[index]];
      }
    }

    setDataSelector(prevState => ({...prevState, ...val}));
  }

 const customise = useSelector(state => state.customise);
  return (
    <>
     <div className="hp-mb-2">
     <Form
      form={form}
      layout="vertical"
      onValuesChange={(_, field) => setFieldsChanges(field)}
      >
        <Row gutter={[5, 5]} justify="space-between">
          <Col md={10} xs={24} span={24}>
              <BreadCrumbs
                breadCrumbActive="Indicator Data Entry"
              />
              <Col>
                    
                    {
                  roles?.includes("system_administrator") ? 
                  (
                    <Select disabled={true} placeholder="Select Country" defaultValue={organization_id} onChange={(e) => {setDataSelector(prevState => ({...prevState, organization_id: e}))}} style={{ width: (window.screen.width > 800 ? "55%" : "100%")}}>
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
                      <h3 style={{marginTop:"10px"}}>{organization?.name}</h3>
                  </Space>
                  )
                }
              </Col>
           </Col>
          <Col md={3} xs={24} span={24}>
            {/* <label>Year <br/><h4 style={{ marginTop:'8px' }}>{year}</h4></label> */}
            <Form.Item name="year" label="Year"
              tooltip ="year the indicator data was reported">
                  <DatePicker picker="year" onChange={(date, dateString) => ( setDataSelector(prevState => ({...prevState, year: moment(dateString).format('Y')})) )} allowClear={false}/>
                </Form.Item>
          </Col>
          <Col md={4} xs={24} span={24}>
              <Form.Item label="Indicator Type" name="indicatorType" rules={[{ required: true, message: 'This is required!' }]}
                tooltip="The classification of nutrition indicators in terms of its importance as a reporting measure defined by ANSS team based on specific criteria. (i.e. Primary Outcome, Intermediate Outcome, Process/Output,  and Others)">
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
              <Form.Item label="Indicator Category" name="indicatorCategory" rules={[{ required: true, message: 'This is required!' }]}
                tooltip="the classification of nutrition indicators based on related forms and causes of malnutrition (e.g. Anthropometry, Micronutrients and Diseases, Dietary and Lifestyle, etc…)">
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
                  ['All', 'Draft', 'Submitted', 'Approved', 'Returned'].map((item, index) => {
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
      <Col md={6} xs={24} span={24}>
        <DetailIndicatorsList year={dataSeletor?.year} setIndicatorIndex={setIndicatorIndex} dataStatus={dataStatus} repository_id={repository_id} setIndicator={setIndicator} indicatorIndex={indicatorIndex} organization_id={organization_id} />
      </Col>
      <Col md={18} xs={24} span={24}>
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
                    <Link to="/data-entry">
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
                <label>Indicator Code: <span style={{ fontWeight: 'bold' }}>{Object.keys(indicator).length ? indicator?.item?.attributes?.code : country}</span></label> 
                {statusViewer()}
              </Col>
              <Col md={24} span={24}>
                <h3>{Object.keys(indicator).length ? indicator?.item?.attributes?.name : country}</h3>
              </Col>
              <Col
                span={24}
                className="hp-profile-content-list hp-mt-8 hp-pb-sm-0 hp-pb-20"
              >
                <p>{Object.keys(indicator).length ? indicator?.item?.attributes?.description : country}</p>
              </Col>
              <Col md={24} span={24}>
                <DetailForm setIndicatorIndex={setIndicatorIndex} setReloadIndicatorList={setReloadIndicatorList} indicatorIndex={indicatorIndex} year={dataSeletor?.year} indicator={indicator} organization_id={organization_id} country={country} action={action}/>
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