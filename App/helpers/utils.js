const ItemsModel = require(__path_schemas + "items");

let createFilterStatus = async (currentStatus) => {
  let statusFilter = [
    { name: "All", value: "all", count: 0, class: "default" },
    { name: "Active", value: "active", count: 0, class: "default" },
    {
      name: "InActive",
      value: "inactive",
      count: 0,
      class: "default",
    },
  ];
  // statusFilter.forEach((item, index) => {
  for (let i = 0; i < statusFilter.length; i++) {
    let item = statusFilter[i];

    let condition = item.value !== "all" ? { status: item.value } : {};
    if (item.value === currentStatus) statusFilter[i].class = "success";

    // if (item.value !== "all") condition = { status: item.value };

    await ItemsModel.count(condition).then((data) => {
      statusFilter[i].count = data;
    });
  }

  return statusFilter;
};

module.exports = {
  createFilterStatus: createFilterStatus,
};
