import { useState, useEffect } from "react";
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
    const {formAction, id} =  useParams();
    const [addData, setVal] = useState("");
    const [pageAction, setPageAction] = useState("");
    const [pageId, setPageId] = useState();
    const [form] = Form.useForm();
    const [btnReload, setBtnReload] = useState(false);
    const [bannerOrder, setBannerOrder] = useState(0);
    const [highlightOrder, setHighlightOrder] = useState(0);
    const [featuredOrder, setFeaturedOrder] = useState(0);
    const [contentType, setContentType] = useState("");
    const [selectedFeatures, setSelectedFeatures] = useState([]);
    const [uploadErrors, setUploadErrors] = useState([]);
    const [isDataFetched, setIsDataFetched] = useState(false);
    const [dataFileSource, setDataFileSource] = useState({})
    const [numFeatures, setNumFeatures] = useState(0);

    
    const dispatch = useDispatch();
    const {page_data, page_links, page_meta, page_details, page_content_types, page_options, status, message} = useSelector((state) => state.pages);
    

    const handleChange = (e, editor) => {
        const data = editor?.getData();
        setVal(data);
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


    useEffect(() => {
        if(pageId){
            dispatch(getPageSetupData({}, pageId))
            .then(() =>{
                setIsDataFetched(true);
            });
            // getDataDetails();
        }
    }, [pageId]);

    const getCreatedFile = (url, fileType) => {
        if(url){
            createFile(url).then(response => {
                if(response)
                    setDataFileSource(prevState => ({ ...prevState, [fileType.toLowerCase()]: response }))
            })
        }
    }

    const getDataDetails = () => {
        getCreatedFile(page_details?.attributes?.banner_image,"Banner");
        getCreatedFile(page_details?.attributes?.featured_image, "Featured");
        getCreatedFile(page_details?.attributes?.thumbnail_image, "Thumbnail");
        console.log(page_details);
        form.setFieldsValue({
            banner_photo: page_details?.attributes?.banner_image ? [{url:page_details?.attributes?.banner_image, name: "Banner"}] : [],
            featured_order: page_details?.attributes?.featured_sort_order ? page_details?.attributes?.featured_sort_order : null,
            featured_photo: page_details?.attributes?.featured_image ? [{url: page_details?.attributes?.featured_image, name: "Featured"}] : [],
            featured_section: page_details?.attributes?.featured_image ? true : false,
            highlight_order: page_details?.attributes?.thumbnail_sort_order ? page_details?.attributes?.thumbnail_sort_order : null,
            thumbnail_photo:page_details?.attributes?.thumbnail_image ? [{url:page_details?.attributes?.thumbnail_image, name: "Thumbnail"}] : [],
            highlight_section: page_details?.attributes?.thumbnail_sort_order ? true : false,
            home_slider: page_details?.attributes?.banner_image ? true : false,
            banner_order: page_details?.attributes?.banner_sort_order ? page_details?.attributes?.banner_sort_order : null,
            status:page_details?.attributes?.status,
            summary:page_details?.attributes?.summary, 
            title:page_details?.attributes?.title,
            content_type_id: page_details?.attributes?.content_type_id
        });
        var features = selectedFeatures;
        if(page_details?.attributes?.featured_image){
            setNumFeatures(prevCount => (prevCount + 1))
            features.push('featured_section');
        }
        if(page_details?.attributes?.banner_image){
            setNumFeatures(prevCount => (prevCount + 1))
            features.push('home_slider');
        }
        if(page_details?.attributes?.thumbnail_image){
            setNumFeatures(prevCount => (prevCount + 1))
            features.push('highlight_section');
        }
       setVal(page_details?.attributes?.body);
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
                if(e?.fileList[index]?.size >= 116208){
                    files.push({...e?.fileList[index]})
                }else{
                    callNotif('Error', `Image size must be greater than or equal to 16.21 KB`, 'error');
                }
            }
        }
        return files;
      };

    const checkImageSize = ({banner_photo = null, thumbnail_photo = null, featured_photo = null}) => {
        var errorCount = 0;
        var arrErrors = [];
        if(banner_photo){
            for (let index = 0; index < banner_photo.length; index++) {
                if(banner_photo[index]?.size < 116208){
                    arrErrors.push({feature: "Banner Image", size: bytesToMegaBytes(banner_photo[index]?.size)})
                    errorCount++;
                }
            }
        }
        if(thumbnail_photo){
            for (let index = 0; index < thumbnail_photo.length; index++) {
                if(thumbnail_photo[index]?.size < 116208){
                    arrErrors.push({feature: "Thumbnail Image", size: bytesToMegaBytes(thumbnail_photo[index]?.size)})
                    errorCount++;
                }
            }
        }
        if(featured_photo){
            for (let index = 0; index < featured_photo.length; index++) {
                if(featured_photo[index]?.size < 116208){
                    arrErrors.push({feature: "Featured Photo", size: bytesToMegaBytes(featured_photo[index]?.size)})
                    errorCount++;
                }
            }
        }
        ;
        setUploadErrors(arrErrors);
        return errorCount ? false : true;
    }
    const onFinish = (values) => {
        
        // if(numFeatures){
            setBtnReload(true);
            var formData = new FormData();
            var dataFormat = {
                data:{
                    type:"pages",
                    attributes:{
                        content_type_id:values.content_type_id,
                        title:values.title,
                        summary:values.summary,
                        body:addData,
                        status:values.status == "submit" ? "submitted" : "draft",
                        banner_sort_order:bannerOrder,
                        thumbnail_sort_order:highlightOrder,
                        featured_sort_order:featuredOrder
                    }
                }
            }
            formData.append("body", JSON.stringify(dataFormat));
            formData.append("thumbnail_image", values?.thumbnail_photo?.length ? (values?.thumbnail_photo[0]?.originFileObj ? values?.thumbnail_photo[0]?.originFileObj : (dataFileSource['thumbnail'] ? dataFileSource['thumbnail'] : null)) : null);
            formData.append("banner_image", values?.banner_photo?.length ? (values?.banner_photo[0]?.originFileObj ? values?.banner_photo[0]?.originFileObj : (dataFileSource['banner'] ? dataFileSource['banner'] : null)) : null);
            formData.append("featured_image", values?.featured_photo?.length ? (values?.featured_photo[0]?.originFileObj ? values?.featured_photo[0]?.originFileObj : (dataFileSource['featured'] ? dataFileSource['featured'] : null)) : null);
           
            if(formAction == "add-data")
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
            if(formAction == "edit-data")
                    // formData.append("_method", "PUT");
                    dispatch(addPageSetupData(formData, pageId))
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
        // }else{
        //     callNotif('Information', "Please select atleast one feature.", 'info')
        // }
        
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
    const onChangeStatus = (checked, feature) => {
        setNumFeatures(prevCount => checked ? (prevCount + 1) : (prevCount - 1) )
        var features = selectedFeatures;
        if(checked){
            features.push(feature);
        }else{
            features.splice(features.indexOf(feature), 1);
        }
        setSelectedFeatures(features);
    }
    const onCancelAction = () => {
        form.setFieldsValue({
            banner_photo: null,
            featured_order: null,
            featured_photo: null,
            featured_section: false,
            highlight_order: null,
            thumbnail_photo:null,
            highlight_section: false,
            home_slider: false,
            banner_order: null,
            status:null,
            summary:null, 
            title:null,
            content_type_id: null,
        });
        setVal("");
        setSelectedFeatures([]);
    }
    if(isDataFetched){
        getDataDetails();
    }
    const getContentType = (id) => {
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

    console.log('page_options', page_options);

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
                            <Input.TextArea showCount maxLength={2000} rows={10} placeholder="Enter Summary" readOnly={formAction == "view-data" ? true : false} />
                        </Form.Item>
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
                    <Row justify="start">
                        <Col span={24} md={8}>
                        <Form.Item label="Home Slider" name="home_slider" valuePropName="checked" >
                            <Switch onChange={(e) => {onChangeStatus(e, 'home_slider')}}  disabled={formAction == "view-data"}/>
                        </Form.Item>
                        <Form.Item label="Sort Order" name="banner_order"  rules={[{ required: selectedFeatures.includes('home_slider'), message: 'This is required!' }]}>
                            <InputNumber min={1}  onChange={(e) => {setBannerOrder(e)}} disabled={!selectedFeatures.includes('home_slider') || formAction == "view-data"} />
                        </Form.Item>
                        </Col>
                        <Col span={24} md={16}>
                        <Form.Item label="Banner">
                            <Form.Item name="banner_photo" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: selectedFeatures.includes('home_slider'), message: 'This is required!' }]}>
                            <Upload name="logo" action="/upload.do" accept="image/png, image/jpeg, image/jpg" showUploadList={{showRemoveIcon:formAction != "view-data"}}   listType="picture" maxCount={1}>
                                {
                                    formAction != "view-data" ? (
                                        <Button icon={<UploadOutlined />} disabled={!selectedFeatures.includes('home_slider')}>Click to upload</Button>
                                    ) : ""
                                }
                            </Upload>
                            </Form.Item>
                        </Form.Item>
                        </Col>
                    </Row>
                    <Divider dashed  />
                    <Row justify="start">
                        <Col span={24} md={8}>
                            <Form.Item label="Highlight Section" name="highlight_section" valuePropName="checked">
                                <Switch onChange={(e) => {onChangeStatus(e, 'highlight_section')}} disabled={formAction == "view-data"}/>
                            </Form.Item>
                            <Form.Item label="Sort Order" name="highlight_order" rules={[{ required: selectedFeatures.includes('highlight_section'), message: 'This is required!' }]}>
                                <InputNumber min={1}  onChange={(e) => {setHighlightOrder(e)}}  disabled={!selectedFeatures.includes('highlight_section')  || formAction == "view-data"}/>
                            </Form.Item>
                        </Col>
                        <Col span={24} md={16}>
                        <Form.Item label="Thumbnail">
                            <Form.Item name="thumbnail_photo" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: selectedFeatures.includes('highlight_section'), message: 'This is required!' }]}>
                            <Upload name="logo" action="/upload.do" accept="image/png, image/jpeg, image/jpg" showUploadList={{showRemoveIcon:formAction != "view-data"}}  listType="picture" maxCount={1}>
                            {
                                    formAction != "view-data" ? (
                                <Button icon={<UploadOutlined />} disabled={!selectedFeatures.includes('highlight_section')}>Click to upload</Button>
                                ) : ""
                            }
                            </Upload>
                            </Form.Item>
                        </Form.Item>
                        </Col>
                        
                    </Row>
                    <Divider dashed  />
                    <Row justify="start">
                        <Col span={24} md={8}>
                        <Form.Item label="Featured Section" name="featured_section" valuePropName="checked">
                            <Switch onChange={(e) => {onChangeStatus(e, 'featured_section')}} disabled={formAction == "view-data"}/>
                        </Form.Item>
                        <Form.Item label="Sort Order" name="featured_order" rules={[{ required: selectedFeatures.includes('featured_section'), message: 'This is required!' }]}>
                            <InputNumber min={1}  onChange={(e) => {setFeaturedOrder(e)}}  disabled={!selectedFeatures.includes('featured_section')  || formAction == "view-data"}/>
                        </Form.Item>
                        </Col>
                        <Col span={24} md={16}>
                        <Form.Item label="Featured Photo">
                            <Form.Item name="featured_photo" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: selectedFeatures.includes('featured_section'), message: 'This is required!' }]}>
                            <Upload name="logo" action="/upload.do" accept="image/png, image/jpeg, image/jpg" showUploadList={{showRemoveIcon:formAction != "view-data"}} listType="picture" maxCount={1}>
                                {
                                        formAction != "view-data" ? (
                                    <Button icon={<UploadOutlined />} disabled={!selectedFeatures.includes('featured_section')}>Click to upload</Button>
                                    ) : ""
                                }
                            </Upload>
                            </Form.Item>
                        </Form.Item>
                        </Col>
                    </Row>
                </Card>
         </Col>
       </Row>
       </Form>
     </>
     );
}
 
export default Details;