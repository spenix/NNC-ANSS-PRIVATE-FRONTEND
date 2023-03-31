import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const data = {
  asianCountries: [
    {
      id: 1,
      name: "Philippines",
      unsd: "608",
      iso_alpha:"PHL"

    },
    {
      id: 2,
      name: "Brunei",
      unsd: "096",
      iso_alpha:"BRN"
    },
    {
      id: 3,
      name: "Cambodia",
      unsd: "116",
      iso_alpha:"KHM"
    },
    {
      id: 4,
      name: "Indonesia",
      unsd: "360",
      iso_alpha:"IDN"
    },
    {
        id: 5,
        name: "Lao",
        unsd: "418",
        iso_alpha:"LAO"
    },
    {
        id: 6,
        name: "Malaysia",
        unsd: "458",
        iso_alpha:"MYS"
    },
    {
        id: 7,
        name: "Myanmar",
        unsd: "104",
        iso_alpha:"MMR"
    },
    {
        id: 8,
        name: "Singapore",
        unsd: "702",
        iso_alpha:"SGP"
    },
    {
        id: 9,
        name: "Thailand",
        unsd: "764",
        iso_alpha:"THA"
    },
    {
        id: 10,
        name: "Vietnam",
        unsd: "704",
        iso_alpha:"VNM"
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
mockAdapter.onGet("/api/countries/list/all-data").reply(200, data.asianCountries);

// Add New User
mockAdapter.onPost("/apps/countries/add-country").reply((config) => {
  const country = JSON.parse(config.data);
  const { length } = data.asianCountries;
  let lastIndex = 0;
  if (length) {
    lastIndex = data.asianCountries[length - 1].id;
  }
  country.id = lastIndex + 1;
  data.asianCountries.unshift(country);
  return [201, { country }];
});

// Get Filter Data
mockAdapter.onGet("/api/countries/list/data").reply((config) => {
  const {
    q = "",
  } = config;

  const queryLowered = q.toLowerCase();
  const filteredData = data.asianCountries.filter(
    (country) =>
      (country.name.toLowerCase().includes(queryLowered) || country.unsd.toLowerCase().includes(queryLowered) || country.iso_alpha.toLowerCase().includes(queryLowered))
  );

  return [
    200,
    {
      asianCountries: filteredData,
    },
  ];
});

// Get User
mockAdapter.onGet("/api/countries/country").reply((config) => {
  const { id } = config;
  const country = data.asianCountries.find((i) => i.id === id);
  return [200, { country }];
});

// Delete User
mockAdapter.onDelete("/apps/countries/delete").reply((config) => {
  let countryId = config.id;
  countryId = Number(countryId);
  const countryIndex = data.asianCountries.findIndex((t) => t.id === countryId);
  data.asianCountries.splice(countryIndex, 1);

  return [200];
});

export default instance;