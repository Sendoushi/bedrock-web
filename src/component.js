/* global Promise */
/* eslint-disable strict */
'use strict';
/* eslint-enable strict */

// --------------------------------
// Vars / Imports

var merge = require('deepmerge');
var dom = require('./utils/dom.js');

var DEFAULTS = {
    el: null,
    parent: null,
    tmpl: null
};

// -----------------------------------------
// PRIVATE FUNCTIONS

/**
 * Check if dom is ready
 * @return {promise}
 */
var isDomReady = function () {
    var promise = new Promise(function (resolve) {
        // Wait for the document to be ready
        var isReady = document.readyState === 'complete';
        isReady = isReady || (document.readyState !== 'loading' && !document.documentElement.doScroll);
        if (isReady) {
            resolve();
        } else {
            document.addEventListener('DOMContentLoaded', resolve);
        }
    });

    return promise;
};

// -----------------------------------------
// PUBLIC FUNCTIONS

/**
 * Renders
 * @param  {object} comp
 * @param  {object} data
 * @return {object}
 */
var render = function (comp, data) {
    var tmpl = comp.tmpl;

    // Cache the data
    comp.renderedData = data || comp.renderedData;

    if (tmpl && typeof tmpl === 'function') {
        tmpl = tmpl(comp, comp.renderedData);
    }

    if (!tmpl || typeof tmpl !== 'string') {
        return;
    }

    // Lets set now!
    if (comp.el) {
        (tmpl !== comp.renderedTmpl) && dom.html(comp.el, tmpl);
        dom.trigger(comp.el, 'render', comp);
    }

    // Lets cache tmpl for future usage...
    comp.renderedTmpl = tmpl;

    return comp;
};

/**
 * Destroys component
 * @param  {object} comp
 */
var destroy = function (comp) {
    // Lets inform!
    if (comp.el) {
        if (comp.tmpl) {
            dom.empty(comp.el);
        }

        dom.trigger(comp.el, 'destroy', comp);
    }
};

/**
 * Initializes
 * @param  {object} comp
 * @return {object}
 */
var init = function (comp) {
    // It is a selector... needs to be here
    var parent = comp.parent || document.body;
    var classList = (parent === document.body) ? document.body.classList : null;

    // Cache the parent
    comp.parent = parent;

    // Remove class no-script
    classList && classList.remove('no-script');

    // Lets try and find the element
    if (typeof comp.el === 'string') {
        comp.selector = comp.el;
        comp.el = dom.find(parent, comp.selector);
    } else if (!!comp.el) {
        comp.selector = null; // TODO: Maybe get the attributes?
    }

    return comp;
};

// --------------------------------
// Runtime

require('es6-promise/auto');

// --------------------------------
// Export

module.exports = {
    init: function (data) {
        var comp = merge(DEFAULTS, data, { clone: true });

        // Wait for document to be ready and go on!
        return isDomReady().then(init.bind(null, comp));
    },
    render: render,
    destroy: destroy
};

/*
// Usage
var component = require('bedrock/component.js');
var doT = require('dot');
var tmpl = doT.template('<div></div>');

component.init({
    el: '.foo', // Pass a parent if string (performance wise), otherwise pass just an element
    parent: document.body, // Default is this one. Needed to find el selector
    tmpl: function (comp, data) { return tmpl(data); } // String accepted. It is optional
})
.then(function (comp) {
    // It won't happen if you don't use template ability
    component.render(comp);

    // Set components
    // Set events
});
*/
