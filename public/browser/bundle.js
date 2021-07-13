(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const weightedSearchAlgorithm = require("../pathfindingAlgorithms/weightedSearchAlgorithm");
const unweightedSearchAlgorithm = require("../pathfindingAlgorithms/unweightedSearchAlgorithm");


    function launchAnimations(board, success, type) {
      let nodes = board.nodesToAnimate.slice(0);
      let delay = board.speed === "fast" ? 0 : board.speed === "average" ? 100 : 500;
      let shortestNodes;
      timeout(0);


      function timeout(index) {
        setTimeout(function () {
          if (index === 0) {
            document.getElementById(board.start).className = "visitedStartNodeBlue";

            if (board.currentAlgorithm === "bidirectional") {
              document.getElementById(board.target).className = "visitedTargetNodeBlue";
            }
            change(nodes[index]);
          } else if (index === nodes.length - 1 && board.currentAlgorithm === "bidirectional") {
            change(nodes[index], nodes[index - 1], "bidirectional");
          } else if (index < nodes.length - 1 && index > 0){
            change(nodes[index], nodes[index - 1]);
          }
          //draw the shortest path
          else {
            board.nodesToAnimate = [];
            if (success) {
              board.drawShortestPathTimeout(board.target, board.start, type);
              board.objectShortestPathNodesToAnimate = [];
              board.shortestPathNodesToAnimate = [];
              board.reset();
              shortestNodes = board.objectShortestPathNodesToAnimate.concat(board.shortestPathNodesToAnimate);
              return;
            } else {
              console.log("Failure.");
              board.reset();
              board.toggleButtons();
              return;
            }

          }

          timeout(index + 1);
        }, delay);
      }

      function change(currentNode, previousNode, bidirectional) {
        let currentHTMLNode = document.getElementById(currentNode.id);
        let classNames = ["start", "target", "visitedStartNodeBlue", "visitedTargetNodeBlue"];
        if (!classNames.includes(currentHTMLNode.className)) {
          currentHTMLNode.className = !bidirectional ?
              "current" : currentNode.weight === 15 ?
                  "visited weight" : "visited";
        }

        if (currentHTMLNode.className === "start") {
          currentHTMLNode.className = "visitedStartNodeBlue";
        }
        if (currentHTMLNode.className === "target") {
          currentHTMLNode.className = "visitedTargetNodeBlue";
        }
        if (previousNode) {
          let previousHTMLNode = document.getElementById(previousNode.id);
          if (!classNames.includes(previousHTMLNode.className)) {
            previousHTMLNode.className = previousNode.weight === 15 ? "visited weight" : "visited";
          }
        }
      }





    };
module.exports = launchAnimations;

},{"../pathfindingAlgorithms/unweightedSearchAlgorithm":15,"../pathfindingAlgorithms/weightedSearchAlgorithm":16}],2:[function(require,module,exports){
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

},{"../pathfindingAlgorithms/unweightedSearchAlgorithm":15,"../pathfindingAlgorithms/weightedSearchAlgorithm":16}],3:[function(require,module,exports){
    function mazeGenerationAnimations(board) {
      //from index = 0 to the end of wallsToAnimate
      let nodes = board.wallsToAnimate.slice(0);
      //fast = 5, average = 25, slow = 75 <- delay
      let delay = board.speed === "fast" ? 5 : board.speed === "average" ? 25 : 75;
      timeout(0);

      //recursion
      function timeout(index) {
        setTimeout(function () {
          if (index === nodes.length){
            board.wallsToAnimate = [];//all walls were showed
            board.toggleButtons();
            return;
          }
          //change the className then the appearance will be changed
          nodes[index].className = board.nodes[nodes[index].id].weight === 15 ? "unvisited weight" : "wall";
          timeout(index + 1);
        }, delay);
      }


    };

module.exports = mazeGenerationAnimations;

},{}],4:[function(require,module,exports){
const Node = require("./node");
const launchAnimations = require("./animations/launchAnimations");
const launchInstantAnimations = require("./animations/launchInstantAnimations");
const mazeGenerationAnimations = require("./animations/mazeGenerationAnimations");
const weightedSearchAlgorithm = require("./pathfindingAlgorithms/weightedSearchAlgorithm");
const unweightedSearchAlgorithm = require("./pathfindingAlgorithms/unweightedSearchAlgorithm");
const recursiveDivisionMaze = require("./mazeAlgorithms/recursiveDivisionMaze");
const otherMaze = require("./mazeAlgorithms/otherMaze");
const otherOtherMaze = require("./mazeAlgorithms/otherOtherMaze");
const bidirectional = require("./pathfindingAlgorithms/bidirectional");
const getDistance = require("./getDistance");

function Board(height, width) {
  this.height = height;
  this.width = width;
  this.start = null;
  this.target = null;
  this.object = null;
  this.boardArray = [];
  this.nodes = {};
  this.nodesToAnimate = [];
  this.objectNodesToAnimate = [];
  this.shortestPathNodesToAnimate = [];
  this.objectShortestPathNodesToAnimate = [];
  this.wallsToAnimate = [];
  this.mouseDown = false;
  this.pressedNodeStatus = "normal";
  this.previouslyPressedNodeStatus = null;
  this.previouslySwitchedNode = null;
  this.previouslySwitchedNodeWeight = 0;
  this.keyDown = false;
  this.algoDone = false;
  this.currentAlgorithm = null;
  this.currentHeuristic = null;
  this.numberOfObjects = 0;
  this.isObject = false;
  this.buttonsOn = false;
  this.speed = "fast";
}

Board.prototype.initialise = function() {
  this.createGrid();
  this.addEventListeners();
  this.toggleTutorialButtons();
};

Board.prototype.createGrid = function() {
  let tableHTML = "";
  for (let r = 0; r < this.height; r++) {
    let currentArrayRow = [];
    let currentHTMLRow = `<tr id="row ${r}">`;
    for (let c = 0; c < this.width; c++) {
      let newNodeId = `${r}-${c}`, newNodeClass, newNode;
      if (r === Math.floor(this.height / 2) && c === Math.floor(this.width / 4)) {
        newNodeClass = "start";
        this.start = `${newNodeId}`;
      } else if (r === Math.floor(this.height / 2) && c === Math.floor(3 * this.width / 4)) {
        newNodeClass = "target";
        this.target = `${newNodeId}`;
      } else {
        newNodeClass = "unvisited";
      }
      newNode = new Node(newNodeId, newNodeClass);
      currentArrayRow.push(newNode);
      currentHTMLRow += `<td id="${newNodeId}" class="${newNodeClass}"></td>`;
      this.nodes[`${newNodeId}`] = newNode;
    }
    this.boardArray.push(currentArrayRow);
    tableHTML += `${currentHTMLRow}</tr>`;
  }
  let board = document.getElementById("board");
  board.innerHTML = tableHTML;
};

Board.prototype.addEventListeners = function() {
  let board = this;
  for (let r = 0; r < board.height; r++) {
    for (let c = 0; c < board.width; c++) {
      let currentId = `${r}-${c}`;
      let currentNode = board.getNode(currentId);
      let currentElement = document.getElementById(currentId);
      currentElement.onmousedown = (e) => {
        e.preventDefault();
        if (this.buttonsOn) {
          board.mouseDown = true;
          if (currentNode.status === "start" || currentNode.status === "target" || currentNode.status === "object") {
            board.pressedNodeStatus = currentNode.status;
          } else {
            board.pressedNodeStatus = "normal";
            board.changeNormalNode(currentNode);
          }
        }
      }
      currentElement.onmouseup = () => {
        if (this.buttonsOn) {
          board.mouseDown = false;
          if (board.pressedNodeStatus === "target") {
            board.target = currentId;
          } else if (board.pressedNodeStatus === "start") {
            board.start = currentId;
          } else if (board.pressedNodeStatus === "object") {
            board.object = currentId;
          }
          board.pressedNodeStatus = "normal";
        }
      }
      currentElement.onmouseenter = () => {
        if (this.buttonsOn) {
          //change the position of start, target or object, and recall the algorithm
          if (board.mouseDown && board.pressedNodeStatus !== "normal") {
            board.changeSpecialNode(currentNode);
            if (board.pressedNodeStatus === "target") {
              board.target = currentId;
              if (board.algoDone) {
                board.redoAlgorithm();
              }
            } else if (board.pressedNodeStatus === "start") {
              board.start = currentId;
              if (board.algoDone) {
                board.redoAlgorithm();
              }
            } else if (board.pressedNodeStatus === "object") {
              board.object = currentId;
              if (board.algoDone) {
                board.redoAlgorithm();
              }
            }
          } else if (board.mouseDown) {
            board.changeNormalNode(currentNode);
          }
        }
      }
      currentElement.onmouseleave = () => {
        if (this.buttonsOn) {
          if (board.mouseDown && board.pressedNodeStatus !== "normal") {
            board.changeSpecialNode(currentNode);
          }
        }
      }
    }
  }
};

Board.prototype.getNode = function(id) {
  let coordinates = id.split("-");
  let r = parseInt(coordinates[0]);
  let c = parseInt(coordinates[1]);
  return this.boardArray[r][c];
};

Board.prototype.changeSpecialNode = function(currentNode) {//when current status is not start, target or object
  let element = document.getElementById(currentNode.id), previousElement;
  if (this.previouslySwitchedNode)
    previousElement = document.getElementById(this.previouslySwitchedNode.id);

  //if current status is normal
  if (currentNode.status !== "target" && currentNode.status !== "start" && currentNode.status !== "object") {
    if (this.previouslySwitchedNode) {//if previouslySwitchedNode is not null
      this.previouslySwitchedNode.status = this.previouslyPressedNodeStatus;
      //unvisited weight is equal to 15
      previousElement.className = this.previouslySwitchedNodeWeight === 15 ?
      "unvisited weight" : this.previouslyPressedNodeStatus;
      this.previouslySwitchedNode.weight = this.previouslySwitchedNodeWeight === 15 ?
      15 : 0;

      //temporarily store values to the variables below
      this.previouslySwitchedNode = null;
      this.previouslySwitchedNodeWeight = currentNode.weight;

      this.previouslyPressedNodeStatus = currentNode.status;
      element.className = this.pressedNodeStatus;
      currentNode.status = this.pressedNodeStatus;
      //current Node has been visited
      currentNode.weight = 0;
    }
  }
  //current Node is start, target or object
  else if (currentNode.status !== this.pressedNodeStatus && !this.algoDone) {
    this.previouslySwitchedNode.status = this.pressedNodeStatus;
    previousElement.className = this.pressedNodeStatus;
  } else if (currentNode.status === this.pressedNodeStatus) {//what does pressedNodeStatus mean
    this.previouslySwitchedNode = currentNode;
    element.className = this.previouslyPressedNodeStatus;
    currentNode.status = this.previouslyPressedNodeStatus;
  }
};

Board.prototype.changeNormalNode = function(currentNode) {
  let element = document.getElementById(currentNode.id);
  let relevantStatuses = ["start", "target", "object"];
  let unweightedAlgorithms = ["dfs", "bfs"]
  if (!this.keyDown) {//if the current node hasn't been clicked on
    if (!relevantStatuses.includes(currentNode.status)) {//what is object?
      //when status is wall or unvisited
      //if current status is not wall, then change both className and status to wall
      element.className = currentNode.status !== "wall" ?
        "wall" : "unvisited";
      currentNode.status = element.className !== "wall" ?
        "unvisited" : "wall";
      currentNode.weight = 0;
    }
  } else if (this.keyDown === 87 && !unweightedAlgorithms.includes(this.currentAlgorithm)) {
    //current algorithm is a weighted one
    if (!relevantStatuses.includes(currentNode.status)) {
      //when status is wall or unvisited
      //when weight is not 15, change weight to 15 and className to "unvisited weight"
      element.className = currentNode.weight !== 15 ?
        "unvisited weight" : "unvisited";
      currentNode.weight = element.className !== "unvisited weight" ?
        0 : 15;
      currentNode.status = "unvisited";
    }
  }
};

Board.prototype.drawShortestPath = function(targetNodeId, startNodeId, object) {
  let currentNode;
  if (this.currentAlgorithm !== "bidirectional") {
    currentNode = this.nodes[this.nodes[targetNodeId].previousNode];
    if (object) {
      while (currentNode.id !== startNodeId) {
        this.objectShortestPathNodesToAnimate.unshift(currentNode);
        currentNode = this.nodes[currentNode.previousNode];
      }
    } else {
      while (currentNode.id !== startNodeId) {
        this.shortestPathNodesToAnimate.unshift(currentNode);
        // document.getElementById(currentNode.id).className = `shortest-path`;
        currentNode = this.nodes[currentNode.previousNode];
      }
    }
  } else {
    if (this.middleNode !== this.target && this.middleNode !== this.start) {
      currentNode = this.nodes[this.nodes[this.middleNode].previousNode];
      secondCurrentNode = this.nodes[this.nodes[this.middleNode].otherpreviousNode];
      if (secondCurrentNode.id === this.target) {
        this.nodes[this.target].direction = getDistance(this.nodes[this.middleNode], this.nodes[this.target])[2];
      }
      if (this.nodes[this.middleNode].weight === 0) {
        document.getElementById(this.middleNode).className = `shortest-path`;
      } else {
        document.getElementById(this.middleNode).className = `shortest-path weight`;
      }
      while (currentNode.id !== startNodeId) {
        this.shortestPathNodesToAnimate.unshift(currentNode);
        document.getElementById(currentNode.id).className = `shortest-path`;
        currentNode = this.nodes[currentNode.previousNode];
      }
      while (secondCurrentNode.id !== targetNodeId) {
        this.shortestPathNodesToAnimate.unshift(secondCurrentNode);
        document.getElementById(secondCurrentNode.id).className = `shortest-path`;
        if (secondCurrentNode.otherpreviousNode === targetNodeId) {
          if (secondCurrentNode.otherdirection === "left") {
            secondCurrentNode.direction = "right";
          } else if (secondCurrentNode.otherdirection === "right") {
            secondCurrentNode.direction = "left";
          } else if (secondCurrentNode.otherdirection === "up") {
            secondCurrentNode.direction = "down";
          } else if (secondCurrentNode.otherdirection === "down") {
            secondCurrentNode.direction = "up";
          }
          this.nodes[this.target].direction = getDistance(secondCurrentNode, this.nodes[this.target])[2];
        }
        secondCurrentNode = this.nodes[secondCurrentNode.otherpreviousNode]
      }
    } else {
      document.getElementById(this.nodes[this.target].previousNode).className = `shortest-path`;
    }
  }
};


Board.prototype.drawShortestPathTimeout = function(targetNodeId, startNodeId, type, object) {
  let board = this;
  let currentNode;
  let secondCurrentNode;
  let currentNodesToAnimate;

  if (board.currentAlgorithm !== "bidirectional") {
    currentNode = board.nodes[board.nodes[targetNodeId].previousNode];
      currentNodesToAnimate = [];
      //add the shortest path nodes to currentNodesToAnimate
      while (currentNode.id !== startNodeId) {
        currentNodesToAnimate.unshift(currentNode);
        currentNode = board.nodes[currentNode.previousNode];
      }

  } else {
    if (board.middleNode !== board.target && board.middleNode !== board.start) {
      currentNode = board.nodes[board.nodes[board.middleNode].previousNode];
      secondCurrentNode = board.nodes[board.nodes[board.middleNode].otherpreviousNode];
      if (secondCurrentNode.id === board.target) {
        board.nodes[board.target].direction = getDistance(board.nodes[board.middleNode], board.nodes[board.target])[2];
      }

        currentNodesToAnimate = [];
        board.nodes[board.middleNode].direction = getDistance(currentNode, board.nodes[board.middleNode])[2];
        while (currentNode.id !== startNodeId) {
          currentNodesToAnimate.unshift(currentNode);
          currentNode = board.nodes[currentNode.previousNode];
        }
        currentNodesToAnimate.push(board.nodes[board.middleNode]);
        while (secondCurrentNode.id !== targetNodeId) {
          if (secondCurrentNode.otherdirection === "left") {
            secondCurrentNode.direction = "right";
          } else if (secondCurrentNode.otherdirection === "right") {
            secondCurrentNode.direction = "left";
          } else if (secondCurrentNode.otherdirection === "up") {
            secondCurrentNode.direction = "down";
          } else if (secondCurrentNode.otherdirection === "down") {
            secondCurrentNode.direction = "up";
          }
          currentNodesToAnimate.push(secondCurrentNode);
          if (secondCurrentNode.otherpreviousNode === targetNodeId) {
            board.nodes[board.target].direction = getDistance(secondCurrentNode, board.nodes[board.target])[2];
          }
          secondCurrentNode = board.nodes[secondCurrentNode.otherpreviousNode]
        }

  } else {
    currentNodesToAnimate = [];
    let target = board.nodes[board.target];
    currentNodesToAnimate.push(board.nodes[target.previousNode], target);
  }

}


  timeout(0);

  function timeout(index) {
    if (!currentNodesToAnimate.length) currentNodesToAnimate.push(board.nodes[board.start]);
    setTimeout(function () {
      if (index === 0) {
        shortestPathChange(currentNodesToAnimate[index]);
      } else if (index < currentNodesToAnimate.length) {
        shortestPathChange(currentNodesToAnimate[index], currentNodesToAnimate[index - 1]);
      } else if (index === currentNodesToAnimate.length) {
        shortestPathChange(board.nodes[board.target], currentNodesToAnimate[index - 1]);
      }
      if (index > currentNodesToAnimate.length) {
        board.toggleButtons();
        return;
      }
      timeout(index + 1);
    }, 40)
  }


  function shortestPathChange(currentNode, previousNode) {

    if (currentNode.id !== board.start) {
        let currentHTMLNode = document.getElementById(currentNode.id);
        if (type === "unweighted") {
          currentHTMLNode.className = "shortest-path-unweighted";
        } else {
          if (currentNode["direction"] === "up") {
            currentHTMLNode.className = "shortest-path-up";
          } else if (currentNode["direction"] === "down") {
            currentHTMLNode.className = "shortest-path-down";
          } else if (currentNode["direction"] === "right") {
            currentHTMLNode.className = "shortest-path-right";
          } else if (currentNode["direction"] === "left") {
            currentHTMLNode.className = "shortest-path-left";
          } else {
            currentHTMLNode.className = "shortest-path";
          }
        }
      }
    if (previousNode) {
      if (previousNode.id !== board.target && previousNode.id !== board.start) {
        let previousHTMLNode = document.getElementById(previousNode.id);
        previousHTMLNode.className = "shortest-path";
      }
    } else {
      let element = document.getElementById(board.start);
      element.className = "startTransparent";
    }
  }

};

Board.prototype.createMazeOne = function(type) {
  Object.keys(this.nodes).forEach(node => {
    let random = Math.random();
    let currentHTMLNode = document.getElementById(node);
    let relevantClassNames = ["start", "target", "object"]
    let randomTwo = type === "wall" ? 0.25 : 0.35;
    if (random < randomTwo && !relevantClassNames.includes(currentHTMLNode.className)) {
      if (type === "wall") {
        currentHTMLNode.className = "wall";
        this.nodes[node].status = "wall";
        this.nodes[node].weight = 0;
      } else if (type === "weight") {
        currentHTMLNode.className = "unvisited weight";
        this.nodes[node].status = "unvisited";
        this.nodes[node].weight = 15;
      }
    }
  });
};

Board.prototype.clearPath = function(clickedButton) {
  if (clickedButton) {
    let start = this.nodes[this.start];
    let target = this.nodes[this.target];
    let object = this.numberOfObjects ? this.nodes[this.object] : null;
    start.status = "start";
    document.getElementById(start.id).className = "start";
    target.status = "target";
    document.getElementById(target.id).className = "target";
    if (object) {
      object.status = "object";
      document.getElementById(object.id).className = "object";
    }
  }

  document.getElementById("startButtonStart").onclick = () => {
    if (!this.currentAlgorithm) {
      document.getElementById("startButtonStart").innerHTML = '<button class="btn btn-default navbar-btn" type="button">Pick an Algorithm!</button>'
    } else {
      this.clearPath("clickedButton");
      this.toggleButtons();
      let weightedAlgorithms = ["dijkstra", "greedy"];
      let unweightedAlgorithms = ["dfs", "bfs"];
      let success;
      if (this.currentAlgorithm === "bidirectional") {
        if (!this.numberOfObjects) {
          success = bidirectional(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic, this);
          launchAnimations(this, success, "weighted");
        } else {
          this.isObject = true;
        }
        this.algoDone = true;
      } else if (this.currentAlgorithm === "astar") {
        if (!this.numberOfObjects) {
          success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
          launchAnimations(this, success, "weighted");
        } else {
          this.isObject = true;
          success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
          launchAnimations(this, success, "weighted");
        }
        this.algoDone = true;
      } else if (weightedAlgorithms.includes(this.currentAlgorithm)) {
        if (!this.numberOfObjects) {
          success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
          launchAnimations(this, success, "weighted");
        } else {
          this.isObject = true;
          success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
          launchAnimations(this, success, "weighted");
        }
        this.algoDone = true;
      } else if (unweightedAlgorithms.includes(this.currentAlgorithm)) {
        if (!this.numberOfObjects) {
          success = unweightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm);
          launchAnimations(this, success, "unweighted");
        } else {
          this.isObject = true;
          success = unweightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm);
          launchAnimations(this, success, "unweighted");
        }
        this.algoDone = true;
      }
    }
  }

  this.algoDone = false;
  Object.keys(this.nodes).forEach(id => {
    let currentNode = this.nodes[id];
    currentNode.previousNode = null;
    currentNode.distance = Infinity;
    currentNode.totalDistance = Infinity;
    currentNode.heuristicDistance = null;
    currentNode.direction = null;
    currentNode.storedDirection = null;
    currentNode.relatesToObject = false;
    currentNode.overwriteObjectRelation = false;
    currentNode.otherpreviousNode = null;
    currentNode.otherdistance = Infinity;
    currentNode.otherdirection = null;
    let currentHTMLNode = document.getElementById(id);
    let relevantStatuses = ["wall", "start", "target", "object"];
    if ((!relevantStatuses.includes(currentNode.status) || currentHTMLNode.className === "visitedobject") && currentNode.weight !== 15) {
      currentNode.status = "unvisited";
      currentHTMLNode.className = "unvisited";
    } else if (currentNode.weight === 15) {
      currentNode.status = "unvisited";
      currentHTMLNode.className = "unvisited weight";
    }
  });
};

