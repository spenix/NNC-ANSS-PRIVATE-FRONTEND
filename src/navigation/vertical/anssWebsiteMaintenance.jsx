import { Document } from "react-iconly";
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../utils/LangConstants';
import { RiBookReadFill, RiBook2Line, RiDashboardLine, RiContactsBookLine } from "react-icons/ri";
const anssWebsiteMaintenance = [
    {
        header: "WEBSITE",
        roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW]
        },
    },
    {
        id: "anss-main-pages-setup",
        title: "Page Setup",
        roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
        icon: <RiBookReadFill/>,
        navLink: "/pages-setup",
    },{
        id: "anss-main-contact-us",
        title: "Contact Us",
        roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
        icon: <RiContactsBookLine/>,
        navLink: "/contact-us",
    },
   
];

export default anssWebsiteMaintenance