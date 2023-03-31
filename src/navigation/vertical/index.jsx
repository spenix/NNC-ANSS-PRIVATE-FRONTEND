import apps from "./apps";
import pages from "./pages";
import main from "./main";
import anssMain from "./anssMain";
import anssMaintenance from "./anssMaintenance";
import anssWebsiteMaintenance from "./anssWebsiteMaintenance";
import components from "./components";

let navigation = [...anssMain, ...anssMaintenance, ...anssWebsiteMaintenance, ...apps, ...pages, ...main, ...components];

if(process.env.REACT_APP_ENVIRONMENT == "production" || process.env.REACT_APP_ENVIRONMENT == "staging") {
    navigation = [...anssMain, ...anssMaintenance, ...anssWebsiteMaintenance];
}


export default navigation;