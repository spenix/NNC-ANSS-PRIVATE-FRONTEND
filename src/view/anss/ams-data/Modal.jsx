import { Modal, Col, Row, Divider, DatePicker, Form, Button, Select } from "antd";
import { useState, useEffect } from "react";
import moment from "moment";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { getAllData as getAllIndicatorTypesData } from "../../../redux/indicatorTypes/indicatorTypesActions";
import {getAllData as getAllIndicatorCategoryData} from "../../../redux/indicatorCategories/indicatorCategoriesActions";
import { getAllData as getAllOrganizationsData } from "../../../redux/asian-countries/asianCountriesAction2";
import { useHistory } from "react-router-dom";

export default function AddNewAms(props) {
  const { open, toggleSidebar } = props
  const currYear = new Date().getFullYear();
  const [year, setYear] = useState(currYear);
  const [ isSysAdd, setIsSysAdd ] = useState(false);
  const [form] = Form.useForm();
  let history = useHistory();
  // Redux
  const dispatch = useDispatch();
  const {indicatorType_data} = useSelector((state) => state.indicatorTypes);
  const {memberState_data} = useSelector((state) => state.asianCountries);
  const {indicatorCategory_data} = useSelector((state) => state.indicatorCategories);
  const {myprofile} = useSelector((state) => state.users);

    useEffect(() => {
      dispatch(getAllIndicatorTypesData());
      dispatch(getAllIndicatorCategoryData());
      dispatch(getAllOrganizationsData());
    }, [dispatch]);

    useEffect(() => {
      const { roles } = myprofile;
      if(typeof roles == "object")
          setIsSysAdd(roles.includes("system_administrator"));
    }, [myprofile]);

    useEffect(() =>{
      form.setFieldsValue({
        year:"",
        country:null,
        indicator_type:"All",
        indicator_category:"All",
      })
    }, [form]);
  // Form Finish
  const onFinish = (values) => {
    toggleSidebar();
    var parameter = {
      country : isSysAdd ? getCountryName(values.country) : myprofile?.organization?.name,
      organization_id : isSysAdd ? values.country : myprofile?.organization?.party_id,
      year    : year,
      indicator_category : values?.indicator_category ? values?.indicator_category : "All",
      indicator_type : values?.indicator_type ? values?.indicator_type : "All"
    }
    history.push(`/ams-data/detail/encode-data/${ window.btoa(JSON.stringify(parameter)) }`);
  };

  const getCountryName = (orgId) => {
    var data_res = memberState_data.filter(item => {
      return item.id == orgId;
    })
    return data_res[0]?.attributes?.name;
  }

  function onChange(date, dateString) {
    setYear(dateString);
  }
 
  const setCountryField = () => {
    if(isSysAdd)
      return (
        <Col md={24} span={24}>
                <Form.Item name="country" label="Country" rules={[{ required: true, message: 'This is required!' }]}>
                  <Select placeholder="Country">
                    {
                      memberState_data.map(item =>{
                        return (
                          <Select.Option key={item.id} value={item.id}>{item.attributes.name}</Select.Option>
                        )
                      })
                    }
                  </Select>
                </Form.Item>
              </Col>
      );
  }

  return (
    <Modal
      title="ENCODE AMS DATA"
      visible={open}
      onCancel={toggleSidebar}
      footer={null}
      bodyStyle={{ padding: 24 }}
    >
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        name="basic"
        onFinish={onFinish}
      >
        <Row justify="center" align="center" >
              <Col md={24} span={24}>
                <Form.Item name="year" label="Year"   rules={[{ required: true, message: 'This is required!' }]}>
                  <DatePicker picker="year" onChange={onChange}/>
                </Form.Item>
              </Col>
               {setCountryField()}
              <Col md={24} span={24}>
              <Form.Item name="indicator_type" label="Indicator Type" rules={[{ required: false, message: 'This is required!' }]}>
                  <Select  
                  placeholder="Indicator Type"
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
             
              <Col md={24} span={24}>
                <Form.Item name="indicator_category" label="Indicator Category" rules={[{ required: false, message: 'This is required!' }]}>
                  <Select 
                  showSearch
                  placeholder="Indicator Category"
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
          <Divider />
          <Col span={24}>
            <Button
              type="primary"
              htmlType="submit"
              block
            >
              START ENCODE AMS DATA
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};