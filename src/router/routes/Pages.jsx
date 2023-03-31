import { lazy } from "react";

const PagesRoutes = [
  //COMPONENTS
  {
    path: "/components/components-page",
    component: lazy(() => import("../../view/components/components-page")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-display/avatar",
    component: lazy(() => import("../../view/components/data-display/avatar")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-display/badge",
    component: lazy(() => import("../../view/components/data-display/badge")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-display/calendar",
    component: lazy(() =>
      import("../../view/components/data-display/calendar")
    ),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-display/card",
    component: lazy(() => import("../../view/components/data-display/card")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-display/collapse",
    component: lazy(() =>
      import("../../view/components/data-display/collapse")
    ),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-display/comment",
    component: lazy(() => import("../../view/components/data-display/comment")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-display/empty",
    component: lazy(() => import("../../view/components/data-display/empty")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-display/list",
    component: lazy(() => import("../../view/components/data-display/list")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-display/popover",
    component: lazy(() => import("../../view/components/data-display/popover")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-display/table",
    component: lazy(() => import("../../view/components/data-display/table")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-display/tabs",
    component: lazy(() => import("../../view/components/data-display/tabs")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-display/tag",
    component: lazy(() => import("../../view/components/data-display/tag")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-display/timeline",
    component: lazy(() =>
      import("../../view/components/data-display/timeline")
    ),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-display/tooltip",
    component: lazy(() =>
      import("../../view/components/data-display/tooltip")
    ),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-entry/checkbox",
    component: lazy(() => import("../../view/components/data-entry/checkbox")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-entry/datepicker",
    component: lazy(() =>
      import("../../view/components/data-entry/datepicker")
    ),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-entry/form",
    component: lazy(() => import("../../view/components/data-entry/form")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-entry/inputs",
    component: lazy(() => import("../../view/components/data-entry/inputs")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-entry/input-number",
    component: lazy(() =>
      import("../../view/components/data-entry/input-number")
    ),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-entry/radio",
    component: lazy(() =>
      import("../../view/components/data-entry/radio")
    ),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-entry/rate",
    component: lazy(() => import("../../view/components/data-entry/rate")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-entry/select",
    component: lazy(() => import("../../view/components/data-entry/select")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-entry/slider",
    component: lazy(() => import("../../view/components/data-entry/slider")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-entry/switch",
    component: lazy(() => import("../../view/components/data-entry/switch")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/data-entry/upload",
    component: lazy(() => import("../../view/components/data-entry/upload")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/feedback/alert",
    component: lazy(() => import("../../view/components/feedback/alert")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/feedback/drawer",
    component: lazy(() => import("../../view/components/feedback/drawer")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/feedback/message",
    component: lazy(() => import("../../view/components/feedback/message")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/feedback/modal",
    component: lazy(() => import("../../view/components/feedback/modal")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/feedback/notification",
    component: lazy(() =>
      import("../../view/components/feedback/notification")
    ),
    layout: "VerticalLayout",
  },
  {
    path: "/components/feedback/popconfirm",
    component: lazy(() => import("../../view/components/feedback/popconfirm")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/feedback/progress",
    component: lazy(() => import("../../view/components/feedback/progress")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/feedback/result",
    component: lazy(() => import("../../view/components/feedback/result")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/feedback/skeleton",
    component: lazy(() => import("../../view/components/feedback/skeleton")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/general/buttons",
    component: lazy(() => import("../../view/components/general/buttons")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/general/icons",
    component: lazy(() => import("../../view/components/general/icons")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/general/style-guide",
    component: lazy(() => import("../../view/components/general/style-guide")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/navigation/breadcrumb",
    component: lazy(() =>
      import("../../view/components/navigation/breadcrumb")
    ),
    layout: "VerticalLayout",
  },
  {
    path: "/components/navigation/dropdown",
    component: lazy(() => import("../../view/components/navigation/dropdown")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/navigation/menu",
    component: lazy(() => import("../../view/components/navigation/menu")),
    layout: "VerticalLayout",
  },
  {
    path: "/components/navigation/pagination",
    component: lazy(() =>
      import("../../view/components/navigation/pagination")
    ),
    layout: "VerticalLayout",
  },
  {
    path: "/components/navigation/steps",
    component: lazy(() => import("../../view/components/navigation/steps")),
    layout: "VerticalLayout",
  },

  // MAIN
  {
    path: "/main/dashboard/analytics",
    component: lazy(() => import("../../view/main/dashboard/analytics")),
    layout: "VerticalLayout",
  },
  {
    path: "/main/dashboard/nft",
    component: lazy(() => import("../../view/main/dashboard/nft")),
    layout: "VerticalLayout",
  },
  {
    path: "/main/dashboard/ecommerce",
    component: lazy(() => import("../../view/main/dashboard/ecommerce")),
    layout: "VerticalLayout",
  },
  {
    path: "/main/widgets/cards/advance",
    component: lazy(() => import("../../view/main/widgets/cards/advance")),
    layout: "VerticalLayout",
  },
  {
    path: "/main/widgets/cards/analytics",
    component: lazy(() => import("../../view/main/widgets/cards/analytics")),
    layout: "VerticalLayout",
  },
  {
    path: "/main/widgets/cards/statistics",
    component: lazy(() => import("../../view/main/widgets/cards/statistics")),
    layout: "VerticalLayout",
  },
  {
    path: "/main/widgets/selectbox",
    component: lazy(() => import("../../view/main/widgets/selectbox")),
    layout: "VerticalLayout",
  },
  {
    path: "/main/widgets/illustration-set",
    component: lazy(() => import("../../view/main/widgets/illustration-set")),
    layout: "VerticalLayout",
  },
  {
    path: "/main/widgets/crypto-icons",
    component: lazy(() => import("../../view/main/widgets/crypto-icons")),
    layout: "VerticalLayout",
  },
  {
    path: "/main/widgets/user-icons",
    component: lazy(() => import("../../view/main/widgets/user-icons")),
    layout: "VerticalLayout",
  },
  {
    path: "/main/widgets/flags",
    component: lazy(() => import("../../view/main/widgets/flags")),
    layout: "VerticalLayout",
  },
  {
    path: "/main/widgets/charts",
    component: lazy(() => import("../../view/main/widgets/charts")),
    layout: "VerticalLayout",
  },
  {
    path: "/main/layouts/divider",
    component: lazy(() => import("../../view/main/layouts/divider")),
    layout: "VerticalLayout",
  },
  {
    path: "/main/layouts/grid-system",
    component: lazy(() => import("../../view/main/layouts/grid-system")),
    layout: "VerticalLayout",
  },
  {
    path: "/main/layouts/page-layouts/boxed-layout",
    component: lazy(() => import("../../view/main/layouts/page-layouts/boxed")),
    layout: "VerticalLayout",
  },
  {
    path: "/main/layouts/page-layouts/vertical-layout",
    component: lazy(() => import("../../view/main/layouts/page-layouts/vertical")),
    layout: "VerticalLayout",
  },
  {
    path: "/main/layouts/page-layouts/horizontal-layout",
    component: lazy(() => import("../../view/main/layouts/page-layouts/horizontal")),
    layout: "HorizontalLayout",
  },
  {
    path: "/main/layouts/page-layouts/full-layout",
    component: lazy(() => import("../../view/main/layouts/page-layouts/full")),
    layout: "FullLayout",
  },

  // APPS
  {
    path: "/apps/calendar",
    component: lazy(() => import("../../view/apps/calendar")),
    layout: "VerticalLayout",
  },
  {
    path: "/apps/contact",
    component: lazy(() => import("../../view/apps/contact")),
    layout: "VerticalLayout",
  },
  {
    path: "/apps/contact/contact-detail",
    component: lazy(() => import("../../view/apps/contact")),
    layout: "VerticalLayout",
  },
  {
    path: "/apps/ecommerce/shop",
    component: lazy(() => import("../../view/apps/ecommerce")),
    layout: "VerticalLayout",
  },
  {
    path: "/apps/ecommerce/wishlist",
    component: lazy(() => import("../../view/apps/ecommerce")),
    layout: "VerticalLayout",
  },
  {
    path: "/apps/ecommerce/product-detail",
    component: lazy(() => import("../../view/apps/ecommerce")),
    layout: "VerticalLayout",
  },
  {
    path: "/apps/ecommerce/checkout",
    component: lazy(() => import("../../view/apps/ecommerce")),
    layout: "VerticalLayout",
  },
  {
    path: "/apps/ecommerce/address-information",
    component: lazy(() => import("../../view/apps/ecommerce")),
    layout: "VerticalLayout",
  },
  {
    path: "/apps/ecommerce/payment",
    component: lazy(() => import("../../view/apps/ecommerce")),
    layout: "VerticalLayout",
  },

  // PAGES
  {
    path: "/pages/landing",
    component: lazy(() => import("../../view/pages/landing")),
    layout: "FullLayout",
  },
  // {
  //   path: "/login",
  //   component: lazy(() => import("../../view/pages/authentication/login")),
  //   layout: "FullLayout",
  // },
  {
    path: "/pages/authentication/recover-password",
    component: lazy(() =>
      import("../../view/pages/authentication/recover-password")
    ),
    layout: "FullLayout",
  },
  {
    path: "/pages/authentication/register",
    component: lazy(() => import("../../view/pages/authentication/register")),
    layout: "FullLayout",
  },
  {
    path: "/pages/authentication/reset-password",
    component: lazy(() =>
      import("../../view/pages/authentication/reset-password")
    ),
    layout: "FullLayout",
  },
  {
    path: "/pages/blank-page",
    component: lazy(() => import("../../view/pages/blank")),
    layout: "VerticalLayout",
  },
  {
    path: "/pages/error-403",
    component: lazy(() => import("../../view/pages/errors/403")),
    layout: "FullLayout",
  },
  {
    path: "/pages/error-404",
    component: lazy(() => import("../../view/pages/errors/404")),
    layout: "FullLayout",
  },
  {
    path: "/pages/error-500",
    component: lazy(() => import("../../view/pages/errors/500")),
    layout: "FullLayout",
  },
  {
    path: "/pages/error-502",
    component: lazy(() => import("../../view/pages/errors/502")),
    layout: "FullLayout",
  },
  {
    path: "/pages/error-503",
    component: lazy(() => import("../../view/pages/errors/503")),
    layout: "FullLayout",
  },
  {
    path: "/pages/coming-soon",
    component: lazy(() => import("../../view/pages/errors/coming-soon")),
    layout: "FullLayout",
  },
  {
    path: "/pages/maintenance",
    component: lazy(() => import("../../view/pages/errors/maintenance")),
    layout: "FullLayout",
  },
  {
    path: "/pages/faq",
    component: lazy(() => import("../../view/pages/faq")),
    layout: "VerticalLayout",
  },
  {
    path: "/pages/invoice",
    component: lazy(() => import("../../view/pages/invoice")),
    layout: "VerticalLayout",
  },
  {
    path: "/pages/knowledge-base/knowledge-base-1",
    component: lazy(() =>
      import("../../view/pages/knowledge-base/knowledge-base-1")
    ),
    layout: "VerticalLayout",
  },
  {
    path: "/pages/knowledge-base/knowledge-base-2",
    component: lazy(() =>
      import("../../view/pages/knowledge-base/knowledge-base-2")
    ),
    layout: "VerticalLayout",
  },
  {
    path: "/pages/welcome",
    component: lazy(() => import("../../view/pages/lock-screen/welcome")),
    layout: "FullLayout",
  },
  {
    path: "/pages/password-is-changed",
    component: lazy(() => import("../../view/pages/lock-screen/password-is-changed")),
    layout: "FullLayout",
  },
  {
    path: "/pages/deactivated",
    component: lazy(() => import("../../view/pages/lock-screen/deactivated")),
    layout: "FullLayout",
  },
  {
    path: "/pages/lock",
    component: lazy(() => import("../../view/pages/lock-screen/lock")),
    layout: "FullLayout",
  },
  {
    path: "/pages/pricing",
    component: lazy(() => import("../../view/pages/pricing")),
    layout: "VerticalLayout",
  },
  {
    path: "/pages/profile/personel-information",
    component: lazy(() => import("../../view/pages/profile")),
    layout: "VerticalLayout",
  },
  {
    path: "/pages/profile/notifications",
    component: lazy(() => import("../../view/pages/profile")),
    layout: "VerticalLayout",
  },
  {
    path: "/pages/profile/activity",
    component: lazy(() => import("../../view/pages/profile")),
    layout: "VerticalLayout",
  },
  {
    path: "/pages/profile/security",
    component: lazy(() => import("../../view/pages/profile")),
    layout: "VerticalLayout",
  },
  {
    path: "/pages/profile/password-change",
    component: lazy(() => import("../../view/pages/profile")),
    layout: "VerticalLayout",
  },
  {
    path: "/pages/profile/connect-with-social",
    component: lazy(() => import("../../view/pages/profile")),
    layout: "VerticalLayout",
  },
  // ANSS
  {
    path: "/users",
    component: lazy(() => import("../../view/anss/users")),
    layout: "VerticalLayout",
  },
  {
    path: "/users/user-detail",
    component: lazy(() => import("../../view/anss/users")),
    layout: "VerticalLayout",
  },
  {
    path: "/indicators",
    component: lazy(() => import("../../view/anss/indicators")),
    layout: "VerticalLayout",
  },
  {
    path: "/indicators/detail",
    component: lazy(() => import("../../view/anss/indicators")),
    layout: "VerticalLayout",
  },
  {
    path: "/indicator-types",
    component: lazy(() => import("../../view/anss/indicatorTypes")),
    layout: "VerticalLayout",
  },
  {
    path: "/indicator-types/detail",
    component: lazy(() => import("../../view/anss/indicatorTypes")),
    layout: "VerticalLayout",
  },
  {
    path: "/indicator-categories",
    component: lazy(() => import("../../view/anss/indicatorCategories")),
    layout: "VerticalLayout",
  },
  {
    path: "/indicator-categories/detail",
    component: lazy(() => import("../../view/anss/indicatorCategories")),
    layout: "VerticalLayout",
  },
  
  {
    path: "/my-profile/personel-information",
    component: lazy(() => import("../../view/anss/my-profile")),
    layout: "VerticalLayout",
  },
  {
    path: "/my-profile/password-change",
    component: lazy(() => import("../../view/anss/my-profile")),
    layout: "VerticalLayout",
  },
  {
    path: "/main-report",
    component: lazy(() => import("../../view/anss/main-report")),
    layout: "VerticalLayout",
  },
  {
    path: "/metadata",
    component: lazy(() => import("../../view/anss/metadata")),
    layout: "VerticalLayout",
  },
  {
    path: "/manuals",
    component: lazy(() => import("../../view/anss/manuals")),
    layout: "VerticalLayout",
  },
  {
    path: "/afns-report",
    component: lazy(() => import("../../view/anss/afns-report")),
    layout: "VerticalLayout",
  },
  {
    path: "/countries",
    component: lazy(() => import("../../view/anss/asian-countries")),
    layout: "VerticalLayout",
  },

  {
    path: "/pages-setup",
    component: lazy(() => import("../../view/anss/pages-setup")),
    layout: "VerticalLayout",
  },
  {
    path: "/dashboard",
    component: lazy(() => import("../../view/anss/dashboard")),
    layout: "VerticalLayout",
  },
  {
    path: "/policies-and-programmes",
    component: lazy(() => import("../../view/anss/policies-and-programmes")),
    layout: "VerticalLayout",
  },
  {
    path: "/social-protection-program",
    component: lazy(() => import("../../view/anss/social-protection-program")),
    layout: "VerticalLayout",
  },
  {
    path: "/data-entry",
    component: lazy(() => import("../../view/anss/indicator-approval")),
    layout: "VerticalLayout",
  },
  {
    path: "/indicator-approval",
    component: lazy(() => import("../../view/anss/indicator-approval")),
    layout: "VerticalLayout",
  },
  // new maintenance
  {
    path: "/collection-periods",
    component: lazy(() => import("../../view/anss/collection-periods")),
    layout: "VerticalLayout",
  },
  {
    path: "/origins",
    component: lazy(() => import("../../view/anss/origins")),
    layout: "VerticalLayout",
  },
  {
    path: "/data-source-types",
    component: lazy(() => import("../../view/anss/data-source-types")),
    layout: "VerticalLayout",
  },
  {
    path: "/international-data-sources",
    component: lazy(() => import("../../view/anss/international-data-sources")),
    layout: "VerticalLayout",
  },
  {
    path: "/national-data-sources",
    component: lazy(() => import("../../view/anss/national-data-sources")),
    layout: "VerticalLayout",
  },
  {
    path: "/national-custodians",
    component: lazy(() => import("../../view/anss/national-custodian")),
    layout: "VerticalLayout",
  },
  {
    path: "/international-custodians",
    component: lazy(() => import("../../view/anss/custodians")),
    layout: "VerticalLayout",
  },
  {
    path: "/policy-statuses",
    component: lazy(() => import("../../view/anss/policy-statuses")),
    layout: "VerticalLayout",
  },
  {
    path: "/policy-classifications",
    component: lazy(() => import("../../view/anss/policy-classifications")),
    layout: "VerticalLayout",
  },
  {
    path: "/policy-environment",
    component: lazy(() => import("../../view/anss/policy-environment")),
    layout: "VerticalLayout",
  },
  {
    path: "/indicator-data-types",
    component: lazy(() => import("../../view/anss/indicator-data-types")),
    layout: "VerticalLayout",
  },
  {
    path: "/user-manual",
    component: lazy(() => import("../../view/anss/userManual")),
    layout: "VerticalLayout",
  },
  {
    path: "/indicator-data-template",
    component: lazy(() => import("../../view/anss/userTemplate")),
    layout: "VerticalLayout",
  },
  {
    path: "/templates",
    component: lazy(() => import("../../view/anss/templates")),
    layout: "VerticalLayout",
  },
  {
    path: "/export-data",
    component: lazy(() => import("../../view/anss/export-data")),
    layout: "VerticalLayout",
  },
  {
    path: "/contact-us",
    component: lazy(() => import("../../view/anss/contact-us")),
    layout: "VerticalLayout",
  },
  {
    path: "/activity-log",
    component: lazy(() => import("../../view/anss/activity-log")),
    layout: "VerticalLayout",
  },
];

export default PagesRoutes;