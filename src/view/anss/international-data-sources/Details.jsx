import { useState, useEffect, useCallback } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, notification, Space, Select, DatePicker, Upload } from "antd";
import debounce from "lodash/debounce";
// for Redux imports
import { addDataSourceData, getDataSourceData, editDataSourceData } from "../../../redux/dataSources/dataSourcesActions";
import { getAllData as getAllDataSourceTypes } from "../../../redux/dataSourceTypes/dataSourceTypesActions";
import { getAllData as getAllCustodianData } from "../../../redux/custodian/custodianActions";
import { getAllLanguages} from "../../../redux/public-routes/publicRoutesAction";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import {successMsg, errorMsg, warningMsg, infoMsg, callNotif, createFile, bytesToMegaBytes} from '../../../utils/global-functions/minor-functions';
import {RiArrowLeftSLine} from "react-icons/ri";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD, ADD_DATA, UPDATED_DATA} from '../../../utils/LangConstants';
const Details = (props) => {
    const {pageRoles} = props;
    var actions = [{action_name: "add-data", action:"Add"}, {action_name: "edit-data", action:"Edit"}, {action_name: "view-data", action:"View"}];
    const history = useHistory();
    const [loadAddUserBtn, setLoadAddUserBtn] = useState(false);
    const [pageAction, setPageAction] = useState("");
    const [isDataFetched, setIsDataFetched] = useState(false);
    const {formAction, id} =  useParams();
    const [dataSourceId, setDataSourceId] = useState();
    const [hasDownloadFiles, setHasDownloadFiles] = useState(false);
    const [dateSting, setDateSting] = useState("");
    const [documentUrl, setDocumentUrl] = useState("");
    const [dataFileSource, setDataFileSource] = useState({})
    const [viewAddField, setViewAddField] = useState(false);
    const [form] = Form.useForm();

    const dispatch = useDispatch();

    const {dataSource_details, status, message} = useSelector((state) => state.dataSources);
    const {languages_data} = useSelector((state) => state.publicRoutes);
    const {dataSourceType_data} = useSelector((state) => state.dataSourceTypes);
    const {custodian_data} = useSelector((state) => state.custodian);
    const {myprofile} = useSelector((state) => state.users);

    
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
             if(item.action_name == formAction){
                      setHasDownloadFiles(item.action.toLowerCase() != 'view')
                      setPageAction(item.action)
                      return item
             }
                      
        }).length;
        return count ? true : false
    } 


    
    useEffect(() => {
        errMsg();
    }, [status]);

    const errMsg = () => {
        if(typeof status == "string" && status == "error"){
                if(typeof message == "object"){
                  message.forEach(item => {
                    if(item != ""){
                        callNotif('Error', item, status)
                    }
                  });
                }else{
                    if(message != "") {
                        callNotif('Error', message, status)
                    }
                }
                setLoadAddUserBtn(false);
                clearErrMessage();
        }
    }

    const clearErrMessage = () => {
        dispatch({
            type: 'SET_SOURCE_DATA_MESSAGE',
            status: '',
            msg: '',
        });
    }

    useEffect(() => {
        onCancelAction();
    }, [form]);

    // component useEffects();
    useEffect(() => {
        setTimeout(() => {
            if(isBase64(id) == false || checkFormAction() != true){
                history.push('/international-data-sources');
            }else{
                if(formAction != "add-data"){
                    setDataSourceId(window.atob(id));
                    delayedSearch(window.atob(id));
                }
            }
        }, 1000);
        dispatch(getAllLanguages())
    }, [id]);

    const delayedSearch = useCallback(
        debounce((q) => fetchData(q), 500),
        []
      );
    
    const fetchData = (id) => {
        if(typeof id != "undefined"){
        dispatch(getDataSourceData({}, id))
            .then(() =>{
                setIsDataFetched(true);
            });
        }
    }

    useEffect(() => {
        dispatch(getAllDataSourceTypes());
        dispatch(getAllCustodianData({intl_flag: true}));
    }, [dispatch]);

    const getCreatedFile = (url, fileType) => {
        if(url){
            createFile(url).then(response => {
                if(response)
                    setDataFileSource(prevState => ({ ...prevState, [fileType.toLowerCase()]: response }))
            })
        }
    } 
    const getDataDetails = () => {
        if(Object.keys(dataSource_details).length){
            console.log(dataSource_details);
            const {attributes, id} = dataSource_details;
            getCreatedFile(attributes?.document_url,"Document");
            form.setFieldsValue({
                custodian_id: attributes?.custodian?.id,
                source_type_id:attributes?.datasource_type?.id,
                title:attributes?.title,
                publication_coverage_dt: moment(`${attributes?.publication_date}-1-1`),
                url_source:attributes?.url,
                language_availability: attributes?.language,
                document_url: attributes?.document_url ? [{url: attributes?.document_url, name: "View Document"}] : [],
            });
            setDateSting(moment(`${attributes?.publication_date}-1-1`).format("Y"));
            setViewAddField(attributes?.language ? true: false);
        }
       
        setIsDataFetched(false);
    }

    const onFinish = (values) => {
        var formData = new FormData();
        var params = {
            data:{
              attributes:
              {
                custodian_id:values.custodian_id,
                datasource_type_id:values.source_type_id,
                title:values.title,
                url:values.url_source,
                publication_date:`${dateSting}`,
                party_id:myprofile?.organization?.party_id,
                language: values.language_availability,
                intl_flag:true,
              }
            }
          }
        formData.append("body", JSON.stringify(params));
        formData.append("document_url", values?.document_url?.length ? (values?.document_url[0]?.originFileObj ? values?.document_url[0]?.originFileObj : (dataFileSource['document'] ? dataFileSource['document'] : null)) : null);
        setLoadAddUserBtn(true);
        if(formAction == "add-data")
            if(pageRoles.includes(ACTION_ADD)){
                dispatch(addDataSourceData(formData)).then(() => {
                    setLoadAddUserBtn(false);
                    callNotif("Success", `International Data Source ${ADD_DATA}`, 'success');
                    onCancelAction();
                }).catch((e) => {
                    errMsg();
                });
            }else{
              callNotif("Information", `Oops! can't execute, you don't have ${ACTION_ADD} permission.`, 'info');
              setLoadAddUserBtn(false);
            }
        if(formAction == "edit-data")
            formData.append("_method", "PUT");
            if(pageRoles.includes(ACTION_EDIT)){
                dispatch(editDataSourceData(formData, dataSourceId))
                .then(() =>{
                    setLoadAddUserBtn(false);
                    callNotif("Success", `International Data Source ${UPDATED_DATA}`, 'success');
                    setIsDataFetched(true);
                }).catch((e) => {
                    errMsg();
                });
            }else{
              callNotif("Information", `Oops! can't execute, you don't have ${ACTION_EDIT} permission.`, 'info');
              setLoadAddUserBtn(false);
            }
    }       

    const onCancelAction = () => {
        form.resetFields([
            'source_type_id',
            'custodian_id',
            'title',
            'publication_coverage_dt',
            'url_source',
            'document_url',
            'language_availability',
        ]);
        setViewAddField(false);
    }

    const btnActions = () => {
        if(formAction != "view-data")
            return (
                <Row justify="end" align="middle" style={{marginTop:'10px'}}>
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

    const getDateVal = (date, dateString) => {
        setDateSting(dateString);
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
        }
        return e?.fileList;
      };
    const language_availability = () => {
      if(viewAddField)
          return (
            <Row className="flex justify-start ">
                 <Col span={24} md={16}>
                     <Form.Item
                         name="language_availability"
                         label="Language Availability"
                         rules={formAction == "view-data" ? [] :[{ required: true, message: 'This is required!' }]}
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
                    breadCrumbActive="International Data Source"
                />
           </Col>
           <Col md={9} xs={24} span={24} align="end">
               <Link to="/international-data-sources">
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
         <Card title={pageAction+" International Data Source"} bordered={false}  style={cardStyle}>
         <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item label="Source Type" name="source_type_id" rules={[{ required: true, message: 'This is required!' }]}>
                            <Select
                                placeholder="Select Source Type"
                                allowClear
                                disabled={formAction == "view-data" ? true : false}
                            >
                                {
                                    dataSourceType_data.map(item => {
                                        return <Select.Option key={item.id} value={item.id} title={item.attributes.description}>{item.attributes.name}</Select.Option>
                                    })
                                }
                                
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item label="Custodian" name="custodian_id" rules={[{ required: true, message: 'This is required!' }]}>
                            <Select
                                placeholder="Select Custodian"
                                allowClear
                                disabled={formAction == "view-data" ? true : false}
                            >
                                 {
                                    custodian_data.map(item => {
                                        return <Select.Option key={item.id} value={item.id}>{item.attributes.name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input placeholder="Enter Title" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={6}>
                        <Form.Item
                            name="publication_coverage_dt"
                            label="Publication / Coverage Date"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <DatePicker className="max-w-full" style={{ width: "100%" }} picker="year" onChange={getDateVal} disabled={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="url_source"
                            label="Link"
                        >
                            <Input placeholder="Enter Link" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item label="Document" extra={"Upload document must be in pdf file type up to 25 MB."}>
                            <Form.Item name="document_url" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: false, message: 'This is required!' }]}>
                            <Upload 
                                // beforeUpload={beforeUpload}
                                name="logo" 
                                action="/upload.do" 
                                accept="application/pdf" 
                                showUploadList={{showRemoveIcon:formAction != "view-data"}} 
                                listType="picture" 
                                maxCount={1}>
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
                {language_availability()}

               {btnActions()}
            </Card>
         </Col>
       </Row>
       </Form>
     </>
     );
}
 
export default Details;