module.exports = {
  routes: [
    {
      method: "GET",
      path: "/event/me",
      handler: "event.me",
      config: {
        policies: [],
      },
    },
  ],
};
