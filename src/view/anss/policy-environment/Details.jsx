import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, notification, Space, Switch, Select } from "antd";

// for Redux imports
import { addPolicyEnvironmentData, getPolicyEnvironmentData, editPolicyEnvironmentData } from "../../../redux/policy-environment/policyEnvironmentActions";
import { getAllData } from "../../../redux/policy-classification/policyClassificationActions";
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
    const [environmentId, setEnvironmentId] = useState();
    const [dataStatus, setDataStatus] = useState(true);
    const [form] = Form.useForm();
    const [fields, setFields] = useState([
        {
            name: ['status'],
            value: dataStatus,
        },
      ]);

    const dispatch = useDispatch();
    const {policyEnvironment_data, policyEnvironment_links, policyEnvironment_meta, policyEnvironment_details, status, message} = useSelector((state) => state.policyEnvironment);
    const {classification_data} = useSelector((state) => state.policyClassification);

    useEffect(() => {
        errMsg();
      }, [status]);
    
      const clearErrMessage = () => {
        dispatch({
            type: 'SET_ENVIRONMENT_DATA_MESSAGE',
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
                history.push('/policy-environment');
            }else{
                if(formAction != "add-data"){
                    setEnvironmentId(window.atob(id));
                }
            }
        }, 1000);
        // dispatch(getAllData());
    }, [id]);


    useEffect(() => {
        if(environmentId){
            dispatch(getPolicyEnvironmentData({}, environmentId))
            .then(() =>{
                setIsDataFetched(true);
            });
            // getDataDetails();
            dispatch(getAllData());
        }
    }, [environmentId]);


    const onChangeStatus = (checked) => {
        setDataStatus(checked)
      }
    const getDataDetails = () => {
        setFields([
              {
                name: ['classification_id'],
                value: policyEnvironment_details?.attributes?.classification?.id,
              },
              {
                name: ['indicator'],
                value: policyEnvironment_details?.attributes?.indicator,
              },
              {
                name: ['url_global'],
                value: policyEnvironment_details?.attributes?.url_global,
              },
            //   {
            //       name: ['status'],
            //       value:  policyEnvironment_details?.attributes?.is_active,
            //   },
        ]);
        setIsDataFetched(false);
    }

    const onFinish = (values) => {
        var params = {
            classification_id: values.classification_id,
            indicator: values.indicator,
            url_global: values.url_global,
            // is_active: values.status
        }
        setLoadAddUserBtn(true);
        if(formAction == "add-data")
            if(pageRoles.includes(ACTION_ADD)){
                dispatch(addPolicyEnvironmentData(params)).then(() => {
                    setLoadAddUserBtn(false);
                    openNotificationWithIcon('success', "Success", `Policy Environment ${ADD_DATA}`);
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
                    dispatch(editPolicyEnvironmentData(params, environmentId))
                    .then(() =>{
                        setLoadAddUserBtn(false);
                        openNotificationWithIcon('success', "Success", `Policy Environment ${UPDATED_DATA}`);
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
         <Row gutter={[32, 32]} justify="space-between">
            <Col md={15} xs={24} span={24}>
            <BreadCrumbs
                breadCrumbActive="Policy Environment"
            />
            </Col>
            <Col md={9} xs={24} span={24} align="end">
               <Link to="/policy-environment">
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
         <Card title={pageAction+" Policy Environment"} bordered={false}  style={cardStyle}>
                <Row className="flex justify-start ">
                <Col span={24} md={16}>
                        <Form.Item
                            name="classification_id"
                            label="Policy Classification"
                            rules={[{ required: true, message: 'This is required!' }]}
                            
                        >
                                <Select placeholder="Select Policy Classification" disabled={formAction == "view-data" ? true : false}>
                                    {
                                        classification_data.map((item) => {
                                            return <Select.Option key={item.id} value={item.id}>{item.attributes.section}</Select.Option>
                                        })
                                    }
                                </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item
                            name="indicator"
                            label="Policy Indicator"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input placeholder="Enter Policy Indicator"  readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item
                            name="url_global"
                            label="URL"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input placeholder="Enter URL"  readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                    {/* <Col span={24} md={12}>
                        <Form.Item name="status" label="Status: Is Active?" >
                            <Switch  checked={dataStatus} onChange={onChangeStatus}  disabled={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col> */}
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