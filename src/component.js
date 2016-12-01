/* eslint-disable strict */'use strict';/* eslint-enable strict */

var deepClone = require('mout/lang/deepClone.js');
var deepMixIn = require('mout/object/deepMixIn.js');
var DEFAULTS = {
    el: null,
    parent: null,
    els: {},
    comps: {},
    tmpl: null
};

// -----------------------------------------
// Functions

/**
 * Renders
 * @param  {object} comp
 * @param  {object} data
 * @return {object}
 */
function render(comp, data) {
    var tmpl = comp.tmpl;

    // Cache the data
    comp.renderedData = data || comp.renderedData;

    if (tmpl && typeof tmpl === 'function') {
        tmpl = tmpl(comp, comp.renderedData);
    }

    if (!tmpl || typeof tmpl !== 'string') {
        return comp;
    }

    // Lets set now!
    if (comp.el) {
        if (tmpl !== comp.renderedTmpl) {
            comp.el.html(tmpl);
        }
    }

    // Lets cache tmpl for future usage...
    comp.renderedTmpl = tmpl;

    return comp;
}

/**
 * Destroys component
 * @param  {object} comp
 */
function destroy(comp) {
    if (!comp.el) {
        return comp;
    }

    // Lets inform!
    if (comp.tmpl) {
        comp.el.empty();
    }
}

/**
 * Gets comp object
 * @param  {object} data
 * @param  {object} DEFAULTS
 * @return {object}
 */
function getComp(data, DEFAULTS_COMP) {
    var defaults = !!DEFAULTS_COMP ? deepClone(DEFAULTS_COMP) : {};
    var compData = !!data ? deepClone(data) : {};

    return deepMixIn({}, defaults, compData);
}

/**
 * Initializes
 * @param  {object} comp
 * @return {object}
 */
function init(comp) {
    return comp;
}

// --------------------------------
// Export

module.exports = {
    init: function (el, data) {
        var comp = getComp(data, DEFAULTS);

        // Merge will mess with elements
        comp.el = el;

        return init(comp);
    },
    getComp: getComp,
    render: render,
    destroy: destroy
};
