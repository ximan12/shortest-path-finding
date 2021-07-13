function mazeGenerationAnimations(board) {
    //from index = 0 to the end of wallsToAnimate
  let nodes = board.wallsToAnimate.slice(0);
  //fast = 5, average = 25, slow = 75 <- delay
  let speed = board.speed === "fast" ? 5 : board.speed === "average" ? 25 : 75;
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
    }, speed);
  }


};

module.exports = mazeGenerationAnimations;
