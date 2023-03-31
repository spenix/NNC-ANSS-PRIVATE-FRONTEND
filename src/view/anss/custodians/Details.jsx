import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, notification, Space, Switch, Upload } from "antd";

// for Redux imports
import { addCustodianData, getCustodianData, editCustodianData } from "../../../redux/custodian/custodianActions";
import { useDispatch, useSelector } from "react-redux";

import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import {RiArrowLeftSLine} from "react-icons/ri";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import { ACTION_EDIT, ACTION_ADD, UPDATED_DATA, ADD_DATA} from '../../../utils/LangConstants';
import {successMsg, errorMsg, warningMsg, infoMsg, callNotif, createFile} from '../../../utils/global-functions/minor-functions';
const Details = (props) => {
    const {pageRoles} = props;
    var actions = [{action_name: "add-data", action:"Add"}, {action_name: "edit-data", action:"Edit"}, {action_name: "view-data", action:"View"}];
    const history = useHistory();
    const [btnReload, setBtnReload] = useState(false);
    const [pageAction, setPageAction] = useState("");
    const [isDataFetched, setIsDataFetched] = useState(false);
    const {formAction, id} =  useParams();
    const [custodianId, setCustodianId] = useState();
    const [dataStatus, setDataStatus] = useState(true);
    const [form] = Form.useForm();
    const [dataFileSource, setDataFileSource] = useState({})

    const dispatch = useDispatch();
    const {custodian_data, custodian_links, custodian_meta, custodian_details, status, message} = useSelector((state) => state.custodian);
    const { myprofile: {roles} } = useSelector((state) => state.users);
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

    // const openNotificationWithIcon = (type, msg = "", desc = "") => {
    //     notification[type]({
    //       message: msg,
    //       description: desc,
    //     });
    //   };
    
    // component useEffects();
    useEffect(() => {
        setTimeout(() => {
            if(isBase64(id) == false || checkFormAction() != true){
                history.push('/international-custodians');
            }else{
                if(formAction != "add-data"){
                    setCustodianId(window.atob(id));
                }
            }
        }, 1000);
        // dispatch(getAllData());
    }, [id]);

    useEffect(() => {
        errMsg();
    }, [message]);

    useEffect(() => {
        onCancelAction();
    }, [form])

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
            type: 'SET_CUSTODIAN_DATA_MESSAGE',
            status: '',
            msg: '',
        });
    }

    useEffect(() => {
        if(custodianId){
            dispatch(getCustodianData({}, custodianId))
            .then(() =>{
                setIsDataFetched(true);
            });
            // getDataDetails();
        }
    }, [custodianId]);


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
        getCreatedFile(custodian_details?.attributes?.thumbnail,"Thumbnail");
        form.setFieldsValue({
            custodian: custodian_details?.attributes?.name,
            thumbnail: custodian_details?.attributes?.thumbnail ? [{url: custodian_details?.attributes?.thumbnail, name: "Thumbnail"}] : [],
            status: custodian_details?.attributes?.is_active
        });
        setDataStatus(custodian_details?.attributes?.is_active)
        setIsDataFetched(false);
    }


    const onFinish = (values) => {
        var formData = new FormData();
        var dataFormat = {
            data:{
              attributes:
                  {
                      name:values.custodian,
                      is_active:values.status,
                      intl_flag: true
                  }
            }
          }
        formData.append("body", JSON.stringify(dataFormat))
        formData.append("thumbnail", values?.thumbnail?.length ? (values?.thumbnail[0]?.originFileObj ? values?.thumbnail[0]?.originFileObj : (dataFileSource['thumbnail'] ? dataFileSource['thumbnail'] : null)) : null);
        setBtnReload(true);
        if(formAction == "add-data")
            if(pageRoles.includes(ACTION_ADD)){
                dispatch(addCustodianData(formData)).then(() => {
                    setBtnReload(false);
                    callNotif("Success", `International Custodian ${ADD_DATA}`, 'success');
                    onCancelAction();
                }).catch(() => {
                    errMsg();
                })
            }else{
                callNotif("Information", `Oops! can't execute, you don't have ${ACTION_ADD} permission.`, 'info');
                setBtnReload(false);
            }
           
        if(formAction == "edit-data")
            if(pageRoles.includes(ACTION_EDIT)){
                formData.append("_method", "PUT");
                dispatch(editCustodianData(formData, custodianId))
                .then(() =>{
                    setBtnReload(false);
                    callNotif("Success", `International Custodian ${UPDATED_DATA}`, 'success');
                    setIsDataFetched(true);
                }).catch(() => {
                    errMsg();
                })
            }else{
                callNotif("Information", `Oops! can't execute, you don't have ${ACTION_EDIT} permission.`, 'info');
                setBtnReload(false);
            }
    }       

    const onCancelAction = () => {
        form.resetFields([
            'thumbnail',
            'status',
            'custodian'
        ]);
          setDataStatus(true)
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
                             loading={btnReload}
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
      form = {form}
      layout="vertical"
      onFinish={onFinish}
    >
       <div className="hp-mb-10">
         <Row gutter={[16, 16]} justify="space-between">
            <Col md={15} xs={24} span={24}>
                <BreadCrumbs
                        // breadCrumbParent="Maintenance"
                        breadCrumbActive={`International Custodian`}
                />
           </Col>
           <Col md={9} xs={24} span={24} align="end">
                        <Link to="/international-custodians">
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
         <Card title={pageAction+` International Custodian`} bordered={false}  style={cardStyle}>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="custodian"
                            label="Custodian"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input placeholder="Enter Custodian"  readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item label="Logo">
                            <Form.Item name="thumbnail" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: false, message: 'This is required!' }]}>
                            <Upload name="logo" action="/upload.do" accept="image/png, image/jpeg, image/jpg" showUploadList={{showRemoveIcon:formAction != "view-data"}}  listType="picture" maxCount={1}>
                                {
                                    formAction != "view-data" ? (
                                        <Button icon={<UploadOutlined />}>Click to upload</Button>
                                    ) : ""
                                }
                            </Upload>
                            </Form.Item>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item name="status" label="Status: Is Active?" >
                            <Switch  checked={dataStatus} onChange={onChangeStatus}  disabled={formAction == "view-data" ? true : false}/>
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