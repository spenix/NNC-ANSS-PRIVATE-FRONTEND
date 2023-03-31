import React from 'react'
import { Row, Col, Image } from "antd";
import BreadCrumbs from '../../../layout/components/content/breadcrumbs';
import NoDataImg from '../../../assets/images/anss-image/nodata.png';
function UserManual(props) {
    const {attributes: {description, document_url}} = props;
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
              breadCrumbActive="User Manual"
            />
        </Col>
      </Row>
      {
        document_url ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li style={{ fontSize: "16px", marginBottom: "10px" }}><b>Description: </b> {description ? description : "N/A"}</li>
            <li className="hp-mb-32">
              <iframe src={document_url} width="100%" height="800px"></iframe>
            </li>
          </ul>
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

export default UserManual