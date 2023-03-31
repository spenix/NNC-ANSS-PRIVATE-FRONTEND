import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, notification, Space, Upload } from "antd";

// for Redux imports
import { addUserTemplateData, getUserTemplateData, editUserTemplateData } from "../../../redux/userTemplate/userTemplateActions";
import { useDispatch, useSelector } from "react-redux";

import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import {RiArrowLeftSLine} from "react-icons/ri";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../utils/LangConstants';
import {createFile, callNotif} from '../../../utils/global-functions/minor-functions';
const Details = (props) => {
    const {pageRoles} = props;
    var actions = [{action_name: "add-data", action:"Add"}, {action_name: "edit-data", action:"Edit"}, {action_name: "view-data", action:"View"}];
    const history = useHistory();
    const [loadAddUserBtn, setLoadAddUserBtn] = useState(false);
    const [pageAction, setPageAction] = useState("");
    const [isDataFetched, setIsDataFetched] = useState(false);
    const {formAction, id} =  useParams();
    const [userTemplateId, setUserTemplateId] = useState();
    const [btnStatus, setBtnStatus] = useState("");
    const [form] = Form.useForm();
    const [dataFileSource, setDataFileSource] = useState({})

    const dispatch = useDispatch();
    const {userTemplate_data, userTemplate_links, userTemplate_meta, userTemplate_details, status, message} = useSelector((state) => state.userTemplate);

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
                history.push('/manual');
            }else{
                if(formAction != "add-data"){
                    setUserTemplateId(window.atob(id));
                }
            }
        }, 1000);
        // dispatch(getAllData());
    }, [id]);

    useEffect(() => {
        onCancelAction();
    }, [form]);

    useEffect(() => {
        if(userTemplateId){
            dispatch(getUserTemplateData({}, userTemplateId))
            .then(() =>{
                setIsDataFetched(true);
            });
            // getDataDetails();
        }
    }, [userTemplateId]);

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
        }
    }
    const getCreatedFile = (url, fileType) => {
        if(url){
            createFile(url).then(response => {
                if(response)
                    setDataFileSource(prevState => ({ ...prevState, [fileType.toLowerCase()]: response }))
            })
        }
    }   
    const getDataDetails = () => {
        if(Object.keys(userTemplate_details).length){
            const {attributes, id} = userTemplate_details;
            getCreatedFile(attributes?.document_url,"Document");
            form.setFieldsValue({
                description: attributes?.description,
                document_url: attributes?.document_url ? [{url: attributes?.document_url, name: "Document"}] : []
            });
        }
        setIsDataFetched(false);
    }

    const onFinish = (values) => {
        var formData = new FormData();
        var params = {
            data:
                {
                    type:'templates',
                    attributes:{
                        description:values.description,
                    }
                }
            }
        formData.append("body", JSON.stringify(params));
        formData.append("document_url", values?.document_url.length ? values?.document_url[0]?.originFileObj ? values?.document_url[0]?.originFileObj : (dataFileSource['document'] ? dataFileSource['document'] : null): null);
        setLoadAddUserBtn(true);
        if(formAction == "add-data")
            if(pageRoles.includes(ACTION_ADD)){
                dispatch(addUserTemplateData(formData)).then(() => {
                    setLoadAddUserBtn(false);
                    openNotificationWithIcon('success', "Success", "User Template was added successfully.");
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
                dispatch(editUserTemplateData(formData, userTemplateId))
                .then(() =>{
                    setLoadAddUserBtn(false);
                    openNotificationWithIcon('success', "Success", "User Template was updated successfully.");
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
    }

    const btnActions = () => {
        if(formAction != "view-data")
            return (
                <Row justify="end" align="middle">
                    <Col span={24} md={24}>
                        <Space>
                            <Button onClick={onCancelAction}>Clear</Button>
                            {/* <Button type="primary"  className="hp-bg-warning-1">Save & Add Another</Button> */}
                            {/* <Button 
                             loading={loadAddUserBtn == true && btnStatus == "draft"}
                             className="hp-bg-info-1 hp-border-color-info-1 hp-hover-bg-info-2 hp-hover-border-color-info-2"
                             type="primary"
                             htmlType="submit"
                             block
                             onClick={() => {setBtnStatus('draft')}}
                            >Save as Draft</Button> */}
                            <Button 
                             loading={loadAddUserBtn == true && btnStatus == "submitted"}
                             type="primary"
                             htmlType="submit"
                             block
                             onClick={() => {setBtnStatus('submitted')}}
                            >Save</Button>
                        </Space>
                    </Col>
                </Row>
            );
    }

    if(isDataFetched) {
        getDataDetails();
    }

    const normFile = (e) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e?.fileList;
      };

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
                        // breadCrumbParent="Maintenance"
                    breadCrumbActive="Indicator Data Templates"
                />
            </Col>
            <Col md={9} xs={24} span={24} align="end">
               <Link to="/templates">
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
         <Card title={pageAction+" Indicator Data Template"} bordered={false}  style={cardStyle}>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input.TextArea showCount maxLength={200} 
                                placeholder="Enter Description" 
                                disabled={formAction == "view-data" ? true : false}
                                />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item label="Document" extra={"Upload document must be in .xlsx or .xls file type up to 15 MB."}>
                            <Form.Item name="document_url" valuePropName="fileList" getValueFromEvent={normFile}  rules={[{ required: true, message: 'This is required!' }]}>
                            <Upload name="logo" action="/upload.do" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" showUploadList={{showRemoveIcon:formAction != "view-data"}}  listType="picture" maxCount={1}>
                                {
                                    formAction != "view-data" ? (
                                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                                    ) : ""
                                }
                            </Upload>
                            </Form.Item>
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