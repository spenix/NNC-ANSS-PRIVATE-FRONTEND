import React, {useState, useEffect} from 'react'
import { Row, Col, Button, Alert } from "antd";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import { useDispatch, useSelector } from "react-redux";
// import NoDataImg from '../../../assets/images/anss-image/nodata.png';
import {BASE_URL} from "../../../utils/Constants"
import { RiFileExcel2Line } from "react-icons/ri";

import { uploadDataFile, getUploadDataFile } from "../../../redux/export-data-to-excel/exportDataActions";
import {callNotif} from '../../../utils/global-functions/minor-functions';
function Index() {
    const [loading, setLoading] = useState(false)
    const [viewMsg, setViewMsg] = useState(false)
    const dispatch = useDispatch();
    const {exportData_data, exportData_links, exportData_meta, exportData_details, status, message} = useSelector((state) => state.exportData);

    const openNotificationWithIcon = (type, title = "", msg = "") => {
      callNotif(title, msg, type);
    };
  
    useEffect(() => {
        dispatch(getUploadDataFile);   
    }, [dispatch])

    const getExportedData = () => {
        setViewMsg(true);
        // var strWindowFeatures = "location=yes,height=570,width=520,scrollbars=yes,status=yes";
        window.open(`${BASE_URL}/indicators/ams/export`, '_blank')

        setTimeout(() =>{setViewMsg(false)}, 10000)
        openNotificationWithIcon("success", "AMS Data To Excel was successfully exported")
    }

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
                setLoading(false);
            }
        }
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
              breadCrumbActive="Export AMS Data To Excel"
            />
        </Col>
      </Row>
      <Row>
         <Col span={12}>
            <Button onClick={() => getExportedData()}><RiFileExcel2Line className="remix-icon" /> Export AMS Data</Button>
         </Col>
      </Row>
    </>
  )
}

export default Index