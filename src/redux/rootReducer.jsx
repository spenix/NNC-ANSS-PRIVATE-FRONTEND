import { combineReducers } from "redux";

import calendarReducer from "./calendar/calendarReducer";
import contactReducer from "./contact/contactReducer";
import customiseReducer from "./customise/customiseReducer";
import ecommerceReducer from "./ecommerce/ecommerceReducer";
import authReducer from "./auth/authReducer";
import usersReducer from "./users/usersReducer";
import indicatorsReducer2 from "./indicators/indicatorsReducer2";
import indicatorTypesReducer from "./indicatorTypes/indicatorTypesReducer"
import indicatorCategoriesReducer from "./indicatorCategories/indicatorCategoriesReducer"
import amsReducer from "./ams-data/amsReducer";
import rolesReducer from "./roles/rolesReducer";
import asianCountriesReducer from "./asian-countries/asianCountriesReducer2";
import organizationsReducer from "./organizations/organizationsReducer";
import IndicatorsApprovalReducer from "./indicators-approval/indicatorsApprovalReducer";
import dataSourcesReducer from "./dataSources/dataSourcesReducer";
import dataSourceTypesReducer from "./dataSourceTypes/dataSourceTypesReducer";
import custodianReducer from "./custodian/custodianReducer";
import collectionPeriodReducer from "./collection-period/collectionPeriodReducer";
import socialProgramReducer from "./social-protection-program/socialProgramReducer";
import policyClassificationReducer from "./policy-classification/policyClassificationReducer";
import policyStatusReducer from "./policy-status/policyStatusReducer";
import policyProgrammesReducer from "./policy-programmes/policyProgrammesReducer";
import policyEnvironmentReducer from "./policy-environment/policyEnvironmentReducer";
import afnsReportReducer from "./afns-report/afnsReportReducer";
import userManualReducer from "./userManual/userManualReducer";
import userTemplateReducer from "./userTemplate/userTemplateReducer";
import pageSetupReducer from "./page-setup/pageSetupReducer";
import publicRoutesReducer from "./public-routes/publicRoutesReducer";
import exportDataReducer from "./export-data-to-excel/exportDataReducer";
import contactUsReducer from "./contact-us/contactUsReducer";
import activityLogReducer from "./activity-log/activityLogReducer";

const rootReducer = combineReducers({
  calendar: calendarReducer,
  contact: contactReducer,
  ecommerce: ecommerceReducer,
  customise: customiseReducer,
  auth: authReducer,
  users: usersReducer,
  indicators: indicatorsReducer2,
  indicatorTypes:indicatorTypesReducer,
  indicatorCategories:indicatorCategoriesReducer,
  ams:amsReducer,
  roles: rolesReducer,
  asianCountries: asianCountriesReducer,
  organizations: organizationsReducer,
  indicatorsApproval: IndicatorsApprovalReducer,
  collectionPeriod: collectionPeriodReducer,
  dataSources: dataSourcesReducer,
  dataSourceTypes: dataSourceTypesReducer,
  socialProgram:socialProgramReducer,
  policyClassification: policyClassificationReducer,
  policyStatus: policyStatusReducer,
  policyProgrammes: policyProgrammesReducer,
  policyEnvironment: policyEnvironmentReducer,
  afnsReport: afnsReportReducer,
  custodian: custodianReducer,
  pages: pageSetupReducer,
  userManual: userManualReducer,
  publicRoutes: publicRoutesReducer,
  exportData: exportDataReducer,
  userTemplate: userTemplateReducer, 
  contactUs: contactUsReducer,
  activityLog: activityLogReducer, // please always add comma here para maiwasan ang conflict
});

export default rootReducer;