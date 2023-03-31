import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const data = {
  indicatorsDataRecords: [
    {
      id: 1,
      year: "2019",
      indicators_no: 9

    },
    {
      id: 2,
      year: "2020",
      indicators_no: 10
    },
    {
        id: 3,
        year: "2021",
        indicators_no: 13
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
mockAdapter.onGet("/api/country-indicators/list/all-data").reply(200, data.indicatorsDataRecords);

// Add New User
mockAdapter.onPost("/apps/country-indicators/add-indicator").reply((config) => {
  const indicator = JSON.parse(config.data);
  const { length } = data.indicatorsDataRecords;
  let lastIndex = 0;
  if (length) {
    lastIndex = data.indicatorsDataRecords[length - 1].id;
  }
  indicator.id = lastIndex + 1;
  data.indicatorsDataRecords.unshift(indicator);
  return [201, { indicator }];
});

// Get Filter Data
mockAdapter.onGet("/api/country-indicators/list/data").reply((config) => {
  const {
    q = "",
  } = config;

  const queryLowered = q.toLowerCase();
  const filteredData = data.indicatorsDataRecords.filter(
    (indicator) =>
      (indicator.year.toLowerCase().includes(queryLowered) || indicator.indicators_no.toLowerCase().includes(queryLowered))
  );

  return [
    200,
    {
      indicatorsDataRecords: filteredData,
    },
  ];
});

// Get User
mockAdapter.onGet("/api/country-indicators/indicator").reply((config) => {
  const { id } = config;
  const indicator = data.indicatorsDataRecords.find((i) => i.id == id);
  return [200, { indicator }];
});

// Delete User
mockAdapter.onDelete("/apps/country-indicators/delete").reply((config) => {
  let indicatorId = config.id;
  indicatorId = Number(indicatorId);
  const indicatorIndex = data.indicatorsDataRecords.findIndex((t) => t.id === indicatorId);
  data.indicatorsDataRecords.splice(indicatorIndex, 1);

  return [200];
});

export default instance;