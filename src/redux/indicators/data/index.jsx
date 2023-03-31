import MockAdapter from "axios-mock-adapter";
import axios from "axios";

import avatarImg from "../../../assets/images/memoji/memoji-1.png";
const data = {
  indicators: [
    {
      id: 1,
      avatar: avatarImg,
      fullName: "Low Birthweight",
      company: "Yotz PVT LTD",
      role: "editor",
      code: "gslixby0",
      country: "El Salvador",
      contact: "(479) 232-9151",
      email: "gslixby0@abc.net.au",
      currentPlan: "enterprise",
      code:"DEF",
      status: "inactive",
      source: "",
      nationalData: "",
      informationText: "1 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales sit amet nunc et vehicula. Mauris sed lectus nisi.",
      aboutText: "1 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales sit amet nunc et vehicula. Mauris sed lectus nisi. Suspendisse velit mi, pretium non euismod vitae Suspendisse velit mi, pretium non euismod vitae",
    },
    {
      id: 2,
      avatar: avatarImg,
      fullName: "Overweight",
      company: "Skinder PVT LTD",
      role: "author",
      code: "hredmore1",
      country: "Albania",
      contact: "(472) 607-9137",
      email: "hredmore1@imgur.com",
      currentPlan: "team",
      code:"ABC",
      status: "pending",
      source: "",
      nationalData: "",
      informationText: "2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales sit amet nunc et vehicula. Mauris sed lectus nisi.",
      aboutText: "2 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales sit amet nunc et vehicula. Mauris sed lectus nisi. Suspendisse velit mi, pretium non euismod vitae Suspendisse velit mi, pretium non euismod vitae",
    },
    {
      id: 3,
      avatar: "Marjory Sicely",
      fullName: "FIES-ModSevere",
      company: "Oozz PVT LTD",
      role: "maintainer",
      code: "msicely2",
      country: "Myanmar",
      contact: "(321) 264-4599",
      email: "msicely2@who.int",
      currentPlan: "enterprise",
      code:"DEF",
      status: "active",
      source: "",
      nationalData: "",
      informationText: "3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales sit amet nunc et vehicula. Mauris sed lectus nisi.",
      aboutText: "3 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales sit amet nunc et vehicula. Mauris sed lectus nisi. Suspendisse velit mi, pretium non euismod vitae Suspendisse velit mi, pretium non euismod vitae",
    },
    {
      id: 4,
      avatar: null,
      fullName: "OW-Adult",
      company: "Oozz PVT LTD",
      role: "maintainer",
      code: "crisby3",
      country: "China",
      contact: "(923) 690-6806",
      email: "crisby3@wordpress.com",
      currentPlan: "team",
      code:"ABC",
      status: "inactive",
      source: "",
      nationalData: "",
      informationText: "4 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales sit amet nunc et vehicula. Mauris sed lectus nisi.",
      aboutText: "4 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales sit amet nunc et vehicula. Mauris sed lectus nisi. Suspendisse velit mi, pretium non euismod vitae Suspendisse velit mi, pretium non euismod vitae"
    },
    {
      id: 5,
      avatar: null,
      fullName: "Severe food Insercurity",
      company: "Aimbo PVT LTD",
      role: "subscriber",
      code: "mhurran4",
      country: "Pakistan",
      contact: "(669) 914-1078",
      email: "mhurran4@yahoo.co.jp",
      currentPlan: "enterprise",
      code:"DEF",
      status: "pending",
      source: "",
      nationalData: "",
      informationText: "5 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales sit amet nunc et vehicula. Mauris sed lectus nisi.",
      aboutText: "5 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales sit amet nunc et vehicula. Mauris sed lectus nisi. Suspendisse velit mi, pretium non euismod vitae Suspendisse velit mi, pretium non euismod vitae",
    },
    {
      id: 6,
      avatar: null,
      fullName: "Thinness among school-age children and adolescents",
      company: "Jaxbean PVT LTD",
      role: "author",
      code: "shalstead5",
      country: "China",
      contact: "(958) 973-3093",
      email: "shalstead5@shinystat.com",
      currentPlan: "company",
      code:"ABC",
      status: "active",
      source: "",
      nationalData: "",
      informationText: "6 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales sit amet nunc et vehicula. Mauris sed lectus nisi.",
      aboutText: "6 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur sodales sit amet nunc et vehicula. Mauris sed lectus nisi. Suspendisse velit mi, pretium non euismod vitae Suspendisse velit mi, pretium non euismod vitae",
    },
  ],
};

let instance = axios.create({
  baseURL: "https://localhost:3000/",
  timeout: 1000,
  headers: {
    "X-Custom-Header": "foobar",
  },
});



let mockAdapter = new MockAdapter(instance);

// Get All Data
mockAdapter.onGet("/api/indicators/list/all-data").reply(200, data.indicators);

// Add New User
mockAdapter.onPost("/apps/indicators/add-indicator").reply((config) => {
  const indicator = JSON.parse(config.data);
  const { length } = data.indicators;
  let lastIndex = 0;
  if (length) {
    lastIndex = data.indicators[length - 1].id;
  }
  indicator.id = lastIndex + 1;

  data.indicators.unshift(indicator);

  return [201, { indicator }];
});

// Get Filter Data
mockAdapter.onGet("/api/indicators/list/data").reply((config) => {
  const {
    q = "",
  } = config;

  const queryLowered = q.toLowerCase();
  const filteredData = data.indicators.filter(
    (indicator) =>
      (indicator.code.toLowerCase().includes(queryLowered) || indicator.fullName.toLowerCase().includes(queryLowered) || indicator.informationText.toLowerCase().includes(queryLowered) || indicator.source.toLowerCase().includes(queryLowered) || indicator.nationalData.toLowerCase().includes(queryLowered) || indicator.status.toLowerCase().includes(queryLowered))
  );

  return [
    200,
    {
      indicators: filteredData,
    },
  ];
});

// Get User
mockAdapter.onGet("/api/indicators/indicator").reply((config) => {
  const { id } = config;
  const indicator = data.indicators.find((i) => i.id === id);
  return [200, { indicator }];
});

// Delete User
mockAdapter.onDelete("/apps/indicators/delete").reply((config) => {
  let indicatorId = config.id;
  indicatorId = Number(indicatorId);

  const indicatorIndex = data.indicators.findIndex((t) => t.id === indicatorId);
  data.indicators.splice(indicatorIndex, 1);

  return [200];
});

export default instance;