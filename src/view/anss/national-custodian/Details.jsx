import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, notification, Space, Switch, Upload, Select } from "antd";

// for Redux imports
import { addCustodianData, getCustodianData, editCustodianData } from "../../../redux/custodian/custodianActions";
import { useDispatch, useSelector } from "react-redux";

import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import {RiArrowLeftSLine} from "react-icons/ri";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import { ACTION_EDIT, ACTION_ADD, UPDATED_DATA, ADD_DATA} from '../../../utils/LangConstants';
import { getAllData as getAllOrganizationsData } from "../../../redux/asian-countries/asianCountriesAction2";
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
    const [ isSysAdd, setIsSysAdd ] = useState(false);
    const [dataFileSource, setDataFileSource] = useState({})

    const dispatch = useDispatch();
    const {custodian_data, custodian_links, custodian_meta, custodian_details, status, message} = useSelector((state) => state.custodian);
    const { myprofile: {roles, organization}} = useSelector((state) => state.users);
    const {memberState_data} = useSelector((state) => state.asianCountries);


    useEffect(() => {
        if(typeof roles == "object"){
            setIsSysAdd(roles.includes("system_administrator"));
            if(roles.includes("system_administrator"))
                dispatch(getAllOrganizationsData()); 
        }
      }, [roles]);

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

    // component useEffects();
    useEffect(() => {
        setTimeout(() => {
            if(isBase64(id) == false || checkFormAction() != true){
                history.push('/national-custodians');
            }else{
                const data = JSON.parse(window.atob(id))
                if(formAction != "add-data"){
                    setCustodianId(window.atob(id));
                }else{
                    form.setFieldsValue({
                        organization_id: data?.org_id
                    });
                }
            }
        }, 1000);
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
            organization_id: custodian_details?.attributes?.organization_id,
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
                      organization_id: isSysAdd ? values.organization_id : organization?.party_id,
                      intl_flag:false
                  }
            }
          }
        formData.append("body", JSON.stringify(dataFormat))
        formData.append("thumbnail", values?.thumbnail?.length ? (values?.thumbnail[0]?.originFileObj ? values?.thumbnail[0]?.originFileObj : (values?.thumbnail[0] !== 'undefined' ? dataFileSource['thumbnail'] : null)) : null);
        setBtnReload(true);
        if(formAction == "add-data")
            if(pageRoles.includes(ACTION_ADD)){
                dispatch(addCustodianData(formData)).then(() => {
                    setBtnReload(false);
                    callNotif("Success", `National Custodian ${ADD_DATA}`, 'success');
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
                    callNotif("Success", `National Custodian ${UPDATED_DATA}`, 'success');
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
    const setCountryField = () => {
        if(isSysAdd)
          return (
                <Col span={24} md={16}>
                    <Form.Item name="organization_id" label="Member state" rules={[{ required: true, message: 'This is required!' }]}>
                      <Select disabled={true} placeholder="Member State">
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
          );
      }
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
                        breadCrumbActive={`National Custodian`}
                />
           </Col>
           <Col md={9} xs={24} span={24} align="end">
                        <Link to="/national-custodians">
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
         <Card title={pageAction+` National Custodian`} bordered={false}  style={cardStyle}>
                <Row className="flex justify-start ">
                    {
                        setCountryField()
                    }
                    <Col span={24} md={16}>
                        <Form.Item
                            name="custodian"
                            label="Custodian"
                            rules={[{ required: true, message: 'This is required!' }]}
                            tooltip="Name of organization or institution that collected/ published the data"
                        >
                            <Input placeholder="Enter Custodian"  readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item label="Logo">
                            <Form.Item name="thumbnail" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: false, message: 'This is required!' }]}
                                tooltip="Logo of the Custodian in .jpg/.png format">
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
                        <Form.Item name="status" label="Status: Is Active?" 
                            tooltip="Identifies if a Custodian is an active contributor in the system">
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