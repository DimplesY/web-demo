
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
  // 创建一个 Set 用于存储已访问的包
  const visited = new Set();

  // 创建一个递归函数来进行深度优先搜索
  function dfs(pkg) {
    // 如果当前包已经被访问过，则存在循环依赖
    if (visited.has(pkg)) {
      return true;
    }

    // 将当前包标记为已访问
    visited.add(pkg);

    // 查找当前包的依赖对象
    const pkgObject = pkgs.find(p => p.name === pkg);

    // 如果找不到依赖对象，说明该包没有其他依赖，直接返回 false
    if (!pkgObject) {
      visited.delete(pkg);
      return false;
    }

    // 获取当前包的依赖列表
    const dependencies = Object.keys(pkgObject.dependencies);

    // 遍历依赖列表，对每个依赖进行深度优先搜索
    for (const dependency of dependencies) {
      if (dfs(dependency)) {
        return true; // 如果发现循环依赖，则返回 true
      }
    }

    // 当前包的依赖已经全部遍历完毕，将其从已访问集合中删除
    visited.delete(pkg);

    return false; // 没有发现循环依赖
  }

  // 对每个包进行深度优先搜索
  for (const pkg of pkgs) {
    if (dfs(pkg.name)) {
      return true; // 如果存在循环依赖，则返回 true
    }
  }

  return false; // 没有发现循环依赖
}


console.log(hasCircularDependency(pkgs))


