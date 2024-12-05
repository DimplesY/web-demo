
const pkgs = [
  {
    "name": "a",
    "dependencies": {
      "b": "^1.0.0"
    }
  },
  {
    "name": "b",
    "dependencies": {
      "c": "^1.0.0"
    }
  },
  {
    "name": "c",
    "dependencies": {
      "a": "^1.0.0"
    }
  }
]


function hasCircularDependency(pkgs) {
  const visited = new Set();
  function dfs(pkg) {
    if (visited.has(pkg)) {
      return true;
    }
    visited.add(pkg);
    const pkgObject = pkgs.find(p => p.name === pkg);
    if (!pkgObject) {
      visited.delete(pkg);
      return false;
    }
    const dependencies = Object.keys(pkgObject.dependencies);
    for (const dependency of dependencies) {
      if (dfs(dependency)) {
        return true; 
      }
    }
    visited.delete(pkg);
    return false; 
  }

  for (const pkg of pkgs) {
    if (dfs(pkg.name)) {
      return true; 
    }
  }

  return false; 
}


console.log(hasCircularDependency(pkgs))


