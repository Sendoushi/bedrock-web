import React from 'react';

// -----------------------------------------
// VARS

// -----------------------------------------
// FUNCTIONS

/**
 * Get closest DOM element up the tree that contains a class, ID, or data attribute
 * @param  {Node} elem The base element
 * @param  {String} selector The class, id, data attribute, or tag to look for
 * @return {Node} Null if no match
 */
const getClosest = (el, selector) => {
    const firstChar = selector.charAt(0);

    // Get closest match
    for ( ; el && el !== document; el = el.parentNode) {
        // If selector is a class
        if (firstChar === '.') {
            if (el.classList.contains(selector.substr(1))) {
                return el;
            }
        }

        // If selector is an ID
        if (firstChar === '#') {
            if (el.id === selector.substr(1)) {
                return el;
            }
        }

        // If selector is a data attribute
        if (firstChar === '[') {
            if (el.hasAttribute(selector.substr(1, selector.length - 2))) {
                return el;
            }
        }

        // If selector is a tag
        if (el.tagName.toLowerCase() === selector) {
            return el;
        }
    }
};

/**
 * Connect store to component
 * @param  {tag} self
 * @param  {object} actions
 * @param  {function} cb
 */
const connect = (self, actions, cb) => {
    // Add for the actions update
    self._unsubscribe = actions.subscribe(() => {
        if (!self._unsubscribe) {
            return;
        }

        // Inform of changes
        cb(actions.getState());
    });
};

/**
 * Disconnect the store from the component
 * @param  {tag} self
 */
const disconnect = (self) => {
    // Unsubscribe
    self._unsubscribe && self._unsubscribe();
    self._unsubscribe = null;
};

/**
 * Middleware for create element
 * @param  {string} el
 * @param  {object} data
 * @param  {array} children
 * @return {React}
 */
const cE = (el, data, children) => {
    data = data || {};
    children = children || [];

    // Initialize vars
    let classList;
    let elChilds;

    // Take care of children
    elChilds = data.elChilds || [];
    if (children && children.length) {
        elChilds = elChilds.concat(children);
    }

    if (typeof el === 'string') {
        // Set class names
        classList = el.split('.');
        el = classList.shift(); // Removes element
    }

    return React.createElement(el, {
        ...data,
        className: classList && classList.join(' '),
        elChilds: null
    }, ...elChilds);
};

/**
 * Templates a string into react
 * @param  {string} template
 * @param  {object} data
 * @return {React}
 */
const tmpl = (template, data) => {
    // TODO: Parser!
    // return cE();
};

// -----------------------------------------
// EXPORT

export { getClosest, connect, disconnect, cE, tmpl };
