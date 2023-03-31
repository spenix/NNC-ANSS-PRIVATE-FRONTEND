import { useEffect } from "react";
import { useParams, Link, useHistory } from "react-router-dom";

// Redux
import { getIndicator } from "../../../redux/indicators/indicatorsActions";
import { useDispatch, useSelector } from "react-redux";

import { Row, Col, Button, Tag, Card, Typography } from "antd";

import {RiArrowLeftSLine} from "react-icons/ri";

import BreadCrumbs from '../../../layout/components/content/breadcrumbs';

const {  Title, Paragraph } = Typography;

export default function Detail() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const {selectedIndicators} = useSelector(state => state.indicators)
  useEffect(() => {
    dispatch(getIndicator(parseInt(id)))
  }, [dispatch])
  // Redux
  const customise = useSelector(state => state.customise)

  return (
      <>
       <div className="hp-mb-10">
        <Row gutter={[32, 32]} justify="space-between">
          <BreadCrumbs
             breadCrumbParent="Maintenance"
             breadCrumbActive="Indicator Repository"
          />
           <Col md={15} span={24}>
            <Row justify="end" align="middle" gutter={[16]}>
              <Col xs={12} md={8} xl={4}>
              <Link to="/indicators">
                            <Button
                            type="text"
                            shape="square"
                            style={{backgroundColor:"#F0F8FF"}}
                            ><RiArrowLeftSLine size={24} />Return</Button>
                        </Link>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
      <Row justify="space-between" gutter={[16, 16]}>
        <Col span={24} md={12}>
        <Card title="Indicators Detail" style={{ width: "100%", minHeight: "500px"}}>
        <Typography>
        <Title>{selectedIndicators?.name}</Title>
        <Paragraph>
            {selectedIndicators?.description}
        </Paragraph>
        <Tag style={{ color: selectedIndicators?.status == "Active" ? "green" : "red"}}>{selectedIndicators?.status}</Tag>
        </Typography>
           
        </Card>
        </Col>
      </Row>
    </>
  )
};