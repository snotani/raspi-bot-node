'use strict';

const { lookup } = require('dns').promises;
const { hostname } = require('os');

module.exports = {
  /**
   * Lookup the current device's IP address by its hostname.
   *
   * @param {(number|object)} [options] Optional options used by NodeJS's
   *  `dns.lookup(hostname[, options])`
   * @returns {string} The current device's IP address.
   *  Async function/Promise resolves to address.
   */
  getLocalIPAddress: async function getLocalIPAddress(options) {
    // Source: https://stackoverflow.com/a/55887284/508098
    return (await lookup(hostname(), options)).address;
  },
};
