import { Home, Location, Graph, Document, Heart, Paper, Buy } from "react-iconly";
import {RiFilePaper2Line, RiDraftLine, RiBook2Line, RiSettings4Line, RiListOrdered } from "react-icons/ri";
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../utils/LangConstants';
const anssMain = [
    // {
    //     header: "ANSS",
    //     roles:{
    //         data_manager: [ACTION_VIEW], 
    //         focal_point: [ACTION_VIEW], 
    //         secretariat: [ACTION_VIEW], 
    //         system_administrator: [ACTION_VIEW]
    //     },
    // },
    {
        id: "anss-main-dashboard",
        title: "Dashboard",
        roles:{
            data_manager: [ACTION_VIEW], 
            focal_point: [ACTION_VIEW], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW]
        },
        icon: <Home set="curved" className="remix-icon"/>,
        // navLink: "/main/dashboard/analytics",
        navLink: "/dashboard",
    },
    {
        id: "anss-main-ams-data",
        title: "Indicator Data Entry",
        roles:{
            data_manager: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD], 
            focal_point: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
         },
        icon: <RiDraftLine set="curved" className="remix-icon"/>,
        navLink: "/data-entry",
    },
    // {
    //     id: "anss-main-ams-data",
    //     title: "Indicator Data",
    //     roles:{
    //         data_manager: [ACTION_VIEW], 
    //         focal_point: [ACTION_VIEW], 
    //         secretariat: [], 
    //         system_administrator: [ACTION_VIEW]
    //     },
    //     icon: <Location set="curved" className="remix-icon"/>,
    //     children: [
    //         {
    //             id: "indicator-repositories-data",
    //             title: "Data Entry",
    //             roles:{
    //                 data_manager: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD], 
    //                 focal_point: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD], 
    //                 secretariat: [], 
    //                 system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
    //             },
    //             navLink: "/data-entry",
    //         },
    //         // {
    //         //     id: "indicator-approval",
    //         //     title: "Indicator Approval",
    //         //     roles:{
    //         //         data_manager: [], 
    //         //         focal_point: [ACTION_VIEW, ACTION_EDIT], 
    //         //         secretariat: [], 
    //         //         system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
    //         //     },
    //         //     navLink: "/indicator-approval",
    //         // }
    //     ],
    // },
    // {
    //     id: "anss-main-report",
    //     title: "Report",
    //     icon: <Graph set="curved" className="remix-icon"/>,
    //     navLink: "/main-report",
    // },
    // {
    //     id: "anss-main-metadata",
    //     title: "Metadata",
    //     icon: <Heart set="curved" className="remix-icon"/>,
    //     navLink: "/metadata",
    // },
    
    
    {
        id: "anss-main-ppd",
        title: "Policies & Programmes",
        roles:{
            data_manager: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD], 
            focal_point: [ACTION_VIEW], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
        icon: <RiBook2Line />,
        navLink: "/policies-and-programmes",
    },
    {
        id: "anss-main-sppd",
        title: 'Social Protection \n Programmes',
        roles:{
            data_manager: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD], 
            focal_point: [ACTION_VIEW], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
        icon: <Document set="curved" className="remix-icon"/>,
        navLink: "/social-protection-program",
    },
    
    {
       id: "anss-main-tools",
       title: "Tools",
       roles:{
        data_manager: [ACTION_VIEW], 
        focal_point: [], 
        secretariat: [ACTION_VIEW], 
        system_administrator: [ACTION_VIEW]
       },
       icon: <RiSettings4Line set="curved" className="remix-icon"/>,
       children: [
        {
            id: "anss-main-user-manual",
            title: "User Manual",
            roles:{
                data_manager: [ACTION_VIEW], 
                focal_point: [], 
                secretariat: [ACTION_VIEW], 
                system_administrator: [ACTION_VIEW]
            },
            navLink: "/user-manual",
        },
        {
            id: "anss-main-user-template",
            title: "Indicator Data Template",
            roles:{
                data_manager: [ACTION_VIEW], 
                focal_point: [], 
                secretariat: [ACTION_VIEW], 
                system_administrator: [ACTION_VIEW]
            },
            navLink: "/indicator-data-template",
        },
      ],
  },
    
];

export default anssMain