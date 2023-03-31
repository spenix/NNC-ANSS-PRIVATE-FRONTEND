import React from "react";

import { Row, Col } from "antd";
import Countdown from "react-countdown";

import img from "../../../../assets/images/pages/error/coming-soon.svg";

export default function ComingSoon() {
  const Completionist = () => <span>You are good to go!</span>;
  const timerClass = "hp-d-block hp-text-color-primary-1";
  const timerTextClass = "hp-d-block hp-text-color-black-80 hp-text-color-dark-30 h4";

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (completed) {
      return <Completionist />;
    } else {
      return (
        <Row align="middle" justify="center">
          <div className="hp-comingsoon-timer-item">
            <span className={timerClass}>{days}</span>
            <span className={timerTextClass}>DAYS</span>
          </div>

          <div className="hp-comingsoon-timer-item">
            <span className={timerClass}>{hours}</span>
            <span className={timerTextClass}>HOURS</span>
          </div>

          <div className="hp-comingsoon-timer-item">
            <span className={timerClass}>{minutes}</span>
            <span className={timerTextClass}>MINUTES</span>
          </div>

          <div className="hp-comingsoon-timer-item">
            <span className={timerClass}>{seconds}</span>
            <span className={timerTextClass}>SECONDS</span>
          </div>
        </Row>
      );
    }
  };

  return (
    <Row className="hp-bg-color-primary-4 hp-bg-color-dark-90 hp-text-center">
      <Col className="hp-error-content hp-py-32" span={24}>
        <Row className="hp-h-100" align="middle" justify="center">
          <Col>
            <div className="hp-position-relative hp-mt-sm-0 hp-mt-64 hp-mb-32">
              <div className="hp-error-content-circle hp-bg-dark-100"></div>

              <img className="hp-position-relative hp-d-block hp-m-auto" src={img} alt="Coming Soon" />
            </div>

            <h1 className="hp-mb-0">We are launching soon</h1>

            <Countdown date="2022-02-01" renderer={renderer} />
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
