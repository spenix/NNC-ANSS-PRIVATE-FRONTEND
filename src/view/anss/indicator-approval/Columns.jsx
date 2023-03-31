import { Link } from "react-router-dom";
import store from "../../../redux/store";
import { deleteIndicator } from "../../../redux/indicators-approval/inidicatorsApprovalAction";
import { Popconfirm, Space } from "antd";
import { Delete, EditSquare } from "react-iconly";
import { RiErrorWarningLine, RiEyeLine } from "react-icons/ri";

// Popconfirm
function confirm(dataId) {
  store.dispatch(deleteIndicator(dataId))
}

export const columns = [
  {
    title: "Reporting Year",
    dataIndex: "year",
    align: "left",
  },
  {
    title: "No. of Indicators",
    dataIndex: "indicators_no",
    align: "center",
  },
  {
    title: "Action(s)",
    dataIndex: "key",
    align: "center",
    width: '15%',
    render: (dataIndex) => (
      <Space>
           {/* <Link
                 to={`/countries/detail/${dataIndex}`}
            >
                <RiEyeLine set="broken"  size={24}
                  className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
            </Link> */}
           <Link
             to={`/indicator-approval/detail/${dataIndex}`}
          >
              <EditSquare set="broken"  size={24}
                  className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
          </Link>
          {/* <Popconfirm
              placement="topLeft"
              title="Are you sure to delete this indicator types"
              onConfirm={() => confirm(dataIndex)}
              okText="Yes"
              cancelText="No"
              icon={
              <RiErrorWarningLine className="remix-icon hp-text-color-primary-1" />
              }
          >
              <Delete
                  size={24}
                  className="hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 hp-text-color-black-80"
              />
          </Popconfirm> */}
        </Space>
      ),
  },
  
];
