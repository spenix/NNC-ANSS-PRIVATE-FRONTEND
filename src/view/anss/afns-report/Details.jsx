import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, notification, Space, DatePicker, Upload } from "antd";
import moment from "moment";
// for Redux imports
import { addAfnsReportData, getAfnsReportData, editAfnsReportData } from "../../../redux/afns-report/afnsReportActions";
import { useDispatch, useSelector } from "react-redux";

import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import {RiArrowLeftSLine} from "react-icons/ri";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {callNotif, createFile} from '../../../utils/global-functions/minor-functions';
const Details = ({...props}) => {
    var actions = [{action_name: "add-data", action:"Add"}, {action_name: "edit-data", action:"Edit"}, {action_name: "view-data", action:"View"}];
    const history = useHistory();
    const [btnReload, setBtnReload] = useState(false);
    const [pageAction, setPageAction] = useState("");
    const [isDataFetched, setIsDataFetched] = useState(false);
    const {formAction, id} =  useParams();
    const [afnsReportId, setAfnsReportId] = useState();
    const [ btnStatus, setBtnStatus] = useState("");
    const [dateSting, setDateSting] = useState("");
    const [dataFileSource, setDataFileSource] = useState({})
    const [form] = Form.useForm();

    const dispatch = useDispatch();
    const {afnsReport_data, afnsReport_links, afnsReport_meta, afnsReport_details, status, message} = useSelector((state) => state.afnsReport);

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
                history.push('/afns-report');
            }else{
                if(formAction != "add-data"){
                    setAfnsReportId(window.atob(id));
                }
            }
        }, 1000);
        // dispatch(getAllData());
    }, [id]);

    useEffect(() => {
        onCancelAction();
    }, [form]);
    useEffect(() => {
        if(afnsReportId){
            dispatch(getAfnsReportData({}, afnsReportId))
            .then(() =>{
                setIsDataFetched(true);
            });
            // getDataDetails();
        }
    }, [afnsReportId]);

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
                    setBtnReload(false);
                }else{
                    callNotif('Error', message, status)
                    setBtnReload(false);
                }
                clearErrMessage();
            }
        }
    }

    const clearErrMessage = () => {
        dispatch({
            type: 'SET_AFNS_REPORT_DATA_MESSAGE',
            status: '',
            msg: '',
        });
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
        getCreatedFile(afnsReport_details?.attributes?.file, "Document");
        getCreatedFile(afnsReport_details?.attributes?.thumbnail, "Thumbnail");
        form.setFieldsValue({
            title:afnsReport_details?.attributes?.title,
            year: afnsReport_details?.attributes?.year ? moment(`${afnsReport_details?.attributes?.year}-1-1`) : "",
            document_url: afnsReport_details?.attributes?.file ? [{url: afnsReport_details?.attributes?.file, name: "Document"}] : [],
            thumbnail:afnsReport_details?.attributes?.thumbnail ? [{url: afnsReport_details?.attributes?.thumbnail, name: "Thumbnail"}] : []
        });
        setDateSting(afnsReport_details?.attributes?.year);
        setIsDataFetched(false);
    }

    const onFinish = (values) => {
        var formData = new FormData();
        var params = {
            data:
                {
                    type:'afns',
                    attributes:{
                        year:dateSting,
                        title:values.title,
                        status:btnStatus
                    }
                }
            }
        formData.append("body", JSON.stringify(params));
        formData.append("file", values?.document_url[0]?.originFileObj ? values?.document_url[0]?.originFileObj : (dataFileSource['document'] ? dataFileSource['document'] : null));
        formData.append("thumbnail", values?.thumbnail[0]?.originFileObj ? values?.thumbnail[0]?.originFileObj : (dataFileSource['thumbnail'] ? dataFileSource['thumbnail'] : null));
        // console.log("file", values?.document_url[0]?.originFileObj ? values?.document_url[0]?.originFileObj : (dataFileSource['document'] ? dataFileSource['document'] : null));
        // console.log("thumbnail", values?.thumbnail[0]?.originFileObj ? values?.thumbnail[0]?.originFileObj : (dataFileSource['thumbnail'] ? dataFileSource['thumbnail'] : null));
        // console.log("formAction", formAction);
        if(formAction == "add-data"){
            setBtnReload(true);
            dispatch(addAfnsReportData(formData)).then(() => {
                setBtnReload(false);
                openNotificationWithIcon('success', "Success", "AFNS Report is added successfully.");
                onCancelAction();
            }).catch((e) => {
                errMsg();
            });
        }
            
        if(formAction == "edit-data"){
            setBtnReload(true);
            dispatch(editAfnsReportData(formData, afnsReportId))
                .then(() =>{
                    setBtnReload(false);
                    openNotificationWithIcon('success', "Success", "AFNS Report is updated successfully.");
                    setIsDataFetched(true);
                }).catch((e) => {
                    errMsg();
                });
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
                            {
                                afnsReport_details?.attributes?.status == "draft" ?
                                (
                                    <Button 
                                    loading={btnReload}
                                    className="hp-bg-info-1 hp-border-color-info-1 hp-hover-bg-info-2 hp-hover-border-color-info-2"
                                    type="primary"
                                    htmlType="submit"
                                    block
                                    onClick={() => {setBtnStatus('draft')}}
                                    >Save as Draft</Button>
                                ) : ""
                            }
                            <Button 
                             loading={btnReload}
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

    
    const getDateVal = (date, dateString) => {
        setDateSting(dateString);
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
                breadCrumbActive="AFNS Report"
            />
            </Col>
            <Col md={9} xs={24} span={24} align="end">
               <Link to="/afns-report">
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
         <Card title={pageAction+" AFNS Report"} bordered={false}  style={cardStyle}>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input placeholder="Enter Title"  autoComplete="off" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item
                            name="year"
                            label="Year"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <DatePicker picker="year" onChange={getDateVal} disabled={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>

                    <Col span={24} md={16}>
                            <Form.Item label="Document" name="document_url" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: 'This is required!' }]}>
                            <Upload name="logo" action="/upload.do" accept="application/pdf" showUploadList={{showRemoveIcon:formAction != "view-data"}}  listType="picture" maxCount={1}>
                                {
                                    formAction != "view-data" ? (
                                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                                    ) : ""
                                }
                            </Upload>
                            </Form.Item>
                    </Col>

                    <Col span={24} md={16}>
                            <Form.Item label="Thumbnail" name="thumbnail" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: 'This is required!' }]}>
                            <Upload name="logo" action="/upload.do" accept="image/png, image/jpeg, image/jpg" showUploadList={{showRemoveIcon:formAction != "view-data"}}  listType="picture" maxCount={1}>
                                {
                                    formAction != "view-data" ? (
                                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                                    ) : ""
                                }
                            </Upload>
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