const ItemsModel = require("./../schemas/items");

let createFilterStatus = () => {
  let statusFilter = [
    { name: "all", value: "all", count: 0, link: "#", class: "default" },
    {
      name: "Active",
      value: "Active",
      count: 0,
      link: "#",
      class: "success",
    },
    {
      name: "InActive",
      value: "InActive",
      count: 0,
      link: "#",
      class: "default",
    },
  ];

  statusFilter.forEach((item, index) => {
    let condition = {};
    if (item.value !== "all") condition = { status: item.value };
    ItemsModel.count(condition).then((data) => {
      statusFilter[index].count = data;
    });
  });
  return statusFilter;
};

module.exports = {
  createFilterStatus: createFilterStatus,
};
