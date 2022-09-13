"use strict";

/**
 * event controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::event.event");

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
