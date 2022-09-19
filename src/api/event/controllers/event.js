"use strict";
/**
 * event controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

// module.exports = createCoreController("api::event.event");
module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  //  get logged in users
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      // return ctx.unauthorized("You are not logged in");
      return ctx.badRequest(null, [
        { message: [{ id: "No authorization header was found!" }] },
      ]);
    }

    const data = await strapi.db.query("api::event.event").findMany({
      where: {
        users_permissions: {
          id: {
            $eq: user.id,
          },
        },
      },
      populate: ["image", "users_permissions"],
    });

    if (!data) {
      return ctx.notFound();
    }

    const sanitizedEntity = await this.sanitizeOutput(data, ctx);

    return this.transformResponse(sanitizedEntity);
  },
}));

// REMEMBER: if u want you url like http://localhost:1337/api/event/${slug} instead of http://localhost:1337/api/event/${id} you need use below code

// module.exports = createCoreController("api::event.event", ({ strapi }) => ({
//   async findOne(ctx) {
//     const { id } = ctx.params;

//     const entity = await strapi.db
//       .query("api::event.event")
//       .findOne({ where: { slug: id }, populate: true }); // matching slug field in database
//     const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

//     return this.transformResponse(sanitizedEntity);
//   },
// }));
