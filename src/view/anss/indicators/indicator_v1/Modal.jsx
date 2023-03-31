import { Modal, Col, Row, Divider, Input, Form, Button, Select } from "antd";
import { useState, useEffect, useRef } from "react";
// Redux
import { useDispatch, useSelector } from "react-redux";
import { addIndicator, createIndicator } from "../../../redux/indicators/indicatorsActions";

import { getAllData as getAllIndicatorTypes } from "../../../redux/indicatorTypes/indicatorTypesActions";
import { getAllData as getAllIndicatorCategory } from "../../../redux/indicatorCategories/indicatorCategoriesActions";
import { getAllForTblData } from "../../../redux/dataSources/dataSourcesActions";

export default function AddNewIndicator(props) {
  const { open, toggleSidebar, modalAction, indicatorSelected} = props;
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [fields, setFields] = useState([
    {
      name: ['code'],
      value: '',
    },
    {
      name: ['name'],
      value: '',
    },
    {
      name: ['decription'],
      value: '',
    },
  ]);
  // Redux
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const { indicatorType_data } = useSelector(state => state.indicatorTypes);
  const indicatorCategories = useSelector(state => state.indicatorCategories);
  // const { allDataSources } = useSelector(state => state.dataSources);
  var allIndicatorCategories = indicatorCategories?.indicatorCategory_data ? indicatorCategories?.indicatorCategory_data : [];
  useEffect(() => {
      dispatch(getAllIndicatorTypes());
      dispatch(getAllIndicatorCategory());
      dispatch(getAllForTblData({limit:25}));
      setFields([
        {
          name: ['code'],
          value: modalAction.toLowerCase() == "edit" ? indicatorSelected.code : "",
        },
        {
          name: ['name'],
          value: modalAction.toLowerCase() == "edit" ? indicatorSelected.name : "",
        },
        {
          name: ['description'],
          value: modalAction.toLowerCase() == "edit" ? indicatorSelected.description : "",
        },
      ]);
  }, [modalAction, indicatorSelected, dispatch])
  // Form Finish
  const onFinish = (values) => {
    // toggleSidebar();
    setLoadingBtn(true);
    dispatch(
      createIndicator({
        type_id: values.indicator_type,
        category_id : values.indicator_category,
        code: values.code,
        name: values.name,
        description: values.description,
        frequency: values?.frequency ? values?.frequency : "" ,
        datatype:  values.datatype,
        is_active: true
      })
    )
    .then(() => {
      toggleSidebar();
      setLoadingBtn(true);
      // fetch(pagination);
      clearFormValue();
    })
    .catch((e) => {
      // setLoadAddUserBtn(false);
    });
    
    // alert("Under Development");
    // dispatch(
    //   addIndicator({
    //     id:indicatorSelected?.key,
    //     code: values.code,
    //     name: values.name,
    //     decription: values.description
    //   })
    // );
  };

  const clearFormValue = () => {
    form.setFieldsValue({
      code: "",
      name: "",
      description: "",
      indicator_type: "",
      indicator_category: "",
      frequency: "",
      datatype: ""
    });
  }

  const onChange = (newFields) => {
    setFields(newFields);
  }
  return (
    <Modal
      title={modalAction+" Indicator"}
      visible={open}
      onCancel={toggleSidebar}
      footer={null}
      bodyStyle={{ padding: 24 }}
    >
      <Form
        form={form}
        layout="vertical"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        fields={fields}
        onFieldsChange={(_, allFields) => {
          onChange(allFields);
        }}
      >
        <Row gutter={[8, 0]}>
          <Col span={24}>
            <Form.Item name="code" label="Code" rules={[{ required: true, message: 'This is required!' }]}>
              <Input  />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="name" label="Indicator Name" rules={[{ required: true, message: 'This is required!' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="description" label="Decription">
              <Input.TextArea />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="indicator_type" label="Type">
              <Select placeholder="Type">

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

          <Col span={24}>
            <Form.Item name="indicator_category" label="Category">
              <Select placeholder="Category">
                  {
                      allIndicatorCategories.map(item =>{
                        return (
                          <Select.Option key={item.id} value={item.id}>{item?.attributes?.name}</Select.Option>
                        )
                      })
                    }
                  
                </Select>
            </Form.Item>
          </Col>

          {/* <Col span={24}>
            <Form.Item name="frequency" label="Frequency" rules={[{ required: true, message: 'This is required!' }]}>
              <Input />
            </Form.Item>
          </Col> */}

          <Col span={24}>
            <Form.Item name="datatype" label="Data Type" rules={[{ required: true, message: 'This is required!' }]}>
              <Input />
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="data_sources" label="Data Sources">
              <Select placeholder="Data Sources">
                {
                  allIndicatorCategories.map(item =>{
                    return (
                      <Select.Option key={item.id} value={item.id}>{item?.attributes?.name}</Select.Option>
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
              {modalAction}
            </Button>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};