import { Link } from "react-router-dom";

import store from "../../../../redux/store";
import { getIndicator, deleteIndicator } from "../../../../redux/indicators/indicatorsActions";

import { Popconfirm, Tag } from "antd";
import { Delete, EditSquare } from "react-iconly";
import { RiErrorWarningLine } from "react-icons/ri";

// Popconfirm
function confirm(dataId) {
  store.dispatch(deleteIndicator(dataId))
}

export const columns = [
  {
    title: "Code",
    dataIndex: "code",
    align: "left",
  },
  {
    title: "Indicator Name",
    dataIndex: "fullName",
  },
  {
    title: "Decription",
    dataIndex: "informationText",
    ellipsis: true,
  },
  {
    title: "Source",
    dataIndex: "source",
  },
  {
    title: "National Data",
    dataIndex: "nationalData",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (dataIndex) => {
      if (dataIndex === "inactive") {
        return <Tag color="red">{dataIndex}</Tag>;
      } else if (dataIndex === "pending") {
        return <Tag color="yellow">{dataIndex}</Tag>;
      } else if (dataIndex === "active") {
        return <Tag color="green">{dataIndex}</Tag>;
      }
    },
  },
  {
    title: "Action",
    dataIndex: "avatar",
    render: (dataIndex, index) => (
    <>
         <Link
          onClick={() => store.dispatch(getIndicator(dataIndex[0]))}
          to={`/indicators/detail/${dataIndex[0]}`}
        >
            <EditSquare set="broken"  size={24}
                className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
        </Link>
        <Popconfirm
            placement="topLeft"
            title="Are you sure to delete this contact?"
            onConfirm={() => confirm(dataIndex[0])}
            okText="Yes"
            cancelText="No"
            icon={
            <RiErrorWarningLine className="remix-icon hp-text-color-primary-1" />
            }
        >
            {/* <div className="hp-text-center"> */}
            <Delete
                size={24}
                className="hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 hp-text-color-black-80"
            />
            {/* </div> */}
        </Popconfirm>
      </>
    ),
  },
  
];
