const ItemsModel = require("./../schemas/items");

let createFilterStatus = (currentStatus) => {
  let statusFilter = [
    { name: "All", value: "all", count: 0, link: "#", class: "default" },
    { name: "Active", value: "active", count: 0, link: "#", class: "default" },
    {
      name: "InActive",
      value: "inactive",
      count: 0,
      link: "#",
      class: "default",
    },
  ];
  statusFilter.forEach((item, index) => {
    let condition = {};
    if (item.value !== "all") condition = { status: item.value };
    if (item.value === currentStatus) statusFilter[index].class = "success";

    ItemsModel.count(condition).then((data) => {
      console.log("data: " + data);
      console.log("ItemsModel.status: " + ItemsModel.status);
      statusFilter[index].count = data;
    });
  });

  return statusFilter;
};

module.exports = {
  createFilterStatus: createFilterStatus,
};