import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, Select, Space, Switch, Upload, Divider, InputNumber } from "antd";
import {RiArrowLeftSLine} from "react-icons/ri";
import {CKEditor} from "@ckeditor/ckeditor5-react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
const Details = ({...props}) => {
    const history = useHistory();
    const {formAction, id} =  useParams();
    const [status, setStatus] = useState(true);
    const [addData, setVal] = useState("");
    const [addedData, showData] = useState(0);

    const handleChange = (e, editor) => {
        const data = editor.getData();
        setVal(data);
    }

    useEffect(() => {
        setTimeout(() => {
            if(isBase64(id) == false || checkFormAction() != true){
                history.push('/origins');
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
    
    const onChangeStatus = (checked) => {
        setStatus(checked)
      }
    return ( 
    <>
    <Form
      layout="vertical"
    >
        <div className="hp-mb-10">
         <Row gutter={[16, 16]} justify="space-between">
            <Col md={15} xs={24} span={24}>
                <BreadCrumbs
                    breadCrumbActive="Origins"
                />
            </Col>
            <Col md={9} xs={24} span={24} align="end">
               <Link to="/origins">
                             <Button
                             type="text"
                             shape="square"
                             style={{backgroundColor:"#F0F8FF"}}
                             ><RiArrowLeftSLine size={24} />Return</Button>
                         </Link>
           </Col>
         </Row>
       </div>
       <Row justify="space-between" gutter={[16, 16]} Style={{padding:"10px"}}>
         <Col span={24} md={24}>
         <Card style={cardStyle}>
                <Row class="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="origin"
                            label="Origin"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input placeholder="Enter Origin" />
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item name="status" label="Status: Is Active?" >
                            <Switch  checked={status} value={status} onChange={onChangeStatus} />
                        </Form.Item>
                    </Col>
                </Row>
                <Row justify="end" align="middle">
                    <Col span={24} md={24}>
                        <Space>
                            <Button>Cancel</Button>
                            {/* <Button type="primary"  className="hp-bg-warning-1">Save & Add Another</Button> */}
                            <Button type="primary">Save</Button>
                        </Space>
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