import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, notification, Space, Switch } from "antd";

// for Redux imports
import { addDataSourceTypeData, getDataSourceTypeData, editDataSourceTypeData } from "../../../redux/dataSourceTypes/dataSourceTypesActions";
import { useDispatch, useSelector } from "react-redux";

import {RiArrowLeftSLine} from "react-icons/ri";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import { ACTION_EDIT, ACTION_ADD, UPDATED_DATA, ADD_DATA} from '../../../utils/LangConstants';
import {callNotif} from '../../../utils/global-functions/minor-functions';
const Details = (props) => {
    const {pageRoles} = props;
    var actions = [{action_name: "add-data", action:"Add"}, {action_name: "edit-data", action:"Edit"}, {action_name: "view-data", action:"View"}];
    const history = useHistory();
    const [loadBtn, setLoadBtn] = useState(false);
    const [pageAction, setPageAction] = useState("");
    const [isDataFetched, setIsDataFetched] = useState(false);
    const {formAction, id} =  useParams();
    const [custodianId, setCustodianId] = useState();
    const [dataStatus, setDataStatus] = useState(true);
    const [form] = Form.useForm();
    const [fields, setFields] = useState([
        {
            name: ['status'],
            value: dataStatus,
        },
      ]);

    const dispatch = useDispatch();
    const {dataSourceType_data, dataSourceType_links, dataSourceType_meta, dataSourceType_details, status, message} = useSelector((state) => state.dataSourceTypes);

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

   
    useEffect(() => {
        setTimeout(() => {
            if(isBase64(id) == false || checkFormAction() != true){
                history.push('/data-source-types');
            }else{
                if(formAction != "add-data"){
                    setCustodianId(window.atob(id));
                }
            }
        }, 1000);
        // dispatch(getAllData());
    }, [id]);


    useEffect(() => {
        if(custodianId){
            dispatch(getDataSourceTypeData({}, custodianId))
            .then(() =>{
                setIsDataFetched(true);
            });
            // getDataDetails();
        }
    }, [custodianId]);

    useEffect(() => {
        errMsg();
    }, [status]);

    const errMsg = () => {
        if(typeof status == "string" && status == "error"){
            if(message != "") {
                if(typeof message == "object"){
                    message.forEach(item => {
                        callNotif('Error', item, status)
                    });
                }else{
                    callNotif('Error', message, status)
                    
                }
                setBtnReload(false);
                clearErrMessage();
            }
        }
    }

    const clearErrMessage = () => {
        dispatch({
            type: 'SET_SOURCE_TYPE_DATA_MESSAGE',
            status: '',
            msg: '',
        });
    }

    const onChangeStatus = (checked) => {
        setDataStatus(checked)
      }
    const getDataDetails = () => {
        setFields([
              {
                name: ['data_source_type'],
                value: dataSourceType_details?.attributes?.name,
              },
              {
                name: ['data_source_type_desc'],
                value: dataSourceType_details?.attributes?.description,
              },
        ]);
        setDataStatus(dataSourceType_details?.attributes?.is_active);
        setIsDataFetched(false);
    }

    const onFinish = (values) => {
        var params = {
            name:values.data_source_type,
            description:values.data_source_type_desc,
            is_active: values.status
        }
        setLoadBtn(true);
        if(formAction == "add-data")
            if(pageRoles.includes(ACTION_ADD)){
                dispatch(addDataSourceTypeData(params)).then(() => {
                    setLoadBtn(false);
                    callNotif('Success', `Data Source Type ${ADD_DATA}`, 'success')
                    onClearAction();
                })
            }else{
                callNotif('Information', `Oops! can't execute, you don't have ${ACTION_ADD} permission.`, 'info')
                setLoadBtn(false);
            }
        if(formAction == "edit-data")
            if(pageRoles.includes(ACTION_EDIT)){
                dispatch(editDataSourceTypeData(params, custodianId))
                .then(() =>{
                    setLoadBtn(false);
                    callNotif('Success', `Data Source Type ${UPDATED_DATA}`, 'success')
                    setIsDataFetched(true);
                });
            }else{
                callNotif('Information', `Oops! can't execute, you don't have ${ACTION_EDIT} permission.`, 'info')
                setLoadBtn(false);
            }
    }       

    const onClearAction = () => {
        form.resetFields();
        setDataStatus(true)
    }

    const btnActions = () => {
        if(formAction != "view-data")
            return (
                <Row justify="end" align="middle">
                    <Col span={24} md={24}>
                        <Space>
                            <Button onClick={onClearAction}>Clear</Button>
                            {/* <Button type="primary"  className="hp-bg-warning-1">Save & Add Another</Button> */}
                            <Button 
                             loading={loadBtn}
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
    // inline css
    const cardStyle = { width: "100%", margin: "10px 0 10px 0", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }
    
    return ( 
    <>
    <Form
      fields={fields}
      form={form}
      layout="vertical"
      onFieldsChange={(_, allFields) => {
        setFields(allFields);
      }}
      onFinish={onFinish}
    >
        <div className="hp-mb-10">
         <Row gutter={[16, 16]} justify="space-between" >
            <Col md={15} xs={24} span={24}>
            <BreadCrumbs
                    // breadCrumbParent="Maintenance"
                breadCrumbActive="Data Source Type"
            />
            </Col>
           
            <Col md={9} xs={24} span={24} align="end">
               <Link to="/data-source-types">
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
         <Card title={pageAction+" Data Source Type"} bordered={false}  style={cardStyle}>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="data_source_type"
                            label="Data Source Type"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input placeholder="Enter Data Source Type" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={16}>
                        <Form.Item
                            name="data_source_type_desc"
                            label="Description"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input placeholder="Enter Description" readOnly={formAction == "view-data" ? true : false}/>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item name="status" label="Status: Is Active?" >
                            <Switch  checked={dataStatus} onChange={onChangeStatus} disabled={formAction == "view-data" ? true : false}/>
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