import React, { useState, useEffect } from "react";
import { Row, Col, Form, Input, List, Button, Modal, message as msg_notif } from "antd";
import { RiCloseFill, RiCloseCircleLine, RiCheckboxCircleLine, RiInformationLine  } from "react-icons/ri";

import {  statusHandler } from "../../../redux/ams-data/amsActions";
import { useDispatch, useSelector } from "react-redux";
import {callNotif} from '../../../utils/global-functions/minor-functions';
const AmsModal = (props) => {
  const { open, toggleSidebar, indicatorSelected, ActionVal, setSuccessTrans } = props
  const modalActionState = { 
    'approve': 'approved', 
    'return': 'returned'
  }
  const { confirm } = Modal;
  const dispatch = useDispatch();
  const {message, status } = useSelector((state) => state.ams);
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
      type: 'SET_AMS_DATA_ERROR_MESSAGE',
      status: '',
      msg: '',
  });
}

  const onFinish = (values) => {
    confirm({
      title: `Are you sure you want to ${ActionVal} ${indicatorSelected.length > 1 ? "these" : "this"} indicator data?`,
      icon: (
        <span className="remix-icon">
            <RiInformationLine />
          </span>
      ),
      content: `This action will tag ${indicatorSelected.length > 1 ? "these" : "this"} as ${modalActionState[ActionVal]} and cannot be undone.`,
      okText:"Yes",
      onOk() {
        submitData(values);
      },
    });
  }

  const submitData = (values) => {
    var count = 0;
    for (let index = 0; index < indicatorSelected.length; index++) {
      var params = {
        status:modalActionState[ActionVal],
        remarks:values.remark ?? "N/A"
      }
      console.log(modalActionState[ActionVal]);
      dispatch(
        statusHandler(indicatorSelected[index].key, params)
        ).then(() => {
          if(indicatorSelected.length == 1){
            msg_notif.success({
              content: `${indicatorSelected[index]?.repository_code} data was successfully ${modalActionState[ActionVal]}.`,
              icon: <RiCheckboxCircleLine className="remix-icon" />,
            });
          }
          
      }).catch(() => {
        errMsg();
      });
      count++;
    }
    if(indicatorSelected.length == count){
      setSuccessTrans(true);
      if(indicatorSelected.length > 1){
        msg_notif.success({
          content: `Indicator data was successfully ${modalActionState[ActionVal]}.`,
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
              className={ ActionVal.toUpperCase() == "RETURN" ? "hp-bg-danger-1 hp-border-color-danger-1 hp-hover-bg-danger-2 hp-hover-border-color-danger-2" : "hp-bg-primary-1 hp-border-color-primary-1 hp-hover-bg-primary-2 hp-hover-border-color-primary-2"}
              htmlType="submit"
            >
              {ActionVal.toUpperCase()}
              </Button>
          </Col>
        </Row>
    );
  }

    return ( 
      <Modal
      title={`INDICATOR DATA TO BE ${ActionVal?.toUpperCase() == "APPROVE" ? "APPROVED" : "RETURNED"}`}
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
          dataSource={indicatorSelected}
          renderItem={(item, index) => (
            <List.Item key={index} style={{border: '1px solid #DCDCDC', padding: '10px', borderRadius: '10px', margin: '5px', boxShadow:'10px'}}>
              <List.Item.Meta
                title={'Data Source: '+ item.datasource}
                description={(
                  <ul style={{listStyle:"none", marginLeft: 0, paddingLeft: 0}}>
                    <li>
                        <b>Indicator Code:</b> {item.repository_code}
                    </li>
                    <li>
                        <b>Indicator Name:</b> {item.repository_name}
                    </li>
                    <li>
                        <b>National Data:</b> {item.national_data}
                    </li>
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
              rules={[{ required: ActionVal == 'approve' ? false: true, message: 'This is required!' }]}
            >
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