import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Button } from "antd";

import img from "../../../../assets/images/pages/error/403.svg";

export default function Error403() {
  return (
    <Row className="hp-bg-color-primary-4 hp-bg-color-dark-90 hp-text-center">
      <Col className="hp-error-content hp-py-32" span={24}>
        <Row className="hp-h-100" align="middle" justify="center">
          <Col>
            <div className="hp-position-relative hp-mt-sm-0 hp-mt-64 hp-mb-32">
              <div className="hp-error-content-circle hp-bg-dark-100"></div>

              <img className="hp-position-relative hp-d-block hp-m-auto" src={img} alt="403" />
            </div>

            <h1 className="hp-error-content-title hp-mb-sm-0 hp-mb-8 hp-font-weight-300">
              403
            </h1>

            <h2 className="h1 hp-mb-sm-0 hp-mb-16">Forbidden</h2>

            <p className="hp-mb-32 hp-p1-body">You don’t have an access to this page.</p>

            <Link to="/">
              <Button type="primary">Back to Home</Button>
            </Link>
          </Col>
        </Row>
      </Col>

      <Col span={24} className="hp-py-24">
        <p className="hp-mb-0 hp-badge-text">
          COPYRIGHT ©2020 Hypeople, All rights Reserved
        </p>
      </Col>
    </Row>
  );
}
