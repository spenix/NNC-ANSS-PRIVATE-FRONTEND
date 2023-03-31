import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Form, Input, Button, Row, Col, Select, notification, Modal, Divider, Radio, DatePicker, Tooltip, Space, List } from 'antd';
import { InfoCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import debounce from "lodash/debounce";
import moment from 'moment-timezone';
import { useHistory } from "react-router-dom";
import {
  RiCloseFill,
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiInformationLine,
  RiFileList3Line
} from "react-icons/ri";
// Redux
import { addAmsData, updateAmsData, statusHandler, getDataSource, getDataSourceIntl, getAmsDataByParams } from "../../../../redux/ams-data/amsActions";
import { getAllData as getAllCustodianData } from "../../../../redux/custodian/custodianActions";
import { getAllData as getAllDataSourceTypes } from "../../../../redux/dataSourceTypes/dataSourceTypesActions";
import { useDispatch, useSelector } from 'react-redux';
import { SAVE_SUCCESS, DRAFTED_SUCCESS, SUBMITTED_SUCCESS, CONFIRM_SUBMIT, APPROVE_INDICATORS, RETURN_SUBMIT } from '../../../../utils/LangConstants';
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../../../utils/LangConstants';
import {callNotif} from '../../../../utils/global-functions/minor-functions';
export default function DetailForm({setIndicatorIndex, indicatorIndex, setReloadIndicatorList, indicator, year, country, organization_id, action})  {
  const [form] = Form.useForm();
  const [btnStatus, setBtnStatus] = useState('draft');
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const remarks = useRef("");
  const [datasource_selected, setDatasourceSelected] = useState({});
  const [dataSource, setDataSource] = useState("National");
  const [remarksList, setRemarksList] = useState([]);
  const [documentUrl, setDocumentUrl] = useState("");
  const { message, amsData, amsId, amsStatus, dataSources  } = useSelector(state => state.ams);
  const { custodian_data } = useSelector(state => state.custodian);
  const { pageRoles } = useSelector(state => state.auth);
  const { myprofile: {roles, organization} } = useSelector((state) => state.users);
  const history = useHistory();
  const { confirm } = Modal;
  const { TextArea } = Input;
  useEffect(() => {
    form.resetFields();
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
      resource:"National",
      custodian:null,
      title:null,
      date_published:"",
      link:"",
    });
    setRemarksList([]);
    setDocumentUrl("");
    setDataSource("National");
  }

  
const showClearConfirm = () => {
  confirm({
    title: 'Are you sure you want to continue?',
    icon: (
      <span className="remix-icon">
          <RiInformationLine />
        </span>
    ),
    content: 'This action will discard any changes made to this form and cannot be undone.',
    okText:"Yes",
    onOk() {
      clearFormFields();
    },

    // onCancel() {
    //   console.log('Cancel');
    // },
  });
};
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
        <p className="hp-p1-body hp-text-color-black-80">
          {
                    roles?.includes("system_administrator") ? "This action will submit this data entry and automatically tag as approved data" : "This action will submit this data entry and will undergo an approval process."
                }
        </p>
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
        source_type:resultData?.attributes?.datasource_type?.name ? resultData?.attributes?.datasource_type?.name : "",
        origin:resultData?.attributes?.origin,
        nationalData:resultData?.attributes?.national_data,
        collPeriod:resultData?.attributes?.collection_period,
        resource:resultData?.attributes?.datasource?.intl_flag ? (resultData?.attributes?.datasource?.intl_flag ? "International" : "National") : "National",
        custodian:resultData?.attributes?.datasource?.custodian_id ? resultData?.attributes?.datasource?.custodian_id : null,
        title: resultData?.attributes?.datasource?.title ? resultData?.attributes?.datasource?.title : "",
        date_published:resultData?.attributes?.datasource?.publication_date ? moment(`${resultData?.attributes?.datasource?.publication_date}-1-1`) : null,
        link:resultData?.attributes?.datasource?.url ? resultData?.attributes?.datasource?.url : "",
      });
      setDataSource(resultData?.attributes?.datasource?.intl_flag ? (resultData?.attributes?.datasource?.intl_flag ? "International" : "National") : "National");
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
      status: roles?.includes("system_administrator") ? (amsDataStatus == "submitted" ? "approved" : amsDataStatus) : amsDataStatus,
      year,
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
    const successMsg = btnStatus == "submit" ? SUBMITTED_SUCCESS : DRAFTED_SUCCESS;
    setLoadingBtn(true);
    if(amsId == null) {
      if(pageRoles.includes(ACTION_ADD)){
        dispatch(
          addAmsData(params)
        )
        .then(() => {
          setReloadIndicatorList(true);
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
          setReloadIndicatorList(true);
          openSuccessNotification(successMsg);
          setLoadingBtn(false);
          if(action == "edit" && btnStatus == "submit"){
            history.push("/data-entry");
          }else{
            delayedSearch(params);
          }
          
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

    console.log("trigger", action, btnStatus);
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
        <h5 className="hp-mb-0 hp-font-weight-500">View Remarks</h5>
      ),
      width: 600,
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
                        <b>STATUS:</b> {item.status == "returned"? "Returned": "Approved"}
                      </small>
                    </li>
                    <li>
                      <small>
                        <b>{(item.status).toUpperCase()} DATE:</b> {moment(item.created_at).tz('Asia/Manila').format('LLL z')}
                      </small>
                    </li>
                  </ul>
              )}
              />
            </List.Item>
          )}
        />
       
      ),
      okText: "Cancel",
      okButtonProps: {
        type:"default",
        className: 'hp-btn-outline hp-text-color-black-100 hp-border-color-black-100 hp-hover-bg-black-100'
      },
      onOk() {},
    });
  }

  const renderButtons = () => {
    if(amsStatus == "draft" || amsStatus == "returned") {
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
    setDataSource(e.target.value);
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
          dispatch(getDataSource({intl_flag: false, custodian_id:value, party_id:organization_id, year: year}))
        break;
      }
      default: {
          dispatch(getDataSourceIntl({custodian_id:value, year:year}))
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
        source_type:attributes?.datasource_type?.name,
        date_published:moment(`${attributes?.publication_date}-1-1`),
        link:attributes?.url,
      });
    }
  }

  const openFileDocument = (documentUrl) => {
    if(documentUrl)
        window.open(documentUrl, "_blank");
  }

  const viewRemarksBtn = () => {
        return (<>
          
            {
              remarksList.length ? (
                <Col span={12}>
                  <Button type="primary" align="middle"  size="small" onClick={infoModal}><RiFileList3Line className="remix-icon"/> View Remarks</Button>
                </Col>
              ) : ""
            }
            {documentUrl ? (
            <Col span={12}>
                <Button type="primary" size="small" onClick={() => {openFileDocument(documentUrl)}} className="hp-bg-info-1 hp-border-color-info-1 hp-hover-bg-info-2 hp-hover-border-color-info-2">
                  Document
                </Button>
            </Col>
            ) : ""}
          </>
        );
  }

    return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
     <Row justify="space-between" gutter={{
          xs: 4,
          sm: 6,
          md: 16,
          lg: 24,
        }}>
         <Col span={8}>
         <Form.Item label="Origin" name="origin" rules={[{ required: true, message: 'This is required!' }]}
          tooltip="
          Source of Indicator data :    
            Reported - actual data reported 
            Reanlyzed - data reanlyzed to fit globally-accepted indicators">
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
         <Col span={16}>
            <Space>
              <Form.Item label="National Data" name="nationalData" rules={[{ required: true, message: 'This is required!' }]}
                tooltip={`Prevalence of the indicator data  (in ${indicator?.item?.attributes?.datatype})`}
                >
              
                <Input
                  placeholder={"Input Data in "+indicator?.item?.attributes?.datatype}
                  disabled={disabled}
                  style={{ width: 240 }}
                
                />
                
                
              </Form.Item>
              <Tooltip title={"the specific unit of measure of  an indicator data (e.g. %, grams, kcal/person/day…etc.)"}>
                  <Space>
                      <InfoCircleOutlined
                        style={{
                          color: 'rgba(0,0,0,.45)',
                        }}
                      />
                      <label>{indicator?.item?.attributes?.datatype}</label>
                  </Space>
              </Tooltip> 
            </Space>
         </Col>
     </Row>
     <Divider orientation="left">Data Source Entry</Divider>
     <Row justify="space-between" gutter={[16, 16]}>
        <Col span={8}>
        <Form.Item label="Resource" name="resource" 
          tooltip="Type of data collecting organization or institution">
          <Radio.Group onChange={onChangeResource}>
            <Radio value={"National"} disabled={disabled}>National</Radio>
            <Radio value={"International"} disabled={disabled}>International</Radio>
          </Radio.Group>
          </Form.Item>
        </Col>
        
        <Col span={16}>
              <Form.Item label="Custodian" name="custodian" rules={[{ required: true, message: 'This is required!' }]}
                tooltip="Name of organization or institution that collected/ published the data">
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
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'This is required!' }]}
            tooltip="Name of the publication (report or survey) containing the data">
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
            <Form.Item label="Source Type" name="source_type"
              tooltip="Methodology used in gathering the data (e.g., household surveys, population-based census, etc.)">
                <Input placeholder="Source Type" autoComplete="off" style={{cursor:"not-allowed"}} readOnly/>
            </Form.Item>
          </Col>
        <Col span={8}>
            <Form.Item label="Year Published" name="date_published"
              tooltip="Coverage year of the published title">
              <DatePicker style={{ width: "100%"}} picker="year" onChange={onChangeDatePicker} placeholder="Date Published" disabled/>
            </Form.Item>
        </Col>
        <Col span={16}>
        <Form.Item label="Link" name="link" 
          tooltip="Web page address to reach a website or portal">
              <Input placeholder="Link" style={{cursor:"not-allowed"}} autoComplete="off" readOnly/>
            </Form.Item>
        </Col>
        {
          viewRemarksBtn()
        }
     </Row>
     
      <Row justify="end" align="middle" gutter={[8]}>
        {
          amsStatus == "draft" || amsStatus == "returned" ? 
          (
            <Col span={4}>
              <Form.Item>
                <Button type="default" align="middle" onClick={showClearConfirm}>Clear</Button>
              </Form.Item>
            </Col>
          ) : ""
        }
        
        {renderButtons()}
      </Row>
    </Form>
  );
};
