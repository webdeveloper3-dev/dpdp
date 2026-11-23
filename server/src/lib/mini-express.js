/**
 * ====================================================================
 * ZERO-DEPENDENCY EXPRESS-COMPATIBLE HTTP RUNTIME
 * ====================================================================
 */

const http = require("node:http");
const url = require("node:url");

function parseParams(routePath, actualPath) {
  const routeParts = routePath.split("/").filter(Boolean);
  const actualParts = actualPath.split("/").filter(Boolean);
  if (routeParts.length !== actualParts.length) return null;

  const params = {};
  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(":")) {
      params[routeParts[i].slice(1)] = decodeURIComponent(actualParts[i]);
    } else if (routeParts[i] !== actualParts[i]) {
      return null;
    }
  }
  return params;
}

class Router {
  constructor() {
    this.routes = [];
  }

  use(path, ...handlers) {
    if (typeof path === "function") {
      this.routes.push({ type: "middleware", prefix: "/", handler: path });
    } else {
      for (const h of handlers) {
        this.routes.push({ type: "router", prefix: path, handler: h });
      }
    }
    return this;
  }

  get(path, ...handlers) {
    this.routes.push({ type: "route", method: "GET", path, handlers });
    return this;
  }

  post(path, ...handlers) {
    this.routes.push({ type: "route", method: "POST", path, handlers });
    return this;
  }

  put(path, ...handlers) {
    this.routes.push({ type: "route", method: "PUT", path, handlers });
    return this;
  }

  delete(path, ...handlers) {
    this.routes.push({ type: "route", method: "DELETE", path, handlers });
    return this;
  }
}

function createApplication() {
  const router = new Router();

  const app = function (req, res) {
    handleRequest(router, req, res);
  };

  app.routes = router.routes;
  app.use = (...args) => { router.use(...args); return app; };
  app.get = (...args) => { router.get(...args); return app; };
  app.post = (...args) => { router.post(...args); return app; };
  app.put = (...args) => { router.put(...args); return app; };
  app.delete = (...args) => { router.delete(...args); return app; };

  app.listen = function (port, cb) {
    const server = http.createServer((req, res) => {
      handleRequest(router, req, res);
    });
    return server.listen(port, cb);
  };

  return app;
}

function handleRequest(rootRouter, req, res) {
  const parsedUrl = url.parse(req.url, true);
  req.path = parsedUrl.pathname;
  req.query = parsedUrl.query || {};
  req.params = {};

  res.status = function (code) {
    res.statusCode = code;
    return res;
  };

  res.json = function (data) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(data));
  };

  let bodyBuffer = "";
  req.on("data", chunk => {
    bodyBuffer += chunk;
  });

  req.on("end", () => {
    if (bodyBuffer) {
      try {
        req.body = JSON.parse(bodyBuffer);
      } catch (err) {
        req.body = bodyBuffer;
      }
    } else {
      req.body = {};
    }

    dispatch(rootRouter.routes, "", 0, req, res);
  });
}

function dispatch(routes, prefix, index, req, res) {
  if (index >= routes.length) {
    if (!res.writableEnded) {
      res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
    }
    return;
  }

  const route = routes[index];
  const next = () => dispatch(routes, prefix, index + 1, req, res);

  if (route.type === "middleware") {
    return route.handler(req, res, next);
  }

  if (route.type === "router") {
    const combinedPrefix = (prefix + route.prefix).replace(/\/+/g, "/");
    if (req.path.startsWith(combinedPrefix)) {
      const matchedRoutes = (route.handler.routes || []).map(r => ({
        ...r,
        fullPath: (combinedPrefix + (r.path || "")).replace(/\/+/g, "/")
      }));
      return executeSubRouter(matchedRoutes, 0, req, res, next);
    }
    return next();
  }

  if (route.type === "route") {
    const targetPath = (prefix + route.path).replace(/\/+/g, "/");
    if (req.method === route.method) {
      const params = parseParams(targetPath, req.path);
      if (params !== null) {
        req.params = Object.assign(req.params || {}, params);
        return runHandlers(route.handlers, 0, req, res, next);
      }
    }
  }

  return next();
}

function executeSubRouter(subRoutes, subIndex, req, res, parentNext) {
  if (subIndex >= subRoutes.length) {
    return parentNext();
  }
  const subRoute = subRoutes[subIndex];
  const nextSub = () => executeSubRouter(subRoutes, subIndex + 1, req, res, parentNext);

  if (subRoute.type === "route" && req.method === subRoute.method) {
    const params = parseParams(subRoute.fullPath, req.path);
    if (params !== null) {
      req.params = Object.assign(req.params || {}, params);
      return runHandlers(subRoute.handlers, 0, req, res, nextSub);
    }
  }

  return nextSub();
}

function runHandlers(handlers, hIndex, req, res, nextRoute) {
  if (hIndex >= handlers.length) {
    return nextRoute();
  }
  const handler = handlers[hIndex];
  return handler(req, res, () => runHandlers(handlers, hIndex + 1, req, res, nextRoute));
}

createApplication.Router = () => new Router();
createApplication.json = () => (req, res, next) => next();
createApplication.urlencoded = () => (req, res, next) => next();

function cors() {
  return (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-tenant-id, x-principal-id, Authorization");
    if (req.method === "OPTIONS") {
      res.statusCode = 204;
      return res.end();
    }
    next();
  };
}

module.exports = {
  createApplication,
  cors
};
