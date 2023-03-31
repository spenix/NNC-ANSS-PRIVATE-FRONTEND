import React from "react";

import { Row, Col, Card, Button, List, Avatar, Dropdown, Menu } from "antd";
import {
  RiMoneyDollarCircleLine,
  RiMore2Line,
  RiArrowRightUpLine,
  RiArrowRightDownLine,
  RiArrowLeftRightLine,
} from "react-icons/ri";

export default function ExchangeRates() {
  const data = [
    {
      title: "USD",
      description: "American Dollar",
      icon: (
        <RiArrowRightUpLine
          size={24}
          className="hp-mr-8 hp-text-color-success-1"
        />
      ),
      rate: <p className="hp-text-color-success-1 hp-m-0">%2.01</p>,
    },
    {
      title: "TRY",
      description: "Turkish Liras",
      icon: (
        <RiArrowRightDownLine
          size={24}
          className="hp-mr-8 hp-text-color-danger-1"
        />
      ),
      rate: <p className="hp-text-color-danger-1 hp-m-0">%0.39</p>,
    },
    {
      title: "BTC",
      description: "Bitcoin",
      icon: (
        <RiArrowLeftRightLine
          size={24}
          className="hp-mr-8 hp-text-color-info-1"
        />
      ),
      rate: <p className="hp-text-color-info-1 hp-m-0">%1.01</p>,
    },
    {
      title: "EUR",
      description: "Euro",
      icon: (
        <RiArrowRightUpLine
          size={24}
          className="hp-mr-8 hp-text-color-success-1"
        />
      ),
      rate: <p className="hp-text-color-success-1 hp-m-0">%3.2</p>,
    },
    {
      title: "GDP",
      description: "Pound",
      icon: (
        <RiArrowRightUpLine
          size={24}
          className="hp-mr-8 hp-text-color-success-1"
        />
      ),
      rate: <p className="hp-text-color-success-1 hp-m-0">%1.2</p>,
    },
  ];

  const rateMenu = (
    <Menu>
      <Menu.Item key="1">Last 28 Days</Menu.Item>
      <Menu.Item key="2">Last Month</Menu.Item>
      <Menu.Item key="3">Last Year</Menu.Item>
    </Menu>
  );

  const header = (
    <Row>
      <Col span={24}>
        <Row justify="space-between" className="hp-pb-16">
          <h4>Exhange Rates</h4>
          <Dropdown overlay={rateMenu} placement="bottomRight">
            <Button
              type="text"
              size="small"
              icon={
                <RiMore2Line className="hp-text-color-black-80 hp-text-color-dark-30" size={24} />
              }
              style={{ marginRight: -12 }}
            ></Button>
          </Dropdown>
        </Row>
        <Row justify="space-between">
          <p className="hp-caption hp-text-color-black-80 hp-text-color-dark-30">Symbol</p>
          <p className="hp-caption hp-text-color-black-80 hp-text-color-dark-30">%</p>
        </Row>
      </Col>
    </Row>
  );

  return (
    <Card className="hp-exchange-card hp-mb-32">
      <List
        className="hp-p-0"
        itemLayout="horizontal"
        header={header}
        dataSource={data}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar
                  shape="square"
                  size={64}
                  icon={<RiMoneyDollarCircleLine size={24} />}
                />
              }
              title={<a href="#">{item.title}</a>}
              description={item.description}
            />

            <Row align="middle">
              {item.icon} {item.rate}
            </Row>

          </List.Item>
        )}
      />
    </Card>
  );
}