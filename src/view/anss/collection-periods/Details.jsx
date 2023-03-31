import { useState, useEffect } from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { Row, Col, Button, Card, Form, Input, Space, Switch, notification } from "antd";

// for Redux imports
import { getAllData, addCollectionPeriodData } from "../../../redux/collection-period/collectionPeriodActions";
import { useDispatch, useSelector } from "react-redux";

import {RiArrowLeftSLine} from "react-icons/ri";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import {callNotif} from '../../../utils/global-functions/minor-functions';
const Details = ({...props}) => {
    var actions = ["add-data", "edit-data", "view-data"];
    const history = useHistory();
    const [loadAddUserBtn, setLoadAddUserBtn] = useState(false);
    const {formAction, id} =  useParams();
    const [collectionPeriodId, setCollectionPeriodId] = useState();
    const [dataStatus, setDataStatus] = useState(true);
    const [fields, setFields] = useState([
        {
          name: ['collection_period'],
          value: "",
        },
        {
            name: ['status'],
            value: dataStatus,
        },
      ]);

    const dispatch = useDispatch();
    const {collectionPeriod_data, collectionPeriod_links, collectionPeriod_meta, collectionPeriod_details, status, message} = useSelector((state) => state.collectionPeriod);
   
    function isBase64(str) {
        if (str ==='' || str.trim() ===''){ return false; }
        try {
            return window.btoa(window.atob(str)) == str;
        } catch (err) {
            return false;
        }
    }
    
    const openNotificationWithIcon = (type, title = "", msg = "") => {
        callNotif(title, msg, type);
      };

    const checkFormAction = () => {
        var count = actions.filter(item => {
            return item == formAction;
        }).length;
        return count ? true : false
    } 
    
    // component useEffects();
    useEffect(() => {
        setTimeout(() => {
            if(isBase64(id) == false || checkFormAction() != true){
                history.push('/collection-periods');
            }else{
                if(formAction != "add-data"){
                    setCollectionPeriodId(window.atob(id));
                }
            }
        }, 1000);
        dispatch(getAllData());
    }, [id]);


    useEffect(() => {
        if(collectionPeriodId){
            getDataDetails();
        }
       
    }, [collectionPeriodId]);


    const onChangeStatus = (checked) => {
        setDataStatus(checked)
      }
    
    const getDataDetails = () => {
        const detail = collectionPeriod_data.filter((item) => {
            if(item.id == collectionPeriodId){
                return item;
            }
        });
        setFields([
              {
                name: ['collection_period'],
                value: detail[(detail.length - 1)]?.attributes?.name,
              },
              {
                  name: ['status'],
                  value:  detail[(detail.length - 1)]?.attributes?.is_active,
              },
        ]);
    }

    const onFinish = (values) => {
        setLoadAddUserBtn(true);
        if(formAction == "add-data")
            dispatch(addCollectionPeriodData({
                name:values.collection_period,
                is_active: values.status
            })).then(() => {
                setLoadAddUserBtn(false);
                openNotificationWithIcon('success', "Success", "Collection Period is successfully added.");
                onCancelAction();
            })
    }
    
    const onCancelAction = () => {
        setFields([
            {
              name: ['collection_period'],
              value: "",
            },
            {
                name: ['status'],
                value: true,
            },
          ]);
          setDataStatus(true)
    }

    const btnActions = () => {
        if(formAction != "view-data")
            return (
                <Row justify="end" align="middle">
                    <Col span={24} md={24}>
                        <Space>
                            <Button onClick={onCancelAction}>Cancel</Button>
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

    // inline css
    const cardStyle = { width: "100%", margin: "10px 0 10px 0", boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" }
    
    return ( 
    <>
    <Form
      fields={fields}
      layout="vertical"
      onFieldsChange={(_, allFields) => {
        setFields(allFields);
      }}
      onFinish={onFinish}
    >
        <div className="hp-mb-10">
         <Row gutter={[16, 16]} justify="space-between">
            <Col md={15} xs={24} span={24}>
            <BreadCrumbs
                breadCrumbParent="Maintenance"
                breadCrumbActive="Collection Period"
            />
            </Col>
            <Col md={9} xs={24} span={24} align="end">
               <Link to="/collection-periods">
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
         <Card style={cardStyle}>
                <Row className="flex justify-start ">
                    <Col span={24} md={16}>
                        <Form.Item
                            name="collection_period"
                            label="Collection Period"
                            rules={[{ required: true, message: 'This is required!' }]}
                        >
                            <Input placeholder="Enter Collection Period" readOnly={formAction == "view-data"}/>
                        </Form.Item>
                    </Col>
                    <Col span={24} md={12}>
                        <Form.Item name="status" label="Status: Is Active?" >
                            <Switch  checked={dataStatus} onChange={onChangeStatus} disabled={formAction == "view-data"}/>
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