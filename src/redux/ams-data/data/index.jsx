import MockAdapter from "axios-mock-adapter";
import axios from "axios";
const data = {
  ams: [
    {
      id: 1,
      year: 2022,
      country:"Brune",
      no_indecators: [0, 0, 0, 0, 0],
      modifiedBy:  "Dela Cruz, Juan", 
      modifiedDate: "01/14/2022 04:43 PM",
      modified: {name: "Dela Cruz, Juan", date: "01/14/2022 04:43 PM"}
    },
    {
      id: 2,
      year: 2022,
      country:"Cambodia",
      no_indecators: [0, 0, 0, 0, 0],
      modifiedBy:  "Dela Cruz, Juan", 
      modifiedDate: "01/14/2022 04:43 PM",
      modified: {name: "Dela Cruz, Juan", date: "01/14/2022 04:43 PM"}
    },
    {
      id: 3,
      year: 2022,
      country:"Philippines",
      no_indecators: [0, 0, 0, 0, 0],
      modifiedBy:  "Dela Cruz, Juan", 
      modifiedDate: "01/14/2022 04:43 PM",
      modified: {name: "Dela Cruz, Juan", date: "01/14/2022 04:43 PM"}
    },
    {
      id: 4,
      year: 2022,
      country:"Indonesia",
      no_indecators: [0, 0, 0, 0, 0],
      modifiedBy:  "Dela Cruz, Juan", 
      modifiedDate: "01/14/2022 04:43 PM",
      modified: {name: "Dela Cruz, Juan", date: "01/14/2022 04:43 PM"}
    },
    {
      id: 5,
      year: 2022,
      country:"Malaysia",
      no_indecators: [0, 0, 0, 0, 0],
      modifiedBy:  "Dela Cruz, Juan", 
      modifiedDate: "01/14/2022 04:43 PM",
      modified: {name: "Dela Cruz, Juan", date: "01/14/2022 04:43 PM"}
    },
    {
      id: 6,
      year: 2022,
      country:"Lao",
      no_indecators: [0, 0, 0, 0, 0],
      modifiedBy:  "Dela Cruz, Juan", 
      modifiedDate: "01/14/2022 04:43 PM",
      modified: {name: "Dela Cruz, Juan", date: "01/14/2022 04:43 PM"}
    
    },
    {
      id: 7,
      year: 2022,
      country:"Myanmar",
      no_indecators: [0, 0, 0, 0, 0],
      modifiedBy:  "Dela Cruz, Juan", 
      modifiedDate: "01/14/2022 04:43 PM",
      modified: {name: "Dela Cruz, Juan", date: "01/14/2022 04:43 PM"}
    
    },
    {
      id: 8,
      year: 2022,
      country:"Singapore",
      no_indecators: [0, 0, 0, 0, 0],
      modifiedBy:  "Dela Cruz, Juan", 
      modifiedDate: "01/14/2022 04:43 PM",
      modified: {name: "Dela Cruz, Juan", date: "01/14/2022 04:43 PM"}
    
    },
    {
      id: 9,
      year: 2022,
      country:"Thailand",
      no_indecators: [0, 0, 0, 0, 0],
      modifiedBy:  "Dela Cruz, Juan", 
      modifiedDate: "01/14/2022 04:43 PM",
      modified: {name: "Dela Cruz, Juan", date: "01/14/2022 04:43 PM"}
    
    },
    {
      id: 10,
      year: 2022,
      country:"Vietnam",
      no_indecators: [0, 0, 0, 0, 0],
      modifiedBy:  "Dela Cruz, Juan", 
      modifiedDate: "01/14/2022 04:43 PM",
      modified: {name: "Dela Cruz, Juan", date: "01/14/2022 04:43 PM"}
    
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
mockAdapter.onGet("/api/ams-data/list/all-data").reply(200, data.ams);

// Add New Ams
mockAdapter.onPost("/apps/ams-data/add-ams").reply((config) => {
  const ams = JSON.parse(config.data);
  const { length } = data.ams;
  let lastIndex = 0;
  if (length) {
    lastIndex = data.ams[length - 1].id;
  }
  ams.id = lastIndex + 1;
  data.ams.unshift(ams);
  return [201, { ams }];
});

// Get Filter Data
mockAdapter.onGet("/api/ams-data/list/data").reply((config) => {
  const {
    q = "",
  } = config;
  const queryLowered = q.toLowerCase();
  const filteredData = data.ams.filter(
    (ams) =>
      (ams.year.toString().toLowerCase().includes(queryLowered) || ams.country.toLowerCase().includes(queryLowered) || ams.modifiedBy.toLowerCase().includes(queryLowered) || ams.modifiedDate.toLowerCase().includes(queryLowered))
  );

  return [
    200,
    {
      ams: filteredData,
    },
  ];
});

// Get Ams
mockAdapter.onGet("/api/ams-data/ams").reply((config) => {
  const { id } = config;
  const ams = data.ams.find((i) => i.id === id);
  return [200, { ams }];
});

// Delete Ams
mockAdapter.onDelete("/apps/ams-data/delete").reply((config) => {
  let amsId = config.id;
  amsId = Number(amsId);
  const amsIndex = data.ams.findIndex((t) => t.id === amsId);
  data.ams.splice(amsIndex, 1);
  return [200];
});

export default instance;