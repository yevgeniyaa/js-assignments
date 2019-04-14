'use strict';

/**************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 **************************************************************************************************/


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    var r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
    this.width = width;
    this.height = height;

    Rectangle.prototype.getArea = () => width * height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
    return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    var r = fromJSON(Rectangle.prototype, '{"width":10, "height":20}');
 *
 */
function fromJSON(proto, json) {
    return Object.assign(Object.create(proto), JSON.parse(json));
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy and implement the functionality
 * to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple, clear and readable as possible.
 *
 * @example
 *
 *  var builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()  => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()  => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()        =>    'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class CSSPath {
    constructor() {
        this._path = '';
    }

    element(v) {
        if (this._element) {
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
        }
        this.checkPosition('element');
        this._element = v;
        this.addToPath(this._element);
        return this;
    }

    id(v) {
        if (this._id) {
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
        }
        this.checkPosition('id');
        this._id = `#${v}`;
        this.addToPath(this._id);
        return this;
    }

    pseudoElement(v) {
        if (this._pseudoElement) {
            throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
        }
        this.checkPosition('pseudoElement');
        this._pseudoElement = `::${v}`;
        this.addToPath(this._pseudoElement);
        return this;
    }

    class(v) {
        this.checkPosition('class');
        this._class = `.${v}`;
        this.addToPath(this._class);
        return this;
    }

    attr(v) {
        this.checkPosition('attr');
        this._attr = `[${v}]`;
        this.addToPath(this._attr);
        return this;
    }

    pseudoClass(v) {
        this.checkPosition('pseudoClass');
        this._pseudoClass = `:${v}`;
        this.addToPath(this._pseudoClass);
        return this;
    }

    checkPosition(v) {
        const order = ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'];
        if (order.slice(order.findIndex(el => el === v) + 1).some(el => this[`_${el}`])) {
            throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
        }
    }

    addToPath(v) {
        this._path += v;
    }

    stringify() {
        return this._path;
    }
}

class CSSCombinedPath {
    constructor(firstSelector, combinator, secondSelector) {
        this.firstSelector = firstSelector;
        this.combinator = combinator;
        this.secondSelector = secondSelector;
    }

    stringify() {
        return `${this.firstSelector.stringify()} ${this.combinator} ${this.secondSelector.stringify()}`;
    }
}

const cssSelectorBuilder = {

    element: function(value) {
        return new CSSPath().element(value);
    },

    id: function(value) {
        return new CSSPath().id(value);
    },

    class: function(value) {
        return new CSSPath().class(value);
    },

    attr: function(value) {
        return new CSSPath().attr(value);
    },

    pseudoClass: function(value) {
        return new CSSPath().pseudoClass(value);
    },

    pseudoElement: function(value) {
        return new CSSPath().pseudoElement(value);
    },

    combine: function (selector1, combinator, selector2) {
        return new CSSCombinedPath(selector1, combinator, selector2);
    }
};


module.exports = {
    Rectangle: Rectangle,
    getJSON: getJSON,
    fromJSON: fromJSON,
    cssSelectorBuilder: cssSelectorBuilder
};
