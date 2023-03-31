import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, notification, Space, Select, DatePicker, Upload } from "antd";

// for Redux imports
import { addDataSourceData, getDataSourceData, editDataSourceData } from "../../../redux/dataSources/dataSourcesActions";
import { getAllData as getAllDataSourceTypes } from "../../../redux/dataSourceTypes/dataSourceTypesActions";
import { getAllData as getAllCustodianData, searchDataList } from "../../../redux/custodian/custodianActions";
import { getAllData as getAllOrganizationsData } from "../../../redux/asian-countries/asianCountriesAction2";
import { getAllLanguages} from "../../../redux/public-routes/publicRoutesAction";

import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { getMyProfileDetails } from "../../../redux/users/usersActions";
import { useDispatch, useSelector } from "react-redux"
import { RiFileCopy2Line, RiFileUploadLine, RiArrowLeftSLine } from "react-icons/ri";
import moment from "moment";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD, ADD_DATA, UPDATED_DATA} from '../../../utils/LangConstants';
import {createFile, callNotif, bytesToMegaBytes} from '../../../utils/global-functions/minor-functions';
const Details = (props) => {
    const {pageRoles} = props;
    var actions = [{action_name: "add-data", action:"Add"}, {action_name: "edit-data", action:"Edit"}, {action_name: "view-data", action:"View"}];
    const history = useHistory();
    const [loadAddUserBtn, setLoadAddUserBtn] = useState(false);
    const [pageAction, setPageAction] = useState("");
    const [isDataFetched, setIsDataFetched] = useState(false);
    const {formAction, id} =  useParams();
    const [dataSourceId, setDataSourceId] = useState();
    const [dataFileSource, setDataFileSource] = useState({})
    const [dateSting, setDateSting] = useState("");
    const [ isSysAdd, setIsSysAdd ] = useState(false);
    const [viewAddField, setViewAddField] = useState(false);
    const [form] = Form.useForm();

    const dispatch = useDispatch();
    const {dataSource_data, dataSource_links, dataSource_meta, dataSource_details, status, message} = useSelector((state) => state.dataSources);
    const {dataSourceType_data, dataSourceType_links, dataSourceType_meta, dataSourceType_details} = useSelector((state) => state.dataSourceTypes);
    const {custodian_data, custodian_links, custodian_meta, custodian_details} = useSelector((state) => state.custodian);
    const {memberState_data} = useSelector((state) => state.asianCountries);
    
    const {languages_data} = useSelector((state) => state.publicRoutes);
    const { myprofile: {roles, organization}} = useSelector((state) => state.users);

    useEffect(() => {
        if(typeof roles == "object"){
            setIsSysAdd(roles.includes("system_administrator"));
            if(roles.includes("system_administrator"))
                dispatch(getAllOrganizationsData());
           
        }
            
      }, [roles]);

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
                }else{
                    openNotificationWithIcon(status, "Error", message)
                }
                setLoadAddUserBtn(false);
                clearErrMessage();
              }
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
        setTimeout(() => {
            if(isBase64(id) == false || checkFormAction() != true){
                history.push('/national-data-sources');
            }else{
                const data = JSON.parse(window.atob(id))
                if(formAction != "add-data"){
                    setDataSourceId(window.atob(id));
                }else{
                    form.setFieldsValue({
                        organization_id: data?.org_id
                    });
                }

                dispatch(searchDataList({intl_flag: false, limit:200, organization_id: data?.org_id })); 
            }
        });
        checkFormAction();
        dispatch(getAllDataSourceTypes());
        
        dispatch(getAllLanguages())
    }, [id]);

    useEffect(() => {
        onCancelAction();
    }, [form]);

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
                setPageAction(item.action)
                return item
             }  
        }).length;
        return count ? true : false
    } 

    const openNotificationWithIcon = (type, title = "", msg = "") => {
        callNotif(title, msg, type);
      };
    
    useEffect(() => {
        onCancelAction();
    }, [form]);

    useEffect(() => {
        if(typeof dataSourceId != "undefined"){
            dispatch(getDataSourceData({}, dataSourceId))
            .then(() =>{
                setIsDataFetched(true);
            });
        }
        dispatch(getAllDataSourceTypes());
        dispatch(getAllCustodianData());
        dispatch(getMyProfileDetails());

    }, [dataSourceId]);

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
            const {attributes, id} = dataSource_details;
            getCreatedFile(attributes?.document_url,"Document");
            form.setFieldsValue({
                organization_id: attributes?.party_id,
                source_type_id: attributes?.datasource_type?.id,
                custodian_id:attributes?.custodian?.id,
                title:attributes?.title,
                publication_coverage_dt:moment(`${attributes?.publication_date}-1-1`),
                url_source:attributes?.url,
                language_availability: attributes?.language,
                document_url:attributes?.document_url ? [{url: attributes?.document_url, name: "View Document"}] : [],
            });
            setDateSting(moment(`${attributes?.publication_date}-1-1`).format("Y"));
            setViewAddField(attributes?.language ? true: false);
        }
       
        setIsDataFetched(false);
    }

    const onFinish = (values) => {
        var document_url = values?.document_url?.length ? (values?.document_url[0]?.originFileObj ? values?.document_url[0]?.originFileObj : (dataFileSource['document'] ? dataFileSource['document'] : null)) : null;
        var formData = new FormData();
        var params = {
            data:{
              type: "datasources",
              attributes:
              {
                custodian_id:values.custodian_id,
                datasource_type_id:values.source_type_id,
                title:values.title,
                url:values.url_source,
                publication_date:dateSting,
                // party_id: values.organization_id,
                party_id: isSysAdd ? values.organization_id : organization?.party_id,
                language: values.language_availability,
                intl_flag: false
              }
            }
          }
        formData.append("body", JSON.stringify(params));
        formData.append("document_url", document_url);
        setLoadAddUserBtn(true);
        if(document_url != null || values.url_source != ""){
            if(formAction == "add-data"){
                if(pageRoles.includes(ACTION_ADD)){
                    dispatch(addDataSourceData(formData)).then(() => {
                        setLoadAddUserBtn(false);
                        openNotificationWithIcon('success', "Success", `National Data Source ${ADD_DATA}`);
                        onCancelAction();
                    }).catch((e) => {
                        errMsg();
                    });
                }else{
                    openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have ${ACTION_ADD} permission.`);
                    setLoadAddUserBtn(false);
                }
            }
                
            if(formAction == "edit-data"){
                formData.append("_method", "PUT");
                if(pageRoles.includes(ACTION_EDIT)){
                    dispatch(editDataSourceData(formData, dataSourceId))
                    .then(() =>{
                        setLoadAddUserBtn(false);
                        openNotificationWithIcon('success', "Success", `National Data Source ${UPDATED_DATA}`);
                        setIsDataFetched(true);
                    }).catch((e) => {
                        errMsg();
                    });
                }else{
                    openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have ${ACTION_EDIT} permission.`);
                    setLoadAddUserBtn(false);
                }
            }
        }else{
            openNotificationWithIcon('info', "Information", `Please input either link or document.`);
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
            'language_availability'
        ]);
        setViewAddField(false);
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

    
    const getDateVal = (date, dateString) => {
        setDateSting(dateString);
    }

    const setCountryField = () => {
        if(isSysAdd)
          return (
            <Row className="flex justify-start ">
                <Col span={24} md={16}>
                    <Form.Item name="organization_id" label="Country" rules={[{ required: true, message: 'This is required!' }]}>
                      <Select disabled={true} placeholder="Country">
                        {
                          memberState_data.map(item =>{
                            return (
                              <Select.Option key={item.id} value={item.id}>{item.attributes.name}</Select.Option>
                            )
                          })
                        }
                      </Select>
                    </Form.Item>
                </Col>
            </Row>
          );
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
                    breadCrumbActive="National Data Source"
                />
            </Col>
            <Col md={9} xs={24} span={24} align="end">
               <Link to="/national-data-sources">
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
         <Col span={24} md={16}>
         <Card title={pageAction+" National Data Source"} bordered={false}  style={cardStyle}>
                {setCountryField()}
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item label="Source Type" name="source_type_id" rules={[{ required: true, message: 'This is required!' }]}
                            tooltip="Methodology used in gathering  data (e.g., household surveys, population-based census, etc.)"
                        >
                            <Select
                                placeholder="Select Source Type"
                                allowClear
                                disabled={formAction == "view-data" ? true : false}
                            >
                                {
                                    dataSourceType_data.map(item => {
                                        return <Select.Option key={item.id} value={item.id}  title={item.attributes.description}>{item.attributes.name}</Select.Option>
                                    })
                                }
                                
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item label="Custodian" name="custodian_id" rules={[{ required: true, message: 'This is required!' }]}
                            tooltip="Name of organization or institution that collected/ published the data"
                        >
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
                            tooltip="Name of the publication (report or survey) containing the data"
                        >
                            <Input placeholder="Enter Title" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={8}>
                        <Form.Item
                            name="publication_coverage_dt"
                            label="Publication/Coverage"
                            rules={[{ required: true, message: 'This is required!' }]}
                            tooltip="Coverage year of the published title"
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
                                        tooltip="Web page address to reach a website or portal"
                                    >
                                        <Input placeholder="Enter Link" readOnly={formAction == "view-data" ? true : false}/>
                                    </Form.Item>
                                </Col>
                            </Row>
                    <Row className="flex justify-start ">
                        <Col span={24} md={16}>
                            <Form.Item 
                            name="document_url"
                            label="Document"
                            valuePropName="fileList" 
                            getValueFromEvent={normFile}
                            tooltip="Publication in PDF format"
                            extra={"Upload document must be in pdf file type up to 25 MB."}  
                            rules={[{ required: false, message: 'This is required!' }]}
                            >
                            <Upload 
                                name="logo" 
                                action="/upload.do" 
                                accept="application/pdf" 
                                showUploadList={{showRemoveIcon:formAction != "view-data"}}  
                                listType="picture" maxCount={1}>
                                {
                                    formAction != "view-data" ? (
                                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                                    ) : ""
                                }
                            </Upload>
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