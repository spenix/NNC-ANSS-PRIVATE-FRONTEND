import React, { useEffect, useState } from 'react'
import { Row, Col, Button, Image } from "antd";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import { getLatestTemplate, showFile } from "../../../redux/userTemplate/userTemplateActions";
import { useDispatch, useSelector } from "react-redux";
import {callNotif} from '../../../utils/global-functions/minor-functions';
import NoDataImg from '../../../assets/images/anss-image/nodata.png';
import moment from "moment-timezone";

export default function userTemplate() {

  const [isFileFetch, setIsFileFetch] = useState(false);
  const dispatch = useDispatch();
  const {lastestTemplate, status, message, fileData} = useSelector((state) => state.userTemplate);

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
        type: 'SET_USER_TEMPLATE_DATA_MESSAGE',
        status: '',
        msg: '',
    });
}

  useEffect(() => {
    dispatch(getLatestTemplate());
  }, []);

  const downloadFile = (file) => {
    let url = lastestTemplate?.attributes?.document_url;
    let trimmedUrl = url.split('.');
    let newUrl = trimmedUrl[0];
    dispatch(showFile(newUrl));
    setIsFileFetch(true);
  }

  const getFileResponse = () => {
    var blob = new Blob([fileData.data]);
    var objectUrl = window.URL.createObjectURL(blob);

    var tempLink = document.createElement('a');
    tempLink.href = objectUrl;
    tempLink.setAttribute('download', `Indicator Data Template [${moment(lastestTemplate?.attributes?.created_at).tz('Asia/Manila').format('LLL')}].xlsx`);
    tempLink.click();
  }

  if(isFileFetch){
    getFileResponse();
    setIsFileFetch(false);
  }
  return (
    <>
        <Row
        className="hp-mb-16"
        gutter={{
          xs: 4,
          sm: 6,
          md: 16,
          lg: 24,
        }}
      >
        <Col className="gutter-row" span={24}>
          <BreadCrumbs
              homePage = "Home"
              // breadCrumbParent="Maintenance"
              breadCrumbActive="Indicator Data Template"
            />
        </Col>
      </Row>
        {
            Object.keys(lastestTemplate).length ? (
                <Row>
                    <Col md={16} span={24} className="hp-mb-16">
                        <label style={{fontWeight: "bold"}}>Description:</label>
                        <p>{lastestTemplate?.attributes?.description ?? "N/A"}</p>
                    </Col>
                    <Col md={16} span={24}>
                            <Button onClick={() => downloadFile(lastestTemplate?.attributes?.document_url)}>Download Template</Button>
                    </Col>
                </Row>
            ) : (
                <Row justify="center">
                    <Col span={24}>
                        <Image width="100%" src={NoDataImg} />
                    </Col>
                </Row>
            )
        }

      
    </>
  )
}
