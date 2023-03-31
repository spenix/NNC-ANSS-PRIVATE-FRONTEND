import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, Select, Space, Switch, Upload, Divider, InputNumber, DatePicker } from "antd";

// for Redux imports
import { getAllData as getAllDataSourceTypes } from "../../../../redux/dataSourceTypes/dataSourceTypesActions";
import { getAllData as getAllCustodianData } from "../../../../redux/custodian/custodianActions";
import { useDispatch, useSelector } from "react-redux";


import {RiArrowLeftSLine} from "react-icons/ri";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import BreadCrumbs from '../../../../layout/components/content/breadcrumbs';
const Details = ({...props}) => {
    const history = useHistory();
    const {formAction, id} =  useParams();
    const [addData, setVal] = useState("");
    const [addedData, showData] = useState(0);

    const dispatch = useDispatch();
    const {dataSourceType_data, dataSourceType_links, dataSourceType_meta, dataSourceType_details} = useSelector((state) => state.dataSourceTypes);
    const {custodian_data, custodian_links, custodian_meta, custodian_details} = useSelector((state) => state.custodian);


    const handleChange = (e, editor) => {
        const data = editor.getData();
        setVal(data);
    }

    useEffect(() => {
        dispatch(getAllDataSourceTypes());
        dispatch(getAllCustodianData());
    }, []);
    useEffect(() => {
        setTimeout(() => {
            if(isBase64(id) == false || checkFormAction() != true){
                history.push('/international-data-sources');
            }
        });
        checkFormAction();
    }, [id]);

    function isBase64(str) {
        if (str ==='' || str.trim() ===''){ return false; }
        try {
            return window.btoa(window.atob(str)) == str;
        } catch (err) {
            return false;
        }
    }
    const checkFormAction = () => {
        var actions = ['add-data', 'edit-data', 'view-data'];
        var count = actions.filter(item => {
            return item == formAction;
        }).length;
        return count ? true : false
    } 
    const cardStyle = { width: "100%", margin: "10px 0 10px 0", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }

    const normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
          return e;
        }
        return e?.fileList;
      };

    return ( 
    <>
    <Form
      layout="vertical"
    >
        <div className="hp-mb-10">
         <Row gutter={[32, 32]} justify="space-between" style={{borderBottom:"1px solid #000", padding:"10px"}}>
           <BreadCrumbs
           breadCrumbParent="Maintenance"
               breadCrumbActive="International Data Source"
           />
            <Col md={15} span={24}>
             <Row justify="end" align="middle" gutter={[16]}>
               <Col xs={12} md={8} xl={4}>
               <Link to="/international-data-sources">
                             <Button
                             type="text"
                             shape="square"
                             style={{backgroundColor:"#F0F8FF"}}
                             ><RiArrowLeftSLine size={24} />Return</Button>
                         </Link>
               </Col>
             </Row>
           </Col>
         </Row>
       </div>
       <Row justify="space-between" gutter={[16, 16]} style={{padding:"10px"}}>
         <Col span={24} md={24}>
         <Card style={cardStyle}>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item label="Source Type" name="source_type" rules={[{ required: true, message: 'This is required!' }]}>
                            <Select
                                placeholder="Select Source Type"
                                allowClear
                            >
                                {
                                    dataSourceType_data.map(item => {
                                        return <Select.Option key={item.id} value={item.id}>{item.attributes.description}</Select.Option>
                                    })
                                }
                                
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item label="Custodian" name="custodian" rules={[{ required: true, message: 'This is required!' }]}>
                            <Select
                                placeholder="Select Custodian"
                                allowClear
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
                            <Input placeholder="Enter Title" />
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
                            <DatePicker className="max-w-full" style={{ width: "100%" }}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="url_source"
                            label="URL"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input placeholder="Enter URL" />
                        </Form.Item>
                    </Col>
                </Row>
                <Row className="flex justify-start ">
                    <Col span={24} md={6}>
                    <Form.Item label="Document">
                            <Form.Item name="policy_document" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                            <Upload name="logo" action="/#" listType="picture">
                                <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>
                            </Form.Item>
                        </Form.Item>
                    </Col>
                </Row>
                    <Row justify="end" align="middle">
                        <Col span={24} md={24}>
                            <Space>
                                <Button>Cancel</Button>
                                <Button type="primary">Save</Button>
                            </Space>
                        </Col>
                    </Row>
                  
            </Card>
         </Col>
         {/* <Col span={24} md={8}>
                <Card style={cardStyle}>
                    <Row className="flex justify-start ">
                        <Col span={24} md={12}>
                        <Form.Item
                            name="status"
                            label="Status"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Select placeholder="Select Status">
                                <option>Draft</option>
                                <option>Submit</option>
                            </Select>
                        </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="end" align="middle">
                        <Col span={24} md={24}>
                            <Space>
                                <Button>Cancel</Button>
                                <Button type="primary">Save</Button>
                            </Space>
                        </Col>
                    </Row>
                </Card> 
                <Card style={cardStyle}>
                    <h4>Features in Homepage</h4>
                    <Row justify="start">
                        <Col span={24} md={8}>
                        <Form.Item label="Home Slider" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        </Col>
                        <Col span={24} md={16}>
                        <Form.Item label="Banner">
                            <Form.Item name="Banner" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                            <Upload name="logo" action="/upload.do" listType="picture">
                                <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>
                            </Form.Item>
                        </Form.Item>
                        </Col>
                        
                    </Row>
                    <Divider dashed  />
                    <Row justify="start">
                        <Col span={24} md={8}>
                        <Form.Item label="Highlight Section" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        </Col>
                        <Col span={24} md={16}>
                        <Form.Item label="Thumbnail">
                            <Form.Item name="thumbnail" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                            <Upload name="logo" action="/upload.do" listType="picture">
                                <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>
                            </Form.Item>
                        </Form.Item>
                        </Col>
                        <Col span={24} md={8}>
                        <Form.Item label="Sort Order">
                            <InputNumber />
                        </Form.Item>
                        </Col>
                    </Row>
                    <Divider dashed  />
                    <Row justify="start">
                        <Col span={24} md={8}>
                        <Form.Item label="Featured Section" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        </Col>
                        <Col span={24} md={16}>
                        <Form.Item label="Photo">
                            <Form.Item name="photo" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                            <Upload name="logo" action="/upload.do" listType="picture">
                                <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>
                            </Form.Item>
                        </Form.Item>
                        </Col>
                        <Col span={24} md={8}>
                        <Form.Item label="Sort Order">
                            <InputNumber />
                        </Form.Item>
                        </Col>
                    </Row>
                </Card>
         </Col> */}
       </Row>
       </Form>
     </>
     );
}
 
export default Details;