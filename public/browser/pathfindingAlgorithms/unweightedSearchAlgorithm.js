function unweightedSearchAlgorithm(nodes, start, target, nodesToAnimate, boardArray, name) {
  //unweighted: dfs & bfs
  if (!start || !target || start === target) {
    return false;
  }
  let queue = [nodes[start]];
  let visited = {start: true};
  while (queue.length) {
    //shift - remove and return the first element from an array
    let currentNode = name === "bfs" ? queue.shift() : queue.pop();
    nodesToAnimate.push(currentNode);//all the nodes we have explored
    /*if (name === "dfs") */
    visited[currentNode.id] = true;
    currentNode.status = "visited";
    if (currentNode.id === target) {
      return true;
    }
    //get left, right, upper and bottom neighbours
    let currentNeighbors = getNeighbors(currentNode.id, nodes, boardArray, name);
    currentNeighbors.forEach(neighbor => {
      //if the neighbour hasn't been explored
      if (!visited[neighbor]) {
        if (name === "bfs") visited[neighbor] = true;
        nodes[neighbor].previousNode = currentNode.id;
        queue.push(nodes[neighbor]);
      }
    });
  }
  return false;
}

function getNeighbors(id, nodes, boardArray, name) {
  let coordinates = id.split("-");
  let x = parseInt(coordinates[0]);
  let y = parseInt(coordinates[1]);
  let neighbors = [];
  let potentialNeighbor;
  if (boardArray[x - 1] && boardArray[x - 1][y]) {
    potentialNeighbor = `${x - 1}-${y}`
    if (nodes[potentialNeighbor].status !== "wall") {
      if (name === "bfs") {
        neighbors.push(potentialNeighbor);//clockwise
      } else {
        neighbors.unshift(potentialNeighbor);//anticlockwise
      }
    }
  }
  if (boardArray[x][y + 1]) {
    potentialNeighbor = `${x}-${y + 1}`
    if (nodes[potentialNeighbor].status !== "wall") {
      if (name === "bfs") {
        neighbors.push(potentialNeighbor);
      } else {
        neighbors.unshift(potentialNeighbor);
      }
    }
  }
  if (boardArray[x + 1] && boardArray[x + 1][y]) {
    potentialNeighbor = `${x + 1}-${y}`
    if (nodes[potentialNeighbor].status !== "wall") {
      if (name === "bfs") {
        neighbors.push(potentialNeighbor);
      } else {
        //dfs
        neighbors.unshift(potentialNeighbor);
      }
    }
  }
  if (boardArray[x][y - 1]) {
    potentialNeighbor = `${x}-${y - 1}`
    if (nodes[potentialNeighbor].status !== "wall") {
      if (name === "bfs") {
        neighbors.push(potentialNeighbor);
      } else {
        neighbors.unshift(potentialNeighbor);
      }
    }
  }
  return neighbors;
}

module.exports = unweightedSearchAlgorithm;
