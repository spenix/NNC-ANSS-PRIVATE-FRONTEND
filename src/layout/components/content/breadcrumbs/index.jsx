import { Link } from "react-router-dom";
import { Col, Breadcrumb } from "antd";

const BreadCrumbs = (props) => {
  const {
    breadCrumbParent,
    breadCrumbParent2,
    breadCrumbParent3,
    breadCrumbActive,
    homePage
  } = props;

  return (
    <Col>
      <Breadcrumb className="hp-d-flex hp-flex-wrap">
        <Breadcrumb.Item>
          <Link to="/" style={{fontWeight: "bold", fontSize:"1.125rem"}}>{homePage ? homePage : "Home"}</Link>
        </Breadcrumb.Item>

        {breadCrumbParent === "Components" ? (
          <Breadcrumb.Item>
            <Link to="/components/components-page" style={{fontWeight: "bold", fontSize:"1.125rem"}}>Components</Link>
          </Breadcrumb.Item>
        ) : (
          <Breadcrumb.Item style={{fontWeight: "bold", fontSize:"1.125rem"}}>{breadCrumbParent}</Breadcrumb.Item>
        )}

        {breadCrumbParent2 && (
          <Breadcrumb.Item style={{fontWeight: "bold", fontSize:"1.125rem"}}>{breadCrumbParent2}</Breadcrumb.Item>
        )}

        {breadCrumbParent3 && (
          <Breadcrumb.Item style={{fontWeight: "bold", fontSize:"1.125rem"}}>{breadCrumbParent3}</Breadcrumb.Item>
        )}

        <Breadcrumb.Item style={{fontWeight: "bold", fontSize:"1.125rem"}}>{breadCrumbActive}</Breadcrumb.Item>
      </Breadcrumb>
    </Col>
  );
};

export default BreadCrumbs;