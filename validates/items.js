const util = require("util");
const notify = require("./../configs/notify");

const options = {
  name: { min: 6, max: 20 },
  ordering: { min: 0, max: 100 },
  status: { value: "novalue" },
  date: { value: "yyyy-mm-dd" },
};

module.exports = {
  validator: (req) => {
    // NAME
    req
      .checkBody(
        "name",
        util.format(notify.ERROR_NAME, options.name.min, options.name.max)
      )
      .isLength({ min: options.name.min, max: options.name.max });

    // ORDERING
    req
      .checkBody(
        "ordering",
        util.format(
          notify.ERROR_ORDERING,
          options.ordering.min,
          options.ordering.max
        )
      )
      .isInt({ gt: 0, lt: 100 });

    // STATUS
    req
      .checkBody("status", notify.ERROR_STATUS)
      .isNotEqual(options.status.value);

    // DATE
    req.checkBody("date", notify.ERROR_DATE).isISO8601(options.date.value);
  },
};
