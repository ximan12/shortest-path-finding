const weightedSearchAlgorithm = require("../pathfindingAlgorithms/weightedSearchAlgorithm");
const unweightedSearchAlgorithm = require("../pathfindingAlgorithms/unweightedSearchAlgorithm");
//when we call launchInstantAnimations, we have already got all nodes to animate (all visited nodes)
//change the className of visited nodes and then change the className of shortest path nodes
//used for redoAlgo function
function launchInstantAnimations(board, success, type, object, algorithm, heuristic) {

  //change the className of the previousNode as visited so that CSS could change the color of each nodes -- animation
  function change(previousNode) {
    let classNames = ["start"];
    let previousHTMLNode = document.getElementById(previousNode.id);
    if (!classNames.includes(previousHTMLNode.className)) {
      if (object) {
        previousHTMLNode.className = previousNode.weight === 15 ? "instantvisitedobject weight" : "instantvisitedobject";
      } else {
        //cssBasic 433 - instantvisited
        //cssBasic 439 - instantvisited weight
        previousHTMLNode.className = previousNode.weight === 15 ? "instantvisited weight" : "instantvisited";
      }
    }
  }

  //change the classname of current node and the previous node
  //the current node is spaceshiptwo-up.svg and the previous node is a yellow square
  function shortestPathChange(currentNode, previousNode) {
    let currentHTMLNode = document.getElementById(currentNode.id);
    if (type === "unweighted") {
      //cssBasic 792
      currentHTMLNode.className = "shortest-path-unweighted";
    }

    if (previousNode) {
      let previousHTMLNode = document.getElementById(previousNode.id);
      //cssBasic 734
      previousHTMLNode.className = previousNode.weight === 15 ? "instantshortest-path weight" : "instantshortest-path";
    } else {
      document.getElementById(board.start).className = "startTransparent";
    }
  }




  let nodes = object ? board.objectNodesToAnimate.slice(0) : board.nodesToAnimate.slice(0);
  let shortestNodes;
  for (let i = 1; i < nodes.length; i++) {
      change(nodes[i - 1]);
  }
  if (object) {
    board.objectNodesToAnimate = [];
    if (success) {
      board.drawShortestPath(board.object, board.start, "object");
      board.clearNodeStatuses();
      let newSuccess;
      if (type === "weighted") {
        newSuccess = weightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm, heuristic);
      } else {
        newSuccess = unweightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm);
      }
      launchInstantAnimations(board, newSuccess, type);
      shortestNodes = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
    } else {
      console.log("Failure.");
      board.reset();
      return;
    }
  } else {
    board.nodesToAnimate = [];
    if (success) {
      if (board.isObject) {
        board.drawShortestPath(board.target, board.object);
      } else {
        board.drawShortestPath(board.target, board.start);
      }
      shortestNodes = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
    } else {
      console.log("Failure");
      board.reset();
      return;
    }
  }

  let j;
  for (j = 0; j < shortestNodes.length; j++) {
    if (j === 0) {
      shortestPathChange(shortestNodes[j]);
    } else {
      shortestPathChange(shortestNodes[j], shortestNodes[j - 1]);
    }
  }
  board.reset();
  shortestPathChange(board.nodes[board.target], shortestNodes[j - 1]);
  board.objectShortestPathNodesToAnimate = [];
  board.shortestPathNodesToAnimate = [];
  if (object) {
    board.clearNodeStatuses();
    let newSuccess;
    if (type === "weighted") {
      newSuccess = weightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm);
    } else {
      newSuccess = unweightedSearchAlgorithm(board.nodes, board.object, board.target, board.nodesToAnimate, board.boardArray, algorithm);
    }
   launchInstantAnimations(board, newSuccess, type);
  }

};

module.exports = launchInstantAnimations;
