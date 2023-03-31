import { useState, useEffect, useMemo } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, notification, Space, Switch, Select  } from "antd";

// for Redux imports
import { getAllData, addIndicatorData, getIndicatorData, editIndicatorData, getAllDataTypes } from "../../../redux/indicators/indicatorsActions2";
import { getAllData as getAllIndicatorTypes} from "../../../redux/indicatorTypes/indicatorTypesActions";
import { getAllData as getAllIndicatorCategories} from "../../../redux/indicatorCategories/indicatorCategoriesActions";
import { getAllData as getAllDataSourceTypes } from "../../../redux/dataSourceTypes/dataSourceTypesActions";


import { useDispatch, useSelector } from "react-redux";

import {RiArrowLeftSLine} from "react-icons/ri";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD, UPDATED_DATA, ADD_DATA} from '../../../utils/LangConstants';
import {callNotif} from '../../../utils/global-functions/minor-functions';
const Details = (props) => {
    const {pageRoles} = props;
    var actions = [{action_name: "add-data", action:"Add"}, {action_name: "edit-data", action:"Edit"}, {action_name: "view-data", action:"View"}];
    const history = useHistory();
    const [loadAddUserBtn, setLoadAddUserBtn] = useState(false);
    const [pageAction, setPageAction] = useState("");
    const [isDataFetched, setIsDataFetched] = useState(false);
    const {formAction, id} =  useParams();
    const [indicatorTypeId, setIndicatorTypeId] = useState();
    const [dataStatus, setDataStatus] = useState(true);
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const {indicator_details, data_types, status, message} = useSelector((state) => state.indicators);
    const {indicatorType_data} = useSelector((state) => state.indicatorTypes);
    const {indicatorCategory_data} = useSelector((state) => state.indicatorCategories);
    const {dataSourceType_data} = useSelector((state) => state.dataSourceTypes);

    function isBase64(str) {
        if (str ==='' || str.trim() ===''){ return false; }
        try {
            return window.btoa(window.atob(str)) == str;
        } catch (err) {
            return false;
        }
    }
    const checkFormAction = () => {
        var count = actions.filter(item => {
             if(item.action_name == formAction)
                      setPageAction(item.action)
                      return item
        }).length;
        return count ? true : false
    } 

    const openNotificationWithIcon = (type, title = "", msg = "") => {
        callNotif(title, msg, type);
      };
    
    // component useEffects();
    useEffect(() => {
        setTimeout(() => {
            if(isBase64(id) == false || checkFormAction() != true){
                history.push('/indicators');
            }else{
                if(formAction != "add-data"){
                    setIndicatorTypeId(window.atob(id));
                }
            }
        }, 1000);
    }, [id]);

    useMemo(() => {
        dispatch(getAllIndicatorTypes());
        dispatch(getAllIndicatorCategories());
        dispatch(getAllDataTypes());
        dispatch(getAllDataSourceTypes());
    }, [id]);

    useEffect(() => {
        if(indicatorTypeId){
            dispatch(getIndicatorData({}, indicatorTypeId))
            .then(() =>{
                setIsDataFetched(true);
            });
        }else{
              form.setFieldsValue({status:true});
        }
    }, [indicatorTypeId, form]);
    

    useEffect(() => {
        errMsg();
    }, [status]);

    const clearErrMessage = () => {
        dispatch({
            type: 'SET_INDICATOR_DATA_MESSAGE',
            status: '',
            msg: '',
        });
    }

    const errMsg = () => {
        if(typeof status == "string" && status == "error"){
            if(message != "") {
                if(typeof message == "object"){
                  message.forEach(item => {
                      openNotificationWithIcon(status, "Error", item)
                  });
                }else{
                    openNotificationWithIcon(status, "Error", message)
                }
              }
              clearErrMessage();
        }
    }

    const onChangeStatus = (checked) => {
        setDataStatus(checked)
      }

    const getDataDetails = () => {
        console.log(indicator_details);
        var data_sources = [];
        if(typeof indicator_details?.attributes?.data_source_types == "object"){
            for (let index = 0; index < indicator_details?.attributes?.data_source_types.length; index++) {
                data_sources.push(indicator_details?.attributes?.data_source_types[index].id);
            }
        }
        form.setFieldsValue({
            code: indicator_details?.attributes?.code,
            indicator_name: indicator_details?.attributes?.name,
            description:indicator_details?.attributes?.description,
            indicator_type:indicator_details?.attributes?.type?.id,
            indicator_category: indicator_details?.attributes?.category?.id,
            datatype:indicator_details?.attributes?.datatype,
            frequency:indicator_details?.attributes?.frequency,
            data_sources,
        });
        setDataStatus(indicator_details?.attributes?.is_active);
        setIsDataFetched(false);
    }

    const onFinish = (values) => {
        var params = {
            code: values.code,
            name:values.indicator_name,
            description:values.description,
            frequency:values.frequency,
            datatype:values.datatype,
            datasource_types:values.data_sources,
            type_id:values.indicator_type,
            category_id:values.indicator_category,
            is_active: values.status,
            wha_gnmf_flag: false,
            sdg_flag: false,
            afnsr_flag: false,
        }
        setLoadAddUserBtn(true);
        if(formAction == "add-data")
            if(pageRoles.includes(ACTION_ADD)){
                dispatch(addIndicatorData(params)).then(() => {
                    setLoadAddUserBtn(false);
                    openNotificationWithIcon('success', "Success", `Indicator repository ${ADD_DATA}`);
                    onCancelAction();
                }).catch((e) => {
                    errMsg();
                });
            }else{
                openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have ${ACTION_ADD} permission.`);
                setLoadAddUserBtn(false);
            }
            
        if(formAction == "edit-data")
            if(pageRoles.includes(ACTION_EDIT)){
                dispatch(editIndicatorData(params, indicatorTypeId))
                .then(() =>{
                    setLoadAddUserBtn(false);
                    openNotificationWithIcon('success', "Success", `Indicator repository ${UPDATED_DATA}`);
                    setIsDataFetched(true);
                }).catch((e) => {
                    errMsg();
                });
            }else{
                openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have ${ACTION_EDIT} permission.`);
                setLoadAddUserBtn(false);
            }
    }       

    const onCancelAction = () => {
        form.resetFields();
        setDataStatus(true)
    }

    const btnActions = () => {
        if(formAction != "view-data")
            return (
                <Row justify="end" align="middle">
                    <Col span={24} md={24}>
                        <Space>
                            <Button onClick={onCancelAction}>Clear</Button>
                            {/* <Button type="primary"  className="hp-bg-warning-1">Save & Add Another</Button> */}
                            <Button 
                             loading={loadAddUserBtn}
                             type="primary"
                             htmlType="submit"
                             block
                            >Save</Button>
                        </Space>
                    </Col>
                </Row>
            );
    }

    if(isDataFetched) {
        getDataDetails();
    }
    // inline css
    const cardStyle = { width: "100%", margin: "10px 0 10px 0", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }
    
    return ( 
    <>
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
        <div className="hp-mb-10">
         <Row gutter={[16, 16]} justify="space-between">
            <Col md={15} xs={24} span={24}>
                <BreadCrumbs
                        breadCrumbParent="Maintenance"
                    breadCrumbActive="Indicator Repository"
                />
            </Col>
            <Col md={9} xs={24} span={24} align="end">
               <Link to="/indicators">
                             <Button
                             type="text"
                             shape="square"
                             style={{backgroundColor:"#F0F8FF"}}
                             ><RiArrowLeftSLine size={24} />Return</Button>
                         </Link>
           </Col>
         </Row>
       </div>
       <Row justify="space-between" gutter={[16, 16]} style={{padding:"10px"}}>
         <Col span={24} md={24}>
         <Card title={pageAction+" Indicator Repository"} bordered={false}  style={cardStyle}>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item name="code" label="Code" rules={[{ required: true, message: 'This is required!' }]}>
                            <Input  placeholder="Enter Code"/>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item name="indicator_name" label="Indicator Name" rules={[{ required: true, message: 'This is required!' }]}>
                            <Input placeholder="Indicator Name"/>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input.TextArea showCount maxLength={1000} rows={4} placeholder="Description" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item name="indicator_type" label="Indicator Type" rules={[{ required: true, message: 'This is required!' }]}>
                        <Select placeholder="Select Indicator Type">

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
                    <Col span={24} md={16}>
                        <Form.Item name="indicator_category" label="Indicator Category" rules={[{ required: true, message: 'This is required!' }]}>
                            <Select placeholder="Select Indicator Category">
                                {
                                    indicatorCategory_data.map(item =>{
                                        return (
                                        <Select.Option key={item.id} value={item.id}>{item?.attributes?.name}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item name="datatype" label="Data Type" rules={[{ required: true, message: 'This is required!' }]}>
                        <Select placeholder="Select Data Type">
                                {
                                    data_types.map(item =>{
                                        return (
                                        <Select.Option key={item.id} value={item?.attributes?.name}>{item?.attributes?.name}</Select.Option>
                                        )
                                    })
                                }
                        </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item name="frequency" label="Frequency / Collection Period" rules={[{ required: true, message: 'This is required!' }]}>
                            <Input  placeholder="Enter Frequency / Collection Period"/>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item name="data_sources" label="Data Source Type" rules={[{ required: true, message: 'This is required!' }]}>
                            <Select placeholder="Select Data Source Type" mode="multiple">
                            {
                                    dataSourceType_data.map(item =>{
                                        return (
                                        <Select.Option key={item.id} value={item.id}>{item?.attributes?.name}</Select.Option>
                                        )
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item name="status" label="Status: Is Active?">
                            <Switch  checked={dataStatus}  onChange={onChangeStatus} disabled={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                    
                </Row>
               
               {btnActions()}
                  
            </Card>
         </Col>
       </Row>
       </Form>
     </>
     );
}
 
export default Details;