Board.prototype.clearWalls = function() {
  this.clearPath("clickedButton");
  Object.keys(this.nodes).forEach(id => {
    let currentNode = this.nodes[id];
    let currentHTMLNode = document.getElementById(id);
    if (currentNode.status === "wall" || currentNode.weight === 15) {
      currentNode.status = "unvisited";
      currentNode.weight = 0;
      currentHTMLNode.className = "unvisited";
    }
  });
}

Board.prototype.clearWeights = function() {
  Object.keys(this.nodes).forEach(id => {
    let currentNode = this.nodes[id];
    let currentHTMLNode = document.getElementById(id);
    if (currentNode.weight === 15) {
      currentNode.status = "unvisited";
      currentNode.weight = 0;
      currentHTMLNode.className = "unvisited";
    }
  });
}

Board.prototype.clearNodeStatuses = function() {
  Object.keys(this.nodes).forEach(id => {
    let currentNode = this.nodes[id];
    currentNode.previousNode = null;
    currentNode.distance = Infinity;
    currentNode.totalDistance = Infinity;
    currentNode.heuristicDistance = null;
    currentNode.storedDirection = currentNode.direction;
    currentNode.direction = null;
    let relevantStatuses = ["wall", "start", "target", "object"];
    if (!relevantStatuses.includes(currentNode.status)) {
      currentNode.status = "unvisited";
    }
  })
};

