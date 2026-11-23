/**
 * Express wrapper: uses 'express' if installed, otherwise uses zero-dependency mini-express.
 */
let express;
let cors;

try {
  express = require("express");
  cors = require("cors");
} catch (e) {
  const mini = require("./mini-express");
  express = mini.createApplication;
  express.Router = mini.createApplication.Router;
  express.json = mini.createApplication.json;
  express.urlencoded = mini.createApplication.urlencoded;
  cors = mini.cors;
}

module.exports = { express, cors };
