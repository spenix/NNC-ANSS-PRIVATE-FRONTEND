import MockAdapter from "axios-mock-adapter";
import axios from "axios";

const data = {
  indicatorCategories: [
    {
      id: 1,
      name: "Anthropometry",
      description: "Indicators referring to the different forms of malnutrition determined using anthropometric measurements such as weight, height, length, mid-upper arm circumference, wasit circumference, and waist-hip ratio.",
      status:"Active"

    },
    {
      id: 2,
      name: "Micronutrient and Diseases",
      description: "Indicators referring to a specific form of malnutrition where there is inadequate or lack of certain vitamins and minerals in the body, and to a specific form of health condition that may affect nutritional status.",
      status:"Active"
    },
    {
      id: 3,
      name: "Infant and Young Child Feeding (IYCF)",
      description: "Indicators being used in identifying progress of ASEAN Member States on IYCF and in analyzing the causes of malnutrition based on the concept of the First 1000 Days.",
      status:"Active"
    },
    {
      id: 4,
      name: "Dietary and lifestyle",
      description: "Indicators referring to the food consumption, lifestyle and behaviour that constitute the immediate causes of malnutrition.",
      status:"Active"
    },
    {
      id: 5,
      name: "Service and food access",
      description: "Indicators referring to the access of the population to health and nutrition services, and other nutrition-related supply and services.",
      status:"Active"
    },
    {
      id: 6,
      name: "Others",
      description: "Other nutrition-related indicators",
      status:"Active"
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
mockAdapter.onGet("/api/indicator-categories/list/all-data").reply(200, data.indicatorCategories);

// Add New User
mockAdapter.onPost("/apps/indicator-categories/add-indicator-type").reply((config) => {
  const indicatorCategory = JSON.parse(config.data);
  const { length } = data.indicatorCategories;
  let lastIndex = 0;
  if (length) {
    lastIndex = data.indicatorCategories[length - 1].id;
  }
  indicatorCategory.id = lastIndex + 1;
  data.indicatorCategories.unshift(indicatorCategory);
  return [201, { indicatorCategory }];
});

// Get Filter Data
mockAdapter.onGet("/api/indicator-categories/list/data").reply((config) => {
  const {
    q = "",
  } = config;

  const queryLowered = q.toLowerCase();
  const filteredData = data.indicatorCategories.filter(
    (indicatorCategory) =>
      (indicatorCategory.name.toLowerCase().includes(queryLowered) || indicatorCategory.description.toLowerCase().includes(queryLowered) || indicatorCategory.status.toLowerCase().includes(queryLowered))
  );

  return [
    200,
    {
      indicatorCategories: filteredData,
    },
  ];
});

// Get User
mockAdapter.onGet("/api/indicator-categories/indicatorCategory").reply((config) => {
  const { id } = config;
  const indicatorCategory = data.indicatorCategories.find((i) => i.id === id);
  return [200, { indicatorCategory }];
});

// Delete User
mockAdapter.onDelete("/apps/indicator-categories/delete").reply((config) => {
  let indicatorCategoryId = config.id;
  indicatorCategoryId = Number(indicatorCategoryId);
  const indicatorIndex = data.indicatorCategories.findIndex((t) => t.id === indicatorCategoryId);
  data.indicatorCategories.splice(indicatorIndex, 1);
  return [200];
});

export default instance;