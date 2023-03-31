import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory, Link } from "react-router-dom";

// redux & thunk
import { addPageSetupData, getPageSetupData, editPageSetupData, getContentTypes, getPageOptions} from "../../../redux/page-setup/pageSetupActions";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Button, Card, Form, Input, Select, Space, Switch, Upload, Divider, InputNumber } from "antd";
import {RiArrowLeftSLine} from "react-icons/ri";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';

import {callNotif, createFile} from '../../../utils/global-functions/minor-functions';
// import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../utils/LangConstants';
// import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
const Details = (props) => {
    var actions = [{action_name: "add-data", action:"Add"}, {action_name: "edit-data", action:"Edit"}, {action_name: "view-data", action:"View"}];
    const { pageRoles } = props;
    const history = useHistory();
    const [dataFileSource, setDataFileSource] = useState({})
    const {formAction, id} =  useParams();
    const [addData, setVal] = useState("");
    const [addSummary, setValSummary] = useState("");
    const [pageAction, setPageAction] = useState("");
    const [pageId, setPageId] = useState();
    const [form] = Form.useForm();
    const [btnReload, setBtnReload] = useState(false);
    const [contentType, setContentType] = useState("");
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [selectedFeatures, setSelectedFeatures] = useState("");
    const [selectedFeatureType, setSelectedFeatureType] = useState("");
    const [selectedFeatureId, setSelectedFeatureId] = useState("");

    const dispatch = useDispatch();
    const {page_data, page_links, page_meta, page_details, page_content_types, page_options, status, message} = useSelector((state) => state.pages);
    
    const handleChange = (e, editor) => {
        const data = editor?.getData();
        setVal(data);
    }
    const handleChangeSummary = (e, editor) => {
        const data = editor?.getData();
        setValSummary(data);
    }
    useEffect(() => {
        setTimeout(() => {
            if(isBase64(id) == false || checkFormAction() != true){
                history.push('/pages-setup');
            }else{
                if(formAction != "add-data"){
                    setPageId(window.atob(id));
                }
            }
        }, 1000);
    }, [id]);

    useEffect(() => {
        errMsg();
    }, [status]);

    const errMsg = () => {
        if(typeof status == "string" && status == "error"){
            if(message != ""){
                if(typeof message == "object"){
                    message.forEach(item => {
                        callNotif('Error', item, status)
                    });
                    setBtnReload(false);
                }else{
                    callNotif('Error', message, status)
                    setBtnReload(false);
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
    useEffect(() => {
        if(selectedFeatureId){
            var arrObj = {}
            page_options.forEach(item => {
                if(item.id == selectedFeatureId){
                    setSelectedFeatures((item.attributes.name).replace(" ", "_").toLowerCase());
                    setSelectedFeatureType((item.attributes.type).toLowerCase());
                    arrObj[(item.attributes.name).replace(" ", "_").toLowerCase()] = true;
                    if(Object.keys(page_details).length){
                        arrObj[`${(item.attributes.name).replace(" ", "_").toLowerCase()}_order`] = page_details?.attributes?.sort_order;
                        arrObj[`${(item?.attributes?.name).replace(" ", "_").toLowerCase()}_file`] = [{ url: page_details?.attributes?.[`${(item.attributes.type).toLowerCase()}_url`], name: `${(item?.attributes?.name).replace(" ", "_").toLowerCase()}_file`}];
                        getCreatedFile(page_details?.attributes?.[`${(item.attributes.type).toLowerCase()}_url`], `${(item.attributes.name).replace(" ", "_").toLowerCase()}_file`);
                    }
                }
            })
            form.setFieldsValue(arrObj);
        };
    }, [page_options])

    useEffect(() => {
        if(pageId){
            dispatch(getPageSetupData({}, pageId))
            .then(() =>{
                setIsDataFetched(true);
            });
        }
    }, [pageId]);

    const getContentType = (id) => {
        setSelectedFeatures("")
        dispatch({type:"GET_ALL_DATA_PAGE_OPTIONS", data: []})
        var data = page_content_types.filter(item => {
            return item.id == id
        })
        if(data.length){
            setContentType(data[0]?.attributes?.name);
        }
        dispatch(getPageOptions({content_type_id: id})).catch(err => {
            errMsg();
        })
    }



    const getDataDetails = () => {
        getContentType(page_details?.attributes?.content_type_id);
        form.setFieldsValue({
            status:page_details?.attributes?.status == "submitted" ? "submit" : "draft",
            // summary:page_details?.attributes?.summary, 
            title:page_details?.attributes?.title,
            content_type_id: page_details?.attributes?.content_type_id,
        });
       setSelectedFeatureId(page_details?.attributes?.page_option_id);
       setVal(page_details?.attributes?.body);
       setValSummary(page_details?.attributes?.summary);
       setIsDataFetched(false);
       
    }

    useEffect(() => {
        onCancelAction();
    }, [form])

    useEffect(() => {
        dispatch(getContentTypes()).catch(() => {
            errMsg();
        })
    }, [dispatch])

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
    const cardStyle = { width: "100%", margin: "10px 0 10px 0", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)"}
    
      const bytesToMegaBytes = (bytes,decimalPoint) => {
        if(bytes == 0) return '0 Bytes';
        var k = 1000,
            dm = decimalPoint || 2,
            sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
     }

     const normFile = (e) => {
        if (Array.isArray(e)) {
          return e;
        }
        var files = [];
        if(e?.fileList.length){
            for (let index = 0; index < e?.fileList.length; index++) {
                files.push({...e?.fileList[index]})
            }
        }
        return files;
      };

   
    const onFinish = (values) => {
           if(selectedFeatures){
            setBtnReload(true);
            var formData = new FormData();
            var dataFormat = {
                data:{
                    type:"pages",
                    attributes:{
                        content_type_id:values.content_type_id,
                        page_option_id: selectedFeatureId,
                        title:values.title,
                        // summary:values.summary,
                        summary:addSummary,
                        body:addData,
                        status:values.status == "submit" ? "submitted" : "draft",
                        sort_order:  values[`${selectedFeatures}_order`], 
                        source:  values[`${selectedFeatures}_source`] 
                    }
                }
            }

            formData.append("body", JSON.stringify(dataFormat));
            formData.append(`${selectedFeatureType}_url`, values[`${selectedFeatures}_file`].length ? (values[`${selectedFeatures}_file`][0]?.originFileObj ? values[`${selectedFeatures}_file`][0]?.originFileObj : (dataFileSource[`${selectedFeatures}_file`] ? dataFileSource[`${selectedFeatures}_file`] : null)) : null);
           
            if(formAction == "add-data"){
                dispatch(addPageSetupData(formData))
                    .then(() => {
                        setBtnReload(false);
                        callNotif('Success', "Page setup  is added successfully.", 'success')
                        onCancelAction(true);
                    })
                    .catch((e) => {
                        setBtnReload(false);
                        errMsg();
                    })
            }
                    
            if(formAction == "edit-data"){
                formData.append("_method", "PUT");
                dispatch(editPageSetupData(formData, pageId))
                .then(() =>{
                    setBtnReload(false);
                    callNotif("Success", "Page setup is updated successfully.", 'success');
                    setTimeout(() => {
                        history.push('/pages-setup')
                    }, 2000)
                }).catch((e) => {
                    setBtnReload(false);
                    errMsg();
                });
            }
           }else{
                callNotif('Information', `${contentType} feature is required.`, 'info')
           }
            
    }

    const displaySetupBody = () => {
        if(addData){
            return (
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        {ReactHtmlParser(addData)}
                    </Col>
                </Row>
            )
        }
    }
    
   
    const onCancelAction = () => {
        form.resetFields();
        setVal("");
        setValSummary("");
        setContentType("");
        setSelectedFeatures("");
        dispatch({type:"GET_ALL_DATA_PAGE_OPTIONS", data: []})
    }

    if(isDataFetched){
        getDataDetails();
    }
   
   
    const getSelectedFeatures = (page_feature, feature_type, id) => {
        setSelectedFeatures(page_feature);
        setSelectedFeatureType(feature_type);
        setSelectedFeatureId(id);
        var arrObj = {};
         page_options.forEach(item => {
             if((item?.attributes?.name).replace(" ", "_").toLowerCase() != page_feature){
                arrObj[(item?.attributes?.name).replace(" ", "_").toLowerCase()] = false
                arrObj[`${(item?.attributes?.name).replace(" ", "_").toLowerCase()}_file`] = null
                arrObj[`${(item?.attributes?.name).replace(" ", "_").toLowerCase()}_order`] = null
             } 
        })
        if(Object.keys(arrObj).length){
            form.setFieldsValue(arrObj)
        };
    }

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
                    breadCrumbActive="Page Setup"
                />
           </Col>
           <Col md={9} xs={24} span={24} align="end">
               <Link to="/pages-setup">
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
         <Card title={pageAction+" Page Setup"} style={{...cardStyle, minHeight:'500px'}}>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                                name="content_type_id"
                                label="Content Type"
                                rules={[{ required: true, message: 'This is required!' }]} 
                            >
                                <Select placeholder="Select Content Type" onChange={(e) => {getContentType(e)}} disabled={formAction == "view-data" ? true : false}>
                                    {
                                        page_content_types.map((item, index) => {
                                            if(!['Indicator Registry'].includes(item?.attributes?.name)){
                                                return <Select.Option key={index} value={item?.id}>{item?.attributes?.name}</Select.Option>
                                            }
                                            
                                        })
                                    }
                                </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item
                            name="title"
                            label="Title"
                            rules={[{ required: true, message: 'This is required!' }]}
                            
                        >
                            <Input placeholder="Enter Title"  readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item
                                name="summary"
                                label="Summary"
                                rules={[{ required: false, message: 'This is required!' }]}
                                
                            >
                                <CKEditor
                                name="summary"
                                height={400}
                                editor={ ClassicEditor }
                                data={addSummary}
                                onChange={handleChangeSummary}
                                disabled={formAction == "view-data" ? true : false}
                            />
                        </Form.Item>
                        {/* <Form.Item
                            name="summary"
                            label="Summary"
                            rules={[{ required: false, message: 'This is required!' }]}
                            
                        >
                            <Input.TextArea showCount maxLength={2000} rows={10} placeholder="Enter Summary" readOnly={formAction == "view-data" ? true : false} />
                        </Form.Item> */}
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item
                                name="body"
                                label="Body"
                                rules={[{ required: false, message: 'This is required!' }]}
                                
                            >
                                <CKEditor
                                name="body"
                                height={400}
                                editor={ ClassicEditor }
                                data={addData}
                                onChange={handleChange}
                                disabled={formAction == "view-data" ? true : false}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                {/* {displaySetupBody()} */}
            </Card>
         </Col>
         <Col span={24} md={8}>
                <Card style={cardStyle}>
                    <Row className="flex justify-start ">
                        <Col span={24} md={12}>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Select placeholder="Select Status" disabled={formAction == "view-data" ? true : false}>
                                {
                                    ['Draft', 'Submit'].map((item, index) => {
                                        return <Select.Option key={index} value={item.toLowerCase()}>{item}</Select.Option>
                                    })
                                }
                                
                            </Select>
                        </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="end" align="middle">
                        <Col span={24} md={24}>
                            {
                                formAction != "view-data" ? (
                                    <Space>
                                    <Button loading={btnReload} onClick={() => {onCancelAction()}} disabled={btnReload}>Clear</Button>
                                    <Button loading={btnReload} type="primary" htmlType="submit" disabled={btnReload}>Save</Button>
                                </Space>
                                ) : ""
                            }
                        </Col>
                    </Row>
                </Card> 
                <Card style={cardStyle}>
                    <h4>Features {contentType ? `on ${contentType}` : ""}</h4>
                    {
                        page_options.map((item, index) => {
                            var accept = (item?.attributes?.type).toLowerCase() == "image" ? "image/png, image/jpeg, image/jpg" : "video/mp4,video/x-m4v,video/*";
                            var page_feature = (item.attributes.name).replace(" ", "_").toLowerCase();
                            var extra_message = '';

                            switch(page_feature) {
                                case 'home_slider':
                                    extra_message = "Recommended image size is 1400x900 and maximum file size of 25MB";
                                    break;
                                case 'video_section':
                                    extra_message = "Recommended file size is 25MB";
                                    break;
                                default:
                                    extra_message = "Recommended image size is 400x300 and maximum file size of 25MB";
                              }

                            var image_size = page_feature === 'home_slider' ? "Recommended image size is 1400x900 and maximum file size of 25MB" : "Recommended image size is 400x300 and maximum file size of 25MB";
                            return (
                                <Row justify="start" key={index}>
                                    <Col span={24} md={8}>
                                    <Form.Item label={item.attributes.name} name={page_feature} valuePropName="checked" checked={selectedFeatures == page_feature}>
                                        <Switch onChange={(e) => getSelectedFeatures(e ? page_feature : "", (item?.attributes?.type).toLowerCase(), item?.id)}  disabled={formAction == "view-data"} />
                                    </Form.Item>
                                    
                                    </Col>
                                    <Col span={24} md={16}>
                                    <Form.Item label="Source" name={`${page_feature}_source`}>
                                        <Input maxLength={200} disabled={selectedFeatures != page_feature || formAction == "view-data"} />
                                    </Form.Item>
                                   
                                    </Col>
                                    <Col span={24} md={8}>
                                    <Form.Item label="Sort Order" name={`${page_feature}_order`}  rules={[{ required: selectedFeatures == page_feature, message: 'This is required!' }]}>
                                        <InputNumber min={1}  disabled={selectedFeatures != page_feature || formAction == "view-data"} />
                                    </Form.Item>
                                    </Col>
                                    <Col span={24} md={16}>
                                    <Form.Item label={(item.attributes.type).toLowerCase() == "image" ? "Image" : "Video"}>
                                        <Form.Item name={`${page_feature}_file`} valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: false, message: 'This is required!' }]} extra={extra_message}>
                                            <Upload name="logo" action="/upload.do" accept={accept} showUploadList={{showRemoveIcon:formAction != "view-data"}}   listType="picture" maxCount={1}>
                                                {
                                                    formAction != "view-data" ? (
                                                        <Button icon={<UploadOutlined />} disabled={selectedFeatures != page_feature}>Click to upload</Button>
                                                    ) : ""
                                                }
                                            </Upload>
                                        </Form.Item>
                                    </Form.Item>
                                    </Col>
                                </Row>
                            )
                        })
                    }
                    
                    
                </Card>
         </Col>
       </Row>
       </Form>
     </>
     );
}
 
export default Details;