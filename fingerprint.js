var __API = __API || {};

__API.uniqueMembers = function (arr) {
  return arr.filter(function (value, index, self) { 
    return self.indexOf(value) === index;
  });
};

__API.getImmediateChildNames = function (object) {
  return __API.uniqueMembers(
    Object.getOwnPropertyNames(object)
          .concat(Object.getOwnPropertyNames(Object.getPrototypeOf(object))))
          .sort();
};

__API.standardFunctionProperties = __API.getImmediateChildNames(new Function());

// Returns a list of fully-qualified object names,
// descending from named object.
__API.getChildNames = function getChildNames(object, name) {
  var shortChildNames, longChildNames = [];
  try {
    shortChildNames = __API.getImmediateChildNames(object);
  } catch (e) {
    return [];
  }
  for (var i = 0; i < shortChildNames.length; ++i) {
    if (!(shortChildNames[i] === '__API' ||
          (typeof(object) === 'function' && 
           __API.standardFunctionProperties.indexOf(shortChildNames[i]) !== -1) ||
          (typeof(object) === 'object' &&
           shortChildNames[i] === 'prototype')
       )) {
      var failed = false, child = null;
      longChildName = ((name !== null) ? name + "."  : "") + shortChildNames[i];
      try {
        child = eval(longChildName);
      } catch (e) {
        failed = true;
      }
      if (child !== object) {
        longChildNames.push(longChildName);
        if (!failed) {
          longChildNames = longChildNames.concat(getChildNames(child, longChildName).slice());
        }
      }
    }
  }
  return longChildNames;
};

__API.getAllNames = function () { return __API.getChildNames(window, null); };

__API.typeFromName = function (x) {
  try {
    return typeof(eval(x));
  } catch (e) {
    return x;
  }
};

__API.namesOfType = function(names, type ) {
  return names.filter(function (x) { return __API.typeFromName(x) === type; } );
};

__API.value = function(name) {
  var type = __API.typeFromName(name);
  if (['boolean', 'string', 'number'].indexOf(type) !== -1) {
    try {
      return JSON.stringify(eval(name));
    } catch (e) {
      return type;
    }
  } else {
    return type;
  }
};

__API.values = function(names) {
  return names.map(function (name) { return name + ": " + __API.value(name); });
}

__API.apiTypes = function (apiNames) {
  return __API.uniqueMembers(apiNames.map(__API.typeFromName));
};
