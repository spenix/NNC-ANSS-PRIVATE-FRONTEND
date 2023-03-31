import React, {useState, useEffect} from "react";

import { useSelector } from "react-redux";

import { Row, Col, Carousel  } from "antd";

import bg from "../../../assets/images/pages/authentication/authentication-bg.svg";
import bgDark from "../../../assets/images/pages/authentication/authentication-bg-dark.svg";
import logo from "../../../assets/images/logo/logo-vector-blue.svg";
import logoDark from "../../../assets/images/logo/logo-vector.svg";

import anssBg from "../../../assets/images/pages/authentication/anss-login-bg.png";
import anssLogo from "../../../assets/images/logo/anss-logo-only.png";
import anssLogoWithText from "../../../assets/images/logo/anss-logo-new.png";
import http from "../../../utils/httpRequest/HttpRequestUtils";
export default function LeftContent() {
  const [bannerImage, setBannerImage] = useState([])
  const [activeBanner, setActiveBanner] = useState({});
  const onChange = (currentSlide) => {
    setActiveBanner(bannerImage[currentSlide] ? bannerImage[currentSlide] : {});
  };
  const contentStyle = {
    padding: "20px",
    minHeight:"100%",
    minWidth:"100%",
    backgroundPosition: 'center', 
    backgroundSize: 'cover', 
    backgroundRepeat: 'no-repeat',
    align: 'center',
    borderRadius: '5%'
  };
  const contentStyle2 = {
    padding: "20px",
    maxHeight:"100px",
    minWidth:"auto",
    backgroundPosition: 'center', 
    backgroundSize: 'cover', 
    backgroundRepeat: 'no-repeat',
    align: 'center',
    borderRadius: '5%'
  };

const getHomePageFeatures = async () => {
    const { data: {data, links, meta} } = await http.get('cms/pages/contents?content_type_id=1&page_option_id=1');
    setBannerImage(data);
  }

  useEffect(() => {getHomePageFeatures()}, [])

  // Redux
  const theme = useSelector(state => state.customise.theme)
  return (
    <Col lg={12} span={24} className="hp-bg-color-primary-4 hp-bg-color-dark-90 hp-position-relative">
      <Row className="hp-image-row hp-h-100 hp-px-sm-8 hp-px-md-8 hp-pb-sm-32 hp-pt-md-32 hp-pt-md-32">
      <Col className="hp-logo-item hp-m-sm-16 hp-m-md-32 hp-m-64">
          {/* <img src={theme == "light" ? anssLogoWithText : logoDark} alt="Logo" /> */}
        </Col>
        <Col span={24} >
          <Row align="middle" justify="center" className="hp-h-100">
            <Col md={20} span={24} className="hp-bg-item hp-text-center">
            <Carousel autoplay afterChange={onChange}>
              {
                bannerImage.length ?
                (
                  bannerImage.map((item, i) => {
                    return (
                          <div style={{minHeight:"100%"}} key={i} >
                            <img src={item.attributes.image_url} style={contentStyle} alt="Banner Image"/>
                          </div>
                    )
                  })
                ) : ""
                
              }
            </Carousel>
              
            </Col>
            <Col xl={18} span={24} className="hp-text-item hp-text-center">
            <div style={{minHeight:"100%"}}  >
                  <img src={anssLogoWithText} style={contentStyle2} alt="Banner Image"/>
                  <h4 className="hp-mb-sm-0" style={{ color: '#2c5282', fontWeight: 'bold' }}>
                    ASEAN NUTRITION SURVEILLANCE SYSTEM
                  </h4>
                    <p style={{ color: '#2c5282', fontWeight: 'bold' }}>
                      Access to Nutrition Information Across ASEAN
                    </p>
              </div>
            </Col> 
          </Row>
        </Col>
      </Row>
    </Col>
  );
};