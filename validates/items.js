module.exports = {
  validator: (req) => {
    // NAME
    req
      .checkBody("name", "Name must be more than 5 and less than 20 characters")
      .isLength({ min: 5, max: 20 });

    // ORDERING
    req
      .checkBody(
        "ordering",
        "ordering must be greater than 0 and less than 100"
      )
      .isInt({ gt: 0, lt: 100 });

    // STATUS
    req.checkBody("status", "please select a status").isNotEqual("novalue");

    // DATE
    req.checkBody("date", "date must be a valid date").isISO8601("yyyy-mm-dd");
  },
};
