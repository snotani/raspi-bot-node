'use strict';

const { lookup } = require('dns').promises;
const { hostname } = require('os');

module.exports = {
  /**
   * Lookup the current devices' IP address by its hostname.
   *
   * @param {(number|Object)} [options] Optional options used by NodeJS's
   *  `dns.lookup(hostname[, options])`
   */
  getLocalIPAddress: async function getLocalIPAddress(options) {
    // Source: https://stackoverflow.com/a/55887284/508098
    return (await lookup(hostname(), options)).address;
  },
};
