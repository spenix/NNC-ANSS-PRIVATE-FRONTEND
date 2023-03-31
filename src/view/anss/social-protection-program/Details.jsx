import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, Modal, Space, Upload, Select, Divider } from "antd";

// for Redux imports
import { addSocialProgramData, getSocialProgramData, editSocialProgramData } from "../../../redux/social-protection-program/socialProgramActions";
import { getAllData as getAllMemberStateData} from "../../../redux/asian-countries/asianCountriesAction2";
import { getAllLanguages} from "../../../redux/public-routes/publicRoutesAction";
import { useDispatch, useSelector } from "react-redux";

import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import {RiArrowLeftSLine, RiInformationLine} from "react-icons/ri";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD, UPDATED_DATA, ADD_DATA, CONFIRM_SUBMIT} from '../../../utils/LangConstants';
import {createFile, callNotif, bytesToMegaBytes} from '../../../utils/global-functions/minor-functions';
const Details = (props) => {
    const {pageRoles} = props;
    const [btnStatus, setBtnStatus] = useState('draft');
    var actions = [{action_name: "add-data", action:"Add"}, {action_name: "edit-data", action:"Edit"}, {action_name: "view-data", action:"View"}];
    const history = useHistory();
    const [loadBtn, setLoadBtn] = useState(false);
    const [pageAction, setPageAction] = useState("");
    const [isDataFetched, setIsDataFetched] = useState(false);
    const {formAction, id} =  useParams();
    const [socialProgramId, setSocialProgramId] = useState();
    const [dataStatus, setDataStatus] = useState(true);
    const [viewAddField, setViewAddField] = useState(false);
    const [dataFileSource, setDataFileSource] = useState({})
    const [form] = Form.useForm();
    const { confirm } = Modal;
    const dispatch = useDispatch();
    const {socialProgram_data, socialProgram_links, socialProgram_meta, socialProgram_details, status, message} = useSelector((state) => state.socialProgram);
    const { myprofile: {roles, organization} } = useSelector((state) => state.users);
    const {languages_data} = useSelector((state) => state.publicRoutes);
    const {memberState_data} = useSelector((state) => state.asianCountries);

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
                history.push('/social-protection-program');
            }else{
                const data = JSON.parse(window.atob(id))
                console.log(data);
                if(formAction != "add-data"){
                    setSocialProgramId(data.id);
                }else{
                    setOrganizationId();
                }
            }
        }, 1000);
        form.setFieldsValue({status:dataStatus})
        // dispatch(getAllData());
    }, [id]);

    useEffect(() => {
        if(socialProgramId){
            dispatch(getSocialProgramData({}, socialProgramId))
            .then(() =>{
                setIsDataFetched(true);
            });
            // getDataDetails();
        }
        dispatch(getAllMemberStateData())
        dispatch(getAllLanguages())
    }, [socialProgramId]);

    useEffect(() => {
        errMsg();
    }, [status]);

    const errMsg = () => {
        if(typeof status == "string" && status == "error"){
            if(status != ""){
                if(typeof message == "object"){
                    message.forEach(item => {
                        openNotificationWithIcon(status, "Error", item)
                    });
                    setLoadBtn(false);
                }else{
                    openNotificationWithIcon(status, "Error", message)
                    setLoadBtn(false);
                }
                clearErrMessage();
            }
        }
    }

    const clearErrMessage = () => {
        dispatch({
            type: 'SET_SOCIAL_PROGRAM_DATA_MESSAGE',
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
        getCreatedFile(socialProgram_details?.attributes?.document_url,"Document");
        form.setFieldsValue({
            organization_id: socialProgram_details?.attributes?.organization_id,
            program_name:socialProgram_details?.attributes?.name,
            description:socialProgram_details?.attributes?.description,
            enrollment_criteria:socialProgram_details?.attributes?.criteria,
            benefits:socialProgram_details?.attributes?.benefits,
            scale:(socialProgram_details?.attributes?.scale).toLowerCase(),
            program_url:socialProgram_details?.attributes?.url,
            // reference: socialProgram_details?.attributes?.reference,
            language_availability: socialProgram_details?.attributes?.language,
            program_document: socialProgram_details?.attributes?.document_url ? [{url: socialProgram_details?.attributes?.document_url, name: "View Document"}] : [],
        });
        setViewAddField(socialProgram_details?.attributes?.language ? true : false);
        setIsDataFetched(false);
    }

    function showSubmitConfirm(params = {}, formAction = "", socialProgramId = 0) {
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
            addFormDataAction(params, formAction, socialProgramId);
          },
          onCancel() {},
        },[params]);
      }

    const onFinish = (values) => {
        var document_url = (values?.program_document?.length ? (values?.program_document[0]?.originFileObj ? values?.program_document[0]?.originFileObj : (dataFileSource['document'] ? dataFileSource['document'] : null)) : null);
        if(typeof values.program_url == 'undefined' && typeof values?.program_document == 'undefined'){
            openNotificationWithIcon('info', "Information", `Data Source field is required. You need to input the link or upload the document for the data source.`);
        }else{
        var formData = new FormData();
        var dataFormat = {
            data: {
                type: "socials",
                attributes: {
                    name: values.program_name,
                    description: values.description,
                    criteria: values.enrollment_criteria,
                    benefits: values.benefits,
                    scale: values.scale,
                    organization_id: roles?.includes('system_administrator') ? values?.organization_id : organization?.party_id,
                    status: roles?.includes("system_administrator") ? (btnStatus == "submitted" ? "approved" : btnStatus) : btnStatus,
                    language: values?.language_availability,
                    url: values.program_url ? values.program_url : ""
                }
            }
        }
        formData.append("body", JSON.stringify(dataFormat));
        formData.append("document_url", document_url);
        setLoadBtn(true);
        if(document_url != null || values.program_url != ""){
            if(formAction == "add-data"){
                if(pageRoles.includes(ACTION_ADD)){
                    if(btnStatus == "submitted") {
                        showSubmitConfirm(formData, formAction);
                    } else {
                        addFormDataAction(formData, formAction);
                    }
                }else{
                openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have ${ACTION_ADD} permission.`);
                setLoadBtn(false);
                }
            }
            if(formAction == "edit-data"){
                formData.append("_method", "PUT");
                if(pageRoles.includes(ACTION_EDIT)){
                    if(btnStatus == "submitted") {
                        showSubmitConfirm(formData, formAction, socialProgramId);
                    } else {
                        addFormDataAction(formData, formAction, socialProgramId);
                    }
                }else{
                openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have ${ACTION_EDIT} permission.`);
                setLoadBtn(false);
                }
            }  
        } else {
            openNotificationWithIcon('info', "Information", `Please input either link or document.`);
        }
        setLoadBtn(false);
      }
    }       

    const addFormDataAction = (formData = {}, formAction = "", socialProgramId = 0) => {
        if(formAction == "add-data"){
            console.log("assss");
            dispatch(addSocialProgramData(formData)).then(() => {
                setLoadBtn(false);
                openNotificationWithIcon('success', "Success", `Social Protection Programme was ${btnStatus == 'draft' ? "drafted" : btnStatus} successfully.`);
                onCancelAction();
            }).catch((e) => {
                errMsg();
            });
        }
        if(formAction == "edit-data"){
            dispatch(editSocialProgramData(formData, socialProgramId))
                .then(() =>{
                    setLoadBtn(false);
                    openNotificationWithIcon('success', "Success", `Social Protection Programme was ${btnStatus == 'draft' ? "drafted" : btnStatus} successfully.`);
                    setIsDataFetched(true);
                    if(btnStatus == "submitted"){
                        history.push("/social-protection-program");
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
                            <Button 
                            type="primary"
                            htmlType="submit" 
                            loading={loadBtn == true && btnStatus == 'draft'}
                            className="hp-bg-info-1 hp-border-color-info-1 hp-hover-bg-info-2 hp-hover-border-color-info-2"
                            onClick={() => {setBtnStatus('draft')}}
                            onCancel={() => {setLoadBtn(false)}}
                            >
                                Save as Draft
                            </Button>
                            <Button 
                             loading={loadBtn == true && btnStatus == 'submitted'}
                             onClick={() => {setBtnStatus('submitted')}}
                             onCancel={() => {setLoadBtn(false)}}
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
                    breadCrumbActive="Social Protection Programmes"
                />
            </Col>
            <Col md={9} xs={24} span={24} align="end">
                <Link to="/social-protection-program">
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
         <Card title={pageAction+" Social Protection Programme"} bordered={false}  style={cardStyle}>
         <Row className="flex justify-start ">
                {
                    roles?.includes("system_administrator") ? (
                            <Col span={24} md={16}>
                                <Form.Item
                                    name="organization_id"
                                    label="Member State"
                                    rules={formAction == "view-data" ? [] : [{ required: true, message: 'This is required!' }]}
                                >
                                    <Select placeholder="Select Member State" disabled={true}>
                                        {
                                            memberState_data.map(item => {
                                                return <Select.Option key={item.id} value={item.id}>{item.attributes.name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Col>
                    ) : ""
                }
                    <Col span={24} md={16}>
                        <Form.Item
                            name="program_name"
                            label="Programme Name"
                            rules={[{ required: true, message: 'This is required!' }]}
                            tooltip="Name or Title of the Social Protection  Programme"
                        >
                            <Input placeholder="Enter Programme Name" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                
                    <Col span={24} md={16}>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'This is required!' }]}
                            tooltip="Programme highlight or details"
                        >
                            <Input.TextArea showCount maxLength={200} placeholder="Enter Description" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                
                    <Col span={24} md={16}>
                        <Form.Item
                            name="enrollment_criteria"
                            label="Enrollment Criteria"
                            rules={[{ required: true, message: 'This is required!' }]}
                            tooltip="Criteria to determine enrollment in a programme"
                        >
                            <Input placeholder="Enter Enrollment Criteria" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                
                    <Col span={24} md={16}>
                        <Form.Item
                            name="benefits"
                            label="Benefits"
                            rules={[{ required: true, message: 'This is required!' }]}
                            tooltip="Programme benefits received by the beneficiaries"
                        >
                            <Input placeholder="Enter Benefits"readOnly={formAction == "view-data" ? true : false} />
                        </Form.Item>
                    </Col>
               
                    <Col span={24} md={16}>
                        <Form.Item
                            name="scale"
                            label="Service Scale"
                            rules={formAction == "view-data" ? [] :[{ required: true, message: 'This is required!' }]}
                            tooltip="Implementation scope of the Programme"
                        >
                            <Select placeholder="Select Service Scale" disabled={formAction == "view-data" ? true : false}>
                               <Select.Option value="national">National</Select.Option>
                               <Select.Option value="sub-national">Sub-National</Select.Option>
                               <Select.Option value="both">Both, National & Sub-National</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <fieldset style={{padding: '10px'}}>
                    <legend>Data Source <span style={{color: 'red', fontSize:"18px"}}>*</span></legend>
                
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="program_url"
                            label="Link"
                            rules={[{ required: false, message: 'This is required!' }]}
                            tooltip="Web page address to reach a website or portal"
                        >
                            <Input placeholder="Enter Link" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item label="Document">
                            <Form.Item name="program_document" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: false, message: 'This is required!' }]}>
                            <Upload name="logo" action="/upload.do" accept="application/pdf" showUploadList={{showRemoveIcon:formAction != "view-data"}}  listType="picture" maxCount={1}>
                                {
                                    formAction != "view-data" ? (
                                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                                    ) : socialProgram_details?.attributes?.document_url ?  "" : "N/A"
                                }
                            </Upload>
                            </Form.Item>
                        </Form.Item>
                    </Col>
                        
                        {language_availability()}
                    </Row>
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