Board.prototype.instantAlgorithm = function() {
  let weightedAlgorithms = ["dijkstra", "CLA", "greedy"];
  let unweightedAlgorithms = ["dfs", "bfs"];
  let success;
  if (this.currentAlgorithm === "bidirectional") {
    if (!this.numberOfObjects) {
      success = bidirectional(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic, this);
      launchInstantAnimations(this, success, "weighted");
    } else {
      this.isObject = true;
    }
    this.algoDone = true;
  } else if (this.currentAlgorithm === "astar") {
    if (!this.numberOfObjects) {
      success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
      launchInstantAnimations(this, success, "weighted");
    } else {
      this.isObject = true;
      success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
      launchInstantAnimations(this, success, "weighted", "object", this.currentAlgorithm);
    }
    this.algoDone = true;
  }
  if (weightedAlgorithms.includes(this.currentAlgorithm)) {
    if (!this.numberOfObjects) {
      success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
      launchInstantAnimations(this, success, "weighted");
    } else {
      this.isObject = true;
      success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
      launchInstantAnimations(this, success, "weighted", "object", this.currentAlgorithm, this.currentHeuristic);
    }
    this.algoDone = true;
  } else if (unweightedAlgorithms.includes(this.currentAlgorithm)) {
    if (!this.numberOfObjects) {
      success = unweightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm);
      launchInstantAnimations(this, success, "unweighted");
    } else {
      this.isObject = true;
      success = unweightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm);
      launchInstantAnimations(this, success, "unweighted", "object", this.currentAlgorithm);
    }
    this.algoDone = true;
  }
};

Board.prototype.redoAlgorithm = function() {
  this.clearPath();
  this.instantAlgorithm();
};

Board.prototype.reset = function(objectNotTransparent) {
  this.nodes[this.start].status = "start";
  document.getElementById(this.start).className = "startTransparent";
  this.nodes[this.target].status = "target";
  if (this.object) {
    this.nodes[this.object].status = "object";
    if (objectNotTransparent) {
      document.getElementById(this.object).className = "visitedObjectNode";
    } else {
      document.getElementById(this.object).className = "objectTransparent";
    }
  }
};

Board.prototype.resetHTMLNodes = function() {
  let start = document.getElementById(this.start);
  let target = document.getElementById(this.target);
  start.className = "start";
  target.className = "target";
};

Board.prototype.changeStartNodeImages = function() {
  let unweighted = ["bfs", "dfs"];
  let guaranteed = ["dijkstra", "astar"];
  let name = "";
  if (this.currentAlgorithm === "bfs") {
    name = "Breadth-first Search";
  } else if (this.currentAlgorithm === "dfs") {
    name = "Depth-first Search";
  } else if (this.currentAlgorithm === "dijkstra") {
    name = "Dijkstra's Algorithm";
  } else if (this.currentAlgorithm === "astar") {
    name = "A* Search";
  } else if (this.currentAlgorithm === "greedy") {
    name = "Greedy Best-first Search";
  }  else if (this.currentAlgorithm === "bidirectional") {
    name = "Bidirectional Algorithm";
  }
  if (unweighted.includes(this.currentAlgorithm)) {
    if (this.currentAlgorithm === "dfs") {
      document.getElementById("algorithmDescriptor").innerHTML = `${name} is <i><b>unweighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
    } else {
      document.getElementById("algorithmDescriptor").innerHTML = `${name} is <i><b>unweighted</b></i> and <i><b>guarantees</b></i> the shortest path!`;
    }
    //document.getElementById("weightLegend").className = "strikethrough";
    for (let i = 0; i < 14; i++) {
      let j = i.toString();
      let backgroundImage = document.styleSheets["1"].rules[j].style.backgroundImage;
      document.styleSheets["1"].rules[j].style.backgroundImage = backgroundImage.replace("triangle", "spaceship");
    }
  } else {
    if (this.currentAlgorithm === "greedy" || this.currentAlgorithm === "CLA") {
      document.getElementById("algorithmDescriptor").innerHTML = `${name} is <i><b>weighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;
    }
    //document.getElementById("weightLegend").className = "";
    for (let i = 0; i < 14; i++) {
      let j = i.toString();
      let backgroundImage = document.styleSheets["1"].rules[j].style.backgroundImage;
      document.styleSheets["1"].rules[j].style.backgroundImage = backgroundImage.replace("spaceship", "triangle");
    }
  }
  if (this.currentAlgorithm === "bidirectional") {

    document.getElementById("algorithmDescriptor").innerHTML = `${name} is <i><b>weighted</b></i> and <i><b>does not guarantee</b></i> the shortest path!`;

  }
  if (guaranteed.includes(this.currentAlgorithm)) {
    document.getElementById("algorithmDescriptor").innerHTML = `${name} is <i><b>weighted</b></i> and <i><b>guarantees</b></i> the shortest path!`;
  }
};

