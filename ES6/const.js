"use strict";

const foo = Object.freeze({});

// foo.prop = 123;

// foo = {}; // TypeError

/**
 * 将js对象完全冻结函数
 * @param {Object} obj
 */
var constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach((key, i) => {
    if (typeof obj[key] === "object") {
      constantize(obj[key]);
    }
  });
};


console.log(globalThis)