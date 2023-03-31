import { useEffect, useState, useCallback } from "react";
import { useParams, Link, useHistory } from "react-router-dom";
import debounce from "lodash/debounce";
// Redux
import { getAllOrganizations } from "../../../redux/organizations/organizationsAction";
import { getAllData as getAllIndicatorTypesData } from "../../../redux/indicatorTypes/indicatorTypesActions";
import {getAllData as getAllIndicatorCategoryData} from "../../../redux/indicatorCategories/indicatorCategoriesActions";
import {getAllData as getAllIndicatorsData, filterIndicatorsData } from "../../../redux/indicators/indicatorsActions2";
import { useDispatch, useSelector } from "react-redux";

import { Layout, Row, Col, Avatar, Button, Divider, Card, Space, Tag, Form, Select, Input } from "antd";
import {
  RiArrowLeftSLine,
} from "react-icons/ri";

import Legends from '../../../utils/global-components/Legends';
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import FlagIcon from '../../../utils/global-components/FlagIcon';
import DetailIndicatorsList from './DetailIndicatorsList';
import DetailForm from "./DetailForm";
const { Sider, Content } = Layout;
// import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../utils/LangConstants';
import {legends_list} from '../../../utils/common';
export default function Detail(props) {
  const { pageRoles } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const { type, parameter } = useParams();
  const {country, indicator_category, indicator_type, year, organization_id} = JSON.parse(window.atob(parameter))
  const [indicator, setIndicator] = useState({});
  const [indicatorIndex, setIndicatorIndex] = useState(0);
  const [indicatorStatus, setIndicatorStatus] = useState('default');

  const [form] = Form.useForm();


// get values from redux
  const {indicatorType_data} = useSelector((state) => state.indicatorTypes);
  const {indicatorCategory_data} = useSelector((state) => state.indicatorCategories);
  const {indicator_data} = useSelector((state) => state.indicators);
  const {amsData } = useSelector(state => state.ams);

  useEffect(() => {
    dispatch(getAllIndicatorTypesData());
    dispatch(getAllIndicatorCategoryData());
  }, [dispatch])

  useEffect(() => {
    if(Object.keys(amsData).length){
      const {attributes, id, types} = amsData?.data;
      setIndicatorStatus( attributes?.status ? attributes?.status : 'default');
    }else{
      setIndicatorStatus('default');
    }
  }, [amsData])

  const statusViewer = () => {
    var stat_data = legends_list.filter((item, i) => { 
        if(item.stat_name == indicatorStatus) 
                  return item
      })[0];
    return (<Tag style={{ marginLeft: '10px' }}color={stat_data?.stat_color}>{stat_data?.stat}</Tag>);
  }

  const setIndicatorSelector = ({indicatorCategory, indicatorType, status}) => {
      var paramsData = {};
      if(indicatorCategory != null && typeof indicatorCategory == "number"){
        paramsData['category_id'] = indicatorCategory;
      }
      if(indicatorType != null && typeof indicatorType == "number"){
        paramsData['type_id'] = indicatorType;
      }
      if(status != null && status != 'all'){
        paramsData['status'] = status;
      }
      if(Object.keys(paramsData).length){
        paramsData['year'] = year;
        paramsData['organization_id'] = organization_id;
        dispatch(filterIndicatorsData({...paramsData}))
      }else{
        dispatch(getAllIndicatorsData());
      }
  }

  useEffect(() => {
    setIndicatorSelector(
      {
        indicatorType:indicator_type,
        indicatorCategory:indicator_category,
        status:'all'
      }
    );
  }, [indicator_type, indicator_category]);
 
  useEffect(() =>{
    form.setFieldsValue({
      indicatorType:indicator_type,
      indicatorCategory:indicator_category,
      status: "all"
    })
  }, [form]);
 const customise = useSelector(state => state.customise);
  return (
    <>
     <div className="hp-mb-2">
     <Form
      form={form}
      layout="vertical"
      onValuesChange={(_, field) => { setIndicatorSelector(field) }}
      >
        <Row gutter={[5, 5]} justify="space-between">
          <Col md={11} xs={24} span={24}>
              <BreadCrumbs
                breadCrumbActive="Data Entry"
              />
              <Col>
                <Space >
                    <Avatar size={window.screen.width > 800 ? 40 : 24} icon={<FlagIcon country={country} />} className="hp-m-auto" />
                    {window.screen.width > 800 ? (<h4>{country}</h4>) : (<h5>{country}</h5>)}
                </Space>
              </Col>
           </Col>
          <Col md={2} xs={24} span={24}>
            <label>Year <br/><h4 style={{ marginTop:'8px' }}>{year}</h4></label>
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
        <DetailIndicatorsList year={year} setIndicatorIndex={setIndicatorIndex} setIndicator={setIndicator} indicatorIndex={indicatorIndex} organization_id={organization_id} />
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
                <DetailForm setIndicatorIndex={setIndicatorIndex} indicatorIndex={indicatorIndex} year={year} indicator={indicator} organization_id={organization_id} country={country}/>
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