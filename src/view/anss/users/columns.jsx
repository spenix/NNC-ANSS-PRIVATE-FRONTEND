import { Link, useHistory } from "react-router-dom";

import store from "../../../redux/store";
// import { getUser, deleteUser } from "../../../redux/contact/contactActions";
import { getUser, deleteUser } from "../../../redux/users/usersActions";


import { Avatar, Popconfirm, Tag } from "antd";
import { User, Delete, TickSquare, CloseSquare, Show } from "react-iconly";
import { RiErrorWarningLine } from "react-icons/ri";
// const history = useHistory();
// Popconfirm


function confirm(dataId) {
  store.dispatch(deleteUser(dataId))
}


function handleDelete(id) {
  console.log(id);
}

function handleClickView(id) {

  store.dispatch(getUser(id));

  // history.push("/users/user-detail/" + id);

}

export const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    sorter:true,
    render: name => name.first_name + ' ' + name.last_name,
    width: '20%',
  },
  {
    title: 'Email',
    dataIndex: 'email',
    sorter:true,
    width: '20%',
  },
  {
    title: 'AMS',
    dataIndex: 'organization',
    sorter:true,
    width: '15%',
  },
  {
    title: 'Role',
    dataIndex: 'roles',
    // sorter: true,
    render: (roles) => {
      return roles.map((role, i) => {
          // Return the element. Also pass key
          return <Tag key={i}>{role}</Tag>;
       })
    },
    width: '20%',
  },
  {
    title: "Status",
    dataIndex: "status",
    width: "10%",
    align: "center",
    sorter: (a, b) => a.status.length - b.status.length,
    sortDirections: ['descend', 'ascend'],
    render: (dataIndex) => (
      <Tag color={dataIndex == 'active' ? "green" : "red"}>{dataIndex == 'active' ? "Active" : "Inactive"}</Tag>
    )
  },
  {
    title: 'Action',
    dataIndex: 'action_data',
    render: (_, record) => {

      return (
        <div className="hp-text-left">
        {record.status == 'active' ? (
          <Popconfirm title="Are you sure you want to deactivate this user?" onConfirm={() => handleDelete(record.id)}>

          <CloseSquare
            size={24}
            className="hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 hp-text-color-black-80"
          />
        </Popconfirm>

        ) : (<Popconfirm title="  Are you sure you want to activate this user?" onConfirm={() => handleDelete(record.id)}>
            <TickSquare
              size={24}
              className="hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 hp-text-color-black-80"
            />
          </Popconfirm>)}

          {/* <Link
            onClick={() => store.dispatch(getUser(record.id))}
            // to={`/users/user-detail/${record.id}`}
          > */}
            <Show
              onClick={() => handleClickView(record.id)}
              size={24}
              className="hp-cursor-pointer hp-transition hp-hover-text-color-danger-1 hp-text-color-black-80"
            />

          {/* </Link> */}

        </div>
      )



    },
    width: '15%',
  },
];
