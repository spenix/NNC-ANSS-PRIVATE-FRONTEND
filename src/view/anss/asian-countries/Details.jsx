import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, notification, Space, Switch } from "antd";

// for Redux imports
import { addMemberStateData, getMemberStateData, editMemberStateData, queryDataList } from "../../../redux/asian-countries/asianCountriesAction2";
import { useDispatch, useSelector } from "react-redux";

import {RiArrowLeftSLine} from "react-icons/ri";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../utils/LangConstants';
import {callNotif} from '../../../utils/global-functions/minor-functions';
const Details = (props) => {
    const {pageRoles} = props;
    var actions = [{action_name: "add-data", action:"Add"}, {action_name: "edit-data", action:"Edit"}, {action_name: "view-data", action:"View"}];
    const history = useHistory();
    const [loadBtn, setLoadBtn] = useState(false);
    const [pageAction, setPageAction] = useState("");
    const [isDataFetched, setIsDataFetched] = useState(false);
    const {formAction, id} =  useParams();
    const [countryId, setCountryId] = useState();
    const [dataStatus, setDataStatus] = useState(true);
    const [fields, setFields] = useState([]);
    const [form] = Form.useForm();

    const dispatch = useDispatch();
    const {memberState_data, memberState_links, memberState_meta, memberState_details, status, message} = useSelector((state) => state.asianCountries);

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
                history.push('/countries');
            }else{
                if(formAction != "add-data"){
                    setCountryId(window.atob(id));
                }
            }
        }, 1000);
        // dispatch(getAllData());
    }, [id]);


    useEffect(() => {
        if(countryId){
            dispatch(getMemberStateData({}, countryId))
            .then(() =>{
                setIsDataFetched(true);
            });
            // getDataDetails();
        }
    }, [countryId]);

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
                clearErrMessage();
            }
           
        }
    }
    
    const clearErrMessage = () => {
        dispatch({
            type: 'SET_MEMBER_STATE_DATA_MESSAGE',
            status: '',
            msg: '',
        });
    }

    const onChangeStatus = (checked) => {
        setDataStatus(checked)
    }

    const getDataDetails = () => {
        setFields([
            {
            name: ['member_state'],
            value: memberState_details?.attributes?.name,
            },
            {
            name: ['unsd'],
            value: memberState_details?.attributes?.unsd,
            },
            {
            name: ['iso_alpha'],
            value: memberState_details?.attributes?.iso_alpha,
            }
        ]);
        setDataStatus(memberState_details?.attributes?.is_active);
        setIsDataFetched(false);
    }

    const onFinish = (values) => {
        var params = {
            name:values.member_state,
            unsd:values.unsd,
            iso_alpha:values.iso_alpha,
            is_active: dataStatus
        }
        setLoadBtn(true);
        if(formAction == "add-data")
            if(pageRoles.includes(ACTION_ADD)){
                dispatch(addMemberStateData(params)).then(() => {
                    setLoadBtn(false);
                    openNotificationWithIcon('success', "Success", "Member state is added successfully.");
                    onCancelAction();
                }).catch(error => {
                    setLoadBtn(false);
                    errMsg();
                })
            }else{
                openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have ${ACTION_ADD} permission.`);
                setLoadBtn(false);
            }
        if(formAction == "edit-data")
            if(pageRoles.includes(ACTION_EDIT)){
                dispatch(editMemberStateData(params, countryId))
                .then(() =>{
                    setLoadBtn(false);
                    openNotificationWithIcon('success', "Success", "Member state is updated successfully.");
                    setIsDataFetched(true);
                }).catch(error => {
                    setLoadBtn(false);
                    errMsg();
                })
            }else{
                openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have ${ACTION_EDIT} permission.`);
                setLoadBtn(false);
            }
    }       

    const onCancelAction = () => {
        form.resetFields([
            'member_state',
            'unsd',
            'iso_alpha',
            'status',
          ]);
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
                             loading={loadBtn}
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
      fields={fields}
      form={form}
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
                // breadCrumbParent="Maintenance"
               breadCrumbActive="Member State"
           />
         </Col>
           
            <Col md={9} xs={24} span={24} align="end">
               <Link to="/countries">
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
         <Card title={pageAction+" Member State"} bordered={false}  style={cardStyle}>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="member_state"
                            label="Member State"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input placeholder="Enter Member State"  readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item
                            name="unsd"
                            label="UNSD"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input placeholder="Enter UNSD"  maxLength="5" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item
                            name="iso_alpha"
                            label="ISO Alpha"
                            
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input placeholder="Enter ISO Alpha" maxLength="5" readOnly={formAction == "view-data" ? true : false}/>
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