let counter = 1;
Board.prototype.toggleTutorialButtons = function() {

  document.getElementById("skipButton").onclick = () => {
    document.getElementById("tutorial").style.display = "none";
    this.toggleButtons();
  }

  if (document.getElementById("nextButton")) {
    document.getElementById("nextButton").onclick = () => {
      if (counter < 8) counter++;
      nextPreviousClick();
      this.toggleTutorialButtons();
    }
  }

  document.getElementById("previousButton").onclick = () => {
    if (counter > 1) counter--;
    nextPreviousClick();
    this.toggleTutorialButtons()
  }

  let board = this;
  function nextPreviousClick() {
    switch (counter) {
      case 1:
      document.getElementById("tutorial").innerHTML = `<h3>Welcome to ShortestPath Visualizer!</h3><h6>This short tutorial will walk you through all of the features of this application.</h6><p>If you want to dive right in, feel free to press the "Skip Tutorial" button below. Otherwise, press "Next"!</p><div id="tutorialCounter">1/8</div><button id="nextButton" class="btn btn-outline-warning navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-outline-warning navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
      break;
      case 2:
      document.getElementById("tutorial").innerHTML = `<h3>What is a pathfinding algorithm?</h3><h6>At its core, a pathfinding algorithm seeks to find the shortest path between two points. This application visualizes various pathfinding algorithms in action, and more!</h6><p>All of the algorithms on this application are adapted for a 2D grid, where 90 degree turns have a "cost" of 1 and movements from a node to another have a "cost" of 1.</p><div id="tutorialCounter">${counter}/8</div><button id="nextButton" class="btn btn-outline-warning navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
      break;
      case 3:
      document.getElementById("tutorial").innerHTML = `<h3>Picking an algorithm</h3><h6>Choose an algorithm from the "Algorithms" drop-down menu.</h6><p>Note that some algorithms are <i><b>unweighted</b></i>, while others are <i><b>weighted</b></i>. Unweighted algorithms do not take turns into account, whereas weighted ones do. Additionally, not all algorithms guarantee the shortest path. </p><div id="tutorialCounter">${counter}/8</div><button id="nextButton" class="btn btn-outline-warning navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
      break;
      case 4:
      document.getElementById("tutorial").innerHTML = `<h3>Meet the algorithms</h3><h6>Not all algorithms are created equal.</h6><ul><li><b>Dijkstra's Algorithm</b> (weighted): the father of pathfinding algorithms; guarantees the shortest path</li><li><b>A* Search</b> (weighted): arguably the best pathfinding algorithm; uses heuristics to guarantee the shortest path much faster than Dijkstra's Algorithm</li><li><b>Greedy BFS</b> (weighted): a faster, more heuristic-heavy version of A*; does not guarantee the shortest path</li><li><b>Bidirectional Swarm Algorithm</b> (weighted): Swarm from both sides; does not guarantee the shortest path</li><li><b>Breadth-first Search</b> (unweighted): a great algorithm; guarantees the shortest path</li><li><b>Depth-first Search</b> (unweighted): a very bad algorithm for pathfinding; does not guarantee the shortest path</li></ul><div id="tutorialCounter">${counter}/8</div><button id="nextButton" class="btn btn-outline-warning navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
      break;
      case 5:
      document.getElementById("tutorial").innerHTML = `<h3>Adding walls</h3><h6>Click on the grid to add a wall. Generate mazes and patterns from the "Mazes & Patterns" drop-down menu.</h6><p>Walls are impenetrable, meaning that a path cannot cross through them. </p><div id="tutorialCounter">${counter}/8</div><button id="nextButton" class="btn btn-outline-warning navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
      break;
      case 6:
      document.getElementById("tutorial").innerHTML = `<h3>Dragging nodes</h3><h6>Click and drag the start, bomb, and target nodes to move them.</h6><p>Note that you can drag nodes even after an algorithm has finished running. This will allow you to instantly see different paths.</p><div id="tutorialCounter">${counter}/8</div><button id="nextButton" class="btn btn-outline-warning navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
      break;
      case 7:
      document.getElementById("tutorial").innerHTML = `<h3>Visualizing and more</h3><h6>Use the navbar buttons to visualize algorithms and to do other stuff!</h6><p>You can clear the current path, clear walls, clear the entire board, and adjust the visualization speed, all from the navbar. If you want to access this tutorial again, click on "ShortestPath Visualizer" in the top left corner of your screen.</p><div id="tutorialCounter">${counter}/8</div><button id="nextButton" class="btn btn-outline-warning navbar-btn" type="button">Next</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
      break;
      case 8:
      document.getElementById("tutorial").innerHTML = `<h3>Enjoy!</h3></p><div id="tutorialCounter">${counter}/8</div><button id="finishButton" class="btn btn-outline-warning navbar-btn" type="button">Finish</button><button id="previousButton" class="btn btn-default navbar-btn" type="button">Previous</button><button id="skipButton" class="btn btn-default navbar-btn" type="button">Skip Tutorial</button>`
      document.getElementById("finishButton").onclick = () => {
        document.getElementById("tutorial").style.display = "none";
        board.toggleButtons();
      }
      break;
    }
  }

};

//button listeners
Board.prototype.toggleButtons = function() {
  document.getElementById("refreshButton").onclick = () => {
    window.location.reload(true);
  }

  if (!this.buttonsOn) {
    this.buttonsOn = true;

    document.getElementById("startButtonStart").onclick = () => {
      //algorithm
      if (!this.currentAlgorithm) {
        document.getElementById("startButtonStart").innerHTML = '<button class="btn btn-default navbar-btn" type="button">Pick an Algorithm!</button>'
      } else {
        this.clearPath("clickedButton");
        this.toggleButtons();
        let weightedAlgorithms = ["dijkstra", "CLA", "CLA", "greedy"];
        let unweightedAlgorithms = ["dfs", "bfs"];
        let success;
        if (this.currentAlgorithm === "bidirectional") {
          if (!this.numberOfObjects) {
            success = bidirectional(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic, this);
            launchAnimations(this, success, "weighted");
          } else {
            this.isObject = true;
            success = bidirectional(this.nodes, this.start, this.object, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic, this);
            launchAnimations(this, success, "weighted");
          }
          this.algoDone = true;
        } else if (this.currentAlgorithm === "astar") {
          if (!this.numberOfObjects) {
            success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
            launchAnimations(this, success, "weighted");
          } else {
            this.isObject = true;
            success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
            launchAnimations(this, success, "weighted");
          }
          this.algoDone = true;
        } else if (weightedAlgorithms.includes(this.currentAlgorithm)) {
          if (!this.numberOfObjects) {
            success = weightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
            launchAnimations(this, success, "weighted");
          } else {
            this.isObject = true;
            success = weightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm, this.currentHeuristic);
            launchAnimations(this, success, "weighted");
          }
          this.algoDone = true;
        } else if (unweightedAlgorithms.includes(this.currentAlgorithm)) {
          if (!this.numberOfObjects) {
            success = unweightedSearchAlgorithm(this.nodes, this.start, this.target, this.nodesToAnimate, this.boardArray, this.currentAlgorithm);
            launchAnimations(this, success, "unweighted");
          } else {
            this.isObject = true;
            success = unweightedSearchAlgorithm(this.nodes, this.start, this.object, this.objectNodesToAnimate, this.boardArray, this.currentAlgorithm);
            launchAnimations(this, success, "unweighted");
          }
          this.algoDone = true;
        }
      }
    }

    document.getElementById("adjustFast").onclick = () => {
      this.speed = "fast";
      document.getElementById("adjustSpeed").innerHTML = 'Speed: Fast<span class="caret"></span>';
    }

    document.getElementById("adjustAverage").onclick = () => {
      this.speed = "average";
      document.getElementById("adjustSpeed").innerHTML = 'Speed: Average<span class="caret"></span>';
    }

    document.getElementById("adjustSlow").onclick = () => {
      this.speed = "slow";
      document.getElementById("adjustSpeed").innerHTML = 'Speed: Slow<span class="caret"></span>';
    }


    document.getElementById("startButtonBidirectional").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Bidirectional Swarm!</button>'
      this.currentAlgorithm = "bidirectional";
      this.currentHeuristic = "manhattanDistance";
      this.clearPath("clickedButton");
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonDijkstra").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Dijkstra\'s!</button>'
      this.currentAlgorithm = "dijkstra";
      this.changeStartNodeImages();
    }


    document.getElementById("startButtonAStar2").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize A*!</button>'
      this.currentAlgorithm = "astar";
      this.currentHeuristic = "poweredManhattanDistance";
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonGreedy").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize Greedy!</button>'
      this.currentAlgorithm = "greedy";
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonBFS").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize BFS!</button>'
      this.currentAlgorithm = "bfs";
      this.clearWeights();
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonDFS").onclick = () => {
      document.getElementById("startButtonStart").innerHTML = '<button id="actualStartButton" class="btn btn-default navbar-btn" type="button">Visualize DFS!</button>'
      this.currentAlgorithm = "dfs";
      this.clearWeights();
      this.changeStartNodeImages();
    }

    document.getElementById("startButtonCreateMazeOne").onclick = () => {
      this.clearWalls();
      this.clearPath("clickedButton");
      this.createMazeOne("wall");
    }

    document.getElementById("startButtonCreateMazeTwo").onclick = () => {
      this.clearWalls();
      this.clearPath("clickedButton");
      this.toggleButtons();
      recursiveDivisionMaze(this, 2, this.height - 3, 2, this.width - 3, "horizontal", false, "wall");
      mazeGenerationAnimations(this);
    }



    document.getElementById("startButtonClearBoard").onclick = () => {



      let navbarHeight = document.getElementById("navbarDiv").clientHeight;
      let textHeight = document.getElementById("mainText").clientHeight + document.getElementById("algorithmDescriptor").clientHeight;
      let height = Math.floor((document.documentElement.clientHeight - navbarHeight - textHeight) / 28);
      let width = Math.floor(document.documentElement.clientWidth / 25);
      let start = Math.floor(height / 2).toString() + "-" + Math.floor(width / 4).toString();
      let target = Math.floor(height / 2).toString() + "-" + Math.floor(3 * width / 4).toString();

        Object.keys(this.nodes).forEach(id => {
          let currentNode = this.nodes[id];
          let currentHTMLNode = document.getElementById(id);
          if (id === start) {
            currentHTMLNode.className = "start";
            currentNode.status = "start";
          } else if (id === target) {
            currentHTMLNode.className = "target";
            currentNode.status = "target"
          } else {
            currentHTMLNode.className = "unvisited";
            currentNode.status = "unvisited";
          }
          currentNode.previousNode = null;
          currentNode.path = null;
          currentNode.direction = null;
          currentNode.storedDirection = null;
          currentNode.distance = Infinity;
          currentNode.totalDistance = Infinity;
          currentNode.heuristicDistance = null;
          currentNode.weight = 0;
          currentNode.relatesToObject = false;
          currentNode.overwriteObjectRelation = false;

        });
      this.start = start;
      this.target = target;
      this.object = null;
      this.nodesToAnimate = [];
      this.objectNodesToAnimate = [];
      this.shortestPathNodesToAnimate = [];
      this.objectShortestPathNodesToAnimate = [];
      this.wallsToAnimate = [];
      this.mouseDown = false;
      this.pressedNodeStatus = "normal";
      this.previouslyPressedNodeStatus = null;
      this.previouslySwitchedNode = null;
      this.previouslySwitchedNodeWeight = 0;
      this.keyDown = false;
      this.algoDone = false;
      this.numberOfObjects = 0;
      this.isObject = false;
    }

    document.getElementById("startButtonClearWalls").onclick = () => {
      this.clearWalls();
    }

    document.getElementById("startButtonClearPath").onclick = () => {
      this.clearPath("clickedButton");
    }

    document.getElementById("startButtonCreateMazeThree").onclick = () => {
      this.clearWalls();
      this.clearPath("clickedButton");
      this.toggleButtons();
      otherMaze(this, 2, this.height - 3, 2, this.width - 3, "vertical", false);
      mazeGenerationAnimations(this);
    }

    document.getElementById("startButtonCreateMazeFour").onclick = () => {
      this.clearWalls();
      this.clearPath("clickedButton");
      this.toggleButtons();
      otherOtherMaze(this, 2, this.height - 3, 2, this.width - 3, "horizontal", false);
      mazeGenerationAnimations(this);
    }



    document.getElementById("startButtonClearPath").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonClearWalls").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonClearBoard").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonCreateMazeOne").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonCreateMazeTwo").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonCreateMazeThree").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonCreateMazeFour").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonDFS").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonBFS").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonDijkstra").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonAStar2").className = "navbar-inverse navbar-nav";
    document.getElementById("adjustFast").className = "navbar-inverse navbar-nav";
    document.getElementById("adjustAverage").className = "navbar-inverse navbar-nav";
    document.getElementById("adjustSlow").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonBidirectional").className = "navbar-inverse navbar-nav";
    document.getElementById("startButtonGreedy").className = "navbar-inverse navbar-nav";
    document.getElementById("actualStartButton").style.backgroundColor = "";

  } else {
    this.buttonsOn = false;
    document.getElementById("startButtonDFS").onclick = null;
    document.getElementById("startButtonBFS").onclick = null;
    document.getElementById("startButtonDijkstra").onclick = null;
    document.getElementById("startButtonGreedy").onclick = null;
    document.getElementById("startButtonAStar2").onclick = null;
    document.getElementById("startButtonBidirectional").onclick = null;
    document.getElementById("startButtonCreateMazeOne").onclick = null;
    document.getElementById("startButtonCreateMazeTwo").onclick = null;
    document.getElementById("startButtonCreateMazeThree").onclick = null;
    document.getElementById("startButtonCreateMazeFour").onclick = null;
    document.getElementById("startButtonClearPath").onclick = null;
    document.getElementById("startButtonClearWalls").onclick = null;
    document.getElementById("startButtonClearBoard").onclick = null;
    document.getElementById("startButtonStart").onclick = null;
    document.getElementById("adjustFast").onclick = null;
    document.getElementById("adjustAverage").onclick = null;
    document.getElementById("adjustSlow").onclick = null;

    document.getElementById("adjustFast").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("adjustAverage").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("adjustSlow").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonClearPath").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonClearWalls").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonClearBoard").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonCreateMazeOne").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonCreateMazeTwo").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonCreateMazeThree").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonCreateMazeFour").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonDFS").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonBFS").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonDijkstra").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonAStar2").className = "navbar-inverse navbar-nav disabledA";
    document.getElementById("startButtonBidirectional").className = "navbar-inverse navbar-nav disabledA";

    document.getElementById("actualStartButton").style.backgroundColor = "rgb(93,185,31)";
  }


}

let navbarHeight = $("#navbarDiv").height();
let textHeight = $("#mainText").height() + $("#algorithmDescriptor").height();
let height = Math.floor(($(document).height() - navbarHeight - textHeight) / 28);
let width = Math.floor($(document).width() / 25);
let newBoard = new Board(height, width);
newBoard.initialise();

window.onkeydown = (e) => {
  newBoard.keyDown = e.keyCode;
}

window.onkeyup = (e) => {
  newBoard.keyDown = false;
}

},{"./animations/launchAnimations":1,"./animations/launchInstantAnimations":2,"./animations/mazeGenerationAnimations":3,"./getDistance":5,"./mazeAlgorithms/otherMaze":6,"./mazeAlgorithms/otherOtherMaze":7,"./mazeAlgorithms/recursiveDivisionMaze":8,"./mazeAlgorithms/simpleDemonstration":9,"./mazeAlgorithms/stairDemonstration":10,"./mazeAlgorithms/weightsDemonstration":11,"./node":12,"./pathfindingAlgorithms/astar":13,"./pathfindingAlgorithms/bidirectional":14,"./pathfindingAlgorithms/unweightedSearchAlgorithm":15,"./pathfindingAlgorithms/weightedSearchAlgorithm":16}],5:[function(require,module,exports){
function getDistance(nodeOne, nodeTwo) {
  let currentCoordinates = nodeOne.id.split("-");
  let targetCoordinates = nodeTwo.id.split("-");
  let x1 = parseInt(currentCoordinates[0]);
  let y1 = parseInt(currentCoordinates[1]);
  let x2 = parseInt(targetCoordinates[0]);
  let y2 = parseInt(targetCoordinates[1]);
  if (x2 < x1) {
    if (nodeOne.direction === "up") {
      return [1, ["f"], "up"];
    } else if (nodeOne.direction === "right") {
      return [2, ["l", "f"], "up"];
    } else if (nodeOne.direction === "left") {
      return [2, ["r", "f"], "up"];
    } else if (nodeOne.direction === "down") {
      return [3, ["r", "r", "f"], "up"];
    }
  } else if (x2 > x1) {
    if (nodeOne.direction === "up") {
      return [3, ["r", "r", "f"], "down"];
    } else if (nodeOne.direction === "right") {
      return [2, ["r", "f"], "down"];
    } else if (nodeOne.direction === "left") {
      return [2, ["l", "f"], "down"];
    } else if (nodeOne.direction === "down") {
      return [1, ["f"], "down"];
    }
  }
  if (y2 < y1) {
    if (nodeOne.direction === "up") {
      return [2, ["l", "f"], "left"];
    } else if (nodeOne.direction === "right") {
      return [3, ["l", "l", "f"], "left"];
    } else if (nodeOne.direction === "left") {
      return [1, ["f"], "left"];
    } else if (nodeOne.direction === "down") {
      return [2, ["r", "f"], "left"];
    }
  } else if (y2 > y1) {
    if (nodeOne.direction === "up") {
      return [2, ["r", "f"], "right"];
    } else if (nodeOne.direction === "right") {
      return [1, ["f"], "right"];
    } else if (nodeOne.direction === "left") {
      return [3, ["r", "r", "f"], "right"];
    } else if (nodeOne.direction === "down") {
      return [2, ["l", "f"], "right"];
    }
  }
}

module.exports = getDistance;

},{}],6:[function(require,module,exports){
function recursiveDivisionMaze(board, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls) {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }
  if (!surroundingWalls) {
    let relevantIds = [board.start, board.target];
    if (board.object) relevantIds.push(board.object);
    Object.keys(board.nodes).forEach(node => {
      if (!relevantIds.includes(node)) {
        let r = parseInt(node.split("-")[0]);
        let c = parseInt(node.split("-")[1]);
        if (r === 0 || c === 0 || r === board.height - 1 || c === board.width - 1) {
          let currentHTMLNode = document.getElementById(node);
          board.wallsToAnimate.push(currentHTMLNode);
          board.nodes[node].status = "wall";
        }
      }
    });
    surroundingWalls = true;
  }
  if (orientation === "horizontal") {
    let possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }
    let possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let currentRow = possibleRows[randomRowIndex];
    let colRandom = possibleCols[randomColIndex];
    Object.keys(board.nodes).forEach(node => {
      let r = parseInt(node.split("-")[0]);
      let c = parseInt(node.split("-")[1]);
      if (r === currentRow && c !== colRandom && c >= colStart - 1 && c <= colEnd + 1) {
        let currentHTMLNode = document.getElementById(node);
        if (currentHTMLNode.className !== "start" && currentHTMLNode.className !== "target" && currentHTMLNode.className !== "object") {
          board.wallsToAnimate.push(currentHTMLNode);
          board.nodes[node].status = "wall";
        }
      }
    });
    if (currentRow - 2 - rowStart > colEnd - colStart) {
      recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls);
    } else {
      recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, "vertical", surroundingWalls);
    }
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls);
    } else {
      recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls);
    }
  } else {
    let possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    let possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let currentCol = possibleCols[randomColIndex];
    let rowRandom = possibleRows[randomRowIndex];
    Object.keys(board.nodes).forEach(node => {
      let r = parseInt(node.split("-")[0]);
      let c = parseInt(node.split("-")[1]);
      if (c === currentCol && r !== rowRandom && r >= rowStart - 1 && r <= rowEnd + 1) {
        let currentHTMLNode = document.getElementById(node);
        if (currentHTMLNode.className !== "start" && currentHTMLNode.className !== "target" && currentHTMLNode.className !== "object") {
          board.wallsToAnimate.push(currentHTMLNode);
          board.nodes[node].status = "wall";
        }
      }
    });
    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, "vertical", surroundingWalls);
    } else {
      recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", surroundingWalls);
    } else {
      recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls);
    }
  }
};

module.exports = recursiveDivisionMaze;

},{}],7:[function(require,module,exports){
function recursiveDivisionMaze(board, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls) {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }
  if (!surroundingWalls) {
    let relevantIds = [board.start, board.target];
    if (board.object) relevantIds.push(board.object);
    Object.keys(board.nodes).forEach(node => {
      if (!relevantIds.includes(node)) {
        let r = parseInt(node.split("-")[0]);
        let c = parseInt(node.split("-")[1]);
        if (r === 0 || c === 0 || r === board.height - 1 || c === board.width - 1) {
          let currentHTMLNode = document.getElementById(node);
          board.wallsToAnimate.push(currentHTMLNode);
          board.nodes[node].status = "wall";
        }
      }
    });
    surroundingWalls = true;
  }
  if (orientation === "horizontal") {
    let possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }
    let possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let currentRow = possibleRows[randomRowIndex];
    let colRandom = possibleCols[randomColIndex];
    Object.keys(board.nodes).forEach(node => {
      let r = parseInt(node.split("-")[0]);
      let c = parseInt(node.split("-")[1]);
      if (r === currentRow && c !== colRandom && c >= colStart - 1 && c <= colEnd + 1) {
        let currentHTMLNode = document.getElementById(node);
        if (currentHTMLNode.className !== "start" && currentHTMLNode.className !== "target" && currentHTMLNode.className !== "object") {
          board.wallsToAnimate.push(currentHTMLNode);
          board.nodes[node].status = "wall";
        }
      }
    });
    if (currentRow - 2 - rowStart > colEnd - colStart) {
      recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls);
    } else {
      recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, "horizontal", surroundingWalls);
    }
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, orientation, surroundingWalls);
    } else {
      recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls);
    }
  } else {
    let possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    let possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let currentCol = possibleCols[randomColIndex];
    let rowRandom = possibleRows[randomRowIndex];
    Object.keys(board.nodes).forEach(node => {
      let r = parseInt(node.split("-")[0]);
      let c = parseInt(node.split("-")[1]);
      if (c === currentCol && r !== rowRandom && r >= rowStart - 1 && r <= rowEnd + 1) {
        let currentHTMLNode = document.getElementById(node);
        if (currentHTMLNode.className !== "start" && currentHTMLNode.className !== "target" && currentHTMLNode.className !== "object") {
          board.wallsToAnimate.push(currentHTMLNode);
          board.nodes[node].status = "wall";
        }
      }
    });
    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, "horizontal", surroundingWalls);
    } else {
      recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, "horizontal", surroundingWalls);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", surroundingWalls);
    } else {
      recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls);
    }
  }
};

module.exports = recursiveDivisionMaze;

},{}],8:[function(require,module,exports){
function recursiveDivisionMaze(board, rowStart, rowEnd, colStart, colEnd, orientation, surroundingWalls, type) {
  if (rowEnd < rowStart || colEnd < colStart) {
    return;
  }
  if (!surroundingWalls) {
    let relevantIds = [board.start, board.target];
    if (board.object) relevantIds.push(board.object);
    Object.keys(board.nodes).forEach(node => {
      if (!relevantIds.includes(node)) {
        let r = parseInt(node.split("-")[0]);
        let c = parseInt(node.split("-")[1]);
        if (r === 0 || c === 0 || r === board.height - 1 || c === board.width - 1) {
          let currentHTMLNode = document.getElementById(node);
          board.wallsToAnimate.push(currentHTMLNode);
          if (type === "wall") {
            board.nodes[node].status = "wall";
            board.nodes[node].weight = 0;
          } else if (type === "weight") {
            board.nodes[node].status = "unvisited";
            board.nodes[node].weight = 15;
          }
        }
      }
    });
    surroundingWalls = true;
  }
  if (orientation === "horizontal") {
    let possibleRows = [];
    for (let number = rowStart; number <= rowEnd; number += 2) {
      possibleRows.push(number);
    }
    let possibleCols = [];
    for (let number = colStart - 1; number <= colEnd + 1; number += 2) {
      possibleCols.push(number);
    }
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let currentRow = possibleRows[randomRowIndex];
    let colRandom = possibleCols[randomColIndex];
    Object.keys(board.nodes).forEach(node => {
      let r = parseInt(node.split("-")[0]);
      let c = parseInt(node.split("-")[1]);
      if (r === currentRow && c !== colRandom && c >= colStart - 1 && c <= colEnd + 1) {
        let currentHTMLNode = document.getElementById(node);
        if (currentHTMLNode.className !== "start" && currentHTMLNode.className !== "target" && currentHTMLNode.className !== "object") {
          board.wallsToAnimate.push(currentHTMLNode);
          if (type === "wall") {
            board.nodes[node].status = "wall";
            board.nodes[node].weight = 0;
          } else if (type === "weight") {
            board.nodes[node].status = "unvisited";
            board.nodes[node].weight = 15;
          }        }
      }
    });
    if (currentRow - 2 - rowStart > colEnd - colStart) {
      recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, orientation, surroundingWalls, type);
    } else {
      recursiveDivisionMaze(board, rowStart, currentRow - 2, colStart, colEnd, "vertical", surroundingWalls, type);
    }
    if (rowEnd - (currentRow + 2) > colEnd - colStart) {
      recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, orientation, surroundingWalls, type);
    } else {
      recursiveDivisionMaze(board, currentRow + 2, rowEnd, colStart, colEnd, "vertical", surroundingWalls, type);
    }
  } else {
    let possibleCols = [];
    for (let number = colStart; number <= colEnd; number += 2) {
      possibleCols.push(number);
    }
    let possibleRows = [];
    for (let number = rowStart - 1; number <= rowEnd + 1; number += 2) {
      possibleRows.push(number);
    }
    let randomColIndex = Math.floor(Math.random() * possibleCols.length);
    let randomRowIndex = Math.floor(Math.random() * possibleRows.length);
    let currentCol = possibleCols[randomColIndex];
    let rowRandom = possibleRows[randomRowIndex];
    Object.keys(board.nodes).forEach(node => {
      let r = parseInt(node.split("-")[0]);
      let c = parseInt(node.split("-")[1]);
      if (c === currentCol && r !== rowRandom && r >= rowStart - 1 && r <= rowEnd + 1) {
        let currentHTMLNode = document.getElementById(node);
        if (currentHTMLNode.className !== "start" && currentHTMLNode.className !== "target" && currentHTMLNode.className !== "object") {
          board.wallsToAnimate.push(currentHTMLNode);
          if (type === "wall") {
            board.nodes[node].status = "wall";
            board.nodes[node].weight = 0;
          } else if (type === "weight") {
            board.nodes[node].status = "unvisited";
            board.nodes[node].weight = 15;
          }        }
      }
    });
    if (rowEnd - rowStart > currentCol - 2 - colStart) {
      recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, "horizontal", surroundingWalls, type);
    } else {
      recursiveDivisionMaze(board, rowStart, rowEnd, colStart, currentCol - 2, orientation, surroundingWalls, type);
    }
    if (rowEnd - rowStart > colEnd - (currentCol + 2)) {
      recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, "horizontal", surroundingWalls, type);
    } else {
      recursiveDivisionMaze(board, rowStart, rowEnd, currentCol + 2, colEnd, orientation, surroundingWalls, type);
    }
  }
};

module.exports = recursiveDivisionMaze;

},{}],9:[function(require,module,exports){
function simpleDemonstration(board) {
  let currentIdY = board.width - 10;
  for (let counter = 0; counter < 7; counter++) {
    let currentIdXOne = Math.floor(board.height / 2) - counter;
    let currentIdXTwo = Math.floor(board.height / 2) + counter;
    let currentIdOne = `${currentIdXOne}-${currentIdY}`;
    let currentIdTwo = `${currentIdXTwo}-${currentIdY}`;
    let currentElementOne = document.getElementById(currentIdOne);
    let currentElementTwo = document.getElementById(currentIdTwo);
    board.wallsToAnimate.push(currentElementOne);
    board.wallsToAnimate.push(currentElementTwo);
    let currentNodeOne = board.nodes[currentIdOne];
    let currentNodeTwo = board.nodes[currentIdTwo];
    currentNodeOne.status = "wall";
    currentNodeOne.weight = 0;
    currentNodeTwo.status = "wall";
    currentNodeTwo.weight = 0;
  }
}

module.exports = simpleDemonstration;

},{}],10:[function(require,module,exports){
function stairDemonstration(board) {
  let currentIdX = board.height - 1;
  let currentIdY = 0;
  let relevantStatuses = ["start", "target", "object"];
  while (currentIdX > 0 && currentIdY < board.width) {
    let currentId = `${currentIdX}-${currentIdY}`;
    let currentNode = board.nodes[currentId];
    let currentHTMLNode = document.getElementById(currentId);
    if (!relevantStatuses.includes(currentNode.status)) {
      currentNode.status = "wall";
      board.wallsToAnimate.push(currentHTMLNode);
    }
    currentIdX--;
    currentIdY++;
  }
  while (currentIdX < board.height - 2 && currentIdY < board.width) {
    let currentId = `${currentIdX}-${currentIdY}`;
    let currentNode = board.nodes[currentId];
    let currentHTMLNode = document.getElementById(currentId);
    if (!relevantStatuses.includes(currentNode.status)) {
      currentNode.status = "wall";
      board.wallsToAnimate.push(currentHTMLNode);
    }
    currentIdX++;
    currentIdY++;
  }
  while (currentIdX > 0 && currentIdY < board.width - 1) {
    let currentId = `${currentIdX}-${currentIdY}`;
    let currentNode = board.nodes[currentId];
    let currentHTMLNode = document.getElementById(currentId);
    if (!relevantStatuses.includes(currentNode.status)) {
      currentNode.status = "wall";
      board.wallsToAnimate.push(currentHTMLNode);
    }
    currentIdX--;
    currentIdY++;
  }
}

module.exports = stairDemonstration;

},{}],11:[function(require,module,exports){
function weightsDemonstration(board) {
  let currentIdX = board.height - 1;
  let currentIdY = 35;
  while (currentIdX > 5) {
    let currentId = `${currentIdX}-${currentIdY}`;
    let currentElement = document.getElementById(currentId);
    board.wallsToAnimate.push(currentElement);
    let currentNode = board.nodes[currentId];
    currentNode.status = "wall";
    currentNode.weight = 0;
    currentIdX--;
  }
  for (let currentIdX = board.height - 2; currentIdX > board.height - 11; currentIdX--) {
    for (let currentIdY = 1; currentIdY < 35; currentIdY++) {
      let currentId = `${currentIdX}-${currentIdY}`;
      let currentElement = document.getElementById(currentId);
      board.wallsToAnimate.push(currentElement);
      let currentNode = board.nodes[currentId];
      if (currentIdX === board.height - 2 && currentIdY < 35 && currentIdY > 26) {
        currentNode.status = "wall";
        currentNode.weight = 0;
      } else {
        currentNode.status = "unvisited";
        currentNode.weight = 15;
      }
    }
  }
}

module.exports = weightsDemonstration;

},{}],12:[function(require,module,exports){
function Node(id, status) {
  this.id = id;
  this.status = status;
  this.previousNode = null;
  this.path = null;
  this.direction = null;
  this.storedDirection = null;
  this.distance = Infinity;
  this.totalDistance = Infinity;
  this.heuristicDistance = null;
  this.weight = 0;
  this.relatesToObject = false;
  this.overwriteObjectRelation = false;

  this.otherid = id;
  this.otherstatus = status;
  this.otherpreviousNode = null;
  this.otherpath = null;
  this.otherdirection = null;
  this.otherstoredDirection = null;
  this.otherdistance = Infinity;
  this.otherweight = 0;
  this.otherrelatesToObject = false;
  this.otheroverwriteObjectRelation = false;
}

module.exports = Node;

},{}],13:[function(require,module,exports){
function astar(nodes, start, target, nodesToAnimate, boardArray, name, heuristic) {
  if (!start || !target || start === target) {
    return false;
  }
  nodes[start].distance = 0;
  nodes[start].totalDistance = 0;
  nodes[start].direction = "up";
  let unvisitedNodes = Object.keys(nodes);
  while (unvisitedNodes.length) {
    let currentNode = closestNode(nodes, unvisitedNodes);
    while (currentNode.status === "wall" && unvisitedNodes.length) {
      currentNode = closestNode(nodes, unvisitedNodes)
    }
    if (currentNode.distance === Infinity) return false;
    nodesToAnimate.push(currentNode);
    currentNode.status = "visited";
    if (currentNode.id === target) {
      return "success!";
    }
    updateNeighbors(nodes, currentNode, boardArray, target, name, start, heuristic);
  }
}

function closestNode(nodes, unvisitedNodes) {
  let currentClosest, index;
  for (let i = 0; i < unvisitedNodes.length; i++) {
    if (!currentClosest || currentClosest.totalDistance > nodes[unvisitedNodes[i]].totalDistance) {
      currentClosest = nodes[unvisitedNodes[i]];
      index = i;
    } else if (currentClosest.totalDistance === nodes[unvisitedNodes[i]].totalDistance) {
      if (currentClosest.heuristicDistance > nodes[unvisitedNodes[i]].heuristicDistance) {
        currentClosest = nodes[unvisitedNodes[i]];
        index = i;
      }
    }
  }
  unvisitedNodes.splice(index, 1);
  return currentClosest;
}

function updateNeighbors(nodes, node, boardArray, target, name, start, heuristic) {
  let neighbors = getNeighbors(node.id, nodes, boardArray);
  for (let neighbor of neighbors) {
    if (target) {
      updateNode(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, boardArray);
    } else {
      updateNode(node, nodes[neighbor]);
    }
  }
}

function updateNode(currentNode, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
  let distance = getDistance(currentNode, targetNode);
  if (!targetNode.heuristicDistance) targetNode.heuristicDistance = manhattanDistance(targetNode, actualTargetNode);
  let distanceToCompare = currentNode.distance + targetNode.weight + distance[0];
  if (distanceToCompare < targetNode.distance) {
    targetNode.distance = distanceToCompare;
    targetNode.totalDistance = targetNode.distance + targetNode.heuristicDistance;
    targetNode.previousNode = currentNode.id;
    targetNode.path = distance[1];
    targetNode.direction = distance[2];
  }
}

function getNeighbors(id, nodes, boardArray) {
  let coordinates = id.split("-");
  let x = parseInt(coordinates[0]);
  let y = parseInt(coordinates[1]);
  let neighbors = [];
  let potentialNeighbor;
  if ( boardArray[x - 1][y]) {
    potentialNeighbor = `${x - 1}-${y}`
    if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
  }
  if (boardArray[x + 1][y]) {
    potentialNeighbor = `${x + 1}-${y}`
    if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
  }
  if (boardArray[x][y - 1]) {
    potentialNeighbor = `${x}-${y - 1}`
    if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
  }
  if (boardArray[x][y + 1]) {
    potentialNeighbor = `${x}-${y + 1}`
    if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
  }

  return neighbors;
}


function getDistance(nodeOne, nodeTwo) {
  let currentCoordinates = nodeOne.id.split("-");
  let targetCoordinates = nodeTwo.id.split("-");
  let x1 = parseInt(currentCoordinates[0]);
  let y1 = parseInt(currentCoordinates[1]);
  let x2 = parseInt(targetCoordinates[0]);
  let y2 = parseInt(targetCoordinates[1]);
  if (x2 < x1 && y1 === y2) {
    if (nodeOne.direction === "up") {
      return [1, ["f"], "up"];
    } else if (nodeOne.direction === "right") {
      return [2, ["l", "f"], "up"];
    } else if (nodeOne.direction === "left") {
      return [2, ["r", "f"], "up"];
    } else if (nodeOne.direction === "down") {
      return [3, ["r", "r", "f"], "up"];
    }
  } else if (x2 > x1 && y1 === y2) {
    if (nodeOne.direction === "up") {
      return [3, ["r", "r", "f"], "down"];
    } else if (nodeOne.direction === "right") {
      return [2, ["r", "f"], "down"];
    } else if (nodeOne.direction === "left") {
      return [2, ["l", "f"], "down"];
    } else if (nodeOne.direction === "down") {
      return [1, ["f"], "down"];
    }
  } else if (y2 < y1 && x1 === x2) {
    if (nodeOne.direction === "up") {
      return [2, ["l", "f"], "left"];
    } else if (nodeOne.direction === "right") {
      return [3, ["l", "l", "f"], "left"];
    } else if (nodeOne.direction === "left") {
      return [1, ["f"], "left"];
    } else if (nodeOne.direction === "down") {
      return [2, ["r", "f"], "left"];
    }
  } else if (y2 > y1 && x1 === x2) {
    if (nodeOne.direction === "up") {
      return [2, ["r", "f"], "right"];
    } else if (nodeOne.direction === "right") {
      return [1, ["f"], "right"];
    } else if (nodeOne.direction === "left") {
      return [3, ["r", "r", "f"], "right"];
    } else if (nodeOne.direction === "down") {
      return [2, ["l", "f"], "right"];
    }
  }
}

function manhattanDistance(nodeOne, nodeTwo) {
  let nodeOneCoordinates = nodeOne.id.split("-").map(ele => parseInt(ele));
  let nodeTwoCoordinates = nodeTwo.id.split("-").map(ele => parseInt(ele));
  let xOne = nodeOneCoordinates[0];
  let xTwo = nodeTwoCoordinates[0];
  let yOne = nodeOneCoordinates[1];
  let yTwo = nodeTwoCoordinates[1];

  let xChange = Math.abs(xOne - xTwo);
  let yChange = Math.abs(yOne - yTwo);

  return (xChange + yChange);
}



module.exports = astar;

},{}],14:[function(require,module,exports){
const astar = require("./astar");

function bidirectional(nodes, start, target, nodesToAnimate, boardArray, name, heuristic, board) {
  if (name === "astar") return astar(nodes, start, target, nodesToAnimate, boardArray, name)
  if (!start || !target || start === target) {
    return false;
  }
  nodes[start].distance = 0;
  nodes[start].direction = "right";
  nodes[target].otherdistance = 0;
  nodes[target].otherdirection = "left";
  let visitedNodes = {};
  let unvisitedNodesOne = Object.keys(nodes);
  let unvisitedNodesTwo = Object.keys(nodes);
  while (unvisitedNodesOne.length && unvisitedNodesTwo.length) {
    let currentNode = closestNode(nodes, unvisitedNodesOne);
    let secondCurrentNode = closestNodeTwo(nodes, unvisitedNodesTwo);
    while ((currentNode.status === "wall" || secondCurrentNode.status === "wall") && unvisitedNodesOne.length && unvisitedNodesTwo.length) {
      if (currentNode.status === "wall") currentNode = closestNode(nodes, unvisitedNodesOne);
      if (secondCurrentNode.status === "wall") secondCurrentNode = closestNodeTwo(nodes, unvisitedNodesTwo);
    }
    if (currentNode.distance === Infinity || secondCurrentNode.otherdistance === Infinity) {
      return false;
    }
    nodesToAnimate.push(currentNode);
    nodesToAnimate.push(secondCurrentNode);
    currentNode.status = "visited";
    secondCurrentNode.status = "visited";
    if (visitedNodes[currentNode.id]) {
      board.middleNode = currentNode.id;
      return true;
    } else if (visitedNodes[secondCurrentNode.id]) {
      board.middleNode = secondCurrentNode.id;
      return true;
    } else if (currentNode === secondCurrentNode) {
      board.middleNode = secondCurrentNode.id;
      return true;
    }
    visitedNodes[currentNode.id] = true;
    visitedNodes[secondCurrentNode.id] = true;
    updateNeighbors(nodes, currentNode, boardArray, target, name, start, heuristic);
    updateNeighborsTwo(nodes, secondCurrentNode, boardArray, start, name, target, heuristic);
  }
}

function closestNode(nodes, unvisitedNodes) {
  let currentClosest, index;
  for (let i = 0; i < unvisitedNodes.length; i++) {
    if (!currentClosest || currentClosest.distance > nodes[unvisitedNodes[i]].distance) {
      currentClosest = nodes[unvisitedNodes[i]];
      index = i;
    }
  }
  unvisitedNodes.splice(index, 1);
  return currentClosest;
}

function closestNodeTwo(nodes, unvisitedNodes) {
  let currentClosest, index;
  for (let i = 0; i < unvisitedNodes.length; i++) {
    if (!currentClosest || currentClosest.otherdistance > nodes[unvisitedNodes[i]].otherdistance) {
      currentClosest = nodes[unvisitedNodes[i]];
      index = i;
    }
  }
  unvisitedNodes.splice(index, 1);
  return currentClosest;
}

function updateNeighbors(nodes, node, boardArray, target, name, start, heuristic) {
  let neighbors = getNeighbors(node.id, nodes, boardArray);
  for (let neighbor of neighbors) {
    updateNode(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, boardArray);
  }
}

function updateNeighborsTwo(nodes, node, boardArray, target, name, start, heuristic) {
  let neighbors = getNeighbors(node.id, nodes, boardArray);
  for (let neighbor of neighbors) {
    updateNodeTwo(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, boardArray);
  }
}

function updateNode(currentNode, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
  let distance = getDistance(currentNode, targetNode);
  let weight = targetNode.weight === 15 ? 15 : 1;
  let distanceToCompare = currentNode.distance + (weight + distance[0]) * manhattanDistance(targetNode, actualTargetNode);
  if (distanceToCompare < targetNode.distance) {
    targetNode.distance = distanceToCompare;
    targetNode.previousNode = currentNode.id;
    targetNode.path = distance[1];
    targetNode.direction = distance[2];
  }
}

function updateNodeTwo(currentNode, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
  let distance = getDistanceTwo(currentNode, targetNode);
  let weight = targetNode.weight === 15 ? 15 : 1;
  let distanceToCompare = currentNode.otherdistance + (weight + distance[0]) * manhattanDistance(targetNode, actualTargetNode);
  if (distanceToCompare < targetNode.otherdistance) {
    targetNode.otherdistance = distanceToCompare;
    targetNode.otherpreviousNode = currentNode.id;
    targetNode.path = distance[1];
    targetNode.otherdirection = distance[2];
  }
}

function getNeighbors(id, nodes, boardArray) {
  let coordinates = id.split("-");
  let x = parseInt(coordinates[0]);
  let y = parseInt(coordinates[1]);
  let neighbors = [];
  let potentialNeighbor;
  if (boardArray[x - 1] && boardArray[x - 1][y]) {
    potentialNeighbor = `${x - 1}-${y}`
    if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
  }
  if (boardArray[x + 1] && boardArray[x + 1][y]) {
    potentialNeighbor = `${x + 1}-${y}`
    if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
  }
  if (boardArray[x][y - 1]) {
    potentialNeighbor = `${x}-${y - 1}`
    if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
  }
  if (boardArray[x][y + 1]) {
    potentialNeighbor = `${x}-${y + 1}`
    if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
  }
  return neighbors;
}

function getDistance(nodeOne, nodeTwo) {
  let currentCoordinates = nodeOne.id.split("-");
  let targetCoordinates = nodeTwo.id.split("-");
  let x1 = parseInt(currentCoordinates[0]);
  let y1 = parseInt(currentCoordinates[1]);
  let x2 = parseInt(targetCoordinates[0]);
  let y2 = parseInt(targetCoordinates[1]);
  if (x2 < x1) {
    if (nodeOne.direction === "up") {
      return [1, ["f"], "up"];
    } else if (nodeOne.direction === "right") {
      return [2, ["l", "f"], "up"];
    } else if (nodeOne.direction === "left") {
      return [2, ["r", "f"], "up"];
    } else if (nodeOne.direction === "down") {
      return [3, ["r", "r", "f"], "up"];
    }
  } else if (x2 > x1) {
    if (nodeOne.direction === "up") {
      return [3, ["r", "r", "f"], "down"];
    } else if (nodeOne.direction === "right") {
      return [2, ["r", "f"], "down"];
    } else if (nodeOne.direction === "left") {
      return [2, ["l", "f"], "down"];
    } else if (nodeOne.direction === "down") {
      return [1, ["f"], "down"];
    }
  }
  if (y2 < y1) {
    if (nodeOne.direction === "up") {
      return [2, ["l", "f"], "left"];
    } else if (nodeOne.direction === "right") {
      return [3, ["l", "l", "f"], "left"];
    } else if (nodeOne.direction === "left") {
      return [1, ["f"], "left"];
    } else if (nodeOne.direction === "down") {
      return [2, ["r", "f"], "left"];
    }
  } else if (y2 > y1) {
    if (nodeOne.direction === "up") {
      return [2, ["r", "f"], "right"];
    } else if (nodeOne.direction === "right") {
      return [1, ["f"], "right"];
    } else if (nodeOne.direction === "left") {
      return [3, ["r", "r", "f"], "right"];
    } else if (nodeOne.direction === "down") {
      return [2, ["l", "f"], "right"];
    }
  }
}

function getDistanceTwo(nodeOne, nodeTwo) {
  let currentCoordinates = nodeOne.id.split("-");
  let targetCoordinates = nodeTwo.id.split("-");
  let x1 = parseInt(currentCoordinates[0]);
  let y1 = parseInt(currentCoordinates[1]);
  let x2 = parseInt(targetCoordinates[0]);
  let y2 = parseInt(targetCoordinates[1]);
  if (x2 < x1) {
    if (nodeOne.otherdirection === "up") {
      return [1, ["f"], "up"];
    } else if (nodeOne.otherdirection === "right") {
      return [2, ["l", "f"], "up"];
    } else if (nodeOne.otherdirection === "left") {
      return [2, ["r", "f"], "up"];
    } else if (nodeOne.otherdirection === "down") {
      return [3, ["r", "r", "f"], "up"];
    }
  } else if (x2 > x1) {
    if (nodeOne.otherdirection === "up") {
      return [3, ["r", "r", "f"], "down"];
    } else if (nodeOne.otherdirection === "right") {
      return [2, ["r", "f"], "down"];
    } else if (nodeOne.otherdirection === "left") {
      return [2, ["l", "f"], "down"];
    } else if (nodeOne.otherdirection === "down") {
      return [1, ["f"], "down"];
    }
  }
  if (y2 < y1) {
    if (nodeOne.otherdirection === "up") {
      return [2, ["l", "f"], "left"];
    } else if (nodeOne.otherdirection === "right") {
      return [3, ["l", "l", "f"], "left"];
    } else if (nodeOne.otherdirection === "left") {
      return [1, ["f"], "left"];
    } else if (nodeOne.otherdirection === "down") {
      return [2, ["r", "f"], "left"];
    }
  } else if (y2 > y1) {
    if (nodeOne.otherdirection === "up") {
      return [2, ["r", "f"], "right"];
    } else if (nodeOne.otherdirection === "right") {
      return [1, ["f"], "right"];
    } else if (nodeOne.otherdirection === "left") {
      return [3, ["r", "r", "f"], "right"];
    } else if (nodeOne.otherdirection === "down") {
      return [2, ["l", "f"], "right"];
    }
  }
}

function manhattanDistance(nodeOne, nodeTwo) {
  let nodeOneCoordinates = nodeOne.id.split("-").map(ele => parseInt(ele));
  let nodeTwoCoordinates = nodeTwo.id.split("-").map(ele => parseInt(ele));
  let xChange = Math.abs(nodeOneCoordinates[0] - nodeTwoCoordinates[0]);
  let yChange = Math.abs(nodeOneCoordinates[1] - nodeTwoCoordinates[1]);
  return (xChange + yChange);
}

function weightedManhattanDistance(nodeOne, nodeTwo, nodes) {
  let nodeOneCoordinates = nodeOne.id.split("-").map(ele => parseInt(ele));
  let nodeTwoCoordinates = nodeTwo.id.split("-").map(ele => parseInt(ele));
  let xChange = Math.abs(nodeOneCoordinates[0] - nodeTwoCoordinates[0]);
  let yChange = Math.abs(nodeOneCoordinates[1] - nodeTwoCoordinates[1]);

  if (nodeOneCoordinates[0] < nodeTwoCoordinates[0] && nodeOneCoordinates[1] < nodeTwoCoordinates[1]) {

    let additionalxChange = 0,
        additionalyChange = 0;
    for (let currentx = nodeOneCoordinates[0]; currentx <= nodeTwoCoordinates[0]; currentx++) {
      let currentId = `${currentx}-${nodeOne.id.split("-")[1]}`;
      let currentNode = nodes[currentId];
      additionalxChange += currentNode.weight;
    }
    for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
      let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
      let currentNode = nodes[currentId];
      additionalyChange += currentNode.weight;
    }

    let otherAdditionalxChange = 0,
        otherAdditionalyChange = 0;
    for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
      let currentId = `${nodeOne.id.split("-")[0]}-${currenty}`;
      let currentNode = nodes[currentId];
      additionalyChange += currentNode.weight;
    }
    for (let currentx = nodeOneCoordinates[0]; currentx <= nodeTwoCoordinates[0]; currentx++) {
      let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
      let currentNode = nodes[currentId];
      additionalxChange += currentNode.weight;
    }

    if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
      xChange += additionalxChange;
      yChange += additionalyChange;
    } else {
      xChange += otherAdditionalxChange;
      yChange += otherAdditionalyChange;
    }
  } else if (nodeOneCoordinates[0] < nodeTwoCoordinates[0] && nodeOneCoordinates[1] >= nodeTwoCoordinates[1]) {
    let additionalxChange = 0,
        additionalyChange = 0;
    for (let currentx = nodeOneCoordinates[0]; currentx <= nodeTwoCoordinates[0]; currentx++) {
      let currentId = `${currentx}-${nodeOne.id.split("-")[1]}`;
      let currentNode = nodes[currentId];
      additionalxChange += currentNode.weight;
    }
    for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
      let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
      let currentNode = nodes[currentId];
      additionalyChange += currentNode.weight;
    }

    let otherAdditionalxChange = 0,
        otherAdditionalyChange = 0;
    for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
      let currentId = `${nodeOne.id.split("-")[0]}-${currenty}`;
      let currentNode = nodes[currentId];
      additionalyChange += currentNode.weight;
    }
    for (let currentx = nodeOneCoordinates[0]; currentx <= nodeTwoCoordinates[0]; currentx++) {
      let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
      let currentNode = nodes[currentId];
      additionalxChange += currentNode.weight;
    }

    if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
      xChange += additionalxChange;
      yChange += additionalyChange;
    } else {
      xChange += otherAdditionalxChange;
      yChange += otherAdditionalyChange;
    }
  } else if (nodeOneCoordinates[0] >= nodeTwoCoordinates[0] && nodeOneCoordinates[1] < nodeTwoCoordinates[1]) {
    let additionalxChange = 0,
        additionalyChange = 0;
    for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
      let currentId = `${currentx}-${nodeOne.id.split("-")[1]}`;
      let currentNode = nodes[currentId];
      additionalxChange += currentNode.weight;
    }
    for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
      let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
      let currentNode = nodes[currentId];
      additionalyChange += currentNode.weight;
    }

    let otherAdditionalxChange = 0,
        otherAdditionalyChange = 0;
    for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
      let currentId = `${nodeOne.id.split("-")[0]}-${currenty}`;
      let currentNode = nodes[currentId];
      additionalyChange += currentNode.weight;
    }
    for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
      let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
      let currentNode = nodes[currentId];
      additionalxChange += currentNode.weight;
    }

    if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
      xChange += additionalxChange;
      yChange += additionalyChange;
    } else {
      xChange += otherAdditionalxChange;
      yChange += otherAdditionalyChange;
    }
  } else if (nodeOneCoordinates[0] >= nodeTwoCoordinates[0] && nodeOneCoordinates[1] >= nodeTwoCoordinates[1]) {
      let additionalxChange = 0,
          additionalyChange = 0;
      for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
        let currentId = `${currentx}-${nodeOne.id.split("-")[1]}`;
        let currentNode = nodes[currentId];
        additionalxChange += currentNode.weight;
      }
      for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
        let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
        let currentNode = nodes[currentId];
        additionalyChange += currentNode.weight;
      }

      let otherAdditionalxChange = 0,
          otherAdditionalyChange = 0;
      for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
        let currentId = `${nodeOne.id.split("-")[0]}-${currenty}`;
        let currentNode = nodes[currentId];
        additionalyChange += currentNode.weight;
      }
      for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
        let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
        let currentNode = nodes[currentId];
        additionalxChange += currentNode.weight;
      }

      if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
        xChange += additionalxChange;
        yChange += additionalyChange;
      } else {
        xChange += otherAdditionalxChange;
        yChange += otherAdditionalyChange;
      }
    }


  return xChange + yChange;


}

module.exports = bidirectional;

},{"./astar":13}],15:[function(require,module,exports){
function unweightedSearchAlgorithm(nodes, start, target, nodesToAnimate, boardArray, name) {
  if (!start || !target || start === target) {
    return false;
  }
  let structure = [nodes[start]];
  let exploredNodes = {start: true};
  while (structure.length) {
    let currentNode = name === "bfs" ? structure.shift() : structure.pop();
    nodesToAnimate.push(currentNode);
    if (name === "dfs") exploredNodes[currentNode.id] = true;
    currentNode.status = "visited";
    if (currentNode.id === target) {
      return "success";
    }
    let currentNeighbors = getNeighbors(currentNode.id, nodes, boardArray, name);
    currentNeighbors.forEach(neighbor => {
      if (!exploredNodes[neighbor]) {
        if (name === "bfs") exploredNodes[neighbor] = true;
        nodes[neighbor].previousNode = currentNode.id;
        structure.push(nodes[neighbor]);
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
        neighbors.push(potentialNeighbor);
      } else {
        neighbors.unshift(potentialNeighbor);
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

},{}],16:[function(require,module,exports){
const astar = require("./astar");

function weightedSearchAlgorithm(nodes, start, target, nodesToAnimate, boardArray, name, heuristic) {
  if (name === "astar") return astar(nodes, start, target, nodesToAnimate, boardArray, name)
  if (!start || !target || start === target) {
    return false;
  }
  nodes[start].distance = 0;
  nodes[start].direction = "right";
  let unvisitedNodes = Object.keys(nodes);
  while (unvisitedNodes.length) {
    let currentNode = closestNode(nodes, unvisitedNodes);
    while (currentNode.status === "wall" && unvisitedNodes.length) {
      currentNode = closestNode(nodes, unvisitedNodes)
    }
    if (currentNode.distance === Infinity) {
      return false;
    }
    nodesToAnimate.push(currentNode);
    currentNode.status = "visited";
    if (currentNode.id === target) return "success!";
    if (name === "CLA" || name === "greedy") {
      updateNeighbors(nodes, currentNode, boardArray, target, name, start, heuristic);
    } else if (name === "dijkstra") {
      updateNeighbors(nodes, currentNode, boardArray);
    }
  }
}

function closestNode(nodes, unvisitedNodes) {
  let currentClosest, index;
  for (let i = 0; i < unvisitedNodes.length; i++) {
    if (!currentClosest || currentClosest.distance > nodes[unvisitedNodes[i]].distance) {
      currentClosest = nodes[unvisitedNodes[i]];
      index = i;
    }
  }
  unvisitedNodes.splice(index, 1);
  return currentClosest;
}

function updateNeighbors(nodes, node, boardArray, target, name, start, heuristic) {
  let neighbors = getNeighbors(node.id, nodes, boardArray);
  for (let neighbor of neighbors) {
    if (target) {
      updateNode(node, nodes[neighbor], nodes[target], name, nodes, nodes[start], heuristic, boardArray);
    } else {
      updateNode(node, nodes[neighbor]);
    }
  }
}

function averageNumberOfNodesBetween(currentNode) {
  let num = 0;
  while (currentNode.previousNode) {
    num++;
    currentNode = currentNode.previousNode;
  }
  return num;
}


function updateNode(currentNode, targetNode, actualTargetNode, name, nodes, actualStartNode, heuristic, boardArray) {
  let distance = getDistance(currentNode, targetNode);
  let distanceToCompare;
  if (actualTargetNode && name === "CLA") {
    let weight = targetNode.weight === 15 ? 15 : 1;
    if (heuristic === "manhattanDistance") {
      distanceToCompare = currentNode.distance + (distance[0] + weight) * manhattanDistance(targetNode, actualTargetNode);
    } else if (heuristic === "poweredManhattanDistance") {
      distanceToCompare = currentNode.distance + targetNode.weight + distance[0] + Math.pow(manhattanDistance(targetNode, actualTargetNode), 2);
    } else if (heuristic === "extraPoweredManhattanDistance") {
      distanceToCompare = currentNode.distance + (distance[0] + weight) * Math.pow(manhattanDistance(targetNode, actualTargetNode), 7);
    }
    let startNodeManhattanDistance = manhattanDistance(actualStartNode, actualTargetNode);
  } else if (actualTargetNode && name === "greedy") {
    distanceToCompare = targetNode.weight + distance[0] + manhattanDistance(targetNode, actualTargetNode);
  } else {
    distanceToCompare = currentNode.distance + targetNode.weight + distance[0];
  }
  if (distanceToCompare < targetNode.distance) {
    targetNode.distance = distanceToCompare;
    targetNode.previousNode = currentNode.id;
    targetNode.path = distance[1];
    targetNode.direction = distance[2];
  }
}

function getNeighbors(id, nodes, boardArray) {
  let coordinates = id.split("-");
  let x = parseInt(coordinates[0]);
  let y = parseInt(coordinates[1]);
  let neighbors = [];
  let potentialNeighbor;
  if (boardArray[x - 1] && boardArray[x - 1][y]) {
    potentialNeighbor = `${x - 1}-${y}`
    if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
  }
  if (boardArray[x + 1] && boardArray[x + 1][y]) {
    potentialNeighbor = `${x + 1}-${y}`
    if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
  }
  if (boardArray[x][y - 1]) {
    potentialNeighbor = `${x}-${y - 1}`
    if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
  }
  if (boardArray[x][y + 1]) {
    potentialNeighbor = `${x}-${y + 1}`
    if (nodes[potentialNeighbor].status !== "wall") neighbors.push(potentialNeighbor);
  }
  return neighbors;
}


function getDistance(nodeOne, nodeTwo) {
  let currentCoordinates = nodeOne.id.split("-");
  let targetCoordinates = nodeTwo.id.split("-");
  let x1 = parseInt(currentCoordinates[0]);
  let y1 = parseInt(currentCoordinates[1]);
  let x2 = parseInt(targetCoordinates[0]);
  let y2 = parseInt(targetCoordinates[1]);
  if (x2 < x1) {
    if (nodeOne.direction === "up") {
      return [1, ["f"], "up"];
    } else if (nodeOne.direction === "right") {
      return [2, ["l", "f"], "up"];
    } else if (nodeOne.direction === "left") {
      return [2, ["r", "f"], "up"];
    } else if (nodeOne.direction === "down") {
      return [3, ["r", "r", "f"], "up"];
    }
  } else if (x2 > x1) {
    if (nodeOne.direction === "up") {
      return [3, ["r", "r", "f"], "down"];
    } else if (nodeOne.direction === "right") {
      return [2, ["r", "f"], "down"];
    } else if (nodeOne.direction === "left") {
      return [2, ["l", "f"], "down"];
    } else if (nodeOne.direction === "down") {
      return [1, ["f"], "down"];
    }
  }
  if (y2 < y1) {
    if (nodeOne.direction === "up") {
      return [2, ["l", "f"], "left"];
    } else if (nodeOne.direction === "right") {
      return [3, ["l", "l", "f"], "left"];
    } else if (nodeOne.direction === "left") {
      return [1, ["f"], "left"];
    } else if (nodeOne.direction === "down") {
      return [2, ["r", "f"], "left"];
    }
  } else if (y2 > y1) {
    if (nodeOne.direction === "up") {
      return [2, ["r", "f"], "right"];
    } else if (nodeOne.direction === "right") {
      return [1, ["f"], "right"];
    } else if (nodeOne.direction === "left") {
      return [3, ["r", "r", "f"], "right"];
    } else if (nodeOne.direction === "down") {
      return [2, ["l", "f"], "right"];
    }
  }
}

function manhattanDistance(nodeOne, nodeTwo) {
  let nodeOneCoordinates = nodeOne.id.split("-").map(ele => parseInt(ele));
  let nodeTwoCoordinates = nodeTwo.id.split("-").map(ele => parseInt(ele));
  let xChange = Math.abs(nodeOneCoordinates[0] - nodeTwoCoordinates[0]);
  let yChange = Math.abs(nodeOneCoordinates[1] - nodeTwoCoordinates[1]);
  return (xChange + yChange);
}

function weightedManhattanDistance(nodeOne, nodeTwo, nodes) {
  let nodeOneCoordinates = nodeOne.id.split("-").map(ele => parseInt(ele));
  let nodeTwoCoordinates = nodeTwo.id.split("-").map(ele => parseInt(ele));
  let xChange = Math.abs(nodeOneCoordinates[0] - nodeTwoCoordinates[0]);
  let yChange = Math.abs(nodeOneCoordinates[1] - nodeTwoCoordinates[1]);

  if (nodeOneCoordinates[0] < nodeTwoCoordinates[0] && nodeOneCoordinates[1] < nodeTwoCoordinates[1]) {
    let additionalxChange = 0,
        additionalyChange = 0;
    for (let currentx = nodeOneCoordinates[0]; currentx <= nodeTwoCoordinates[0]; currentx++) {
      let currentId = `${currentx}-${nodeOne.id.split("-")[1]}`;
      let currentNode = nodes[currentId];
      additionalxChange += currentNode.weight;
    }
    for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
      let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
      let currentNode = nodes[currentId];
      additionalyChange += currentNode.weight;
    }

    let otherAdditionalxChange = 0,
        otherAdditionalyChange = 0;
    for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
      let currentId = `${nodeOne.id.split("-")[0]}-${currenty}`;
      let currentNode = nodes[currentId];
      additionalyChange += currentNode.weight;
    }
    for (let currentx = nodeOneCoordinates[0]; currentx <= nodeTwoCoordinates[0]; currentx++) {
      let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
      let currentNode = nodes[currentId];
      additionalxChange += currentNode.weight;
    }

    if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
      xChange += additionalxChange;
      yChange += additionalyChange;
    } else {
      xChange += otherAdditionalxChange;
      yChange += otherAdditionalyChange;
    }
  } else if (nodeOneCoordinates[0] < nodeTwoCoordinates[0] && nodeOneCoordinates[1] >= nodeTwoCoordinates[1]) {
    let additionalxChange = 0,
        additionalyChange = 0;
    for (let currentx = nodeOneCoordinates[0]; currentx <= nodeTwoCoordinates[0]; currentx++) {
      let currentId = `${currentx}-${nodeOne.id.split("-")[1]}`;
      let currentNode = nodes[currentId];
      additionalxChange += currentNode.weight;
    }
    for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
      let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
      let currentNode = nodes[currentId];
      additionalyChange += currentNode.weight;
    }

    let otherAdditionalxChange = 0,
        otherAdditionalyChange = 0;
    for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
      let currentId = `${nodeOne.id.split("-")[0]}-${currenty}`;
      let currentNode = nodes[currentId];
      additionalyChange += currentNode.weight;
    }
    for (let currentx = nodeOneCoordinates[0]; currentx <= nodeTwoCoordinates[0]; currentx++) {
      let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
      let currentNode = nodes[currentId];
      additionalxChange += currentNode.weight;
    }

    if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
      xChange += additionalxChange;
      yChange += additionalyChange;
    } else {
      xChange += otherAdditionalxChange;
      yChange += otherAdditionalyChange;
    }
  } else if (nodeOneCoordinates[0] >= nodeTwoCoordinates[0] && nodeOneCoordinates[1] < nodeTwoCoordinates[1]) {
    let additionalxChange = 0,
        additionalyChange = 0;
    for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
      let currentId = `${currentx}-${nodeOne.id.split("-")[1]}`;
      let currentNode = nodes[currentId];
      additionalxChange += currentNode.weight;
    }
    for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
      let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
      let currentNode = nodes[currentId];
      additionalyChange += currentNode.weight;
    }

    let otherAdditionalxChange = 0,
        otherAdditionalyChange = 0;
    for (let currenty = nodeOneCoordinates[1]; currenty <= nodeTwoCoordinates[1]; currenty++) {
      let currentId = `${nodeOne.id.split("-")[0]}-${currenty}`;
      let currentNode = nodes[currentId];
      additionalyChange += currentNode.weight;
    }
    for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
      let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
      let currentNode = nodes[currentId];
      additionalxChange += currentNode.weight;
    }

    if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
      xChange += additionalxChange;
      yChange += additionalyChange;
    } else {
      xChange += otherAdditionalxChange;
      yChange += otherAdditionalyChange;
    }
  } else if (nodeOneCoordinates[0] >= nodeTwoCoordinates[0] && nodeOneCoordinates[1] >= nodeTwoCoordinates[1]) {
      let additionalxChange = 0,
          additionalyChange = 0;
      for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
        let currentId = `${currentx}-${nodeOne.id.split("-")[1]}`;
        let currentNode = nodes[currentId];
        additionalxChange += currentNode.weight;
      }
      for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
        let currentId = `${nodeTwoCoordinates[0]}-${currenty}`;
        let currentNode = nodes[currentId];
        additionalyChange += currentNode.weight;
      }

      let otherAdditionalxChange = 0,
          otherAdditionalyChange = 0;
      for (let currenty = nodeOneCoordinates[1]; currenty >= nodeTwoCoordinates[1]; currenty--) {
        let currentId = `${nodeOne.id.split("-")[0]}-${currenty}`;
        let currentNode = nodes[currentId];
        additionalyChange += currentNode.weight;
      }
      for (let currentx = nodeOneCoordinates[0]; currentx >= nodeTwoCoordinates[0]; currentx--) {
        let currentId = `${currentx}-${nodeTwoCoordinates[1]}`;
        let currentNode = nodes[currentId];
        additionalxChange += currentNode.weight;
      }

      if (additionalxChange + additionalyChange < otherAdditionalxChange + otherAdditionalyChange) {
        xChange += additionalxChange;
        yChange += additionalyChange;
      } else {
        xChange += otherAdditionalxChange;
        yChange += otherAdditionalyChange;
      }
    }

  return xChange + yChange;


}

module.exports = weightedSearchAlgorithm;

},{"./astar":13}]},{},[4]);
