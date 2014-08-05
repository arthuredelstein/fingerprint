
// Returns a tree of object properties, with the root
// at object, assigned name.
function getNameTree(name, object) {
  try {
    var names = Object.getOwnPropertyNames(object),
        nodes = {};
  } catch (e) {
    return null;
  }
  for (var i = 0; i < names.length; ++i) {
    //console.log(names[i]);
    if (['prototype', 'caller', 'callee', 'arguments'].indexOf(names[i]) == -1) {
      child = object[names[i]];
      if (child !== object) {
        nodes[names[i]] = getNameTree(names[i], child);
      }
    }
  }
  return nodes;
};
