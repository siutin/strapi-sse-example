'use strict';

/**
 * Histories.js controller
 *
 * @description: A set of functions called "actions" for managing `Histories`.
 */

module.exports = {

  /**
   * Retrieve histories records.
   *
   * @return {Object|Array}
   */

  find: async (ctx) => {
    if (ctx.query._q) {
      return strapi.services.histories.search(ctx.query);
    } else {
      return strapi.services.histories.fetchAll(ctx.query);
    }
  },

  /**
   * Retrieve a histories record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.histories.fetch(ctx.params);
  },

  /**
   * Count histories records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.services.histories.count(ctx.query);
  },

  /**
   * Create a/an histories record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.services.histories.add(ctx.request.body);
  },

  /**
   * Update a/an histories record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.histories.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an histories record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.histories.remove(ctx.params);
  }
};
