"use strict";

const math = {
  randBetween: (min, max) => {

    return Math.floor(Math.random() * max) + min;
  }
};

export default math;