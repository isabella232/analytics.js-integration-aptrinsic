'use strict';

/**
 * Module dependencies.
 */

var Group = require('segmentio-facade').Group;
var Identify = require('segmentio-facade').Identify;
var integration = require('@segment/analytics.js-integration');
var tick = require('next-tick');

/**
 * Expose `Aptrinsic` integration.
 */
var Aptrinsic;
Aptrinsic = module.exports = integration('Aptrinsic')
  .global('aptrinsic')
  .option('identify', true)
  .option('track', true)
  .option('group', true)
  .option('apiKey', '');

/**
 * Initialize.
 *
 * @api public
 */
Aptrinsic.prototype.initialize = function() {
  var self = this;
  this.load(function() {
    tick(self.ready);
  });
};


/**
 * The context for this integration.
 */

var integrationContext = {
  name: 'aptrinsic-segment',
  version: '1.0.0'
};

/**
 * Load.
 *
 * @api private
 * @param {Function} callback
 */
Aptrinsic.prototype.load = function(callback) {
  if (!window.aptrinsic) {
    /* eslint-disable */
    (function(n,t,a,e){var i="aptrinsic";n[i]=n[i]||function(){
      (n[i].q=n[i].q||[]).push(arguments)},n[i].p=e;
      var r=t.createElement("script");r.async=!0,r.src=a+"?a="+e;
      var c=t.getElementsByTagName("script")[0];c.parentNode.insertBefore(r,c)
    })(window,document,"https://web-sdk.aptrinsic.com/api/aptrinsic.js",this.options.apiKey);
    /* eslint-enable */
  }
  callback();
};

/**
 * Loaded?
 *
 * @api private
 * @return {boolean}
 */
Aptrinsic.prototype.loaded = function() {
  return !!window.aptrinsic;
};

/**
 * Identify.
 *
 * @param {Facade} identify
 */
Aptrinsic.prototype.identify = function(identify) {
  if (!this.options.identify) return;
  var group = this.analytics.group();  // Current group in segment.analytics
  var identifyGroup = new Group({
    groupId: group.id(),
    traits: group.traits()
  });
  _identify(identify, identifyGroup);
};

/**
 * Group.
 *
 * @param {Facade} group
 */
Aptrinsic.prototype.group = function(group) {
  if (!this.options.group) return;
  var user = this.analytics.user(); // Current user in segment.analytics
  var identify = new Identify({
    userId: user.id(),
    traits: user.traits()
  });
  _identify(identify, group);
};

/**
 * Track.
 *
 * @api public
 * @param {Facade} track
 */
Aptrinsic.prototype.track = function(track) {
  if (!this.options.track) return;
  window.aptrinsic('event', track.event(), track.properties(), integrationContext);
};

function _identify(user, group) {
  window.aptrinsic('identify', user, group, integrationContext);
}
