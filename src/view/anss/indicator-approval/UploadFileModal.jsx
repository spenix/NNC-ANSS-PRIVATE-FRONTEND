import React, {useEffect, useState} from "react";
import {  ImportIndicatorData } from "../../../redux/ams-data/amsActions";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Form, Input, Button, Modal, Upload, List, Alert } from "antd";
import { RiCloseFill } from "react-icons/ri";
import { UploadOutlined } from '@ant-design/icons';
import {callNotif} from '../../../utils/global-functions/minor-functions';
import Scrollbars from "react-custom-scrollbars";

export default function UploadFileModal(props) {
  const {open, toggleImport} = props;
  const [btnReload, setBtnReload] = useState(false);
  const [uploadFileMsgs, setUploadFileMsgs] = useState([]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const {amsData_data, amsData_meta, amsData_links, UploadFileMsg, message, status} = useSelector((state) => state.ams);

  useEffect(() => {
    errMsg();
  }, [status]);

  useEffect(() => {
    form.setFieldsValue({
      program_document: null
    })
    setUploadFileMsgs([]);
  }, [toggleImport])

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
        }
    }
}

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const modalBtn = () => {
    return (
      <Row gutter={[8, 8]} justify="end" style={{borderTop: '1px solid #d4d8d9', paddingTop: '10px'}}>
          <Col>
            <Button type="test" onClick={() => toggleImport()}>
              Cancel
              </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              loading={btnReload}
              htmlType="submit"
            >
              Submit
              </Button>
          </Col>
        </Row>
    );
  }

  useEffect(() => {
    if(UploadFileMsg){
      if(typeof UploadFileMsg == "object"){
        const { attributes } = UploadFileMsg;
        if(typeof attributes == "object"){
          setUploadFileMsgs(attributes);
        }else{
          setUploadFileMsgs([]);
          callNotif("Success", "Indicator data was imported successfully.", 'success');
          toggleImport();
        }
      }else{
        callNotif("Success", "Indicator data was imported successfully.", 'success');
        toggleImport();
      }
    }
  }, [UploadFileMsg])

  const onFinish = (values) => {
    var formData = new FormData();
        var dataFormat = {
            data:{
              attributes:
                  {
                    
                  }
            }
          }
        formData.append("body", JSON.stringify(dataFormat))
        formData.append("import_file", values?.program_document?.length ?  values?.program_document[0]?.originFileObj : null);

      dispatch(ImportIndicatorData(formData))
      .then(() => {
        setBtnReload(false);
      })
      .catch(() => {
        errMsg();
    })  
  }

  return (
    <Modal
      title="Upload Indicator Data"
      width={500}
      visible={open}
      onCancel={toggleImport}
      footer={null}
      closeIcon={
        <RiCloseFill
          className="remix-icon text-color-black-100"
          size={24}
        />
      }
    >
      <Form
        form={form}
        layout="vertical"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Row>
          <Col md={24} span={24}>
          <Form.Item label="Document" extra={"Upload document must be in .xlsx, .xls, & .csv file type up to 25 MB."}>
                            <Form.Item name="program_document" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: false, message: 'This is required!' }]}>
                            <Upload name="logo" action="/upload.do" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" showUploadList={{showRemoveIcon:true}}  listType="picture" maxCount={1}>
                              <Button icon={<UploadOutlined />}>Click to upload</Button>
                            </Upload>
                            </Form.Item>
                        </Form.Item>
          </Col>
          <Scrollbars
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            autoHeight
            autoHeightMin={0}
            autoHeightMax={200}
            thumbMinSize={30}>
            <Col md={24} span={24}>
              {
                uploadFileMsgs.length ? (                  
                  <List
                  header={<Alert message="Something went wrong. Please check and try again." type="error" />}
                  itemLayout="horizontal"
                  dataSource={uploadFileMsgs}
                  renderItem={(item) => (
                      <List.Item>
                        <List.Item.Meta
                          title={"Row No.: "+item?.row}
                          description={
                            item?.errors.map(error => {
                              return (
                              <>
                              <p>{error}</p><br/>
                              </>)
                            })
                          }
                        />
                      </List.Item>
                    )}
                    />
                    ) : ""
                  }
            </Col>
          </Scrollbars>
        </Row>
        {modalBtn()}
      </Form>
    </Modal>
  )
}
