import { Link } from "react-router-dom";

import store from "../../../redux/store";
import { getUser, deleteUser } from "../../../redux/contact/contactActions";

import { Avatar, Popconfirm, Tag } from "antd";
import { User, Delete } from "react-iconly";
import { RiErrorWarningLine } from "react-icons/ri";

// Popconfirm
function confirm(dataId) {
  store.dispatch(deleteUser(dataId))
}

export const columns = [
  {
    title: "",
    dataIndex: "avatar",
    render: (dataIndex) => {
      let imageSplit;

      if (dataIndex[1] != null) {
        imageSplit = dataIndex[1].split(".");
      }

      return (
        <Link
          onClick={() => store.dispatch(getUser(dataIndex[0]))}
          to={`/apps/contact/contact-detail/${dataIndex[0]}`}
        >
          {
            (dataIndex[1] != null) ? (
              (imageSplit[imageSplit.length - 1] == "png" || imageSplit[imageSplit.length - 1] == "jpg" || imageSplit[imageSplit.length - 1] == "svg") ? (
                <Avatar src={dataIndex[1]} size={48} />
              ) : (
                <Avatar size={48}>{dataIndex[1].split(" ")[0][0].toUpperCase() + "" + dataIndex[1].split(" ")[1][0].toUpperCase()}</Avatar>
              )
            ) : (
              <Avatar
                size={48}
                icon={<User set="curved" className="hp-text-align-center" />}
              />
            )
          }
        </Link>
      );
    },
  },
  {
    title: "Name",
    dataIndex: "fullName",
  },
  {
    title: "Role",
    dataIndex: "role",
  },
  {
    title: "Email",
    dataIndex: "email",
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
    title: "Phone",
    dataIndex: "contact",
  },
  {
    dataIndex: "avatar",
    render: (dataIndex) => (
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
        <div className="hp-text-right">
          <Delete
            size={24}
            className="hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 hp-text-color-black-80"
          />
        </div>
      </Popconfirm>
    ),
  },
];
