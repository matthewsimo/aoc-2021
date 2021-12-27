import rawInput from "./input.mjs";

const isNodeBig = (node) => {
  return node.toLowerCase() == node ? false : true;
};

const inputToGraph = (input) => {
  let graph = {};

  input.split("\n").forEach((connection) => {
    connection.split("-").forEach((node, i, a) => {
      const otherIndex = i === 1 ? 0 : 1;
      const newNode = a[otherIndex];
      if (graph[node]) {
        graph[node].push(newNode);
      } else {
        graph[node] = [newNode];
      }
    });
  });
  return graph;
};

const pathCanHaveNode = (path, node) => {
  if (node === "start") {
    return false;
  }

  const existingSmallNodes = path.reduce((prev, curr) => {
    if (!isNodeBig(curr)) {
      if (prev[curr]) {
        prev[curr] += 1;
      } else {
        prev[curr] = 1;
      }
    }
    return prev;
  }, {});

  const hasDoubleSmall = Object.values(existingSmallNodes).some((n) => n > 1);

  // console.log({ existingSmallNodes, hasDoubleSmall, node });

  return hasDoubleSmall ? !path.includes(node) : true;
};

const recurseNode = (graph, node, paths, visited) => {
  // console.log("================");
  // console.log({ node, connections: graph[node], paths, visited });

  graph[node].forEach((n) => {
    // console.log({ n });
    if (n === "end") {
      paths.push(visited.concat([node, n]));
    } else {
      if (isNodeBig(n)) {
        recurseNode(graph, n, paths, visited.concat(node));
      } else {
        if (pathCanHaveNode(visited.concat(node), n)) {
          recurseNode(graph, n, paths, visited.concat(node));
        }
      }
    }
  });
};

const pathsForGraph = (graph) => {
  let paths = [];

  graph["start"].forEach((node) => {
    recurseNode(graph, node, paths, ["start"]);
  });

  return paths;
};

const graph = inputToGraph(rawInput);
const graphPaths = pathsForGraph(graph);

//console.log(graph);
// console.log(graphPaths);
console.log(graphPaths.length);
