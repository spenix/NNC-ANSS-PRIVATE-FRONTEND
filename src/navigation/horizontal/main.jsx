import { Home, Graph, Document } from "react-iconly";

const main = [
    {
        header: "Main",
        subMenu: [
            {
                id: "dashboard",
                title: "Dashboards",
                icon: <Home set="curved" className="remix-icon" />,
                children: [
                    {
                        id: "analytics",
                        title: "Analytics",
                        navLink: "/main/dashboard/analytics",
                    },
                    {
                        id: "dashboard-eCommerce",
                        title: "Ecommerce",
                        navLink: "/main/dashboard/ecommerce",
                    },
                    {
                        id: "dashboard-nft",
                        title: "NFT",
                        navLink: "/main/dashboard/nft",
                    },
                ],
            },
            {
                id: "widgets",
                title: "Widgets",
                icon: <Graph set="curved" className="remix-icon" />,
                children: [
                    {
                        id: "cards",
                        title: "Yoda Card",
                        children: [
                            {
                                id: "advance",
                                title: "Advance",
                                navLink: "/main/widgets/cards/advance",
                            },
                            {
                                id: "statistics",
                                title: "Statistics",
                                navLink: "/main/widgets/cards/statistics",
                            },
                            {
                                id: "widgets-analytics",
                                title: "Analytics",
                                navLink: "/main/widgets/cards/analytics",
                            },
                        ],
                    },
                    {
                        id: "charts",
                        title: "Charts",
                        navLink: "/main/widgets/charts",
                    },
                    {
                        id: "selectbox",
                        title: "SelectBox",
                        navLink: "/main/widgets/selectbox",
                    },
                    {
                        id: "illustration-set",
                        title: "Illustration Set",
                        navLink: "/main/widgets/illustration-set",
                    },
                    {
                        id: "crypto-icons",
                        title: "Crypto Icons",
                        navLink: "/main/widgets/crypto-icons",
                    },
                    {
                        id: "user-icons",
                        title: "User Icons",
                        navLink: "/main/widgets/user-icons",
                    },
                    {
                        id: "flags",
                        title: "Flags",
                        navLink: "/main/widgets/flags",
                    },
                ],
            },
            {
                id: "layouts",
                title: "Layouts",
                icon: <Document set="curved" className="remix-icon" />,
                children: [
                    {
                        id: "divider",
                        title: "Divider",
                        navLink: "/main/layouts/divider",
                    },
                    {
                        id: "grid System",
                        title: "Grid Sytem",
                        navLink: "/main/layouts/grid-system",
                    },
                    {
                        id: "page-layouts",
                        title: "Page Layouts",
                        children: [
                            {
                                id: "boxed-layout",
                                title: "Boxed Layout",
                                navLink: "/main/layouts/page-layouts/boxed-layout",
                            },
                            {
                                id: "vertical-layout",
                                title: "Vertical Layout",
                                navLink: "/main/layouts/page-layouts/vertical-layout",
                            },
                            {
                                id: "horizontal-layout",
                                title: "Horizontal Layout",
                                navLink: "/main/layouts/page-layouts/horizontal-layout",
                            },
                            {
                                id: "full-layout",
                                title: "Full Layout",
                                navLink: "/main/layouts/page-layouts/full-layout",
                            },
                        ],
                    },
                ],
            },
        ]
    },
];

export default main