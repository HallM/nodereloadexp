'use strict'

// requireFactory creates a function that will return the module
// when NODE_ENV is production, the module is immediately required and the factory returns the module
// in non-production, a factory is returned which will clear the cache of that module and return a fresh instance
// clearing the cache will allow any currently running code to keep on it's path, with all code from that time
// though really, you probably shouldnt do it in production for memory purposes and "just in case" factor
module.exports = function requireFactory(moduleToRequire) {
  const resolvedPath = require.resolve(moduleToRequire);

  if (process.env.NODE_ENV !== 'production') {
    return function() {
      delete require.cache[resolvedPath];
      return require(resolvedPath);
    };
  }

  // only in production do we preload the module and just return that
  // this is a tad faster than non-preload, but a tad slower than if you just required it once
  const preloadedModule = require(resolvedPath);
  return function() {
    return preloadedModule;
  }
};
