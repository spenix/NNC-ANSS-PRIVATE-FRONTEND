import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const data = {
  indicatorTypes: [
    {
      id: 1,
      name: "Primary Outcome",
      description: "Core indicators for mandatory reporting which measures the progress towards the six global nutrition targets based on the global monitoring framework (GNMF) on Maternal, Infant and Young Child Nutrition and Sustainable Development Goals (SDG) 2: Zero Hunger and SDG 3: Good Health and Well-being",
      status:"Active"

    },
    {
      id: 2,
      name: "Intermediate-Outcome",
      description: "Core indicators that monitor how specific diseases and conditions on the causal model of malnutrition affect the national trends relating to the primary outcome indicators. Indicators subject to the availability of the data in ASEAN Member States. ",
      status:"Active"
    },
    {
      id: 3,
      name: "Process/Output",
      description: "Core indicators that monitor program and situation-specific progress. Indicators to be monitored and reported by each ASEAN Member State as part of their ASEAN country profile and other information products of the ASEAN Food and Nutrition Security Report.",
      status:"Active"
    },
    {
      id: 4,
      name: "Others",
      description: "Additional recommended indicators that can be used to monitor progress towards the primary outcome at national level and ASEAN region.",
      status:"Active"
    }
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
mockAdapter.onGet("/api/indicator-types/list/all-data").reply(200, data.indicatorTypes);

// Add New User
mockAdapter.onPost("/apps/indicator-types/add-indicator-type").reply((config) => {
  const indicator = JSON.parse(config.data);
  const { length } = data.indicatorTypes;
  let lastIndex = 0;
  if (length) {
    lastIndex = data.indicatorTypes[length - 1].id;
  }
  indicator.id = lastIndex + 1;
  data.indicatorTypes.unshift(indicator);
  return [201, { indicator }];
});

// Get Filter Data
mockAdapter.onGet("/api/indicator-types/list/data").reply((config) => {
  const {
    q = "",
  } = config;

  const queryLowered = q.toLowerCase();
  const filteredData = data.indicatorTypes.filter(
    (indicatorType) =>
      (indicatorType.name.toLowerCase().includes(queryLowered) || indicatorType.description.toLowerCase().includes(queryLowered) || indicatorType.status.toLowerCase().includes(queryLowered))
  );

  return [
    200,
    {
      indicatorTypes: filteredData,
    },
  ];
});

// Get User
mockAdapter.onGet("/api/indicator-types/indicatorType").reply((config) => {
  const { id } = config;
  const indicatorType = data.indicatorTypes.find((i) => i.id === id);
  return [200, { indicatorType }];
});

// Delete User
mockAdapter.onDelete("/apps/indicator-types/delete").reply((config) => {
  let indicatorId = config.id;
  indicatorId = Number(indicatorId);

  const indicatorIndex = data.indicatorTypes.findIndex((t) => t.id === indicatorId);
  data.indicatorTypes.splice(indicatorIndex, 1);

  return [200];
});

export default instance;