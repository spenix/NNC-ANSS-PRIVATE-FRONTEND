import { Link } from "react-router-dom";

import store from "../../../redux/store";
import { getAms, deleteAms } from "../../../redux/ams-data/amsActions";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, Popconfirm, Tag, Space } from "antd";
import { User, Delete, EditSquare } from "react-iconly";
import { RiErrorWarningLine } from "react-icons/ri";

import Legends from '../../../utils/global-components/Legends';
import FlagIcon from '../../../utils/global-components/FlagIcon';
const dispatch = useDispatch();
// Popconfirm
const confirm = (dataId) => {
  dispatch(deleteAms({}, dataId))
}
export const columns = [
  {
    title: "Reporting Year",
    dataIndex: "year",
    align: "left",
    sorter: (a, b) => a.year.length - b.year.length,
    sortDirections: ['descend', 'ascend'],
  },
  {
    title: "No. of Indicators",
    dataIndex: "no_indecators",
    render: (dataIndex) =>{
      return (
        <>
          <Tag  color="#59edff">{dataIndex.draft}</Tag>
          <Tag  color="#108ee9">{dataIndex.submitted}</Tag>
          <Tag  color="#87d068">{dataIndex.approved}</Tag>
          <Tag  color="#f50">{dataIndex.returned}</Tag>
        </>
      );
    }
  },
  {
    title: "ACTIONS",
    dataIndex: "key",
    render: (dataIndex) => (
      <Space>
        <Link
            onClick={() => store.dispatch(getAms(dataIndex))}
            to={`/ams-data/detail/${dataIndex}`}
          >
              <EditSquare set="broken"  size={24}
                  className="hp-cursor-pointer hp-transition hp-hover-text-color-info-1 hp-text-color-black-80"/>
          </Link>
        <Popconfirm
          placement="topLeft"
          title="Are you sure to delete this contact?"
          onConfirm={() => confirm(dataIndex)}
          okText="Yes"
          cancelText="No"
          icon={
            <RiErrorWarningLine className="remix-icon hp-text-color-primary-1" />
          }
        >
          {/* <div className="hp-text-right"> */}
            <Delete
              size={24}
              className="hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 hp-text-color-black-80"
            />
          {/* </div> */}
        </Popconfirm>
      </Space>
    ),
  },
];
