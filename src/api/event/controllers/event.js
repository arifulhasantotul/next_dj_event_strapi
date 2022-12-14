"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::event.event", ({ strapi }) => ({
  // create event with linked user
  async create(ctx) {
    const { id } = ctx.state.user;
    const res = await super.create(ctx);

    const updatedRes = await strapi.entityService.update(
      "api::event.event",
      res.data.id,
      { data: { users_permissions: id } }
    );

    return updatedRes;
  },

  // update event by linked user
  async update(ctx) {
    const { id } = ctx.state.user;

    const [event] = await strapi.entityService.findMany("api::event.event", {
      filters: {
        id: ctx.request.params.id,
        users_permissions: id,
      },
    });

    if (!event) {
      return ctx.unauthorized("Need Authorization", {
        thisMessage: "You are not allowed to update this event",
      });
    }
    const res = await super.update(ctx);
    return res;
  },

  // delete event by linked user
  async delete(ctx) {
    const { id } = ctx.state.user;

    const [event] = await strapi.entityService.findMany("api::event.event", {
      filters: {
        id: ctx.request.params.id,
        users_permissions: id,
      },
    });

    if (!event) {
      return ctx.unauthorized("Need Authorization", {
        thisMessage: "You are not allowed to delete this event",
      });
    }
    const res = await super.delete(ctx);
    return res;
  },

  //  get logged in users with events
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("Need authorization!", {
        thisMessage: "You are not logged in",
      });
    }

    const data = await strapi.db.query("api::event.event").findMany({
      where: {
        users_permissions: {
          id: {
            $eq: user.id,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
      populate: ["image", "users_permissions"],
    });

    if (!data) {
      return ctx.notFound("No events found", {
        thisMessage: "You need to add a event first!",
      });
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
