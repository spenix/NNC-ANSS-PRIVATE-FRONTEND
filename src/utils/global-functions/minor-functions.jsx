import { message, notification } from 'antd';
import {
  RiCloseFill,
  RiCheckboxCircleFill,
  RiErrorWarningFill,
  RiInformationLine,
  RiAlarmWarningLine
} from "react-icons/ri";

export const successMsg = (msg) => {
  message.success(msg);
};

export const errorMsg = (msg) => {
  message.error(msg);
};

export const warningMsg = (msg) => {
  message.warning(msg);
};

export const infoMsg = (msg) => {
    message.info(msg);
  };

  export const insertArrVal = (arr, index, ...newItems) => [
    ...arr.slice(0, index),
    ...newItems,
    ...arr.slice(index)
  ]

export const bytesToMegaBytes = (bytes) => {
    return (bytes / (1024 ** 2))
}
export const callNotif = (title = '', msg = '', status = 'info', placement = 'topRight') => {

  switch (status) {
    case "success" : {
        notification.success({
          message: title,
          description: msg,
          placement,
          icon: <RiCheckboxCircleFill style={{ color: "#00F7BF" }} />,
          closeIcon: (
            <RiCloseFill className="remix-icon hp-text-color-black-80" size={24} />
          ),
        });
      break;
    }
    case "warning" : {
        notification.warning({
          message: title,
          description: msg,
          placement,
          icon: <RiAlarmWarningLine style={{ color: "#f26d27" }} />,
          closeIcon: (
            <RiCloseFill className="remix-icon hp-text-color-black-80" size={24} />
          ),
        });
      break;
    }
    case "error" : {
        notification.error({
          message: title,
          description: msg,
          placement,
          icon: <RiErrorWarningFill style={{ color: "#FF0022" }} />,
          closeIcon: (
            <RiCloseFill className="remix-icon hp-text-color-black-80" size={24} />
          ),
        });
      break;
    }
    default : {
      notification.info({
        message: title,
        description: msg,
        placement,
        icon: <RiInformationLine style={{ color: "#108ee9" }} />,
          closeIcon: (
            <RiCloseFill className="remix-icon hp-text-color-black-80" size={24} />
          ),
      });
    }
  }
}

export const getSystemRoles = (param) => {
  const roles = {
    data_manager: 'Data Manager', 
    focal_point: 'Focal Point', 
    secretariat: 'ASEAN Secretariat', 
    system_administrator: 'Functional Systems Administrator'
  };

  return  roles[param];

}

export const createFile = async (fileUrl) => {
  if(fileUrl){
    let response = await fetch(fileUrl).catch(err => console.log(err));
    if (response?.status === 200) { 
      let data = await response.blob();
      let metadata = {
          type: data.type || 'image/jpeg'
      };
      let file = new File([data], fileUrl.split('/').pop(), metadata);
      return file;
    }
  }
  return null;
};
