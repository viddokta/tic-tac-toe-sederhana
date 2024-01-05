var modal;
var cells, playerClass, cpuClass, grid;
var lines = ["012", "345", "678", "036", "147", "258", "048", "246"];
var pw = ["0pp", "p0p", "pp0"];
var cw = ["0cc", "c0c", "cc0"];
var corners = [0, 2, 6, 8];
var sides = [1, 3, 5, 7];
var winObj = {
  win: false,
  player: "",
  line: 0 };


$(document).ready(function () {
  modal = new Modal();
  cells = $(".cell>input:checkbox");
  cells.click(function (e) {
    playerMove(e.target);
  });
  $("#btn-first").click(function () {
    init(false);
  });
  $("#btn-second").click(function () {
    init(true);
  });
});

function init(flag) {
  winObj.win = false;
  cells.each(function (c, e) {
    e.checked = false;
    e.disabled = false;
    $(e).parent().removeClass("win-line tic tac");
  });
  grid = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  playerClass = $("input:radio[name ='mark-switch']:checked").val();
  cpuClass = "tictac".replace(playerClass, "");
  console.log(playerClass, cpuClass);
  modal.hide();
  if (flag) {
    delay(myMove);
  }
}

function delay(fnc, arg) {
  window.setTimeout(fnc, 500, arg);
}

function playerMove(cell) {
  cells.each(function (c, e) {
    e.disabled = true;
  });
  var cId = $(cell).data("cell");
  $(cell).parent().addClass(playerClass);
  grid[cId] = "p";
  delay(gameTest, true);
}

function myMove() {
  //can we win
  var move = canWin(cw);
  if (move !== false) {
    makeMove(move);
    return;
  }
  //can player win - block him
  move = canWin(pw);
  if (move !== false) {
    makeMove(move);
    return;
  }
  //center cell
  if (grid[4] === 0) {
    makeMove(4);
    return;
  }
  //try corners
  move = randomEmptyCell(corners);
  if (move !== false) {
    makeMove(move);
    return;
  }
  //try sides
  move = randomEmptyCell(sides);
  if (move !== false) {
    makeMove(move);
    return;
  }
}

function makeMove(cell) {
  cells[cell].checked = true;
  $(cells[cell]).parent().addClass(cpuClass);
  $(cells[cell]).disabled = true;
  grid[cell] = "c";
  gameTest(false);
}

function randomEmptyCell(range) {
  var empty = range.filter(function (v) {
    return grid[v] === 0;
  });
  if (empty.length > 0) {
    return empty[Math.floor(Math.random() * empty.length)];
  } else {
    return false;
  }
}
function canWin(wm) {
  //var wm=["cc0","c0c","0cc"];
  var m = lines.reduce(function (p, l, i) {
    var a = l.split("").map(function (c) {
      return grid[c];
    }).join("");
    var b = wm.indexOf(a);
    if (b === -1) {
      return p || false;
    } else {
      return p || l.charAt(b);
    }
  }, false);
  return m;
}

function gameTest(isPlayer) {
  if (isWin()) {
    gameWon();
  } else if (isEnd()) {
    gameTie();
  } else {
    if (isPlayer) {
      myMove();
    } else {
      cells.each(function (i, e) {
        if (!e.checked) {
          e.disabled = false;
        }
      });
    }
  }
}

function gameWon() {
  lines[winObj.line].split("").forEach(function (v) {
    $(cells[v]).parent().addClass("win-line");
  });
  if (winObj.player === "ppp") {
    modal.message("You WON !!!");
  } else if (winObj.player === "ccc") {
    modal.message("You LOSE :-(");
  }
  delay(modal.show);
}

function gameTie() {
  modal.message("It's TIE");
  delay(modal.show);
}

function isWin() {
  var res = lines.reduce(function (p, c, i) {
    var lineRes = c.split("").map(function (a) {
      return grid[a];
    }).join("");
    if (lineRes === "ppp" || lineRes === "ccc") {
      winObj.line = i;
      winObj.player = lineRes;
      winObj.win = true;
    }
    return p || winObj.win;
  }, false);
  return res;
}

function isEnd() {
  return grid.filter(function (a) {
    return a != 0;
  }).length === 9;
}

var Modal = function () {
  var self = this;
  this.el = document.querySelector(".modal");
  var body = this.el.querySelector(".mod-body");

  this.el.onclick = function () {
    //self.hide();
  };

  this.show = function () {
    self.el.style.top = 0;
  };
  this.hide = function () {
    self.el.style.top = "-100%";
  };
  this.message = function (msg) {
    body.innerHTML = msg;
  };
};