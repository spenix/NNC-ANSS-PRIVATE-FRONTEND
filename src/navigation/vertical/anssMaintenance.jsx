import {  People, InfoSquare, Document } from "react-iconly";
import {ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD} from '../../utils/LangConstants';
import { RiFlagLine, RiFolder2Line, RiCalendarEventLine, RiBarChartBoxLine, RiBuilding2Line, RiBuilding4Fill, RiBookMarkLine, RiFilePaper2Line, RiPrinterLine, RiBarChart2Line, RiFileSettingsLine, RiFileListFill } from "react-icons/ri";
const anssMaintenance = [
    {
        header: "MAINTENANCE",
        roles:{
            data_manager: [ACTION_VIEW], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW]
        },
    },
    {
        id: "anss-main-users",
        title: "User Management",
        roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
        icon: <People set="curved" className="remix-icon"/>,
        navLink: "/users",
    },
    {
        id: "anss-main-countries",
        title: "Member State",
        roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
        icon: <RiFlagLine/>,
        navLink: "/countries",
    },
    {
        id: "anss-main-afns-report",
        title: "AFNS Report",
        roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
        icon: <RiPrinterLine set="curved" className="remix-icon"/>,
        navLink: "/afns-report",
    },
    // {
    //     id: "anss-main-pages-setup",
    //     title: "Pages",
    //     icon: <Document set="curved" className="remix-icon"/>,
    //     navLink: "/pages-setup",
    // },
    // {
    //     id: "anss-main-collection-periods",
    //     title: "Collection Period",
    //     icon: <RiCalendarEventLine />,
    //     navLink: "/collection-periods",
    // },
    {
        id: "anss-main-custodians",
        title: "International Custodian",
        roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
        icon: <RiBuilding2Line />,
        navLink: "/international-custodians",
    },
    {
        id: "anss-main-national-custodians",
        title: "National Custodian",
        roles:{
            data_manager: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
        icon: <RiBuilding4Fill />,
        navLink: "/national-custodians",
    },
    
    // {
    //     id: "anss-main-origins",
    //     title: "Origins",
    //     icon: <RiFileList3Line />,
    //     navLink: "/origins",
    // },
    {
        id: "anss-main-data-source-types",
        title: "Data Source Type",
        roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
        icon: <RiFolder2Line />,
        navLink: "/data-source-types",
    },
    
    {
        id: "anss-main-international-data-sources",
        title: "International Data Source",
        roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
        icon: <RiBarChartBoxLine />,
        navLink: "/international-data-sources",
    },
    {
        id: "anss-main-national-data-sources",
        title: "National Data Source",
        roles:{
            data_manager: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
        icon: <RiBarChart2Line />,
        navLink: "/national-data-sources",
    },
    // {
    //     id: "anss-main-data-sources",
    //     title: "Data Sources",
    //     roles:{
    //         data_manager: [ACTION_VIEW], 
    //         focal_point: [], 
    //         secretariat: [ACTION_VIEW], 
    //         system_administrator: [ACTION_VIEW]
    //     },
    //     icon: <RiBarChartBoxLine/>,
    //     children: [
            
    //         {
    //             id: "international-data-sources",
    //             title: "International Data Source",
    //             roles:{
    //                 data_manager: [], 
    //                 focal_point: [], 
    //                 secretariat: [ACTION_VIEW], 
    //                 system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
    //             },
    //             navLink: "/international-data-sources",
    //         },
    //         {
    //             id: "national-data-sources",
    //             title: "National Data Source",
    //             roles:{
    //                 data_manager: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD], 
    //                 focal_point: [], 
    //                 secretariat: [ACTION_VIEW], 
    //                 system_administrator: [ACTION_VIEW]
    //             },
    //             navLink: "/national-data-sources",
    //         },
           
    //     ],
    // },
    {
        id: "anss-main-indicator-types",
        title: "Indicators Management",
        roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW]
        },
        icon: <InfoSquare set="curved" className="remix-icon"/>,
        children: [
            {
                id: "indicator-repositories",
                title: "Repository",
                roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
                navLink: "/indicators",
            },
            {
                id: "indicator-categories",
                title: "Category",
                roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
                navLink: "/indicator-categories",
            },
            {
                id: "indicator-types",
                title: "Indicator Type",
                roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
                navLink: "/indicator-types",
            },
            {
                id: "indicator-data-types",
                title: "Data Type",
                roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
                navLink: "/indicator-data-types",
            },
           
        ],
    },
    {
        id: "anss-main-statuses",
        title: "Policies Management",
        roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW]
        },
        icon: <RiBookMarkLine/>,
        children: [
            {
                id: "policy-classifications",
                title: "Policy Classification",
                roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
                navLink: "/policy-classifications",
            },
            {
                id: "policy-environment",
                title: "Policy Environment",
                roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
                navLink: "/policy-environment",
            },
            {
                id: "policy-statuses",
                title: "Policy Status",
                roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
        },
                navLink: "/policy-statuses",
            },
            
            
        ],
    },
    {
        id: "anss-main-data-sources",
        title: "Setup Tools",
        roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW]
        },
        icon: <RiFileSettingsLine/>,
        children: [
            
            {
                id: "anss-main-manuals",
                title: "User Manual",
                roles:{
                    data_manager: [], 
                    focal_point: [], 
                    secretariat: [ACTION_VIEW], 
                    system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
                },
                navLink: "/manuals",
            },
            {
                id: "anss-main-templates",
                title: "Indicator Data Template",
                roles:{
                    data_manager: [], 
                    focal_point: [], 
                    secretariat: [ACTION_VIEW], 
                    system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
                },
                navLink: "/templates",
            },
            {
                id: "anss-main-export-data",
                title: "Export AMS Data",
                roles:{
                    data_manager: [], 
                    focal_point: [], 
                    secretariat: [ACTION_VIEW], 
                    system_administrator: [ACTION_VIEW, ACTION_EDIT, ACTION_DELETE, ACTION_ADD]
                },
                navLink: "/export-data",
            },
           
        ],
    },
    {
        id: "anss-main-activity-log",
        title: "Activity Log",
        roles:{
            data_manager: [], 
            focal_point: [], 
            secretariat: [ACTION_VIEW], 
            system_administrator: [ACTION_VIEW]
        },
        icon: <RiFileListFill />,
        navLink: "/activity-log",
    },
    
];

export default anssMaintenance