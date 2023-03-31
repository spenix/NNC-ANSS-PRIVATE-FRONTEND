import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Form, Input, Button, Row, Col, Select, notification, Modal, Divider, Radio, DatePicker, Tooltip, Space, List } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import debounce from "lodash/debounce";
import moment from 'moment';
import { Link } from "react-router-dom";
import {
  RiCloseFill,
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiInformationLine,
  RiFileList3Line
} from "react-icons/ri";

// Redux
import { addAmsData, updateAmsData, statusHandler, getDataSource, getDataSourceIntl, getAmsDataByParams } from "../../../redux/ams-data/amsActions";
import { getAllData as getAllCustodianData } from "../../../redux/custodian/custodianActions";
import { getAllData as getAllDataSourceTypes } from "../../../redux/dataSourceTypes/dataSourceTypesActions";
import { useDispatch, useSelector } from 'react-redux';
import { SAVE_SUCCESS, SUBMITTED_SUCCESS, CONFIRM_SUBMIT, APPROVE_INDICATORS, RETURN_SUBMIT } from '../../../utils/LangConstants';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../utils/LangConstants';
import {callNotif, createFile} from '../../../utils/global-functions/minor-functions';
export default function DetailForm({setIndicatorIndex, indicatorIndex, indicator, year, country, organization_id})  {
  const [form] = Form.useForm();
  const [btnStatus, setBtnStatus] = useState('draft');
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const remarks = useRef("");
  const [datasource_selected, setDatasourceSelected] = useState({});
  const [dataSource, setDataSources] = useState("National");
  const [remarksList, setRemarksList] = useState([]);
  const [documentUrl, setDocumentUrl] = useState("");
  const { message, amsData, amsId, amsStatus, dataSources  } = useSelector(state => state.ams);
  const { custodian_data } = useSelector(state => state.custodian);
  const { pageRoles } = useSelector(state => state.auth);

  const { confirm } = Modal;
  const { TextArea } = Input;
  useEffect(() => {
    populateIndicatorData();
    if(amsStatus == "submitted" || amsStatus == "approved") {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [amsData, amsStatus])

  useEffect(() => {
    clearFormFields();
  }, [form]);

  
  // Redux
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllCustodianData({organization_id, intl_flag: dataSource == 'International'}));
    dispatch(getAllDataSourceTypes());
  }, [dispatch, dataSource])

  // ----- notifications -----
  const openSuccessNotification = (message) => {
    notification.open({
      message: "Success",
      description: message,
      icon: <RiCheckboxCircleFill style={{ color: "#00F7BF" }} />,
      closeIcon: (
        <RiCloseFill className="remix-icon hp-text-color-black-80" size={24} />
      ),
    });
  };

  const clearFormFields= () => {
    form.setFieldsValue({
      source_type:"",
      origin:null,
      nationalData:"",
      collPeriod:null,
      resource:dataSource,
      custodian:null,
      title:null,
      date_published:"",
      link:"",
    });
  }

  const openNotificationWithIcon = (type, title = "", msg = "") => {
    callNotif(title, msg, type);
  };

  const openErrorNotification = () => {
    if(message)
      notification.open({
        message: "Error",
        description: message,
        icon: <RiErrorWarningFill style={{ color: "#FF0022" }} />,
        closeIcon: (
          <RiCloseFill className="remix-icon hp-text-color-black-80" size={24} />
        ),
      });
  };

  function showSubmitConfirm(params) {
    confirm({
      title: (
        <h5 className="hp-mb-0 hp-font-weight-500">
          {CONFIRM_SUBMIT}
        </h5>
      ),
      icon: (
        <span className="remix-icon">
          <RiInformationLine />
        </span>
      ),
      content: (
        <p className="hp-p1-body hp-text-color-black-80"></p>
      ),
      okText: "Yes",
      okType: "primary",
      cancelText: "No",
      onOk() {
        saveAmsData(params, btnStatus);
      },
      onCancel() {},
    },[params]);
  }

  // const getDataSourceTypeName = (id) => {
  //   var res = dataSourceType_data.filter(item => {
  //     return item.id == id
  //   });
  //   return res.length ? res[0]?.attributes?.description : "";
  // }

  const populateIndicatorData = () => {
    const resultData = amsData?.data;
    if(resultData) {
      setRemarksList(resultData?.attributes?.remarks ? resultData?.attributes?.remarks : []);
      form.setFieldsValue({
        source_type:resultData?.attributes?.datasource_type?.description ? resultData?.attributes?.datasource_type?.description : "",
        origin:resultData?.attributes?.origin,
        nationalData:resultData?.attributes?.national_data,
        collPeriod:resultData?.attributes?.collection_period,
        resource:resultData?.attributes?.datasource?.intl_flag ? (resultData?.attributes?.datasource?.intl_flag ? "International" : "National") : "National",
        custodian:resultData?.attributes?.datasource?.custodian_id ? resultData?.attributes?.datasource?.custodian_id : null,
        title: resultData?.attributes?.datasource?.title ? resultData?.attributes?.datasource?.title : "",
        date_published:resultData?.attributes?.datasource?.publication_date ? moment(resultData?.attributes?.datasource?.publication_date) : null,
        link:resultData?.attributes?.datasource?.url ? resultData?.attributes?.datasource?.url : "",
      });
      setDataSources(resultData?.attributes?.datasource?.intl_flag ? (resultData?.attributes?.datasource?.intl_flag ? "International" : "National") : "National");
    }
  }  

  const onFinish = (values) => {
    const amsDataStatus  = btnStatus == "submit" ? "submitted" : "draft";
  
    const params = {
      repository_id: indicator?.item?.id,
      datasource_id: datasource_selected?.id ? datasource_selected?.id : amsData?.data?.attributes?.datasource?.id,
      datasource_type_id: datasource_selected?.attributes?.datasource_type?.id ? datasource_selected?.attributes?.datasource_type?.id : amsData?.data?.attributes?.datasource.datasource_type_id,
      organization_id: organization_id,
      origin: values.origin,
      status: amsDataStatus,
      year: year,
      national_data: values.nationalData,
  }
    if(btnStatus == "submit") {
      showSubmitConfirm(params);
    } else {
      saveAmsData(params, btnStatus);
    }
  }
  const onClickApprovedOrReturned = (status) => {
    confirm({
      title: (
        <h5 className="hp-mb-0 hp-font-weight-500">
          {status == 'approved'? APPROVE_INDICATORS : RETURN_SUBMIT}
        </h5>
      ),
      icon: (
        <span className="remix-icon">
          <RiInformationLine />
        </span>
      ),
      content: (
        <p className="hp-p1-body hp-text-color-black-80">
          <TextArea placeholder='Remarks' onKeyUp={(e) => {remarks.current = e.target.value}}/>
        </p>
      ),
      okText: status == 'approved' ? "Approve" : "Return",
      okType: status == 'approved' ? "primary" : "danger",
      cancelText: "Close",
      onOk() {
        callStatusHandler(status);
      },
      onCancel() {},
    },[]);
  }
  const callStatusHandler = (status) => {
    const data  = {
      status: status,
      remarks: remarks.current
    }
    dispatch(
      statusHandler(amsId, data)
    )
    .then(() => {
      openSuccessNotification(`Data entry has been ${status} successfully!`);
      setLoadingBtn(false);
    })
    .catch((e) => {
      setLoadingBtn(false);
      openErrorNotification();
    });
  }

  const saveAmsData = (params, btnStatus) => {
    const successMsg = btnStatus == "submit" ? SUBMITTED_SUCCESS : SAVE_SUCCESS;
    setLoadingBtn(true);
    if(amsId == null) {
      if(pageRoles.includes(ACTION_ADD)){
        dispatch(
          addAmsData(params)
        )
        .then(() => {
          openSuccessNotification(successMsg);
          setLoadingBtn(false);
          delayedSearch(params);
        })
        .catch((e) => {
          setLoadingBtn(false);
          openErrorNotification();
        });
      }else{
            openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have permission.`);
            setLoadingBtn(false);
      }
      
    } else {
      if(pageRoles.includes(ACTION_EDIT)){
        dispatch(
          updateAmsData(params, amsId)
        )
        .then(() => {
          openSuccessNotification(successMsg);
          setLoadingBtn(false);
          delayedSearch(params);
        })
        .catch((e) => {
          setLoadingBtn(false);
          openErrorNotification();
        });
      }else{
            openNotificationWithIcon('info', "Information", `Oops! can't execute, you don't have permission.`);
            setLoadingBtn(false);
      }
    }
  }

  const fetchUpdatedData = ({year, repository_id, organization_id}) => {
      dispatch(getAmsDataByParams(
        {
          year,
          repository_id,
          organization_id
        }
      ));
  }

  const delayedSearch = useCallback(
    debounce((q) => fetchUpdatedData(q), 500),
    []
  );

  
function infoModal() {
    Modal.info({
      icon: (
          <RiFileList3Line className="remix-icon"/>
      ),
      title: (
        <h5 className="hp-mb-0 hp-font-weight-500">Remarks</h5>
      ),
      content: (
        <List
          itemLayout="horizontal"
          dataSource={remarksList}
          renderItem={(item, index) => (
            <List.Item key={index} style={{border: '1px solid #DCDCDC', padding: '10px', borderRadius: '10px', margin: '5px', boxShadow:'10px'}}>
              <List.Item.Meta
                title={item.remarks}
                description={(
                  <ul style={{listStyle:"none", marginLeft: 0, paddingLeft: 0}}>
                    <li>
                      <small>
                        <b>Status:</b> {item.status}
                      </small>
                    </li>
                    <li>
                      <small>
                        <b>Submitted Date:</b> {moment(item.created_at).format('LL')}
                      </small>
                    </li>
                  </ul>
              )}
              />
            </List.Item>
          )}
        />
       
      ),
      onOk() {},
    });
  }

  const renderButtons = () => {
    if(amsStatus == "draft" || amsStatus == "returned") {
    //   return (
    //     <>
    //       <Col span={6}>
    //         <Form.Item>
    //           <Button value="sadf" type="primary" 
    //             className="hp-bg-success-1 hp-border-color-success-1 hp-hover-bg-success-2 hp-hover-border-color-success-2"
    //             block
    //             loading={loadingBtn}
    //             onClick={(e) => onClickApprovedOrReturned("approved")}
    //             align="middle"
    //             disabled={loadingBtn}>
    //               Approve
    //           </Button>
    //         </Form.Item>
    //       </Col>
    //       <Col span={4}>
    //         <Form.Item >
    //               <Button 
    //                   type="primary" 
    //                   loading={loadingBtn}
    //                   className="hp-bg-danger-1 hp-border-color-danger-1 hp-hover-bg-danger-2 hp-hover-border-color-danger-2"
    //                   block
    //                   onClick={(e) => onClickApprovedOrReturned("returned")}
    //                   align="middle"
    //                   disabled={loadingBtn} 
    //                   >
    //                     Returned
    //               </Button>
    //           </Form.Item>
    //       </Col>
    //     </>
    //   )
    // } else if (amsStatus == "approved") {
    //     return null
    // } else {
      return (
        <>
          <Col span={6}>
            <Form.Item>
              <Button value="sadf" type="primary" 
                className="hp-bg-info-1 hp-border-color-info-1 hp-hover-bg-info-2 hp-hover-border-color-info-2"
                htmlType='submit'
                block
                loading={loadingBtn}
                onClick={(e) => setBtnStatus("draft")}
                align="middle" 
                disabled={loadingBtn}>
                  Save as Draft
              </Button>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item >
                  <Button 
                      type="primary" 
                      htmlType='submit'
                      loading={loadingBtn}
                      block
                      onClick={(e) => setBtnStatus("submit")}
                      align="middle" 
                      disabled={loadingBtn}
                      >
                        Submit
                  </Button>
              </Form.Item>
          </Col>
        </>
      )
      
    }
  }
  const onChangeResource = (e) => {
    dispatch(getAllCustodianData({organization_id, intl_flag: e.target.value == 'International'}));
    setDataSources(e.target.value);
    form.setFieldsValue({
      source_type:"",
      custodian:null,
      title:null,
      date_published:"",
      link:"",
    });
  };
  
  const onChangeDatePicker = (date, dateString) => {
    setPublishedDate(dateString);
  }
  const getDataSourceDatas = (value) => {
    setDocumentUrl("");
    switch (dataSource) {
      case "National": {
          dispatch(getDataSource({intl_flag: false, custodian_id:value, party_id:organization_id}))
        break;
      }
      default: {
          dispatch(getDataSourceIntl({custodian_id:value}))
        break;
      }
    }
    form.setFieldsValue({
      source_type:"",
      title:null,
      date_published:"",
      link:"",
    });
  }

  const getDataSourceType = (val) => {
    var res = dataSources.filter(item => {
      return item.id == val
    });
    if(res.length) {
      setDatasourceSelected(res[0])
      const {attributes, id} = res[0];
      setDocumentUrl(attributes?.document_url)
      form.setFieldsValue({
        source_type:attributes?.datasource_type?.description,
        date_published:moment(attributes?.publication_date),
        link:attributes?.url,
      });
    }
  }

  const openFileDocument = (documentUrl) => {
    if(documentUrl)
        window.open(documentUrl, "_blank");
  }

  const viewRemarksBtn = () => {
      if(remarksList.length){
        return (<>
          <Col span={12}>
            <Button type="primary" align="middle"  size="small" onClick={infoModal}><RiFileList3Line className="remix-icon"/> View Remarks</Button>
          </Col>
          <Col span={12}>
            {documentUrl ? (
            <Link to={documentUrl} className="btn btn-primary">
              <Button type="primary" size="small" className="hp-bg-info-1 hp-border-color-info-1 hp-hover-bg-info-2 hp-hover-border-color-info-2">
                Document
              </Button>
            </Link>
            ) : ""}
          </Col>
          </>
        );
      }else{
        return (
          <Col span={24}>
            {documentUrl ? (
              <Button type="primary" size="small" className="hp-bg-info-1 hp-border-color-info-1 hp-hover-bg-info-2 hp-hover-border-color-info-2" onClick={() => {openFileDocument(documentUrl)}}>
                Document
              </Button>
            ) : ""}
          </Col>
        )
      }
  }

    return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
     <Row justify="space-between" gutter={[16, 16]}>
         <Col span={12}>
         <Form.Item label="Origin" name="origin" rules={[{ required: true, message: 'This is required!' }]}>
            <Select
              placeholder="Select Origin"
               showSearch
                   optionFilterProp="children"
                   filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              disabled={disabled}
            >
              <Select.Option value="reported">Reported</Select.Option>
              <Select.Option value="reanalyzed">Reanalyzed</Select.Option>
            </Select>
            </Form.Item>
         </Col>
         <Col span={12}>
            <Space>
              <Form.Item label="National Data" name="nationalData" rules={[{ required: true, message: 'This is required!' }]}>
              
                <Input
                  placeholder={"Input Data "+indicator?.item?.attributes?.datatype}
                  disabled={disabled}
                  style={{ width: 240 }}
                
                />
                
              
              </Form.Item>
              <Tooltip title={"Please input a valid "+ indicator?.item?.attributes?.datatype+" data."}>
                  <Space>
                      <InfoCircleOutlined
                        style={{
                          color: 'rgba(0,0,0,.45)',
                        }}
                      />
                      <label>{indicator?.item?.attributes?.datatype ? "Percentage" : indicator?.item?.attributes?.datatype}</label>
                  </Space>
              </Tooltip> 
            </Space>
         </Col>
         
     </Row>
     <Divider orientation="left">Data Source Entry</Divider>
     <Row justify="space-between" gutter={[16, 16]}>
        <Col span={8}>
        <Form.Item label="Resource" name="resource">
          <Radio.Group onChange={onChangeResource}>
            <Radio value={"National"} disabled={disabled}>National</Radio>
            <Radio value={"International"} disabled={disabled}>International</Radio>
          </Radio.Group>
          </Form.Item>
        </Col>
        
        <Col span={16}>
              <Form.Item label="Custodian" name="custodian" rules={[{ required: true, message: 'This is required!' }]}>
                <Select
                  placeholder="Select Custodian"
                   showSearch
                   optionFilterProp="children"
                   filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    disabled={disabled}
                    onChange={getDataSourceDatas}
                >
                  {
                    custodian_data.map((item, index) => {
                      return <Select.Option key={index} value={item?.id}>{item.attributes.name}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
          </Col>
          <Col span={8}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'This is required!' }]}>
                <Select
                  placeholder="Select Title"
                   showSearch
                   optionFilterProp="children"
                   filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                  disabled={disabled}
                  onChange={getDataSourceType}
                >
                  {
                    dataSources.map((item, index) => {
                      return <Select.Option key={index} value={item.id}>{item.attributes.title}</Select.Option>
                    })
                  }
                </Select>
              </Form.Item>
          </Col>
          <Col span={16}>
            <Form.Item label="Source Type" name="source_type">
                <Input placeholder="Source Type" autoComplete="off" style={{cursor:"not-allowed"}} readOnly/>
            </Form.Item>
          </Col>
        <Col span={8}>
            <Form.Item label="Date Published" name="date_published">
              <DatePicker style={{ width: "100%"}}  onChange={onChangeDatePicker} placeholder="Date Published" disabled/>
            </Form.Item>
        </Col>
        <Col span={16}>
        <Form.Item label="Link" name="link">
              <Input placeholder="Link" style={{cursor:"not-allowed"}} autoComplete="off" readOnly/>
            </Form.Item>
        </Col>
        {
          viewRemarksBtn()
        }
     </Row>
     
      <Row justify="end" align="middle" gutter={[16]}>
        <Col span={4}>
          <Form.Item>
            <Button type="default" align="middle" onClick={clearFormFields}>Clear</Button>
          </Form.Item>
        </Col>
        {renderButtons()}
      </Row>
    </Form>
  );
};
