import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, List, Button, Modal, message as msg_notif } from "antd";
import { RiCloseFill, RiCloseCircleLine, RiCheckboxCircleLine, RiInformationLine  } from "react-icons/ri";

import {  SocialProgramDataApproval } from "../../../redux/social-protection-program/socialProgramActions";
import { useDispatch, useSelector } from "react-redux";
import {callNotif} from '../../../utils/global-functions/minor-functions';
const AmsModal = (props) => {
  const { open, toggleSidebar, dataSelected, actionSelected, setSuccessTrans } = props
  const modalActionState = { 
    'approve': 'approved', 
    'return': 'returned'
  }
  const { confirm } = Modal;
  const dispatch = useDispatch();
  const {status, message} = useSelector((state) => state.socialProgram);
  const [form] = Form.useForm();

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
            clearErrMessage();
        }
       
    }
}

const clearErrMessage = () => {
  dispatch({
      type: 'SET_SOCIAL_PROGRAM_DATA_MESSAGE',
      status: '',
      msg: '',
  });
}

  const onFinish = (values) => {
    confirm({
      title: `Are you sure you want to ${actionSelected} ${dataSelected.length > 1 ? "these" : "this"} social protection ${dataSelected.length > 1 ? "programmes" : "programme"}?`,
      icon: (
        <span className="remix-icon">
            <RiInformationLine />
          </span>
      ),
      content: `This action will tag ${dataSelected.length > 1 ? "these" : "this"} as ${modalActionState[actionSelected]} and cannot be undone.`,
      okText:"Yes",
      onOk() {
        submitData(values);
      },
    });
  }

  const submitData = (values) => {
    var count = 0;
    for (let index = 0; index < dataSelected.length; index++) {
      var params = {
        status:modalActionState[actionSelected],
        remarks:values.remark ?? "N/A"
      }
      dispatch(
        SocialProgramDataApproval(params, dataSelected[index]?.id)
        ).then(() => {
          if(dataSelected.length == 1){
            setSuccessTrans(true);
            msg_notif.success({
              content: `${dataSelected[index]?.attributes?.name} data was successfully ${modalActionState[actionSelected]}.`,
              icon: <RiCheckboxCircleLine className="remix-icon" />,
            });
          }
          
      }).catch(() => {
        errMsg();
      });
      count++;
    }
    if(dataSelected.length == count){
      setSuccessTrans(true);
      if(dataSelected.length > 1){
        msg_notif.success({
          content: `Indicator data was successfully ${modalActionState[actionSelected]}.`,
          icon: <RiCheckboxCircleLine className="remix-icon" />,
        });
      }
    }
    
    form.setFieldsValue({
      remark: ""
    });
  }
  const handleFormWidthCancel = () => {
    toggleSidebar();
  };

  const modalBtn = () => {
    return (
      <Row gutter={[8, 8]} justify="end">
          <Col>
           
            <Button type="test" onClick={handleFormWidthCancel}>
              Cancel
              </Button>
          </Col>
          <Col>
            <Button
              type="primary"
              className={ actionSelected.toUpperCase() == "RETURN" ? "hp-bg-danger-1 hp-border-color-danger-1 hp-hover-bg-danger-2 hp-hover-border-color-danger-2" : "hp-bg-primary-1 hp-border-color-primary-1 hp-hover-bg-primary-2 hp-hover-border-color-primary-2"}
              htmlType="submit"
            >
              {actionSelected.toUpperCase()}
              </Button>
          </Col>
        </Row>
    );
  }

    return ( 
      <Modal
      title={`SOCIAL PROTECTION PROGRAMME TO BE ${actionSelected?.toUpperCase() == "APPROVE" ? "APPROVED" : "RETURNED"}`}
      width={800}
      visible={open}
      onCancel={toggleSidebar}
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
          <Col span={24}>
          <List
          itemLayout="horizontal"
          dataSource={dataSelected}
          renderItem={(item, index) => (
            <List.Item key={index} style={{border: '1px solid #DCDCDC', padding: '10px', borderRadius: '10px', margin: '5px', boxShadow:'10px'}}>
              <List.Item.Meta
                description={(
                  <ul style={{listStyle:"none", marginLeft: 0, paddingLeft: 0, color:"black"}}>
                    <li><b>Programme Name: </b>{item?.attributes?.name}</li>
                    <li><b>Description: </b>{item?.attributes?.description  }</li>
                    <li><b>Enrollment Criteria: </b>{item?.attributes?.criteria}</li>
                    <li><b>Benefits: </b>{item?.attributes?.benefits}</li>
                    <li><b>Scale: </b>{item?.attributes?.scale}</li>
                    {item?.attributes?.url ? (<li><b>Link: </b><a href={item?.attributes?.url} target="_blank">{item?.attributes?.url}</a></li>): ""}
                        {
                          item?.attributes?.document_url ? (
                            <>
                              <li>
                              <b>Document: </b>
                              <a href={item?.attributes?.document_url} target="_blank">View document</a>
                              </li>
                              <li>
                              <b>Language Availability: </b>
                              {item?.attributes?.language}
                              </li>
                            </>
                            
                          ) : ""
                        }
                  </ul>
              )}
              />
            </List.Item>
          )}
        />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="Remarks"
              name="remark"
              onCancel={form.setFieldsValue({
                remark: ""
              })}
              rules={[{ required: actionSelected == 'approve' ? false: true, message: 'This is required!' }]}>
              <Input.TextArea rows={5} />
            </Form.Item>
          </Col>
        </Row>
        {modalBtn()}
      </Form>
    </Modal>
     );
}
 
export default AmsModal;