import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, notification, Space, Switch } from "antd";

// for Redux imports
import { addIndicatorTypeData, getIndicatorTypeData, editIndicatorTypeData } from "../../../redux/indicatorTypes/indicatorTypesActions";
import { useDispatch, useSelector } from "react-redux";

import {RiArrowLeftSLine} from "react-icons/ri";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD, UPDATED_DATA, ADD_DATA} from '../../../utils/LangConstants';
import {callNotif} from '../../../utils/global-functions/minor-functions';
import { useForm } from "react-hook-form";
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
    const [fields, setFields] = useState([
        {
            name: ['status'],
            value: dataStatus,
        },
      ]);

    const dispatch = useDispatch();
    const {indicatorType_data, indicatorType_links, indicatorType_meta, indicatorType_details, status, message} = useSelector((state) => state.indicatorTypes);

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
                history.push('/indicator-types');
            }else{
                if(formAction != "add-data"){
                    setIndicatorTypeId(window.atob(id));
                }
            }
        }, 1000);
        // dispatch(getAllData());
    }, [id]);

    useEffect(() => {
        errMsg();
    }, [status]);

    const clearErrMessage = () => {
        dispatch({
            type: 'SET_INDICATOR_TYPE_DATA_MESSAGE',
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

    useEffect(() => {
        if(indicatorTypeId){
            dispatch(getIndicatorTypeData({}, indicatorTypeId))
            .then(() =>{
                setIsDataFetched(true);
            });
            // getDataDetails();
        }
    }, [indicatorTypeId]);


    const onChangeStatus = (checked) => {
        setDataStatus(checked)
      }
    const getDataDetails = () => {
        setFields([
              {
                name: ['indicator_type'],
                value: indicatorType_details?.attributes?.name,
              },
              {
                name: ['description'],
                value: indicatorType_details?.attributes?.description,
              },
              {
                  name: ['status'],
                  value:  indicatorType_details?.attributes?.is_active,
              },
        ]);
        setDataStatus(indicatorType_details?.attributes?.is_active)
        setIsDataFetched(false);
    }

    const onFinish = (values) => {
        setLoadAddUserBtn(true);
        if(formAction == "add-data")
            if(pageRoles.includes(ACTION_ADD)){
                dispatch(addIndicatorTypeData({
                    name:values.indicator_type,
                    description:values.description,
                    is_active: values.status
                })).then(() => {
                    setLoadAddUserBtn(false);
                    openNotificationWithIcon('success', "Success", `Indicator Type ${ADD_DATA}`);
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
                dispatch(editIndicatorTypeData({
                    name:values.indicator_type,
                    description:values.description,
                    is_active: values.status
                }, indicatorTypeId))
                .then(() =>{
                    setLoadAddUserBtn(false);
                    openNotificationWithIcon('success', "Success", `Indicator Type ${UPDATED_DATA}`);
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
      fields={fields}
      layout="vertical"
      onFieldsChange={(_, allFields) => {
        setFields(allFields);
      }}
      onFinish={onFinish}
    >
        <div className="hp-mb-10">
         <Row gutter={[16, 16]} justify="space-between">
            <Col md={15} xs={24} span={24}>
            <BreadCrumbs
                    breadCrumbParent="Maintenance"
                breadCrumbActive="Indicator Type"
            />
            </Col>
            <Col md={9} xs={24} span={24} align="end">
               <Link to="/indicator-types">
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
         <Card title={pageAction+" Indicator Type"} bordered={false}  style={cardStyle}>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="indicator_type"
                            label="Indicator Type"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input placeholder="Enter Indicator Type" readOnly={formAction == "view-data" ? true : false}/>
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
                    <Col span={24} md={12}>
                        <Form.Item name="status" label="Status: Is Active?" >
                            <Switch  checked={dataStatus} onChange={onChangeStatus} disabled={formAction == "view-data" ? true : false}/>
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