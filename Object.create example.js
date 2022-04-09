"use stict";

var inner = {
  logInner() {
    console.log("inner");
    this.log();
  },
};

var outer = Object.create(inner);

outer.log = function log() {
  console.log("outer");
};

outer.logInner();
