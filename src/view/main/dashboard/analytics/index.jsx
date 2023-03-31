import React from "react";

import { Row, Col } from "antd";

import UpgradePlanCardOneBg from "../../widgets/cards/advance/upgradePlanCardOneBg";
import OrderColumnCardVertical from "../../widgets/cards/statistics/orderColumnCardVertical";
import ActiveUserCardVertical from "../../widgets/cards/statistics/activeUserCardVertical";
import SubsColumnCardVertical from "../../widgets/cards/statistics/subsColumnCardVertical";
import CustomerSupportCardVertical from "../../widgets/cards/statistics/customerSupportCardVertical";
import DownloadCard from "../../widgets/cards/advance/downloadCard";
import EarningsCard from "../../widgets/cards/advance/earningsCard";
import BestTeamCard from "../../widgets/cards/statistics/bestTeamCard";
import ExpensesCard from "./expensesCard";
import AnalyticsProjectTableCard from "./analyticsProjectTableCard";
import AnalyticsVisitersLineCard from "./analyticsVisitersLineCard";
import AnalyticsRevenueRadarCard from "./analyticsRevenueRadarCard";

import { useDispatch, useSelector } from "react-redux";

import {  useHistory } from "react-router-dom";

export default function Analytics() {


  const history = useHistory();

  const { isLoggedIn } = useSelector(state => state.auth);

  if(!isLoggedIn) {

    history.push("/login");

  }

  return (
    <Row gutter={[32, 0]}>
      <Col span={24}>
        <h3>Welcome back, Edward 👋</h3>

        <p className="hp-p1-body hp-mb-0">
          Your current status and analytics are here
        </p>
      </Col>

      <Col span={24} className="hp-my-32">
        <Row gutter={[32, 0]}>
          <Col flex="1" className="hp-overflow-hidden">
            <Row gutter={[32, 32]}>
              <Col span={24}>
                <UpgradePlanCardOneBg />
              </Col>

              <Col span={24}>
                <AnalyticsVisitersLineCard />
              </Col>

              <Col md={6} span={12} className="hp-overflow-hidden">
                <OrderColumnCardVertical />
              </Col>

              <Col md={6} span={12} className="hp-overflow-hidden">
                <ActiveUserCardVertical />
              </Col>

              <Col md={6} span={12} className="hp-overflow-hidden">
                <SubsColumnCardVertical />
              </Col>

              <Col md={6} span={12} className="hp-overflow-hidden">
                <CustomerSupportCardVertical />
              </Col>

              <Col span={24}>
                <BestTeamCard />
              </Col>

              <Col span={24}>
                <EarningsCard />
              </Col>

              <Col span={24}>
                <AnalyticsProjectTableCard />
              </Col>
            </Row>
          </Col>

          <Col className="hp-analytics-col-2">
            <Row gutter={[32, 32]}>
              <Col span={24}>
                <ExpensesCard />
              </Col>

              <Col span={24}>
                <DownloadCard />
              </Col>

              <Col span={24}>
                <AnalyticsRevenueRadarCard />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}
