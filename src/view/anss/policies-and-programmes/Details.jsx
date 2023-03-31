import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, notification, Space, Modal, Select, Upload, Divider} from "antd";

// for Redux imports
import { addPolicyProgrammesData, getPolicyProgrammesData, editPolicyProgrammesData } from "../../../redux/policy-programmes/policyProgrammesActions";
import { getAllData as getAllClassificationData } from "../../../redux/policy-classification/policyClassificationActions";
import { getAllData as getAllEnvironmentsData } from "../../../redux/policy-environment/policyEnvironmentActions";
import { getAllData as getAllPolicyStatusData } from "../../../redux/policy-status/policyStatusActions";
import { getAllData as getAllMemberStateData} from "../../../redux/asian-countries/asianCountriesAction2";
import { getAllLanguages} from "../../../redux/public-routes/publicRoutesAction";
import { useDispatch, useSelector } from "react-redux";

import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import {RiArrowLeftSLine, RiFileCopy2Line, RiInformationLine  } from "react-icons/ri";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {createFile, callNotif, bytesToMegaBytes} from '../../../utils/global-functions/minor-functions';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD, CONFIRM_SUBMIT} from '../../../utils/LangConstants';
const Details = (props) => {
    const {pageRoles} = props;
    var actions = [{action_name: "add-data", action:"Add"}, {action_name: "edit-data", action:"Edit"}, {action_name: "view-data", action:"View"}];
    const history = useHistory();
    const [btnStatus, setBtnStatus] = useState('draft');
    const [loadAddUserBtn, setLoadAddUserBtn] = useState(false);
    const [pageAction, setPageAction] = useState("");
    const [isDataFetched, setIsDataFetched] = useState(false);
    const {formAction, id} =  useParams();
    const [policyProgramId, setPolicyProgramId] = useState();
    const [dataStatus, setDataStatus] = useState(true);
    const [viewAddField, setViewAddField] = useState(false);
    const [form] = Form.useForm();
    const { confirm } = Modal;
    const dispatch = useDispatch();
    const {programmes_data, programmes_links, programmes_meta, programmes_details, status, message} = useSelector((state) => state.policyProgrammes);
    const {memberState_data} = useSelector((state) => state.asianCountries);
    const {classification_data} = useSelector((state) => state.policyClassification);
    const {policyEnvironment_data} = useSelector((state) => state.policyEnvironment);
    const {languages_data} = useSelector((state) => state.publicRoutes);
    const {policyStatus_data} = useSelector((state) => state.policyStatus);
    const { myprofile: {roles, organization} } = useSelector((state) => state.users);
    const [dataFileSource, setDataFileSource] = useState({})
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

    const setOrganizationId = () => {
        const data = JSON.parse(window.atob(id))
        form.setFieldsValue({
            organization_id: data?.org_id
        })
    }
    
    // component useEffects();
    useEffect(() => {
        setTimeout(() => {
            if(isBase64(id) == false || checkFormAction() != true){
                history.push('/policies-and-programmes');
            }else{
                const data = JSON.parse(window.atob(id))
                if(formAction != "add-data"){
                    setPolicyProgramId(data?.id);
                }else{
                    setOrganizationId()
                }
            }
        }, 1000);
        // dispatch(getAllData());
    }, [id]);

    
    useEffect(() => {
        if(policyProgramId){
            dispatch(getPolicyProgrammesData({}, policyProgramId))
            .then(() =>{
                setIsDataFetched(true);
            });
            // getDataDetails();
        }
        dispatch(getAllClassificationData())
        dispatch(getAllEnvironmentsData())
        dispatch(getAllPolicyStatusData())
        dispatch(getAllMemberStateData())
        dispatch(getAllLanguages())
    }, [policyProgramId]);



    useEffect(() => {
        errMsg();
    }, [status]);

    const errMsg = () => {
        if(typeof status == "string" && status == "error"){
            if(message != "") {
                if(typeof message == "object"){
                    message.forEach(item => {
                        openNotificationWithIcon(status, "Error", item)
                    });
                    setLoadAddUserBtn(false);
                }else{
                    openNotificationWithIcon(status, "Error", message)
                    setLoadAddUserBtn(false);
                }
                clearErrMessage();
            }

        }
    }
    const clearErrMessage = () => {
        dispatch({
            type: 'SET_PROGRAMMES_DATA_MESSAGE',
            status: '',
            msg: '',
        });
    }
    const onChangeStatus = (checked) => {
        setDataStatus(checked)
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
        getCreatedFile(programmes_details?.attributes?.document_url,"Document");
        form.setFieldsValue({
            organization_id: programmes_details?.attributes?.organization?.party_id,
            classification_id: programmes_details?.attributes?.classification?.id,
            environment_id: programmes_details?.attributes?.environment?.id,
            name: programmes_details?.attributes?.name,
            details: programmes_details?.attributes?.details,
            status: programmes_details?.attributes?.status?.id,
            coverage: programmes_details?.attributes?.coverage,
            url_document: programmes_details?.attributes?.url,
            program_document: programmes_details?.attributes?.document_url ? [{url: programmes_details?.attributes?.document_url, name: "View Document"}] : [],
            service_scale: (programmes_details?.attributes?.service_scale).toLowerCase(),
            // document_reference: programmes_details?.attributes?.reference,
            language_availability: programmes_details?.attributes?.language
        });
        setViewAddField(programmes_details?.attributes?.language != "N/A" && programmes_details?.attributes?.language != null);
        setIsDataFetched(false);
    }
    function showSubmitConfirm(params = {}, formAction = "", policyProgramId = 0) {
        confirm({
          title: (
            <h5 className="hp-mb-0 hp-font-weight-500">
              {CONFIRM_SUBMIT}
            </h5>
          ),
          icon: (
            <span className="remix-icon">
              <RiInformationLine />
            </span>
          ),
          content: (
            <p className="hp-p1-body hp-text-color-black-80">
                {
                    roles?.includes("system_administrator") ? "This action will submit this data entry and automatically tag as approved data" : "This action will submit this data entry and will undergo an approval process."
                }
              
            </p>
          ),
          okText: "Yes",
          okType: "primary",
          cancelText: "No",
          onOk() {
            addFormDataAction(params, formAction, policyProgramId);
          },
          onCancel() {},
        },[params]);
      }

    const onFinish = (values) => {
        if(typeof values.url_document == 'undefined' && typeof values?.program_document == 'undefined'){
            openNotificationWithIcon('info', "Information", `Data Source field is required. You need to input the link or upload the document for the data source.`);
        }else{
        var formData = new FormData();
        var dataFormat ={
                        data: {
                            type: "programs",
                            attributes: {
                                classification_id: values.classification_id,
                                environment_id: values.environment_id,
                                name: values.name,
                                details: values.details,
                                status_id: values.status,
                                service_scale: values.service_scale,
                                coverage: values.coverage,
                                technical_notes: "N/A",
                                language: values?.language_availability ? values?.language_availability : "",
                                organization_id: roles?.includes('system_administrator') ? values?.organization_id : organization?.party_id,
                                program_status: roles?.includes("system_administrator") ? (btnStatus == "submitted" ? "approved" : btnStatus) : btnStatus,
                                // reference: values.document_reference,
                                url:  values.url_document ? values.url_document : ""
                            }
                        }
                    }
        formData.append("body", JSON.stringify(dataFormat));
        formData.append("document_url", values?.program_document?.length ? (values?.program_document[0]?.originFileObj ? values?.program_document[0]?.originFileObj : (dataFileSource['document'] ? dataFileSource['document'] : null)) : null);
        setLoadAddUserBtn(true);
        if(formAction == "add-data")
            if(pageRoles.includes(ACTION_ADD)){
                if(btnStatus == "submitted") {
                    showSubmitConfirm(formData, formAction);
                  } else {
                    addFormDataAction(formData, formAction);
                  }
            }else{
                openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have ${ACTION_ADD} permission.`);
                setLoadAddUserBtn(false);
            }else{
                if(formAction == "edit-data")
                    formData.append("_method", "PUT");
                    if(pageRoles.includes(ACTION_EDIT)){
                        if(btnStatus == "submitted") {
                            
                            showSubmitConfirm(formData, formAction, policyProgramId);
                        } else {
                         
                            addFormDataAction(formData, formAction, policyProgramId);
                        }
                    }else{
                    openNotificationWithIcon('info', "Information", `You don't have ${ACTION_EDIT} permission.`);
                    setLoadAddUserBtn(false);
                    }
                }
            }
        
    }       

    const addFormDataAction = (formData = {}, formAction = "", policyProgramId = 0) => {
        if(formAction == "add-data"){
            dispatch(addPolicyProgrammesData(formData)).then(() => {
                setLoadAddUserBtn(false);
                openNotificationWithIcon('success', "Success", `Policies & Program was ${btnStatus == 'draft' ? "drafted" : btnStatus} successfully.`);
                onCancelAction();
            }).catch((e) => {
                errMsg();
            });
        }
        if(formAction == "edit-data"){
            dispatch(editPolicyProgrammesData(formData, policyProgramId))
            .then(() =>{
                setLoadAddUserBtn(false);
                openNotificationWithIcon('success', "Success", `Policies & Program was ${btnStatus == 'draft' ? "drafted" : btnStatus} successfully.`);
                setIsDataFetched(true);
                if(btnStatus == "submitted"){
                    history.push("/policies-and-programmes");
                }
            }).catch((e) => {
                errMsg();
            });
        }
       
    }


    const onCancelAction = () => {
        form.resetFields();
        setDataStatus(true)
        setViewAddField(false);
        setOrganizationId();
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
                            type="primary"
                            htmlType="submit" 
                            loading={loadAddUserBtn == true && btnStatus == 'draft'}
                            className="hp-bg-info-1 hp-border-color-info-1 hp-hover-bg-info-2 hp-hover-border-color-info-2"
                            onClick={() => {setBtnStatus('draft')}}
                            >
                                Save as Draft
                            </Button>
                            <Button 
                             loading={loadAddUserBtn == true && btnStatus == 'submitted'}
                             onClick={() => {setBtnStatus('submitted')}}
                             type="primary"
                             htmlType="submit"
                             block
                            >Submit</Button>
                        </Space>
                    </Col>
                </Row>
            );
    }

    if(isDataFetched) {
        getDataDetails();
    }
    const language_availability = () => {
        if(viewAddField)
            return (
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="language_availability"
                            label="Language Availability"
                            rules={formAction == "view-data" ? [] :[{ required: true, message: 'This is required!' }]}
                            tooltip="Language used in the publication"
                        >
                            <Select placeholder="Select Language Availability" disabled={formAction == "view-data" ? true : false}>
                               {
                                languages_data.map((item, index) => {
                                    return (<Select.Option key={index} value={item.name}>{item.name}</Select.Option>)
                                })
                               }
                            </Select>
                        </Form.Item>
                        
                    </Col>
                </Row>
            )
    }

    const normFile = (e) => {
        if (Array.isArray(e)) {
          return e;
        }
        if(e?.fileList?.length){
            for (let index = 0; index < e?.fileList.length; index++) {
                if(bytesToMegaBytes(e?.fileList[index]?.size) <= 25){
                    setViewAddField(true);
                }else{
                    callNotif('Error', `Upload document must be in pdf file type up to 25 MB.`, 'error');
                    return null;
                }
            }
        } else {
            setViewAddField(false);
        }
        return e?.fileList;
    };

    const onUploadFail = () => {
        form.setFieldsValue({
            program_document: [],
        });
    }

    const beforeUpload = (file) => {
        const isPdf = file.type === 'application/pdf';
      
        if (!isPdf) {
            openNotificationWithIcon(status, "Error", 'Upload file type must be only PDF');
        }
      
        const isLt25M = (file.size / 1024 / 1024) < 25 // 25MB

        if (!isLt25M) {
            openNotificationWithIcon(status, "Error", 'Upload document must be in pdf file type up to 25 MB');
        }

        return isPdf && isLt25M;
    };

    // inline css
    const cardStyle = { width: "100%", margin: "10px 0 10px 0", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }
    // console.log(classification_data);
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
                    breadCrumbActive="Policies & Programmes"
                />
           </Col>
           <Col md={9} xs={24} span={24} align="end">
               <Link to="/policies-and-programmes">
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
         <Card title={pageAction+" Policy & Program"} bordered={false}  style={cardStyle}>
                {
                    roles?.includes("system_administrator") ? (
                        <Row className="flex justify-start ">
                            <Col span={24} md={12}>
                                <Form.Item
                                    name="organization_id"
                                    label="Member State"
                                    rules={formAction == "view-data" ? [] : [{ required: true, message: 'This is required!' }]}
                                >
                                    <Select disabled={true} placeholder="Select Member State">
                                        {
                                            memberState_data.map(item => {
                                                return <Select.Option key={item.id} value={item.id}>{item.attributes.name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                    ) : ""
                }
                <Row className="flex justify-start ">
                    <Col span={24} md={12}>
                        <Form.Item
                            name="classification_id"
                            label="Policy Classifcation"
                            rules={formAction == "view-data" ? [] : [{ required: true, message: 'This is required!' }]}
                            tooltip="Classification of Policy or Programme based on the AFNSR"
                        >
                            <Select placeholder="Select Policy Classifcation" disabled={formAction == "view-data" ? true : false}>
                                {
                                    classification_data.map(item => {
                                        return <Select.Option key={item.id} value={item.id}>{item.attributes.section}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={12}>
                        <Form.Item
                            name="environment_id"
                            label="Policy Indicator"
                            rules={formAction == "view-data" ? [] :[{ required: true, message: 'This is required!' }]}
                            tooltip="Policy or Programme Indicator based on the AFNSR"
                        >
                            <Select placeholder="Select Policy Indicator" disabled={formAction == "view-data" ? true : false}>
                                {
                                    policyEnvironment_data.map((item) => {
                                        return <Select.Option key={item.id} value={item.id}>{item.attributes.indicator}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="name"
                            label="Policy Name"
                            rules={formAction == "view-data" ? [] :[{ required: true, message: 'This is required!' }]}
                            tooltip="Title of the Policy or Programme"
                        >
                            <Input placeholder="Enter Policy Name" autoComplete="off" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="details"
                            label="Policy Details"
                            rules={formAction == "view-data" ? [] :[{ required: true, message: 'This is required!' }]}
                            tooltip="Policy or Programme highlight or details"
                        >
                            <Input.TextArea showCount maxLength={2000} placeholder="Enter Policy Details" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={6}>
                        <Form.Item
                            name="status"
                            label="Policy Status"
                            rules={formAction == "view-data" ? [] :[{ required: true, message: 'This is required!' }]}
                            tooltip="Policy or Programme implementation status"
                        >
                            <Select placeholder="Select Status" disabled={formAction == "view-data" ? true : false}>
                                {
                                    policyStatus_data.map((item) => {
                                        return <Select.Option key={item.id} value={item.id}>{ item.attributes.display_name }</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={6}>
                        <Form.Item
                            name="service_scale"
                            label="Service Scale"
                            rules={formAction == "view-data" ? [] :[{ required: true, message: 'This is required!' }]}
                            tooltip="Implementation scope of the Policy or Programme"
                        >
                            <Select placeholder="Select Service Scale" disabled={formAction == "view-data" ? true : false}>
                               <Select.Option value="national">National</Select.Option>
                               <Select.Option value="sub-national">Sub-National</Select.Option>
                               <Select.Option value="both">Both, National & Sub-National</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={6}>
                        <Form.Item
                            name="coverage"
                            label="Coverage (%)"
                            rules={formAction == "view-data" ? [] :[{ required: false, message: 'This is required!' }]}
                            tooltip="Data on the coverage of policy or programme implementation (in percentage)"
                        >
                           <Input type="number" placeholder="Enter Coverage" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                </Row>
                {/* <Row className="flex justify-start ">
                <Col span={24} md={16}>
                        <Form.Item
                            name="document_reference"
                            label="Reference"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input placeholder="Enter Reference" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                </Col>  
                </Row> */}
                <fieldset style={{padding: '10px'}}>
                    <legend>Data Source <span style={{color: 'red', fontSize:"18px"}}>*</span></legend>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="url_document"
                            label="Link"
                            rules={formAction == "view-data" ? [] :[{ required: false, message: 'This is required!' }]}
                            tooltip="Web page address to reach a website or portal"
                        >
                            <Input placeholder="Enter Link" autoComplete="off" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                            <Form.Item 
                                name="program_document" 
                                label="Document"
                                tooltip="Publication in PDF format" 
                                valuePropName="fileList" 
                                getValueFromEvent={normFile}
                                extra={"Upload document must be in pdf file type up to 25 MB."}
                                rules={[{ required: false, message: 'This is required!' }]}>
                            <Upload 
                                // beforeUpload={beforeUpload}
                                name="logo" 
                                action="/upload.do" 
                                accept="application/pdf" 
                                showUploadList={{showRemoveIcon:formAction != "view-data"}} 
                                listType="picture" maxCount={1}>
                                {
                                    formAction != "view-data" ? (
                                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                                    ) : programmes_details?.attributes?.document_url ? "" : "N/A"
                                }
                            </Upload> 
                            </Form.Item>
                    </Col>
                </Row>
                    {language_availability()}
                </fieldset>
               {btnActions()}
                  
            </Card>
         </Col>
       </Row>
       </Form>
     </>
     );
}
 
export default Details;