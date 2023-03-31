import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, notification, Space, Switch } from "antd";

// for Redux imports
import { getAllData, getPolicyStatusData, editPolicyStatusData, addPolicyStatusData } from "../../../redux/policy-status/policyStatusActions";
import { useDispatch, useSelector } from "react-redux";

import {RiArrowLeftSLine} from "react-icons/ri";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD, UPDATED_DATA, ADD_DATA} from '../../../utils/LangConstants';
import {callNotif} from '../../../utils/global-functions/minor-functions';
const Details = (props) => {
    const {pageRoles} = props;
    var actions = ["add-data", "edit-data", "view-data"];
    const history = useHistory();
    const [loadAddUserBtn, setLoadAddUserBtn] = useState(false);
    const [pageAction, setPageAction] = useState("");
    const [isDataFetched, setIsDataFetched] = useState(false);
    const {formAction, id} =  useParams();
    const [policyStatusId, setPolicyStatusId] = useState();
    const [dataStatus, setDataStatus] = useState(true);
    const [form] = Form.useForm();
    const [fields, setFields] = useState([
        {
          name: ['custodian'],
          value: "",
        },
        {
            name: ['status'],
            value: dataStatus,
        },
      ]);


      
    const dispatch = useDispatch();
    const {policyStatus_data, policyStatus_links, policyStatus_meta, policyStatus_details, status, message} = useSelector((state) => state.policyStatus);

    useEffect(() => {
        errMsg();
      }, [status]);
    
      const clearErrMessage = () => {
        dispatch({
            type: 'SET_POLICY_STATUS_DATA_MESSAGE',
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
            return item == formAction;
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
                history.push('/policy-statuses');
            }else{
                if(formAction != "add-data"){
                    setPolicyStatusId(window.atob(id));
                }
            }
        }, 1000);
        dispatch(getAllData());
    }, [id]);


    useEffect(() => {
        if(policyStatusId){
            dispatch(getPolicyStatusData({}, policyStatusId))
            .then(() =>{
                setIsDataFetched(true);
            });
            getDataDetails();
        }
    }, [policyStatusId]);


    const onChangeStatus = (checked) => {
        setDataStatus(checked)
      }
    const getDataDetails = () => {
        setFields([
              {
                name: ['display_name'],
                value: policyStatus_details?.attributes?.display_name,
              }
        ]);

        setDataStatus(policyStatus_details?.attributes?.is_active);
        setIsDataFetched(false);
    }
    
    const onFinish = (values) => {
        var params = {
            display_name:values.display_name,
            is_active: values.status
        }
        setLoadAddUserBtn(true);
        if(formAction == "add-data")
            if(pageRoles.includes(ACTION_ADD)){
                dispatch(addPolicyStatusData(params)).then(() => {
                    setLoadAddUserBtn(false);
                    openNotificationWithIcon('success', "Success", `Policy Status ${ADD_DATA}`);
                    onCancelAction();
                }).catch((e) => {
                    errMsg();
                });
            }else{
              openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have ${ACTION_ADD} permission.`);
            }
            
        if(formAction == "edit-data")
            if(pageRoles.includes(ACTION_EDIT)){
                dispatch(editPolicyStatusData(params, policyStatusId))
                .then(() =>{
                    setLoadAddUserBtn(false);
                    openNotificationWithIcon('success', "Success", `Policy Status ${UPDATED_DATA}`);
                    setIsDataFetched(true);
                }).catch((e) => {
                    errMsg();
                });
            }else{
              openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have ${ACTION_EDIT} permission.`);
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
                    breadCrumbActive={formAction == 'add-data' ? "Add Policy Status" : formAction == 'edit-data' ? "Edit Policy Status" : "View Policy Status"}
                />
           </Col>
            <Col md={9} xs={24} span={24} align="end">
                <Link to="/policy-statuses">
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
         <Card style={cardStyle}>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="display_name"
                            label="Status Name"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input placeholder="Enter Policy Status" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item name="status" label="Status: Is Active?" >
                            <Switch  checked={dataStatus} onChange={onChangeStatus} />
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