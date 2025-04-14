"use strict";
(self["webpackChunkmodern_js_deploy_csr"] = self["webpackChunkmodern_js_deploy_csr"] || []).push([["399"], {
74874: (function (__unused_webpack_module, __webpack_exports__, __webpack_require__) {
__webpack_require__.d(__webpack_exports__, {
  mc: () => (defineRuntimeConfig)
});
var APP_CONFIG_SYMBOL = "config";
var getConfig = function(Component) {
  return (
    // @ts-expect-error
    Component[APP_CONFIG_SYMBOL]
  );
};
var defineConfig = function(Component, config) {
  Component[APP_CONFIG_SYMBOL] = config;
  return Component;
};
var defineRuntimeConfig = function(config) {
  return config;
};



}),
75216: (function (__unused_webpack_module, exports) {
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */



/**
 * Module exports.
 * @public
 */

exports.parse = parse;
exports.serialize = serialize;

/**
 * Module variables.
 * @private
 */

var __toString = Object.prototype.toString
var __hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * RegExp to match cookie-name in RFC 6265 sec 4.1.1
 * This refers out to the obsoleted definition of token in RFC 2616 sec 2.2
 * which has been replaced by the token definition in RFC 7230 appendix B.
 *
 * cookie-name       = token
 * token             = 1*tchar
 * tchar             = "!" / "#" / "$" / "%" / "&" / "'" /
 *                     "*" / "+" / "-" / "." / "^" / "_" /
 *                     "`" / "|" / "~" / DIGIT / ALPHA
 */

var cookieNameRegExp = /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

/**
 * RegExp to match cookie-value in RFC 6265 sec 4.1.1
 *
 * cookie-value      = *cookie-octet / ( DQUOTE *cookie-octet DQUOTE )
 * cookie-octet      = %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
 *                     ; US-ASCII characters excluding CTLs,
 *                     ; whitespace DQUOTE, comma, semicolon,
 *                     ; and backslash
 */

var cookieValueRegExp = /^("?)[\u0021\u0023-\u002B\u002D-\u003A\u003C-\u005B\u005D-\u007E]*\1$/;

/**
 * RegExp to match domain-value in RFC 6265 sec 4.1.1
 *
 * domain-value      = <subdomain>
 *                     ; defined in [RFC1034], Section 3.5, as
 *                     ; enhanced by [RFC1123], Section 2.1
 * <subdomain>       = <label> | <subdomain> "." <label>
 * <label>           = <let-dig> [ [ <ldh-str> ] <let-dig> ]
 *                     Labels must be 63 characters or less.
 *                     'let-dig' not 'letter' in the first char, per RFC1123
 * <ldh-str>         = <let-dig-hyp> | <let-dig-hyp> <ldh-str>
 * <let-dig-hyp>     = <let-dig> | "-"
 * <let-dig>         = <letter> | <digit>
 * <letter>          = any one of the 52 alphabetic characters A through Z in
 *                     upper case and a through z in lower case
 * <digit>           = any one of the ten digits 0 through 9
 *
 * Keep support for leading dot: https://github.com/jshttp/cookie/issues/173
 *
 * > (Note that a leading %x2E ("."), if present, is ignored even though that
 * character is not permitted, but a trailing %x2E ("."), if present, will
 * cause the user agent to ignore the attribute.)
 */

var domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;

/**
 * RegExp to match path-value in RFC 6265 sec 4.1.1
 *
 * path-value        = <any CHAR except CTLs or ";">
 * CHAR              = %x01-7F
 *                     ; defined in RFC 5234 appendix B.1
 */

var pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;

/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [opt]
 * @return {object}
 * @public
 */

function parse(str, opt) {
  if (typeof str !== 'string') {
    throw new TypeError('argument str must be a string');
  }

  var obj = {};
  var len = str.length;
  // RFC 6265 sec 4.1.1, RFC 2616 2.2 defines a cookie name consists of one char minimum, plus '='.
  if (len < 2) return obj;

  var dec = (opt && opt.decode) || decode;
  var index = 0;
  var eqIdx = 0;
  var endIdx = 0;

  do {
    eqIdx = str.indexOf('=', index);
    if (eqIdx === -1) break; // No more cookie pairs.

    endIdx = str.indexOf(';', index);

    if (endIdx === -1) {
      endIdx = len;
    } else if (eqIdx > endIdx) {
      // backtrack on prior semicolon
      index = str.lastIndexOf(';', eqIdx - 1) + 1;
      continue;
    }

    var keyStartIdx = startIndex(str, index, eqIdx);
    var keyEndIdx = endIndex(str, eqIdx, keyStartIdx);
    var key = str.slice(keyStartIdx, keyEndIdx);

    // only assign once
    if (!__hasOwnProperty.call(obj, key)) {
      var valStartIdx = startIndex(str, eqIdx + 1, endIdx);
      var valEndIdx = endIndex(str, endIdx, valStartIdx);

      if (str.charCodeAt(valStartIdx) === 0x22 /* " */ && str.charCodeAt(valEndIdx - 1) === 0x22 /* " */) {
        valStartIdx++;
        valEndIdx--;
      }

      var val = str.slice(valStartIdx, valEndIdx);
      obj[key] = tryDecode(val, dec);
    }

    index = endIdx + 1
  } while (index < len);

  return obj;
}

function startIndex(str, index, max) {
  do {
    var code = str.charCodeAt(index);
    if (code !== 0x20 /*   */ && code !== 0x09 /* \t */) return index;
  } while (++index < max);
  return max;
}

function endIndex(str, index, min) {
  while (index > min) {
    var code = str.charCodeAt(--index);
    if (code !== 0x20 /*   */ && code !== 0x09 /* \t */) return index + 1;
  }
  return min;
}

/**
 * Serialize data into a cookie header.
 *
 * Serialize a name value pair into a cookie string suitable for
 * http headers. An optional options object specifies cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [opt]
 * @return {string}
 * @public
 */

function serialize(name, val, opt) {
  var enc = (opt && opt.encode) || encodeURIComponent;

  if (typeof enc !== 'function') {
    throw new TypeError('option encode is invalid');
  }

  if (!cookieNameRegExp.test(name)) {
    throw new TypeError('argument name is invalid');
  }

  var value = enc(val);

  if (!cookieValueRegExp.test(value)) {
    throw new TypeError('argument val is invalid');
  }

  var str = name + '=' + value;
  if (!opt) return str;

  if (null != opt.maxAge) {
    var maxAge = Math.floor(opt.maxAge);

    if (!isFinite(maxAge)) {
      throw new TypeError('option maxAge is invalid')
    }

    str += '; Max-Age=' + maxAge;
  }

  if (opt.domain) {
    if (!domainValueRegExp.test(opt.domain)) {
      throw new TypeError('option domain is invalid');
    }

    str += '; Domain=' + opt.domain;
  }

  if (opt.path) {
    if (!pathValueRegExp.test(opt.path)) {
      throw new TypeError('option path is invalid');
    }

    str += '; Path=' + opt.path;
  }

  if (opt.expires) {
    var expires = opt.expires

    if (!isDate(expires) || isNaN(expires.valueOf())) {
      throw new TypeError('option expires is invalid');
    }

    str += '; Expires=' + expires.toUTCString()
  }

  if (opt.httpOnly) {
    str += '; HttpOnly';
  }

  if (opt.secure) {
    str += '; Secure';
  }

  if (opt.partitioned) {
    str += '; Partitioned'
  }

  if (opt.priority) {
    var priority = typeof opt.priority === 'string'
      ? opt.priority.toLowerCase() : opt.priority;

    switch (priority) {
      case 'low':
        str += '; Priority=Low'
        break
      case 'medium':
        str += '; Priority=Medium'
        break
      case 'high':
        str += '; Priority=High'
        break
      default:
        throw new TypeError('option priority is invalid')
    }
  }

  if (opt.sameSite) {
    var sameSite = typeof opt.sameSite === 'string'
      ? opt.sameSite.toLowerCase() : opt.sameSite;

    switch (sameSite) {
      case true:
        str += '; SameSite=Strict';
        break;
      case 'lax':
        str += '; SameSite=Lax';
        break;
      case 'strict':
        str += '; SameSite=Strict';
        break;
      case 'none':
        str += '; SameSite=None';
        break;
      default:
        throw new TypeError('option sameSite is invalid');
    }
  }

  return str;
}

/**
 * URL-decode string value. Optimized to skip native call when no %.
 *
 * @param {string} str
 * @returns {string}
 */

function decode (str) {
  return str.indexOf('%') !== -1
    ? decodeURIComponent(str)
    : str
}

/**
 * Determine if value is a Date.
 *
 * @param {*} val
 * @private
 */

function isDate (val) {
  return __toString.call(val) === '[object Date]';
}

/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */

function tryDecode(str, decode) {
  try {
    return decode(str);
  } catch (e) {
    return str;
  }
}


}),
72535: (function (module, __unused_webpack_exports, __webpack_require__) {


var reactIs = __webpack_require__(56237);

/**
 * Copyright 2015, Yahoo! Inc.
 * Copyrights licensed under the New BSD License. See the accompanying LICENSE file for terms.
 */
var REACT_STATICS = {
  childContextTypes: true,
  contextType: true,
  contextTypes: true,
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getDerivedStateFromError: true,
  getDerivedStateFromProps: true,
  mixins: true,
  propTypes: true,
  type: true
};
var KNOWN_STATICS = {
  name: true,
  length: true,
  prototype: true,
  caller: true,
  callee: true,
  arguments: true,
  arity: true
};
var FORWARD_REF_STATICS = {
  '$$typeof': true,
  render: true,
  defaultProps: true,
  displayName: true,
  propTypes: true
};
var MEMO_STATICS = {
  '$$typeof': true,
  compare: true,
  defaultProps: true,
  displayName: true,
  propTypes: true,
  type: true
};
var TYPE_STATICS = {};
TYPE_STATICS[reactIs.ForwardRef] = FORWARD_REF_STATICS;
TYPE_STATICS[reactIs.Memo] = MEMO_STATICS;

function getStatics(component) {
  // React v16.11 and below
  if (reactIs.isMemo(component)) {
    return MEMO_STATICS;
  } // React v16.12 and above


  return TYPE_STATICS[component['$$typeof']] || REACT_STATICS;
}

var defineProperty = Object.defineProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames;
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var getPrototypeOf = Object.getPrototypeOf;
var objectPrototype = Object.prototype;
function hoistNonReactStatics(targetComponent, sourceComponent, blacklist) {
  if (typeof sourceComponent !== 'string') {
    // don't hoist over string (html) components
    if (objectPrototype) {
      var inheritedComponent = getPrototypeOf(sourceComponent);

      if (inheritedComponent && inheritedComponent !== objectPrototype) {
        hoistNonReactStatics(targetComponent, inheritedComponent, blacklist);
      }
    }

    var keys = getOwnPropertyNames(sourceComponent);

    if (getOwnPropertySymbols) {
      keys = keys.concat(getOwnPropertySymbols(sourceComponent));
    }

    var targetStatics = getStatics(targetComponent);
    var sourceStatics = getStatics(sourceComponent);

    for (var i = 0; i < keys.length; ++i) {
      var key = keys[i];

      if (!KNOWN_STATICS[key] && !(blacklist && blacklist[key]) && !(sourceStatics && sourceStatics[key]) && !(targetStatics && targetStatics[key])) {
        var descriptor = getOwnPropertyDescriptor(sourceComponent, key);

        try {
          // Avoid failures from read-only properties
          defineProperty(targetComponent, key, descriptor);
        } catch (e) {}
      }
    }
  }

  return targetComponent;
}

module.exports = hoistNonReactStatics;


}),
53670: (function (module) {
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {}

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;


}),
60198: (function (__unused_webpack_module, exports) {
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var b="function"===typeof Symbol&&Symbol.for,c=b?Symbol.for("react.element"):60103,d=b?Symbol.for("react.portal"):60106,e=b?Symbol.for("react.fragment"):60107,f=b?Symbol.for("react.strict_mode"):60108,g=b?Symbol.for("react.profiler"):60114,h=b?Symbol.for("react.provider"):60109,k=b?Symbol.for("react.context"):60110,l=b?Symbol.for("react.async_mode"):60111,m=b?Symbol.for("react.concurrent_mode"):60111,n=b?Symbol.for("react.forward_ref"):60112,p=b?Symbol.for("react.suspense"):60113,q=b?
Symbol.for("react.suspense_list"):60120,r=b?Symbol.for("react.memo"):60115,t=b?Symbol.for("react.lazy"):60116,v=b?Symbol.for("react.block"):60121,w=b?Symbol.for("react.fundamental"):60117,x=b?Symbol.for("react.responder"):60118,y=b?Symbol.for("react.scope"):60119;
function z(a){if("object"===typeof a&&null!==a){var u=a.$$typeof;switch(u){case c:switch(a=a.type,a){case l:case m:case e:case g:case f:case p:return a;default:switch(a=a&&a.$$typeof,a){case k:case n:case t:case r:case h:return a;default:return u}}case d:return u}}}function A(a){return z(a)===m}exports.AsyncMode=l;exports.ConcurrentMode=m;exports.ContextConsumer=k;exports.ContextProvider=h;exports.Element=c;exports.ForwardRef=n;exports.Fragment=e;exports.Lazy=t;exports.Memo=r;exports.Portal=d;
exports.Profiler=g;exports.StrictMode=f;exports.Suspense=p;exports.isAsyncMode=function(a){return A(a)||z(a)===l};exports.isConcurrentMode=A;exports.isContextConsumer=function(a){return z(a)===k};exports.isContextProvider=function(a){return z(a)===h};exports.isElement=function(a){return"object"===typeof a&&null!==a&&a.$$typeof===c};exports.isForwardRef=function(a){return z(a)===n};exports.isFragment=function(a){return z(a)===e};exports.isLazy=function(a){return z(a)===t};
exports.isMemo=function(a){return z(a)===r};exports.isPortal=function(a){return z(a)===d};exports.isProfiler=function(a){return z(a)===g};exports.isStrictMode=function(a){return z(a)===f};exports.isSuspense=function(a){return z(a)===p};
exports.isValidElementType=function(a){return"string"===typeof a||"function"===typeof a||a===e||a===m||a===g||a===f||a===p||a===q||"object"===typeof a&&null!==a&&(a.$$typeof===t||a.$$typeof===r||a.$$typeof===h||a.$$typeof===k||a.$$typeof===n||a.$$typeof===w||a.$$typeof===x||a.$$typeof===y||a.$$typeof===v)};exports.typeOf=z;


}),
56237: (function (module, __unused_webpack_exports, __webpack_require__) {


if (true) {
  module.exports = __webpack_require__(60198);
} else {}


}),
57434: (function (__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) {

// EXTERNAL MODULE: ./node_modules/.pnpm/react@18.3.1/node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(52676);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/core/context/index.js

var globalContext = {};
function setGlobalContext(context) {
  globalContext.entryName = context.entryName;
  globalContext.App = context.App;
  globalContext.routes = context.routes;
  globalContext.appInit = context.appInit;
  globalContext.appConfig = typeof context.appConfig === "function" ? context.appConfig() : context.appConfig;
  globalContext.layoutApp = context.layoutApp;
  globalContext.RSCRoot = context.RSCRoot;
}
function getCurrentEntryName() {
  return globalContext.entryName;
}
function getGlobalRSCRoot() {
  return globalContext.RSCRoot;
}
function setGlobalInternalRuntimeContext(context) {
  globalContext.internalRuntimeContext = context;
}
function getGlobalInternalRuntimeContext() {
  return globalContext.internalRuntimeContext;
}
function getGlobalApp() {
  return globalContext.App;
}
function getGlobalRoutes() {
  return globalContext.routes;
}
function getGlobalAppInit() {
  var _getGlobalApp, _getGlobalLayoutApp;
  return globalContext.appInit || ((_getGlobalApp = getGlobalApp()) === null || _getGlobalApp === void 0 ? void 0 : _getGlobalApp.init) || ((_getGlobalLayoutApp = getGlobalLayoutApp()) === null || _getGlobalLayoutApp === void 0 ? void 0 : _getGlobalLayoutApp.init);
}
function getGlobalAppConfig() {
  var _getGlobalApp, _getGlobalLayoutApp;
  return globalContext.appConfig || ((_getGlobalApp = getGlobalApp()) === null || _getGlobalApp === void 0 ? void 0 : _getGlobalApp.config) || ((_getGlobalLayoutApp = getGlobalLayoutApp()) === null || _getGlobalLayoutApp === void 0 ? void 0 : _getGlobalLayoutApp.config);
}
function getGlobalLayoutApp() {
  return globalContext.layoutApp;
}


// EXTERNAL MODULE: ./node_modules/.pnpm/react@18.3.1/node_modules/react/index.js
var react = __webpack_require__(75271);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+utils@2.67.1/node_modules/@modern-js/utils/dist/esm/universal/constants.js
var ROUTE_MANIFEST = "_MODERNJS_ROUTE_MANIFEST";
var constants_ROUTE_MODULES = "_routeModules";
var HMR_SOCK_PATH = "/webpack-hmr";
var HTML_CHUNKSMAP_SEPARATOR = "<!--<?- chunksMap.js ?>-->";
var LOADER_REPORTER_NAME = "server-loader";
var ROUTE_SPEC_FILE = "route.json";
var NESTED_ROUTE_SPEC_FILE = "nestedRoutes.json";
var MAIN_ENTRY_NAME = "main";
var SERVER_BUNDLE_DIRECTORY = "bundles";
var SERVER_RENDER_FUNCTION_NAME = "serverRender";
var SERVER_PLUGIN_BFF = "@modern-js/plugin-bff";
var SERVER_PLUGIN_EXPRESS = "@modern-js/plugin-express";
var SERVER_PLUGIN_KOA = "@modern-js/plugin-koa";
var SERVER_PLUGIN_SERVER = "@modern-js/plugin-server";
var SERVER_PLUGIN_POLYFILL = "@modern-js/plugin-polyfill";


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/router/runtime/routeModule.js

var createShouldRevalidate = function(routeId) {
  return function(arg) {
    var _window_ROUTE_MODULES, _window;
    var routeModule = (_window = window) === null || _window === void 0 ? void 0 : (_window_ROUTE_MODULES = _window[ROUTE_MODULES]) === null || _window_ROUTE_MODULES === void 0 ? void 0 : _window_ROUTE_MODULES[routeId];
    if (routeModule && typeof routeModule.shouldRevalidate === "function") {
      return routeModule.shouldRevalidate(arg);
    }
    return arg.defaultShouldRevalidate;
  };
};
var handleRouteModule = function(routeModule, routeId) {
  if (typeof document !== "undefined") {
    window[constants_ROUTE_MODULES][routeId] = routeModule;
  }
  return routeModule;
};
var handleRouteModuleError = function(error) {
  console.error(error);
  return null;
};


// EXTERNAL MODULE: ./src/routes/layout.tsx
var layout = __webpack_require__(20154);
;// CONCATENATED MODULE: ./node_modules/.modern-js/main/routes.js



if (typeof document !== 'undefined') {
    window._routeModules = {};
}
var routes_routes = [
    {
        "path": "/",
        "children": [
            {
                "_component": "@_modern_js_src/routes/page",
                "index": true,
                "id": "page",
                "type": "nested",
                "lazyImport": ()=>Promise.all(/* import() | page */ [__webpack_require__.e("86"), __webpack_require__.e("484")]).then(__webpack_require__.bind(__webpack_require__, 58623)).then((routeModule)=>handleRouteModule(routeModule, "page")).catch(handleRouteModuleError),
                "component": /*#__PURE__*/ (0,react.lazy)(()=>Promise.all(/* import() | page */ [__webpack_require__.e("86"), __webpack_require__.e("484")]).then(__webpack_require__.bind(__webpack_require__, 58623)).then((routeModule)=>handleRouteModule(routeModule, "page")).catch(handleRouteModuleError))
            }
        ],
        "isRoot": true,
        "_component": "@_modern_js_src/routes/layout",
        "id": "layout",
        "type": "nested",
        "lazyImport": ()=>Promise.resolve(/* import() */).then(__webpack_require__.bind(__webpack_require__, 20154)).then((routeModule)=>handleRouteModule(routeModule, "layout")).catch(handleRouteModuleError),
        "component": layout["default"]
    }
];

;// CONCATENATED MODULE: ./node_modules/.modern-js/main/runtime-global-context.js

var appConfig;
var appInit;
var layoutApp;

var entryName = 'main';
setGlobalContext({
    entryName,
    layoutApp,
    routes: routes_routes,
    appInit,
    appConfig
});

// EXTERNAL MODULE: ./node_modules/.pnpm/@swc+helpers@0.5.17/node_modules/@swc/helpers/esm/_to_consumable_array.js + 3 modules
var esm_to_consumable_array = __webpack_require__(88511);
// EXTERNAL MODULE: ./node_modules/.pnpm/@swc+helpers@0.5.17/node_modules/@swc/helpers/esm/_define_property.js
var _define_property = __webpack_require__(40833);
// EXTERNAL MODULE: ./node_modules/.pnpm/@swc+helpers@0.5.17/node_modules/@swc/helpers/esm/_type_of.js
var _type_of = __webpack_require__(61999);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime-utils@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime-utils/dist/esm/merge.js



function isObject(obj) {
  return obj && (typeof obj === "undefined" ? "undefined" : (0,_type_of._)(obj)) === "object" && !Array.isArray(obj);
}
function merge(target) {
  for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }
  if (!sources.length) {
    return target;
  }
  var source = sources.shift();
  if (isObject(target) && isObject(source)) {
    for (var key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          Object.assign(target, (0,_define_property._)({}, key, {}));
        }
        merge(target[key], source[key]);
      } else {
        Object.assign(target, (0,_define_property._)({}, key, source[key]));
      }
    }
  }
  return merge.apply(void 0, [
    target
  ].concat((0,esm_to_consumable_array._)(sources)));
}


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+plugin-v2@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/plugin-v2/dist/esm/manager.js

var isFunction = function(obj) {
  return typeof obj === "function";
};
function validatePlugin(plugin) {
  var type = typeof plugin === "undefined" ? "undefined" : (0,_type_of._)(plugin);
  if (type !== "object" || plugin === null) {
    throw new Error("Expect CLI Plugin instance to be an object, but got ".concat(type, "."));
  }
  if (!plugin.setup)
    return;
  if (isFunction(plugin.setup)) {
    return;
  }
  throw new Error("Expect CLI Plugin plugin.setup to be a function, but got ".concat(type, "."));
}
function createPluginManager() {
  var plugins = /* @__PURE__ */ new Map();
  var dependencies = /* @__PURE__ */ new Map();
  var addDependency = function(plugin, dependency, type) {
    if (!dependencies.has(dependency)) {
      dependencies.set(dependency, {
        pre: /* @__PURE__ */ new Map(),
        post: /* @__PURE__ */ new Map()
      });
    }
    if (type === "pre") {
      dependencies.get(plugin).pre.set(dependency, {
        name: dependency,
        isUse: false
      });
    } else if (type === "post") {
      dependencies.get(plugin).post.set(dependency, {
        name: dependency
      });
    } else if (type === "use") {
      if (!dependencies.get(plugin).post.has(dependency) && !dependencies.get(dependency).pre.has(plugin)) {
        dependencies.get(plugin).pre.set(dependency, {
          name: dependency,
          isUse: true
        });
      }
    }
  };
  var addPlugin = function(newPlugin) {
    if (!newPlugin) {
      return;
    }
    validatePlugin(newPlugin);
    var name = newPlugin.name, _newPlugin_usePlugins = newPlugin.usePlugins, usePlugins = _newPlugin_usePlugins === void 0 ? [] : _newPlugin_usePlugins, _newPlugin_pre = newPlugin.pre, pre = _newPlugin_pre === void 0 ? [] : _newPlugin_pre, _newPlugin_post = newPlugin.post, post = _newPlugin_post === void 0 ? [] : _newPlugin_post;
    if (plugins.has(name)) {
      console.warn("Plugin ".concat(name, " already exists."));
      return;
    }
    plugins.set(name, newPlugin);
    dependencies.set(name, {
      pre: /* @__PURE__ */ new Map(),
      post: /* @__PURE__ */ new Map()
    });
    pre.forEach(function(dep) {
      addDependency(name, dep, "pre");
    });
    post.forEach(function(dep) {
      addDependency(name, dep, "post");
    });
    usePlugins.forEach(function(plugin) {
      if (!plugins.has(plugin.name)) {
        addPlugin(plugin);
      }
      addDependency(name, plugin.name, "use");
    });
  };
  var addPlugins = function(newPlugins) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0;
    try {
      for (var _iterator = newPlugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var newPlugin = _step.value;
        addPlugin(newPlugin);
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
  };
  var getPlugins = function() {
    var visited = /* @__PURE__ */ new Set();
    var temp = /* @__PURE__ */ new Set();
    var result = [];
    var visit = function(name) {
      if (temp.has(name)) {
        throw new Error("Circular dependency detected: ".concat(name));
      }
      if (!visited.has(name) && plugins.get(name)) {
        temp.add(name);
        var _plugins_get = plugins.get(name), _plugins_get_required = _plugins_get.required, required = _plugins_get_required === void 0 ? [] : _plugins_get_required;
        required.forEach(function(dep) {
          if (!plugins.get(dep)) {
            throw new Error("".concat(name, " plugin required plugin ").concat(dep, ", but not found."));
          }
        });
        var pre = dependencies.get(name).pre;
        Array.from(pre.values()).filter(function(dep) {
          return !dep.isUse;
        }).forEach(function(dep) {
          return visit(dep.name);
        });
        Array.from(pre.values()).filter(function(dep) {
          return dep.isUse;
        }).forEach(function(dep) {
          return visit(dep.name);
        });
        temp.delete(name);
        visited.add(name);
        result.push(plugins.get(name));
      }
    };
    plugins.forEach(function(_, name) {
      var post = dependencies.get(name).post;
      post.forEach(function(dep) {
        if (!dependencies.get(dep.name).pre.has(name)) {
          dependencies.get(dep.name).pre.set(name, {
            name,
            isUse: false
          });
        }
      });
    });
    plugins.forEach(function(_, name) {
      visit(name);
    });
    result = result.filter(function(result2) {
      return result2;
    });
    return result;
  };
  var clear = function() {
    plugins.clear();
    dependencies.clear();
  };
  return {
    getPlugins,
    addPlugins,
    clear,
    isPluginExists: function(name) {
      return plugins.has(name);
    }
  };
}


// EXTERNAL MODULE: ./node_modules/.pnpm/@swc+helpers@0.5.17/node_modules/@swc/helpers/esm/_object_spread.js
var esm_object_spread = __webpack_require__(91209);
// EXTERNAL MODULE: ./node_modules/.pnpm/@swc+helpers@0.5.17/node_modules/@swc/helpers/esm/_object_without_properties.js + 1 modules
var _object_without_properties = __webpack_require__(49045);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+plugin-v2@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/plugin-v2/dist/esm/runtime/api.js



function initPluginAPI(param) {
  var context = param.context, plugins = param.plugins;
  var hooks = context.hooks, extendsHooks = context.extendsHooks;
  function getRuntimeContext() {
    if (context) {
      var hooks2 = context.hooks, extendsHooks2 = context.extendsHooks, config = context.config, pluginAPI2 = context.pluginAPI, runtimeContext = (0,_object_without_properties._)(context, [
        "hooks",
        "extendsHooks",
        "config",
        "pluginAPI"
      ]);
      runtimeContext._internalContext = context;
      return runtimeContext;
    }
    throw new Error("Cannot access context");
  }
  function updateRuntimeContext(updateContext) {
    context = merge(context, updateContext);
  }
  function getHooks() {
    return (0,esm_object_spread._)({}, hooks, extendsHooks);
  }
  function getRuntimeConfig() {
    if (context.config) {
      return context.config;
    }
    throw new Error("Cannot access config");
  }
  var extendsPluginApi = {};
  plugins.forEach(function(plugin) {
    var _registryApi = plugin._registryApi;
    if (_registryApi) {
      var apis = _registryApi(getRuntimeContext, updateRuntimeContext);
      Object.keys(apis).forEach(function(apiName) {
        extendsPluginApi[apiName] = apis[apiName];
      });
    }
  });
  if (extendsHooks) {
    Object.keys(extendsHooks).forEach(function(hookName) {
      extendsPluginApi[hookName] = extendsHooks[hookName].tap;
    });
  }
  var pluginAPI = (0,esm_object_spread._)({
    updateRuntimeContext,
    getHooks,
    getRuntimeConfig,
    config: hooks.config.tap,
    onBeforeRender: hooks.onBeforeRender.tap,
    wrapRoot: hooks.wrapRoot.tap,
    pickContext: hooks.pickContext.tap
  }, extendsPluginApi);
  return new Proxy(pluginAPI, {
    get: function get(target, prop) {
      if (prop === "then") {
        return void 0;
      }
      if (prop in target) {
        return target[prop];
      }
      return function() {
        console.warn("api.".concat(prop.toString(), " not exist"));
      };
    }
  });
}


// EXTERNAL MODULE: ./node_modules/.pnpm/@swc+helpers@0.5.17/node_modules/@swc/helpers/esm/_object_spread_props.js
var esm_object_spread_props = __webpack_require__(92928);
// EXTERNAL MODULE: ./node_modules/.pnpm/@swc+helpers@0.5.17/node_modules/@swc/helpers/esm/_async_to_generator.js
var esm_async_to_generator = __webpack_require__(34902);
// EXTERNAL MODULE: ./node_modules/.pnpm/tslib@2.8.1/node_modules/tslib/tslib.es6.mjs
var tslib_es6 = __webpack_require__(9787);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+plugin-v2@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/plugin-v2/dist/esm/hooks.js




function createAsyncInterruptHook() {
  var callbacks = [];
  var tap = function(cb) {
    callbacks.push(cb);
  };
  var call = function() {
    var _ref = (0,esm_async_to_generator._)(function() {
      var _len, params, _key, interrupted, interruptResult, interrupt, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, callback, result, err;
      var _arguments = arguments;
      return (0,tslib_es6/* __generator */.Jh)(this, function(_state) {
        switch (_state.label) {
          case 0:
            for (_len = _arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
              params[_key] = _arguments[_key];
            }
            interrupted = false;
            interrupt = function(info) {
              interrupted = true;
              interruptResult = info;
            };
            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0;
            _state.label = 1;
          case 1:
            _state.trys.push([
              1,
              6,
              7,
              8
            ]);
            _iterator = callbacks[Symbol.iterator]();
            _state.label = 2;
          case 2:
            if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done))
              return [
                3,
                5
              ];
            callback = _step.value;
            if (interrupted)
              return [
                3,
                5
              ];
            return [
              4,
              callback.apply(void 0, (0,esm_to_consumable_array._)(params).concat([
                interrupt
              ]))
            ];
          case 3:
            result = _state.sent();
            if (result !== void 0) {
              params[0] = result;
            }
            _state.label = 4;
          case 4:
            _iteratorNormalCompletion = true;
            return [
              3,
              2
            ];
          case 5:
            return [
              3,
              8
            ];
          case 6:
            err = _state.sent();
            _didIteratorError = true;
            _iteratorError = err;
            return [
              3,
              8
            ];
          case 7:
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
            return [
              7
            ];
          case 8:
            return [
              2,
              interrupted ? interruptResult : params[0] || []
            ];
        }
      });
    });
    return function call2() {
      return _ref.apply(this, arguments);
    };
  }();
  return {
    tap,
    call
  };
}
function createSyncHook() {
  var callbacks = [];
  var tap = function(cb) {
    callbacks.push(cb);
  };
  var call = function() {
    for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0;
    try {
      for (var _iterator = callbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var callback = _step.value;
        var result = callback.apply(void 0, (0,esm_to_consumable_array._)(params));
        if (result !== void 0) {
          params[0] = result;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
    return params[0];
  };
  return {
    tap,
    call
  };
}
function createAsyncHook() {
  var callbacks = [];
  var tap = function(cb) {
    callbacks.push(cb);
  };
  var call = function() {
    var _ref = _async_to_generator(function() {
      var _len, params, _key, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, callback, result, err;
      var _arguments = arguments;
      return _ts_generator(this, function(_state) {
        switch (_state.label) {
          case 0:
            for (_len = _arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
              params[_key] = _arguments[_key];
            }
            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0;
            _state.label = 1;
          case 1:
            _state.trys.push([
              1,
              6,
              7,
              8
            ]);
            _iterator = callbacks[Symbol.iterator]();
            _state.label = 2;
          case 2:
            if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done))
              return [
                3,
                5
              ];
            callback = _step.value;
            return [
              4,
              callback.apply(void 0, _to_consumable_array(params))
            ];
          case 3:
            result = _state.sent();
            if (result !== void 0) {
              params[0] = result;
            }
            _state.label = 4;
          case 4:
            _iteratorNormalCompletion = true;
            return [
              3,
              2
            ];
          case 5:
            return [
              3,
              8
            ];
          case 6:
            err = _state.sent();
            _didIteratorError = true;
            _iteratorError = err;
            return [
              3,
              8
            ];
          case 7:
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
            return [
              7
            ];
          case 8:
            return [
              2,
              params[0] || []
            ];
        }
      });
    });
    return function call2() {
      return _ref.apply(this, arguments);
    };
  }();
  return {
    tap,
    call
  };
}
function createCollectAsyncHook() {
  var callbacks = [];
  var tap = function(cb) {
    callbacks.push(cb);
  };
  var call = function() {
    var _ref = _async_to_generator(function() {
      var _len, params, _key, results, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, callback, result, err;
      var _arguments = arguments;
      return _ts_generator(this, function(_state) {
        switch (_state.label) {
          case 0:
            for (_len = _arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
              params[_key] = _arguments[_key];
            }
            results = [];
            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0;
            _state.label = 1;
          case 1:
            _state.trys.push([
              1,
              6,
              7,
              8
            ]);
            _iterator = callbacks[Symbol.iterator]();
            _state.label = 2;
          case 2:
            if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done))
              return [
                3,
                5
              ];
            callback = _step.value;
            return [
              4,
              callback(params)
            ];
          case 3:
            result = _state.sent();
            if (result !== void 0) {
              results.push(result);
            }
            _state.label = 4;
          case 4:
            _iteratorNormalCompletion = true;
            return [
              3,
              2
            ];
          case 5:
            return [
              3,
              8
            ];
          case 6:
            err = _state.sent();
            _didIteratorError = true;
            _iteratorError = err;
            return [
              3,
              8
            ];
          case 7:
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
            return [
              7
            ];
          case 8:
            return [
              2,
              results
            ];
        }
      });
    });
    return function call2() {
      return _ref.apply(this, arguments);
    };
  }();
  return {
    tap,
    call
  };
}
function createCollectSyncHook() {
  var callbacks = [];
  var tap = function(cb) {
    callbacks.push(cb);
  };
  var call = function() {
    for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
      params[_key] = arguments[_key];
    }
    var results = [];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0;
    try {
      for (var _iterator = callbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var callback = _step.value;
        var result = callback(params);
        if (result !== void 0) {
          results.push(result);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
    return results;
  };
  return {
    tap,
    call
  };
}
function createAsyncPipelineHook() {
  var callbacks = [];
  var tap = function(cb) {
    callbacks.push(cb);
  };
  var call = function() {
    var _ref = _async_to_generator(function() {
      var _len, params, _key, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step, _ret, err;
      var _arguments = arguments;
      return _ts_generator(this, function(_state) {
        switch (_state.label) {
          case 0:
            for (_len = _arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
              params[_key] = _arguments[_key];
            }
            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0;
            _state.label = 1;
          case 1:
            _state.trys.push([
              1,
              6,
              7,
              8
            ]);
            _loop = function() {
              var callback, runNext, next, result;
              return _ts_generator(this, function(_state2) {
                switch (_state2.label) {
                  case 0:
                    callback = _step.value;
                    runNext = false;
                    next = function(info) {
                      runNext = true;
                      if (info) {
                        params[0] = info;
                      }
                    };
                    return [
                      4,
                      callback.apply(void 0, _to_consumable_array(params).concat([
                        next
                      ]))
                    ];
                  case 1:
                    result = _state2.sent();
                    if (!runNext) {
                      params[0] = result;
                      return [
                        2,
                        "break"
                      ];
                    }
                    return [
                      2
                    ];
                }
              });
            };
            _iterator = callbacks[Symbol.iterator]();
            _state.label = 2;
          case 2:
            if (!!(_iteratorNormalCompletion = (_step = _iterator.next()).done))
              return [
                3,
                5
              ];
            return [
              5,
              _ts_values(_loop())
            ];
          case 3:
            _ret = _state.sent();
            if (_ret === "break")
              return [
                3,
                5
              ];
            _state.label = 4;
          case 4:
            _iteratorNormalCompletion = true;
            return [
              3,
              2
            ];
          case 5:
            return [
              3,
              8
            ];
          case 6:
            err = _state.sent();
            _didIteratorError = true;
            _iteratorError = err;
            return [
              3,
              8
            ];
          case 7:
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
            return [
              7
            ];
          case 8:
            return [
              2,
              params[0] || []
            ];
        }
      });
    });
    return function call2() {
      return _ref.apply(this, arguments);
    };
  }();
  return {
    tap,
    call
  };
}


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+plugin-v2@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/plugin-v2/dist/esm/runtime/hooks.js

function initHooks() {
  return {
    onBeforeRender: createAsyncInterruptHook(),
    wrapRoot: createSyncHook(),
    pickContext: createSyncHook(),
    config: createCollectSyncHook()
  };
}


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+plugin-v2@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/plugin-v2/dist/esm/runtime/context.js



function initRuntimeContext() {
  return {};
}
function createRuntimeContext(param) {
  var runtimeContext = param.runtimeContext, config = param.config, plugins = param.plugins;
  var extendsHooks = {};
  plugins.forEach(function(plugin) {
    var _plugin_registryHooks = plugin.registryHooks, registryHooks = _plugin_registryHooks === void 0 ? {} : _plugin_registryHooks;
    Object.keys(registryHooks).forEach(function(hookName) {
      extendsHooks[hookName] = registryHooks[hookName];
    });
  });
  return (0,esm_object_spread_props._)((0,esm_object_spread._)({}, runtimeContext), {
    hooks: (0,esm_object_spread._)({}, initHooks(), extendsHooks),
    extendsHooks,
    config
  });
}


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+plugin-v2@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/plugin-v2/dist/esm/runtime/run/create.js





var createRuntime = function() {
  var init = function init2(options) {
    pluginManager.clear();
    initOptions = options;
    var allPlugins = options.plugins, handleSetupResult = options.handleSetupResult;
    pluginManager.addPlugins(allPlugins);
    var plugins = pluginManager.getPlugins();
    var context = createRuntimeContext({
      runtimeContext: initRuntimeContext(),
      config: initOptions.config,
      plugins
    });
    var pluginAPI = initPluginAPI({
      context,
      pluginManager,
      plugins
    });
    context.pluginAPI = pluginAPI;
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0;
    try {
      for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var plugin = _step.value;
        var _plugin_setup;
        var setupResult = (_plugin_setup = plugin.setup) === null || _plugin_setup === void 0 ? void 0 : _plugin_setup.call(plugin, pluginAPI);
        if (handleSetupResult) {
          handleSetupResult(setupResult, pluginAPI);
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
    return {
      runtimeContext: context
    };
  };
  var run = function run2(options) {
    var runtimeContext = init(options).runtimeContext;
    var configs = runtimeContext.hooks.config.call().filter(function(config) {
      return Boolean(config);
    });
    runtimeContext.config = merge.apply(void 0, [
      {}
    ].concat((0,esm_to_consumable_array._)(configs), [
      runtimeContext.config || {}
    ]));
    return {
      runtimeContext
    };
  };
  var initOptions;
  var pluginManager = createPluginManager();
  return {
    run
  };
};


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+plugin-v2@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/plugin-v2/dist/esm/runtime/run/index.js

var runtime = createRuntime();


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/core/compat/hooks.js



function transformHookRunner(hookRunnerName) {
  switch (hookRunnerName) {
    case "beforeRender":
      return "onBeforeRender";
    default:
      return hookRunnerName;
  }
}
function hooks_handleSetupResult(setupResult, api) {
  if (!setupResult) {
    return;
  }
  Object.keys(setupResult).forEach(function(key) {
    var fn = setupResult[key];
    if (typeof fn === "function") {
      var newAPI = transformHookRunner(key);
      if (api[newAPI]) {
        if (key === "beforeRender") {
          api[newAPI](/* @__PURE__ */ (0,esm_async_to_generator._)(function() {
            var _len, params, _key;
            var _arguments = arguments;
            return (0,tslib_es6/* __generator */.Jh)(this, function(_state) {
              switch (_state.label) {
                case 0:
                  for (_len = _arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
                    params[_key] = _arguments[_key];
                  }
                  return [
                    4,
                    fn.apply(void 0, (0,esm_to_consumable_array._)(params))
                  ];
                case 1:
                  _state.sent();
                  return [
                    2
                  ];
              }
            });
          }));
        } else {
          api[newAPI](function() {
            for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
              params[_key] = arguments[_key];
            }
            var res = fn.apply(void 0, (0,esm_to_consumable_array._)(params));
            return res;
          });
        }
      }
    }
  });
}
function getHookRunners(runtimeContext) {
  var _internalContext = runtimeContext._internalContext;
  var hooks = _internalContext.hooks;
  return {
    beforeRender: function() {
      var _ref = (0,esm_async_to_generator._)(function(context) {
        return (0,tslib_es6/* __generator */.Jh)(this, function(_state) {
          return [
            2,
            hooks.onBeforeRender.call(context)
          ];
        });
      });
      return function(context) {
        return _ref.apply(this, arguments);
      };
    }(),
    wrapRoot: function(App) {
      return hooks.wrapRoot.call(App);
    },
    pickContext: function(context) {
      return hooks.pickContext.call(context);
    },
    config: function() {
      return hooks.config.call();
    }
  };
}


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/core/compat/index.js

var compatPlugin = function() {
  return {
    name: "@modern-js/runtime-plugin-compat",
    _registryApi: function(getRuntimeContext) {
      return {
        useRuntimeConfigContext: function() {
          var _internalContext = getRuntimeContext()._internalContext;
          return _internalContext.config;
        },
        useHookRunners: function() {
          return getHookRunners(getRuntimeContext());
        }
      };
    }
  };
};


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/core/compat/requestContext.js
var makeRequestContext = function(context) {
  var baseSSRContext = context.ssrContext;
  var requestContext = baseSSRContext ? {
    isBrowser: context.isBrowser,
    request: baseSSRContext.request || {},
    response: baseSSRContext.response || {},
    logger: baseSSRContext.logger || {}
  } : {};
  return requestContext;
};
var requestContextPlugin = function() {
  return {
    name: "@modern-js/runtime-plugin-request-context",
    setup: function setup(api) {
      api.onBeforeRender(function(context) {
        var requestContext = makeRequestContext(context);
        context.context = requestContext;
      });
    }
  };
};


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/core/plugin/index.js







function registerPlugin(internalPlugins, runtimeConfig) {
  var _ref = runtimeConfig || {}, _ref_plugins = _ref.plugins, plugins = _ref_plugins === void 0 ? [] : _ref_plugins;
  var runtimeContext = runtime.run({
    plugins: [
      compatPlugin(),
      requestContextPlugin()
    ].concat((0,esm_to_consumable_array._)(internalPlugins), (0,esm_to_consumable_array._)(plugins)),
    config: runtimeConfig || {},
    handleSetupResult: hooks_handleSetupResult
  }).runtimeContext;
  setGlobalInternalRuntimeContext(runtimeContext);
  return runtimeContext;
}
function mergeConfig(config) {
  for (var _len = arguments.length, otherConfig = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    otherConfig[_key - 1] = arguments[_key];
  }
  return merge.apply(void 0, [
    {},
    config
  ].concat((0,esm_to_consumable_array._)(otherConfig)));
}


// EXTERNAL MODULE: ./src/modern.runtime.ts
var modern_runtime = __webpack_require__(57597);
// EXTERNAL MODULE: ./node_modules/.pnpm/react-router@6.27.0_react@18.3.1/node_modules/react-router/dist/index.js
var dist = __webpack_require__(92564);
// EXTERNAL MODULE: ./node_modules/.pnpm/react-router-dom@6.27.0_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/react-router-dom/dist/index.js
var react_router_dom_dist = __webpack_require__(37541);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime-utils@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime-utils/dist/esm/url.js
function normalizePathname(pathname) {
  var normalized = "/" + pathname.replace(/^\/+|\/+$/g, "");
  if (normalized === "/") {
    return normalized;
  }
  return normalized;
}


// EXTERNAL MODULE: ./node_modules/.pnpm/@swc+helpers@0.5.17/node_modules/@swc/helpers/esm/_instanceof.js
var esm_instanceof = __webpack_require__(45204);
// EXTERNAL MODULE: ./node_modules/.pnpm/@swc+helpers@0.5.17/node_modules/@swc/helpers/esm/_sliced_to_array.js + 3 modules
var esm_sliced_to_array = __webpack_require__(41299);
// EXTERNAL MODULE: ./node_modules/.pnpm/invariant@2.2.4/node_modules/invariant/browser.js
var browser = __webpack_require__(53670);
var browser_default = /*#__PURE__*/__webpack_require__.n(browser);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/core/loader/loaderManager.js






var createGetId = function() {
  var idCache = /* @__PURE__ */ new Map();
  return function(objectId) {
    var cachedId = idCache.get(objectId);
    if (cachedId) {
      return cachedId;
    }
    var id = JSON.stringify(objectId);
    browser_default()(id, "params should be not null value");
    idCache.set(objectId, id);
    return id;
  };
};
var LoaderStatus;
(function(LoaderStatus2) {
  LoaderStatus2[LoaderStatus2["idle"] = 0] = "idle";
  LoaderStatus2[LoaderStatus2["loading"] = 1] = "loading";
  LoaderStatus2[LoaderStatus2["fulfilled"] = 2] = "fulfilled";
  LoaderStatus2[LoaderStatus2["rejected"] = 3] = "rejected";
})(LoaderStatus || (LoaderStatus = {}));
var createLoader = function(id) {
  var initialData = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {
    loading: false,
    reloading: false,
    data: void 0,
    error: void 0
  }, loaderFn = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function() {
    return Promise.resolve();
  }, skip = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
  var promise;
  var status = 0;
  var data = initialData.data, error = initialData.error;
  var hasLoaded = false;
  var handlers = /* @__PURE__ */ new Set();
  var load = function() {
    var _ref = (0,esm_async_to_generator._)(function() {
      return (0,tslib_es6/* __generator */.Jh)(this, function(_state) {
        if (skip) {
          return [
            2,
            promise
          ];
        }
        if (status === 1) {
          return [
            2,
            promise
          ];
        }
        status = 1;
        notify();
        promise = loaderFn().then(function(value) {
          data = value;
          error = null;
          status = 2;
        }).catch(function(e) {
          error = e;
          data = null;
          status = 3;
        }).finally(function() {
          promise = null;
          hasLoaded = true;
          notify();
        });
        return [
          2,
          promise
        ];
      });
    });
    return function load2() {
      return _ref.apply(this, arguments);
    };
  }();
  var getResult = function() {
    return {
      loading: !hasLoaded && status === 1,
      reloading: hasLoaded && status === 1,
      data,
      error: (0,esm_instanceof._)(error, Error) ? "".concat(error.message) : error,
      // redundant fields for ssr log
      _error: error
    };
  };
  var notify = function() {
    (0,esm_to_consumable_array._)(handlers).forEach(function(handler) {
      handler(status, getResult());
    });
  };
  var onChange = function(handler) {
    handlers.add(handler);
    return function() {
      handlers.delete(handler);
    };
  };
  return {
    get result() {
      return getResult();
    },
    get promise() {
      return promise;
    },
    onChange,
    load
  };
};
var createLoaderManager = function(initialDataMap) {
  var managerOptions = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var _managerOptions_skipStatic = managerOptions.skipStatic, skipStatic = _managerOptions_skipStatic === void 0 ? false : _managerOptions_skipStatic, _managerOptions_skipNonStatic = managerOptions.skipNonStatic, skipNonStatic = _managerOptions_skipNonStatic === void 0 ? false : _managerOptions_skipNonStatic;
  var loadersMap = /* @__PURE__ */ new Map();
  var getId = createGetId();
  var add = function(loaderFn, loaderOptions) {
    var id = getId(loaderOptions.params);
    var loader = loadersMap.get(id);
    var cache = loaderOptions._cache;
    if (!loader || cache === false) {
      var ignoreNonStatic = skipNonStatic && !loaderOptions.static;
      var ignoreStatic = skipStatic && loaderOptions.static;
      var skipExec = ignoreNonStatic || ignoreStatic;
      loader = createLoader(
        id,
        typeof initialDataMap[id] !== "undefined" ? initialDataMap[id] : {
          data: loaderOptions.initialData
        },
        loaderFn,
        // Todo whether static loader is exec when CSR
        skipExec
      );
      loadersMap.set(id, loader);
    }
    return id;
  };
  var get = function(id) {
    return loadersMap.get(id);
  };
  var hasPendingLoaders = function() {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0;
    try {
      for (var _iterator = loadersMap.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var loader = _step.value;
        var promise = loader.promise;
        if ((0,esm_instanceof._)(promise, Promise)) {
          return true;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }
    return false;
  };
  var awaitPendingLoaders = function() {
    var _ref = (0,esm_async_to_generator._)(function() {
      var pendingLoaders, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step_value, id, loader, promise;
      return (0,tslib_es6/* __generator */.Jh)(this, function(_state) {
        switch (_state.label) {
          case 0:
            pendingLoaders = [];
            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0;
            try {
              for (_iterator = loadersMap[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                _step_value = (0,esm_sliced_to_array._)(_step.value, 2), id = _step_value[0], loader = _step_value[1];
                promise = loader.promise;
                if ((0,esm_instanceof._)(promise, Promise)) {
                  pendingLoaders.push([
                    id,
                    loader
                  ]);
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
            return [
              4,
              Promise.all(pendingLoaders.map(function(item) {
                return item[1].promise;
              }))
            ];
          case 1:
            _state.sent();
            return [
              2,
              pendingLoaders.reduce(function(res, param) {
                var _param = (0,esm_sliced_to_array._)(param, 2), id2 = _param[0], loader2 = _param[1];
                res[id2] = loader2.result;
                return res;
              }, {})
            ];
        }
      });
    });
    return function awaitPendingLoaders2() {
      return _ref.apply(this, arguments);
    };
  }();
  return {
    hasPendingLoaders,
    awaitPendingLoaders,
    add,
    get
  };
};


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/core/context/runtime.js



var RuntimeReactContext = (0,react.createContext)({});
var ServerRouterContext = (0,react.createContext)({});
var getInitialContext = function() {
  var isBrowser = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true, routeManifest = arguments.length > 1 ? arguments[1] : void 0;
  return {
    loaderManager: createLoaderManager({}),
    isBrowser,
    routeManifest: routeManifest || typeof window !== "undefined" && window[ROUTE_MANIFEST]
  };
};


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/router/runtime/hooks.js

var modifyRoutes = createSyncHook();
var onBeforeCreateRoutes = createSyncHook();


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime-utils@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime-utils/dist/esm/time.js

function processHrtime(previousTimestamp) {
  var now = (/* @__PURE__ */ new Date()).getTime();
  var clocktime = now * 1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor(clocktime % 1 * 1e9);
  if (previousTimestamp) {
    seconds -= previousTimestamp[0];
    nanoseconds -= previousTimestamp[1];
    if (nanoseconds < 0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [
    seconds,
    nanoseconds
  ];
}
var getLatency = function(hrtime) {
  var _processHrtime = (0,esm_sliced_to_array._)(processHrtime(hrtime), 2), s = _processHrtime[0], ns = _processHrtime[1];
  return s * 1e3 + ns / 1e6;
};
var time = function() {
  var hrtime = processHrtime();
  return function() {
    return getLatency(hrtime);
  };
};


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime-utils@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime-utils/dist/esm/universal/async_storage.js
var getAsyncLocalStorage = function() {
  console.error("You should not get async storage in browser");
  return null;
};


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime-utils@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime-utils/dist/esm/browser/nestedRoutes.js











var transformNestedRoutes = function(routes) {
  var routeElements = [];
  var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0;
  try {
    for (var _iterator = routes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var route = _step.value;
      var routeElement = renderNestedRoute(route);
      routeElements.push(routeElement);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
  return createRoutesFromElements(routeElements);
};
var renderNestedRoute = function(nestedRoute) {
  var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  var children = nestedRoute.children, index = nestedRoute.index, id = nestedRoute.id, component = nestedRoute.component, isRoot = nestedRoute.isRoot, lazyImport = nestedRoute.lazyImport, config = nestedRoute.config, handle = nestedRoute.handle;
  var Component = component;
  var parent = options.parent, _options_props = options.props, props = _options_props === void 0 ? {} : _options_props;
  var routeProps = {
    caseSensitive: nestedRoute.caseSensitive,
    path: nestedRoute.path,
    id: nestedRoute.id,
    loader: nestedRoutes_createLoader(nestedRoute),
    action: nestedRoute.action,
    hasErrorBoundary: nestedRoute.hasErrorBoundary,
    shouldRevalidate: nestedRoute.shouldRevalidate,
    handle: (0,esm_object_spread._)({}, handle, (typeof config === "undefined" ? "undefined" : (0,_type_of._)(config)) === "object" ? config === null || config === void 0 ? void 0 : config.handle : {}),
    index: nestedRoute.index,
    element: nestedRoute.element,
    errorElement: nestedRoute.errorElement
  };
  if (nestedRoute.error) {
    var errorElement = /* @__PURE__ */ (0,jsx_runtime.jsx)(nestedRoute.error, {});
    routeProps.errorElement = errorElement;
  }
  var element;
  if (Component) {
    if ((parent === null || parent === void 0 ? void 0 : parent.loading) && lazyImport) {
      var Loading = parent.loading;
      if (isLoadableComponent(Component)) {
        element = /* @__PURE__ */ (0,jsx_runtime.jsx)(Component, {
          fallback: /* @__PURE__ */ (0,jsx_runtime.jsx)(Loading, {})
        });
      } else {
        element = /* @__PURE__ */ (0,jsx_runtime.jsx)(react.Suspense, {
          fallback: /* @__PURE__ */ (0,jsx_runtime.jsx)(Loading, {}),
          children: /* @__PURE__ */ (0,jsx_runtime.jsx)(Component, {})
        });
      }
    } else if (isLoadableComponent(Component) && lazyImport) {
      element = /* @__PURE__ */ (0,jsx_runtime.jsx)(Component, {});
    } else if (isRoot) {
      element = /* @__PURE__ */ (0,jsx_runtime.jsx)(Component, (0,esm_object_spread._)({}, props));
    } else if (lazyImport) {
      element = /* @__PURE__ */ (0,jsx_runtime.jsx)(react.Suspense, {
        fallback: null,
        children: /* @__PURE__ */ (0,jsx_runtime.jsx)(Component, {})
      });
    } else {
      element = /* @__PURE__ */ (0,jsx_runtime.jsx)(Component, {});
    }
  } else {
    nestedRoute.loading = parent === null || parent === void 0 ? void 0 : parent.loading;
    routeProps.element = /* @__PURE__ */ (0,jsx_runtime.jsx)(dist/* Outlet */.j3, {});
  }
  if (element) {
    routeProps.element = element;
  }
  var childElements = children === null || children === void 0 ? void 0 : children.map(function(childRoute) {
    return renderNestedRoute(childRoute, {
      parent: nestedRoute
    });
  });
  var routeElement = index ? /* @__PURE__ */ (0,jsx_runtime.jsx)(dist/* Route */.AW, (0,esm_object_spread_props._)((0,esm_object_spread._)({}, routeProps), {
    index: true
  }), id) : /* @__PURE__ */ (0,jsx_runtime.jsx)(dist/* Route */.AW, (0,esm_object_spread_props._)((0,esm_object_spread._)({}, routeProps), {
    index: false,
    children: childElements
  }), id);
  return routeElement;
};
function nestedRoutes_createLoader(route) {
  var loader = route.loader;
  if (loader) {
    return function() {
      var _ref = (0,esm_async_to_generator._)(function(args) {
        var end, res, cost, _storage_useContext_monitors, storage;
        return (0,tslib_es6/* __generator */.Jh)(this, function(_state) {
          switch (_state.label) {
            case 0:
              if (typeof route.lazyImport === "function") {
                route.lazyImport();
              }
              end = time();
              return [
                4,
                loader(args)
              ];
            case 1:
              res = _state.sent();
              cost = end();
              if (typeof document === "undefined") {
                ;
                storage = getAsyncLocalStorage();
                storage === null || storage === void 0 ? void 0 : (_storage_useContext_monitors = storage.useContext().monitors) === null || _storage_useContext_monitors === void 0 ? void 0 : _storage_useContext_monitors.timing("".concat(LOADER_REPORTER_NAME, "-").concat(route.id), cost);
              }
              return [
                2,
                res
              ];
          }
        });
      });
      return function(args) {
        return _ref.apply(this, arguments);
      };
    }();
  } else {
    return function() {
      if (typeof route.lazyImport === "function") {
        route.lazyImport();
      }
      return null;
    };
  }
}
function isLoadableComponent(component) {
  return component && component.displayName === "Loadable" && component.preload && typeof component.preload === "function";
}


// EXTERNAL MODULE: ./node_modules/.pnpm/@remix-run+router@1.20.0/node_modules/@remix-run/router/dist/router.js
var dist_router = __webpack_require__(13252);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/router/runtime/DefaultNotFound.js

var DefaultNotFound = function() {
  return /* @__PURE__ */ (0,jsx_runtime.jsx)("div", {
    style: {
      margin: "150px auto",
      textAlign: "center",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    },
    children: "404"
  });
};


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/router/runtime/DeferredDataScripts.js
function DeferredDataScripts_default() {
  return null;
}
;


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/router/runtime/utils.js











function getRouteComponents(routes, param) {
  var globalApp = param.globalApp, ssrMode = param.ssrMode, props = param.props;
  var Layout = function(_param) {
    var Component = _param.Component, props2 = (0,_object_without_properties._)(_param, [
      "Component"
    ]);
    var GlobalLayout = globalApp;
    if (!GlobalLayout) {
      return /* @__PURE__ */ (0,jsx_runtime.jsx)(Component, (0,esm_object_spread._)({}, props2));
    }
    return /* @__PURE__ */ (0,jsx_runtime.jsx)(GlobalLayout, (0,esm_object_spread._)({
      Component
    }, props2));
  };
  var routeElements = [];
  var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0;
  try {
    for (var _iterator = routes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var route = _step.value;
      if (route.type === "nested") {
        var routeElement = renderNestedRoute(route, {
          DeferredDataComponent: ssrMode === "stream" ? DeferredDataScripts_default : void 0,
          props
        });
        routeElements.push(routeElement);
      } else {
        var routeElement1 = /* @__PURE__ */ (0,jsx_runtime.jsx)(dist/* Route */.AW, {
          path: route.path,
          element: /* @__PURE__ */ (0,jsx_runtime.jsx)(Layout, {
            Component: route.component
          })
        }, route.path);
        routeElements.push(routeElement1);
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
  routeElements.push(/* @__PURE__ */ (0,jsx_runtime.jsx)(dist/* Route */.AW, {
    path: "*",
    element: /* @__PURE__ */ (0,jsx_runtime.jsx)(DefaultNotFound, {})
  }, "*"));
  return routeElements;
}
function renderRoutes(param) {
  var routesConfig = param.routesConfig, props = param.props, ssrMode = param.ssrMode;
  if (!routesConfig) {
    return null;
  }
  var routes = routesConfig.routes, globalApp = routesConfig.globalApp;
  if (!routes) {
    return null;
  }
  var routeElements = getRouteComponents(routes, {
    globalApp,
    ssrMode,
    props
  });
  return routeElements;
}
function getLocation(serverContext) {
  var _url_replace;
  var _ref = (serverContext === null || serverContext === void 0 ? void 0 : serverContext.request) || {}, pathname = _ref.pathname, url = _ref.url;
  var cleanUrl = url === null || url === void 0 ? void 0 : (_url_replace = url.replace("http://", "")) === null || _url_replace === void 0 ? void 0 : _url_replace.replace("https://", "");
  var index = (cleanUrl || "").indexOf(pathname);
  if (index === -1) {
    return pathname;
  }
  return cleanUrl.substring(index);
}
var urlJoin = function() {
  for (var _len = arguments.length, parts = new Array(_len), _key = 0; _key < _len; _key++) {
    parts[_key] = arguments[_key];
  }
  var separator = "/";
  var replace = new RegExp("".concat(separator, "{1,}"), "g");
  return standardSlash(parts.join(separator).replace(replace, separator));
};
function standardSlash(str) {
  var addr = str;
  if (!addr || typeof addr !== "string") {
    return addr;
  }
  if (addr.startsWith(".")) {
    addr = addr.slice(1);
  }
  if (!addr.startsWith("/")) {
    addr = "/".concat(addr);
  }
  if (addr.endsWith("/") && addr !== "/") {
    addr = addr.slice(0, addr.length - 1);
  }
  return addr;
}
function serializeErrors(errors) {
  if (!errors) {
    return null;
  }
  var entries = Object.entries(errors);
  var serialized = {};
  var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0;
  try {
    for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step_value = _sliced_to_array(_step.value, 2), key = _step_value[0], val = _step_value[1];
      if (isRouteErrorResponse(val)) {
        serialized[key] = _object_spread_props(_object_spread({}, val), {
          __type: "RouteErrorResponse"
        });
      } else if (_instanceof(val, Error)) {
        serialized[key] = {
          message: val.message,
          stack: val.stack,
          __type: "Error"
        };
      } else {
        serialized[key] = val;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
  return serialized;
}
function deserializeErrors(errors) {
  if (!errors) {
    return null;
  }
  var entries = Object.entries(errors);
  var serialized = {};
  var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0;
  try {
    for (var _iterator = entries[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step_value = (0,esm_sliced_to_array._)(_step.value, 2), key = _step_value[0], val = _step_value[1];
      if (val && val.__type === "RouteErrorResponse") {
        serialized[key] = new dist_router/* UNSAFE_ErrorResponseImpl */.OF(val.status, val.statusText, val.data, val.internal === true);
      } else if (val && val.__type === "Error") {
        var error = new Error(val.message);
        error.stack = val.stack;
        serialized[key] = error;
      } else {
        serialized[key] = val;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
  return serialized;
}


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/router/runtime/plugin.js












var finalRouteConfig = {
  routes: []
};
var beforeCreateRouter = true;
function plugin_modifyRoutes(modifyFunction) {
  if (beforeCreateRouter) {
    var originRoutes = finalRouteConfig.routes;
    var newRoutes = modifyFunction(originRoutes);
    finalRouteConfig.routes = newRoutes;
  } else {
    console.error("It is not allowed to modify routes config after create router.");
  }
}
var routerPlugin = function() {
  var userConfig = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  return {
    name: "@modern-js/plugin-router",
    registryHooks: {
      modifyRoutes: modifyRoutes,
      onBeforeCreateRoutes: onBeforeCreateRoutes
    },
    setup: function(api) {
      var routes = [];
      api.onBeforeRender(function(context) {
        if (window._SSR_DATA && userConfig.unstable_reloadOnURLMismatch) {
          var _ssrContext_request;
          var ssrContext = context.ssrContext;
          var currentPathname = normalizePathname(window.location.pathname);
          var initialPathname = (ssrContext === null || ssrContext === void 0 ? void 0 : (_ssrContext_request = ssrContext.request) === null || _ssrContext_request === void 0 ? void 0 : _ssrContext_request.pathname) && normalizePathname(ssrContext.request.pathname);
          if (initialPathname && initialPathname !== currentPathname) {
            var errorMsg = "The initial URL ".concat(initialPathname, " and the URL ").concat(currentPathname, " to be hydrated do not match, reload.");
            console.error(errorMsg);
            window.location.reload();
          }
        }
        context.router = {
          useMatches: dist/* useMatches */.SN,
          useLocation: dist/* useLocation */.TH,
          useHref: dist/* useHref */.oQ
        };
        Object.defineProperty(context, "routes", {
          get: function get() {
            return routes;
          }
        });
      });
      api.wrapRoot(function(App) {
        var pluginConfig = api.getRuntimeConfig();
        var _merge = merge(pluginConfig.router || {}, userConfig), _merge_serverBase = _merge.serverBase, serverBase = _merge_serverBase === void 0 ? [] : _merge_serverBase, _merge_supportHtml5History = _merge.supportHtml5History, supportHtml5History = _merge_supportHtml5History === void 0 ? true : _merge_supportHtml5History, _merge_basename = _merge.basename, basename = _merge_basename === void 0 ? "" : _merge_basename, routesConfig = _merge.routesConfig, createRoutes = _merge.createRoutes, future = _merge.future;
        var select = function(pathname) {
          return serverBase.find(function(baseUrl) {
            return pathname.search(baseUrl) === 0;
          }) || "/";
        };
        finalRouteConfig = (0,esm_object_spread._)({
          routes: getGlobalRoutes(),
          globalApp: getGlobalLayoutApp()
        }, routesConfig);
        if (!finalRouteConfig.routes && !createRoutes) {
          return App;
        }
        var getRouteApp = function() {
          var useCreateRouter = function(props) {
            var runtimeContext = (0,react.useContext)(RuntimeReactContext);
            var baseUrl = select(location.pathname).replace(/^\/*/, "/");
            var _basename = baseUrl === "/" ? urlJoin(baseUrl, runtimeContext._internalRouterBaseName || basename) : baseUrl;
            var hydrationData = window._ROUTER_DATA;
            var getBlockNavState = runtimeContext.unstable_getBlockNavState;
            return (0,react.useMemo)(function() {
              if (hydrationData === null || hydrationData === void 0 ? void 0 : hydrationData.errors) {
                hydrationData = (0,esm_object_spread_props._)((0,esm_object_spread._)({}, hydrationData), {
                  errors: deserializeErrors(hydrationData.errors)
                });
              }
              routes = createRoutes ? createRoutes() : (0,dist/* createRoutesFromElements */.i7)(renderRoutes({
                routesConfig: finalRouteConfig,
                props
              }));
              var hooks = api.getHooks();
              routes = hooks.modifyRoutes.call(routes);
              var router = supportHtml5History ? (0,react_router_dom_dist/* createBrowserRouter */.aj)(routes, {
                basename: _basename,
                hydrationData
              }) : (0,react_router_dom_dist/* createHashRouter */.cP)(routes, {
                basename: _basename,
                hydrationData
              });
              var originSubscribe = router.subscribe;
              router.subscribe = function(listener) {
                var wrapedListener = function() {
                  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                  }
                  var blockRoute = getBlockNavState ? getBlockNavState() : false;
                  if (blockRoute) {
                    return;
                  }
                  return listener.apply(void 0, (0,esm_to_consumable_array._)(args));
                };
                return originSubscribe(wrapedListener);
              };
              return router;
            }, [
              finalRouteConfig,
              props,
              _basename,
              hydrationData,
              getBlockNavState
            ]);
          };
          var Null = function() {
            return null;
          };
          return function(props) {
            beforeCreateRouter = false;
            var router = useCreateRouter(props);
            var routerWrapper = (
              // To match the node tree about https://github.com/web-infra-dev/modern.js/blob/v2.59.0/packages/runtime/plugin-runtime/src/router/runtime/plugin.node.tsx#L150-L168
              // According to react [useId generation algorithm](https://github.com/facebook/react/pull/22644), `useId` will generate id with the react node react struct.
              // To void hydration failed, we must guarantee that the node tree when browser hydrate must have same struct with node tree when ssr render.
              /* @__PURE__ */ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
                children: [
                  /* @__PURE__ */ (0,jsx_runtime.jsx)(react_router_dom_dist/* RouterProvider */.pG, {
                    router,
                    future
                  }),
                  /* @__PURE__ */ (0,jsx_runtime.jsx)(Null, {}),
                  /* @__PURE__ */ (0,jsx_runtime.jsx)(Null, {})
                ]
              })
            );
            return App ? /* @__PURE__ */ (0,jsx_runtime.jsx)(App, {
              children: routerWrapper
            }) : routerWrapper;
          };
        };
        return getRouteApp();
      });
    }
  };
};


;// CONCATENATED MODULE: ./node_modules/.modern-js/main/runtime-register.js



var runtime_register_runtimeConfig = typeof modern_runtime/* default */.Z === 'function' ? (0,modern_runtime/* default */.Z)(getCurrentEntryName()) : modern_runtime/* default */.Z;
var runtime_register_plugins = [];

runtime_register_plugins.push(routerPlugin(mergeConfig({
    "serverBase": [
        "/modern-js-deploy-csr"
    ]
}, (runtime_register_runtimeConfig || {})['router'], ((runtime_register_runtimeConfig || {})['routerByEntries'] || {})['main'], (getGlobalAppConfig() || {})['router'])));
registerPlugin(runtime_register_plugins, runtime_register_runtimeConfig);

;// CONCATENATED MODULE: ./node_modules/.modern-js/main/register.js



;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime-utils@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime-utils/dist/esm/parsed.js
var parsedJSONFromElement = function(id) {
  var elements = document.querySelectorAll("#".concat(id));
  if (elements.length === 0) {
    return void 0;
  }
  var element = elements[elements.length - 1];
  if (element) {
    try {
      var parsed = JSON.parse((element === null || element === void 0 ? void 0 : element.textContent) || "");
      return parsed;
    } catch (e) {
      console.error("parse ".concat(id, " error"), e);
      return void 0;
    }
  }
  return void 0;
};


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/common.js
var common_isBrowser = function() {
  return typeof window !== "undefined" && window.name !== "nodejs";
};
var JSX_SHELL_STREAM_END_MARK = "<!--<?- SHELL_STREAM_END ?>-->";
var ESCAPED_SHELL_STREAM_END_MARK = "&lt;!--&lt;?- SHELL_STREAM_END ?&gt;--&gt;";


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/core/constants.js
var RenderLevel;
(function(RenderLevel2) {
  RenderLevel2[RenderLevel2["CLIENT_RENDER"] = 0] = "CLIENT_RENDER";
  RenderLevel2[RenderLevel2["SERVER_PREFETCH"] = 1] = "SERVER_PREFETCH";
  RenderLevel2[RenderLevel2["SERVER_RENDER"] = 2] = "SERVER_RENDER";
})(RenderLevel || (RenderLevel = {}));
var SSR_DATA_JSON_ID = "__MODERN_SSR_DATA__";
var ROUTER_DATA_JSON_ID = "__MODERN_ROUTER_DATA__";


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/core/react/index.js




function createRoot(UserApp) {
  var App = UserApp || getGlobalApp();
  if (common_isBrowser()) {
    window._SSR_DATA = window._SSR_DATA || parsedJSONFromElement(SSR_DATA_JSON_ID);
    window._ROUTER_DATA = window._ROUTER_DATA || parsedJSONFromElement(ROUTER_DATA_JSON_ID);
  }
  var internalRuntimeContext = getGlobalInternalRuntimeContext();
  var hooks = internalRuntimeContext.hooks;
  var WrapperApp = hooks.wrapRoot.call(App);
  return WrapperApp;
}


// EXTERNAL MODULE: ./node_modules/.pnpm/cookie@0.7.2/node_modules/cookie/index.js
var cookie = __webpack_require__(75216);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/core/react/wrapper.js


function wrapRuntimeContextProvider(App, contextValue) {
  return /* @__PURE__ */ react.createElement(RuntimeReactContext.Provider, {
    value: contextValue
  }, App);
}


;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.27.0/node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.27.0/node_modules/@babel/runtime/helpers/esm/extends.js
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.27.0/node_modules/@babel/runtime/helpers/esm/assertThisInitialized.js
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  return e;
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.27.0/node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}

;// CONCATENATED MODULE: ./node_modules/.pnpm/@babel+runtime@7.27.0/node_modules/@babel/runtime/helpers/esm/inheritsLoose.js

function _inheritsLoose(t, o) {
  t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o);
}

// EXTERNAL MODULE: ./node_modules/.pnpm/react-is@16.13.1/node_modules/react-is/index.js
var react_is = __webpack_require__(56237);
// EXTERNAL MODULE: ./node_modules/.pnpm/hoist-non-react-statics@3.3.2/node_modules/hoist-non-react-statics/dist/hoist-non-react-statics.cjs.js
var hoist_non_react_statics_cjs = __webpack_require__(72535);
var hoist_non_react_statics_cjs_default = /*#__PURE__*/__webpack_require__.n(hoist_non_react_statics_cjs);
;// CONCATENATED MODULE: ./node_modules/.pnpm/@loadable+component@5.15.3_react@18.3.1/node_modules/@loadable/component/dist/loadable.esm.js








/* eslint-disable import/prefer-default-export */
function invariant(condition, message) {
  if (condition) return;
  var error = new Error("loadable: " + message);
  error.framesToPop = 1;
  error.name = 'Invariant Violation';
  throw error;
}
function warn(message) {
  // eslint-disable-next-line no-console
  console.warn("loadable: " + message);
}

var Context = /*#__PURE__*/
react.createContext();

var LOADABLE_REQUIRED_CHUNKS_KEY = '__LOADABLE_REQUIRED_CHUNKS__';
function getRequiredChunkKey(namespace) {
  return "" + namespace + LOADABLE_REQUIRED_CHUNKS_KEY;
}

var sharedInternals = /*#__PURE__*/(/* unused pure expression or super */ null && (Object.freeze({
  __proto__: null,
  getRequiredChunkKey: getRequiredChunkKey,
  invariant: invariant,
  Context: Context
})));

var LOADABLE_SHARED = {
  initialChunks: {}
};

var STATUS_PENDING = 'PENDING';
var STATUS_RESOLVED = 'RESOLVED';
var STATUS_REJECTED = 'REJECTED';

function resolveConstructor(ctor) {
  if (typeof ctor === 'function') {
    return {
      requireAsync: ctor,
      resolve: function resolve() {
        return undefined;
      },
      chunkName: function chunkName() {
        return undefined;
      }
    };
  }

  return ctor;
}

var loadable_esm_withChunkExtractor = function withChunkExtractor(Component) {
  var LoadableWithChunkExtractor = function LoadableWithChunkExtractor(props) {
    return react.createElement(Context.Consumer, null, function (extractor) {
      return react.createElement(Component, Object.assign({
        __chunkExtractor: extractor
      }, props));
    });
  };

  if (Component.displayName) {
    LoadableWithChunkExtractor.displayName = Component.displayName + "WithChunkExtractor";
  }

  return LoadableWithChunkExtractor;
};

var loadable_esm_identity = function identity(v) {
  return v;
};

function createLoadable(_ref) {
  var _ref$defaultResolveCo = _ref.defaultResolveComponent,
      defaultResolveComponent = _ref$defaultResolveCo === void 0 ? loadable_esm_identity : _ref$defaultResolveCo,
      _render = _ref.render,
      onLoad = _ref.onLoad;

  function loadable(loadableConstructor, options) {
    if (options === void 0) {
      options = {};
    }

    var ctor = resolveConstructor(loadableConstructor);
    var cache = {};
    /**
     * Cachekey represents the component to be loaded
     * if key changes - component has to be reloaded
     * @param props
     * @returns {null|Component}
     */

    function _getCacheKey(props) {
      if (options.cacheKey) {
        return options.cacheKey(props);
      }

      if (ctor.resolve) {
        return ctor.resolve(props);
      }

      return 'static';
    }
    /**
     * Resolves loaded `module` to a specific `Component
     * @param module
     * @param props
     * @param Loadable
     * @returns Component
     */


    function resolve(module, props, Loadable) {
      var Component = options.resolveComponent ? options.resolveComponent(module, props) : defaultResolveComponent(module);

      if (options.resolveComponent && !(0,react_is.isValidElementType)(Component)) {
        throw new Error("resolveComponent returned something that is not a React component!");
      }

      hoist_non_react_statics_cjs_default()(Loadable, Component, {
        preload: true
      });
      return Component;
    }

    var cachedLoad = function cachedLoad(props) {
      var cacheKey = _getCacheKey(props);

      var promise = cache[cacheKey];

      if (!promise || promise.status === STATUS_REJECTED) {
        promise = ctor.requireAsync(props);
        promise.status = STATUS_PENDING;
        cache[cacheKey] = promise;
        promise.then(function () {
          promise.status = STATUS_RESOLVED;
        }, function (error) {
          console.error('loadable-components: failed to asynchronously load component', {
            fileName: ctor.resolve(props),
            chunkName: ctor.chunkName(props),
            error: error ? error.message : error
          });
          promise.status = STATUS_REJECTED;
        });
      }

      return promise;
    };

    var InnerLoadable =
    /*#__PURE__*/
    function (_React$Component) {
      _inheritsLoose(InnerLoadable, _React$Component);

      InnerLoadable.getDerivedStateFromProps = function getDerivedStateFromProps(props, state) {
        var cacheKey = _getCacheKey(props);

        return _extends({}, state, {
          cacheKey: cacheKey,
          // change of a key triggers loading state automatically
          loading: state.loading || state.cacheKey !== cacheKey
        });
      };

      function InnerLoadable(props) {
        var _this;

        _this = _React$Component.call(this, props) || this;
        _this.state = {
          result: null,
          error: null,
          loading: true,
          cacheKey: _getCacheKey(props)
        };
        invariant(!props.__chunkExtractor || ctor.requireSync, 'SSR requires `@loadable/babel-plugin`, please install it'); // Server-side

        if (props.__chunkExtractor) {
          // This module has been marked with no SSR
          if (options.ssr === false) {
            return _assertThisInitialized(_this);
          } // We run load function, we assume that it won't fail and that it
          // triggers a synchronous loading of the module


          ctor.requireAsync(props)["catch"](function () {
            return null;
          }); // So we can require now the module synchronously

          _this.loadSync();

          props.__chunkExtractor.addChunk(ctor.chunkName(props));

          return _assertThisInitialized(_this);
        } // Client-side with `isReady` method present (SSR probably)
        // If module is already loaded, we use a synchronous loading
        // Only perform this synchronous loading if the component has not
        // been marked with no SSR, else we risk hydration mismatches


        if (options.ssr !== false && ( // is ready - was loaded in this session
        ctor.isReady && ctor.isReady(props) || // is ready - was loaded during SSR process
        ctor.chunkName && LOADABLE_SHARED.initialChunks[ctor.chunkName(props)])) {
          _this.loadSync();
        }

        return _this;
      }

      var _proto = InnerLoadable.prototype;

      _proto.componentDidMount = function componentDidMount() {
        this.mounted = true; // retrieve loading promise from a global cache

        var cachedPromise = this.getCache(); // if promise exists, but rejected - clear cache

        if (cachedPromise && cachedPromise.status === STATUS_REJECTED) {
          this.setCache();
        } // component might be resolved synchronously in the constructor


        if (this.state.loading) {
          this.loadAsync();
        }
      };

      _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
        // Component has to be reloaded on cacheKey change
        if (prevState.cacheKey !== this.state.cacheKey) {
          this.loadAsync();
        }
      };

      _proto.componentWillUnmount = function componentWillUnmount() {
        this.mounted = false;
      };

      _proto.safeSetState = function safeSetState(nextState, callback) {
        if (this.mounted) {
          this.setState(nextState, callback);
        }
      }
      /**
       * returns a cache key for the current props
       * @returns {Component|string}
       */
      ;

      _proto.getCacheKey = function getCacheKey() {
        return _getCacheKey(this.props);
      }
      /**
       * access the persistent cache
       */
      ;

      _proto.getCache = function getCache() {
        return cache[this.getCacheKey()];
      }
      /**
       * sets the cache value. If called without value sets it as undefined
       */
      ;

      _proto.setCache = function setCache(value) {
        if (value === void 0) {
          value = undefined;
        }

        cache[this.getCacheKey()] = value;
      };

      _proto.triggerOnLoad = function triggerOnLoad() {
        var _this2 = this;

        if (onLoad) {
          setTimeout(function () {
            onLoad(_this2.state.result, _this2.props);
          });
        }
      }
      /**
       * Synchronously loads component
       * target module is expected to already exists in the module cache
       * or be capable to resolve synchronously (webpack target=node)
       */
      ;

      _proto.loadSync = function loadSync() {
        // load sync is expecting component to be in the "loading" state already
        // sounds weird, but loading=true is the initial state of InnerLoadable
        if (!this.state.loading) return;

        try {
          var loadedModule = ctor.requireSync(this.props);
          var result = resolve(loadedModule, this.props, Loadable);
          this.state.result = result;
          this.state.loading = false;
        } catch (error) {
          console.error('loadable-components: failed to synchronously load component, which expected to be available', {
            fileName: ctor.resolve(this.props),
            chunkName: ctor.chunkName(this.props),
            error: error ? error.message : error
          });
          this.state.error = error;
        }
      }
      /**
       * Asynchronously loads a component.
       */
      ;

      _proto.loadAsync = function loadAsync() {
        var _this3 = this;

        var promise = this.resolveAsync();
        promise.then(function (loadedModule) {
          var result = resolve(loadedModule, _this3.props, Loadable);

          _this3.safeSetState({
            result: result,
            loading: false
          }, function () {
            return _this3.triggerOnLoad();
          });
        })["catch"](function (error) {
          return _this3.safeSetState({
            error: error,
            loading: false
          });
        });
        return promise;
      }
      /**
       * Asynchronously resolves(not loads) a component.
       * Note - this function does not change the state
       */
      ;

      _proto.resolveAsync = function resolveAsync() {
        var _this$props = this.props,
            __chunkExtractor = _this$props.__chunkExtractor,
            forwardedRef = _this$props.forwardedRef,
            props = _objectWithoutPropertiesLoose(_this$props, ["__chunkExtractor", "forwardedRef"]);

        return cachedLoad(props);
      };

      _proto.render = function render() {
        var _this$props2 = this.props,
            forwardedRef = _this$props2.forwardedRef,
            propFallback = _this$props2.fallback,
            __chunkExtractor = _this$props2.__chunkExtractor,
            props = _objectWithoutPropertiesLoose(_this$props2, ["forwardedRef", "fallback", "__chunkExtractor"]);

        var _this$state = this.state,
            error = _this$state.error,
            loading = _this$state.loading,
            result = _this$state.result;

        if (options.suspense) {
          var cachedPromise = this.getCache() || this.loadAsync();

          if (cachedPromise.status === STATUS_PENDING) {
            throw this.loadAsync();
          }
        }

        if (error) {
          throw error;
        }

        var fallback = propFallback || options.fallback || null;

        if (loading) {
          return fallback;
        }

        return _render({
          fallback: fallback,
          result: result,
          options: options,
          props: _extends({}, props, {
            ref: forwardedRef
          })
        });
      };

      return InnerLoadable;
    }(react.Component);

    var EnhancedInnerLoadable = loadable_esm_withChunkExtractor(InnerLoadable);
    var Loadable = react.forwardRef(function (props, ref) {
      return react.createElement(EnhancedInnerLoadable, Object.assign({
        forwardedRef: ref
      }, props));
    });
    Loadable.displayName = 'Loadable'; // In future, preload could use `<link rel="preload">`

    Loadable.preload = function (props) {
      Loadable.load(props);
    };

    Loadable.load = function (props) {
      return cachedLoad(props);
    };

    return Loadable;
  }

  function lazy(ctor, options) {
    return loadable(ctor, _extends({}, options, {
      suspense: true
    }));
  }

  return {
    loadable: loadable,
    lazy: lazy
  };
}

function loadable_esm_defaultResolveComponent(loadedModule) {
  // eslint-disable-next-line no-underscore-dangle
  return loadedModule.__esModule ? loadedModule["default"] : loadedModule["default"] || loadedModule;
}

/* eslint-disable no-use-before-define, react/no-multi-comp */

var _createLoadable =
/*#__PURE__*/
createLoadable({
  defaultResolveComponent: loadable_esm_defaultResolveComponent,
  render: function render(_ref) {
    var Component = _ref.result,
        props = _ref.props;
    return react.createElement(Component, props);
  }
}),
    loadable_esm_loadable = _createLoadable.loadable,
    loadable_esm_lazy = _createLoadable.lazy;

/* eslint-disable no-use-before-define, react/no-multi-comp */

var _createLoadable$1 =
/*#__PURE__*/
createLoadable({
  onLoad: function onLoad(result, props) {
    if (result && props.forwardedRef) {
      if (typeof props.forwardedRef === 'function') {
        props.forwardedRef(result);
      } else {
        props.forwardedRef.current = result;
      }
    }
  },
  render: function render(_ref) {
    var result = _ref.result,
        props = _ref.props;

    if (props.children) {
      return props.children(result);
    }

    return null;
  }
}),
    loadable$1 = _createLoadable$1.loadable,
    lazy$1 = _createLoadable$1.lazy;

/* eslint-disable no-underscore-dangle, camelcase */
var BROWSER = typeof window !== 'undefined';
function loadableReady(done, _temp) {
  if (done === void 0) {
    done = function done() {};
  }

  var _ref = _temp === void 0 ? {} : _temp,
      _ref$namespace = _ref.namespace,
      namespace = _ref$namespace === void 0 ? '' : _ref$namespace,
      _ref$chunkLoadingGlob = _ref.chunkLoadingGlobal,
      chunkLoadingGlobal = _ref$chunkLoadingGlob === void 0 ? '__LOADABLE_LOADED_CHUNKS__' : _ref$chunkLoadingGlob;

  if (!BROWSER) {
    warn('`loadableReady()` must be called in browser only');
    done();
    return Promise.resolve();
  }

  var requiredChunks = null;

  if (BROWSER) {
    var id = getRequiredChunkKey(namespace);
    var dataElement = document.getElementById(id);

    if (dataElement) {
      requiredChunks = JSON.parse(dataElement.textContent);
      var extElement = document.getElementById(id + "_ext");

      if (extElement) {
        var _JSON$parse = JSON.parse(extElement.textContent),
            namedChunks = _JSON$parse.namedChunks;

        namedChunks.forEach(function (chunkName) {
          LOADABLE_SHARED.initialChunks[chunkName] = true;
        });
      } else {
        // version mismatch
        throw new Error('loadable-component: @loadable/server does not match @loadable/component');
      }
    }
  }

  if (!requiredChunks) {
    warn('`loadableReady()` requires state, please use `getScriptTags` or `getScriptElements` server-side');
    done();
    return Promise.resolve();
  }

  var resolved = false;
  return new Promise(function (resolve) {
    window[chunkLoadingGlobal] = window[chunkLoadingGlobal] || [];
    var loadedChunks = window[chunkLoadingGlobal];
    var originalPush = loadedChunks.push.bind(loadedChunks);

    function checkReadyState() {
      if (requiredChunks.every(function (chunk) {
        return loadedChunks.some(function (_ref2) {
          var chunks = _ref2[0];
          return chunks.indexOf(chunk) > -1;
        });
      })) {
        if (!resolved) {
          resolved = true;
          resolve();
        }
      }
    }

    loadedChunks.push = function () {
      originalPush.apply(void 0, arguments);
      checkReadyState();
    };

    checkReadyState();
  }).then(done);
}

/* eslint-disable no-underscore-dangle */
var loadable$2 = loadable_esm_loadable;
loadable$2.lib = loadable$1;
var lazy$2 = loadable_esm_lazy;
lazy$2.lib = lazy$1;
var __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = (/* unused pure expression or super */ null && (sharedInternals));

/* ESM default export */ var loadable_esm = ((/* unused pure expression or super */ null && (loadable$2)));


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/core/browser/withCallback.js

var WithCallback = function(param) {
  var callback = param.callback, children = param.children;
  var once = (0,react.useRef)(false);
  (0,react.useLayoutEffect)(function() {
    if (once.current) {
      return;
    }
    once.current = true;
    callback();
  }, [
    callback
  ]);
  return children;
};


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/core/browser/hydrate.js







var isReact18 = function() {
  return "true" === "true";
};
function hydrateRoot(App, context, ModernRender, ModernHydrate) {
  var _window__SSR_DATA, _window, _window__SSR_DATA1, _window1;
  var hydrateContext = (0,esm_object_spread_props._)((0,esm_object_spread._)({}, context), {
    get routes() {
      return context.routes;
    },
    _hydration: true
  });
  var callback = function() {
    delete hydrateContext._hydration;
  };
  var renderLevel = ((_window = window) === null || _window === void 0 ? void 0 : (_window__SSR_DATA = _window._SSR_DATA) === null || _window__SSR_DATA === void 0 ? void 0 : _window__SSR_DATA.renderLevel) || RenderLevel.CLIENT_RENDER;
  var renderMode = ((_window1 = window) === null || _window1 === void 0 ? void 0 : (_window__SSR_DATA1 = _window1._SSR_DATA) === null || _window__SSR_DATA1 === void 0 ? void 0 : _window__SSR_DATA1.mode) || "string";
  if (isReact18() && renderMode === "stream") {
    return streamSSRHydrate();
  }
  function streamSSRHydrate() {
    if (renderLevel === RenderLevel.SERVER_RENDER) {
      var SSRApp = function() {
        return /* @__PURE__ */ (0,jsx_runtime.jsx)(WithCallback, {
          callback,
          children: App
        });
      };
      return ModernHydrate(wrapRuntimeContextProvider(/* @__PURE__ */ (0,jsx_runtime.jsx)(SSRApp, {}), hydrateContext));
    } else {
      return ModernRender(wrapRuntimeContextProvider(App, context));
    }
  }
  return stringSSRHydrate();
  function stringSSRHydrate() {
    if (renderLevel === RenderLevel.CLIENT_RENDER || renderLevel === RenderLevel.SERVER_PREFETCH) {
      return ModernRender(wrapRuntimeContextProvider(App, context));
    } else if (renderLevel === RenderLevel.SERVER_RENDER) {
      return new Promise(function(resolve) {
        if (isReact18()) {
          loadableReady(function() {
            var SSRApp = function() {
              return /* @__PURE__ */ (0,jsx_runtime.jsx)(WithCallback, {
                callback,
                children: App
              });
            };
            ModernHydrate(wrapRuntimeContextProvider(/* @__PURE__ */ (0,jsx_runtime.jsx)(SSRApp, {}), hydrateContext)).then(function(root) {
              resolve(root);
            });
          });
        } else {
          loadableReady(function() {
            ModernHydrate(wrapRuntimeContextProvider(App, hydrateContext), callback).then(function(root) {
              resolve(root);
            });
          });
        }
      });
    } else {
      console.warn("unknow render level: ".concat(renderLevel, ", execute render()"));
      return ModernRender(wrapRuntimeContextProvider(App, context));
    }
  }
}


;// CONCATENATED MODULE: ./node_modules/.pnpm/@modern-js+runtime@2.67.1_react-dom@18.3.1_react@18.3.1__react@18.3.1/node_modules/@modern-js/runtime/dist/esm/core/browser/index.js












var IS_REACT18 = "true" === "true";
var getQuery = function() {
  return window.location.search.substring(1).split("&").reduce(function(res, item) {
    var _item_split = (0,esm_sliced_to_array._)(item.split("="), 2), key = _item_split[0], value = _item_split[1];
    if (key) {
      res[key] = value;
    }
    return res;
  }, {});
};
function getSSRData() {
  var _ssrData_context, _ssrData_context1, _ssrRequest_headers;
  var ssrData = window._SSR_DATA;
  var ssrRequest = ssrData === null || ssrData === void 0 ? void 0 : (_ssrData_context = ssrData.context) === null || _ssrData_context === void 0 ? void 0 : _ssrData_context.request;
  var finalSSRData = (0,esm_object_spread_props._)((0,esm_object_spread._)({}, ssrData || {
    renderLevel: 0,
    mode: "string"
  }), {
    context: (0,esm_object_spread_props._)((0,esm_object_spread._)({}, (ssrData === null || ssrData === void 0 ? void 0 : ssrData.context) || {}), {
      request: (0,esm_object_spread_props._)((0,esm_object_spread._)({}, (ssrData === null || ssrData === void 0 ? void 0 : (_ssrData_context1 = ssrData.context) === null || _ssrData_context1 === void 0 ? void 0 : _ssrData_context1.request) || {}), {
        params: (ssrRequest === null || ssrRequest === void 0 ? void 0 : ssrRequest.params) || {},
        host: (ssrRequest === null || ssrRequest === void 0 ? void 0 : ssrRequest.host) || location.host,
        pathname: (ssrRequest === null || ssrRequest === void 0 ? void 0 : ssrRequest.pathname) || location.pathname,
        headers: (ssrRequest === null || ssrRequest === void 0 ? void 0 : ssrRequest.headers) || {},
        cookieMap: cookie.parse(document.cookie || "") || {},
        cookie: document.cookie || "",
        userAgent: (ssrRequest === null || ssrRequest === void 0 ? void 0 : (_ssrRequest_headers = ssrRequest.headers) === null || _ssrRequest_headers === void 0 ? void 0 : _ssrRequest_headers["user-agent"]) || navigator.userAgent,
        referer: document.referrer,
        query: (0,esm_object_spread._)({}, getQuery(), (ssrRequest === null || ssrRequest === void 0 ? void 0 : ssrRequest.query) || {}),
        url: location.href
      })
    })
  });
  return finalSSRData;
}
function isClientArgs(id) {
  return typeof id === "undefined" || typeof id === "string" || typeof HTMLElement !== "undefined" && (0,esm_instanceof._)(id, HTMLElement);
}
function core_browser_render(App, id) {
  return browser_render.apply(this, arguments);
}
function browser_render() {
  browser_render = (0,esm_async_to_generator._)(function(App, id) {
    var context, runBeforeRender, ModernRender, ModernHydrate, _ssrData_data, _ssrData_data1, ssrData, loadersData, initialLoadersState, initialData, rootElement;
    function _ModernRender() {
      _ModernRender = (0,esm_async_to_generator._)(function(App2) {
        var renderFunc;
        return (0,tslib_es6/* __generator */.Jh)(this, function(_state) {
          renderFunc = IS_REACT18 ? renderWithReact18 : renderWithReact17;
          return [
            2,
            renderFunc(App2, rootElement)
          ];
        });
      });
      return _ModernRender.apply(this, arguments);
    }
    function _ModernHydrate() {
      _ModernHydrate = (0,esm_async_to_generator._)(function(App2, callback) {
        var hydrateFunc;
        return (0,tslib_es6/* __generator */.Jh)(this, function(_state) {
          hydrateFunc = IS_REACT18 ? hydrateWithReact18 : hydrateWithReact17;
          return [
            2,
            hydrateFunc(App2, rootElement, callback)
          ];
        });
      });
      return _ModernHydrate.apply(this, arguments);
    }
    return (0,tslib_es6/* __generator */.Jh)(this, function(_state) {
      switch (_state.label) {
        case 0:
          context = getInitialContext();
          runBeforeRender = function() {
            var _ref = (0,esm_async_to_generator._)(function(context2) {
              var internalRuntimeContext, api, hooks, init;
              return (0,tslib_es6/* __generator */.Jh)(this, function(_state2) {
                switch (_state2.label) {
                  case 0:
                    internalRuntimeContext = getGlobalInternalRuntimeContext();
                    api = internalRuntimeContext.pluginAPI;
                    api.updateRuntimeContext(context2);
                    hooks = internalRuntimeContext.hooks;
                    return [
                      4,
                      hooks.onBeforeRender.call(context2)
                    ];
                  case 1:
                    _state2.sent();
                    init = getGlobalAppInit();
                    return [
                      2,
                      init === null || init === void 0 ? void 0 : init(context2)
                    ];
                }
              });
            });
            return function runBeforeRender2(context2) {
              return _ref.apply(this, arguments);
            };
          }();
          if (!isClientArgs(id))
            return [
              3,
              2
            ];
          ModernRender = function ModernRender2(App2) {
            return _ModernRender.apply(this, arguments);
          };
          ModernHydrate = function ModernHydrate2(App2, callback) {
            return _ModernHydrate.apply(this, arguments);
          };
          ssrData = getSSRData();
          loadersData = ((_ssrData_data = ssrData.data) === null || _ssrData_data === void 0 ? void 0 : _ssrData_data.loadersData) || {};
          initialLoadersState = Object.keys(loadersData).reduce(function(res, key) {
            var loaderData = loadersData[key];
            if ((loaderData === null || loaderData === void 0 ? void 0 : loaderData.loading) !== false) {
              return res;
            }
            res[key] = loaderData;
            return res;
          }, {});
          Object.assign(context, {
            loaderManager: createLoaderManager(initialLoadersState, {
              skipStatic: true
            }),
            // garfish plugin params
            _internalRouterBaseName: App.props.basename,
            ssrContext: ssrData.context
          });
          context.initialData = (_ssrData_data1 = ssrData.data) === null || _ssrData_data1 === void 0 ? void 0 : _ssrData_data1.initialData;
          return [
            4,
            runBeforeRender(context)
          ];
        case 1:
          initialData = _state.sent();
          if (initialData) {
            context.initialData = initialData;
          }
          rootElement = id && typeof id !== "string" ? id : document.getElementById(id || "root");
          if (window._SSR_DATA) {
            return [
              2,
              hydrateRoot(App, context, ModernRender, ModernHydrate)
            ];
          }
          return [
            2,
            ModernRender(wrapRuntimeContextProvider(App, context))
          ];
        case 2:
          throw Error("`render` function needs id in browser environment, it needs to be string or element");
      }
    });
  });
  return browser_render.apply(this, arguments);
}
function renderWithReact18(App, rootElement) {
  return _renderWithReact18.apply(this, arguments);
}
function _renderWithReact18() {
  _renderWithReact18 = (0,esm_async_to_generator._)(function(App, rootElement) {
    var ReactDOM, root;
    return (0,tslib_es6/* __generator */.Jh)(this, function(_state) {
      switch (_state.label) {
        case 0:
          return [
            4,
            __webpack_require__.e(/* import() */ "361").then(__webpack_require__.t.bind(__webpack_require__, 38751, 19))
          ];
        case 1:
          ReactDOM = _state.sent();
          root = ReactDOM.createRoot(rootElement);
          root.render(App);
          return [
            2,
            root
          ];
      }
    });
  });
  return _renderWithReact18.apply(this, arguments);
}
function renderWithReact17(App, rootElement) {
  return _renderWithReact17.apply(this, arguments);
}
function _renderWithReact17() {
  _renderWithReact17 = (0,esm_async_to_generator._)(function(App, rootElement) {
    var ReactDOM;
    return (0,tslib_es6/* __generator */.Jh)(this, function(_state) {
      switch (_state.label) {
        case 0:
          return [
            4,
            Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 30967, 19))
          ];
        case 1:
          ReactDOM = _state.sent();
          ReactDOM.render(App, rootElement);
          return [
            2,
            rootElement
          ];
      }
    });
  });
  return _renderWithReact17.apply(this, arguments);
}
function hydrateWithReact18(App, rootElement) {
  return _hydrateWithReact18.apply(this, arguments);
}
function _hydrateWithReact18() {
  _hydrateWithReact18 = (0,esm_async_to_generator._)(function(App, rootElement) {
    var ReactDOM, root;
    return (0,tslib_es6/* __generator */.Jh)(this, function(_state) {
      switch (_state.label) {
        case 0:
          return [
            4,
            __webpack_require__.e(/* import() */ "361").then(__webpack_require__.t.bind(__webpack_require__, 38751, 19))
          ];
        case 1:
          ReactDOM = _state.sent();
          root = ReactDOM.hydrateRoot(rootElement, App);
          return [
            2,
            root
          ];
      }
    });
  });
  return _hydrateWithReact18.apply(this, arguments);
}
function hydrateWithReact17(App, rootElement, callback) {
  return _hydrateWithReact17.apply(this, arguments);
}
function _hydrateWithReact17() {
  _hydrateWithReact17 = (0,esm_async_to_generator._)(function(App, rootElement, callback) {
    var ReactDOM, root;
    return (0,tslib_es6/* __generator */.Jh)(this, function(_state) {
      switch (_state.label) {
        case 0:
          return [
            4,
            Promise.resolve(/* import() */).then(__webpack_require__.t.bind(__webpack_require__, 30967, 19))
          ];
        case 1:
          ReactDOM = _state.sent();
          root = ReactDOM.hydrate(App, rootElement, callback);
          return [
            2,
            root
          ];
      }
    });
  });
  return _hydrateWithReact17.apply(this, arguments);
}


;// CONCATENATED MODULE: ./node_modules/.modern-js/main/index.jsx




var ModernRoot = createRoot();
core_browser_render(/*#__PURE__*/ (0,jsx_runtime.jsx)(ModernRoot, {}), 'root');


}),

}]);