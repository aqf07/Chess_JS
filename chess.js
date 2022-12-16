var c = document.getElementById('mainCanvas');
var ctx = c.getContext('2d');
ctx.font = '20px Arial';
const possibleStates = ['e', 'p', 'b', 'kn', 'r', 'q', 'k'];

class Tile {
  constructor(x, y, piece) {
    this.colors = ['#e2cfaf', '#716757', '#ffe9c5', '#8d816d'];
    this.dotColors = ['#c6b599', '#554d41']
    this.x = x;
    this.y = y;
    if ((x+y)%2 == 1)
      this.color = 1
    else
      this.color = 0;
    this.piece = piece;
  }

  clear() {
    if (this.color > 2)
      this.color -= 2;
    this.draw();
  }


  setState(newState) {
    this.state = newState;
  }

  draw() {
    ctx.fillStyle = this.colors[this.color];
    ctx.fillRect(100*this.x, 100*this.y, 100, 100);
    if (this.piece != null) {
      ctx.fillStyle = this.piece.color;
      ctx.fillText(this.piece.getStr(), 100*this.x+40, 100*this.y+60);
    }
  }

  highlight() {
    if (this.color < 2)
      this.color += 2;
    else
      this.color -= 2;
    this.draw();
  }

  showMove() {
    ctx.beginPath();
    ctx.fillStyle = this.dotColors[this.color];
    ctx.arc(100*this.x+50, 100*this.y+50, 15, 0, 2*Math.PI);
    ctx.fill();
  }
}

class Piece {
  constructor(color) {
    this.color = color;
  }

  insertMove(i, j, board, moves) {
    if (board[i][j].piece == null) {
      moves.push(board[i][j]);
      return true;
    }
    if (board[i][j].piece.color != this.color)
      moves.push(board[i][j]);
    return false;
  }
}

class Pawn extends Piece {
  constructor(color) {
    super(color);
  }

  getMoves(i, j, board) {
    var moves = [];
    if (this.color == 'white') {
      if (i == 1)
        moves.push(board[i+2][j]);
      if (board[i+1][j].piece == null)
        moves.push(board[i+1][j]);
      if (j+1 < board.length && board[i+1][j+1].piece != null && board[i+1][j+1].piece.color == 'black')
        moves.push(board[i+1][j+1]);
      if (j-1 >= 0 && board[i+1][j-1].piece != null && board[i+1][j-1].piece.color == 'black')
        moves.push(board[i+1][j-1]);
    }
    else {
      if (i == 6)
        moves.push(board[i-2][j]);
      if (board[i-1][j].piece == null)
        moves.push(board[i-1][j]);
      if (j+1 < board.length && board[i-1][j+1].piece != null && board[i-1][j+1].piece.color == 'white')
        moves.push(board[i-1][j+1]);
      if (j-1 >= 0 && board[i-1][j-1].piece != null && board[i-1][j-1].piece.color == 'white')
        moves.push(board[i-1][j-1]);
    }
    return moves;
  }

  move() {
    return;
  }

  getStr() {
    return 'Pawn';
  }
}

class Queen extends Piece {
  constructor(color) {
    super(color);
  }

  getStr() {
    return 'Queen';
  }

  getMoves(i, j, board) {
    var moves = [];
    for (var k=1; i+k<board.length&&j+k<board.length;k++)
      if (!this.insertMove(i+k, j+k, board, moves))
        break;
    for (var k=1; i+k<board.length&&j-k>=0;k++)
      if (!this.insertMove(i+k, j-k, board, moves))
        break;
    for (var k=1; i-k>=0&&j+k<board.length;k++)
      if (!this.insertMove(i-k, j+k, board, moves))
        break;
    for (var k=1; i-k>=0&&j-k>=0;k++)
      if (!this.insertMove(i-k, j-k, board, moves))
        break;
    for (var k=i+1; k<board.length; k++)
      if (!this.insertMove(k, j, board, moves))
        break;
    for (var k=i-1; k>=0; k--)
      if (!this.insertMove(k, j, board, moves))
        break;
    for (var k=j+1; k<board.length; k++)
      if (!this.insertMove(i, k, board, moves))
        break;
    for (var k=j-1; k>=0; k--)
      if (!this.insertMove(i, k, board, moves))
        break;
    return moves;
  }

  move() {
    return;
  }
}

class Bishop extends Piece {
  constructor(color) {
    super(color);
  }

  getStr() {
    return 'Bishop';
  }

  getMoves(i, j, board) {
    var moves = [];
    for (var k=1; i+k<board.length&&j+k<board.length;k++)
      if (!this.insertMove(i+k, j+k, board, moves))
        break;
    for (var k=1; i+k<board.length&&j-k>=0;k++)
      if (!this.insertMove(i+k, j-k, board, moves))
        break;
    for (var k=1; i-k>=0&&j+k<board.length;k++)
      if (!this.insertMove(i-k, j+k, board, moves))
        break;
    for (var k=1; i-k>=0&&j-k>=0;k++)
      if (!this.insertMove(i-k, j-k, board, moves))
        break;
    return moves;
  }

  move() {
    return;
  }
}


class Rook extends Piece {
  constructor(color) {
    super(color);
    this.hasMoved = false;
  }

  getStr() {
    return 'Rook';
  }

  getMoves(i, j, board) {
    var moves = [];
    for (var k=i+1; k<board.length; k++)
      if (!this.insertMove(k, j, board, moves))
        break;
    for (var k=i-1; k>=0; k--)
      if (!this.insertMove(k, j, board, moves))
        break;
    for (var k=j+1; k<board.length; k++)
      if (!this.insertMove(i, k, board, moves))
        break;
    for (var k=j-1; k>=0; k--)
      if (!this.insertMove(i, k, board, moves))
        break;
    return moves;
  }

  move() {
    this.hasMoved = true;
  }

}

class Knight extends Piece {
  constructor(color) {
    super(color);
  }

  move() {
    return;
  }

  getStr() {
    return "Knight"
  }

  getMoves(i, j, board) {
    var moves = [];
    if (i+2 < board.length) {
      if (j+1 < board.length)
        this.insertMove(i+2, j+1, board, moves);
      if (j-1 >= 0)
        this.insertMove(i+2, j-1, board, moves);
    }
    if (i+1 < board.length) {
      if (j+2 < board.length)
        this.insertMove(i+1, j+2, board, moves);
      if (j-2 >= 0)
        this.insertMove(i+1, j-2, board, moves);
    }
    if (i-1 >= 0) {
      if (j+2 < board.length)
        this.insertMove(i-1, j+2, board, moves);
      if (j-2 >= 0)
        this.insertMove(i-1, j-2, board, moves);
    }
    if (i-2 >= 0) {
      if (j+1 < board.length)
        this.insertMove(i-2, j+1, board, moves);
      if (j-1 >= 0)
        this.insertMove(i-2, j-1, board, moves);
    }
    return moves;
  }
}

class King extends Piece {
  constructor(color) {
    super(color);
    this.hasMoved = false;
  }

  getStr() {
    return "King";
  }

  move() {
    this.hasMoved = true;
  }

  getMoves(i, j, board) {
    var moves = [];
    for (var y=-1; y<=1; y++)
      for (var x=-1; x<=1; x++)
        if (0 <= i+y < board.length && 0 <= j+x < board.length)
          this.insertMove(i+y, j+x, board, moves);
    return moves;
  }
}


class Board {
  constructor() {
    this.board = new Array(8);
    for (var i=0; i<this.board.length; i++) {
      this.board[i] = new Array(8);
      for (var j=0; j<this.board[i].length; j++) {
        this.board[i][j] = new Tile(j, 7-i, null);
        this.board[i][j].draw();
      }
    }
    this.focused = null;
    this.currentMoves = [];
  }

  update() {
    for (var i=0; i<this.board.length; i++) {
      for (var j=0; j<this.board[i].length; j++) {
        this.board[i][j].draw();
      }
    }
  }

  move(t1, t2) {
    t1.piece.move();
    t2.piece = t1.piece;
    t1.piece = null;
    this.update();
  }

  selectTile(e) {
    const i = 7-Math.floor(e.clientY / 100);
    const j = Math.floor(e.clientX / 100);
    var moved = false
    for (var s=0; s<this.currentMoves.length; s++) {
      if (!moved && this.board[i][j] == this.currentMoves[s]) {
        this.move(this.focused, this.board[i][j]);
        var moved = true;
      }
      this.currentMoves[s].clear();
    }
    this.currentMoves = [];
    if (moved)
      return;
    if (this.board[i][j].piece == null)
      return;
    if (this.focused  == this.board[i][j]) {
      this.focused.highlight();
      this.focused = null;
    }
    else {
      if (this.focused != null)
        this.focused.highlight();
      this.board[i][j].highlight();
      this.focused = this.board[i][j];

      this.currentMoves = this.focused.piece.getMoves(i, j, this.board);
      for (var k=0; k<this.currentMoves.length; k++) {
        this.currentMoves[k].showMove();
      }
    }
  }
}

function setupTile(i, j, s, board) {
  if (s == 'p')
    board[i][j].piece = new Pawn('black');
  else if (s == 'P')
    board[i][j].piece = new Pawn('white');
  else if (s == 'n')
    board[i][j].piece = new Knight('black');
  else if (s == 'N')
    board[i][j].piece = new Knight('white');
  else if (s == 'b')
    board[i][j].piece = new Bishop('black');
  else if (s=='B')
    board[i][j].piece = new Bishop('white');
  else if (s == 'r')
    board[i][j].piece = new Rook('black');
  else if (s == 'R')
    board[i][j].piece = new Rook('white');
  else if (s == 'q')
    board[i][j].piece = new Queen('black');
  else if (s == 'Q')
    board[i][j].piece = new Queen('white')
  else if (s == 'k')
    board[i][j].piece = new King('black')
  else if (s == 'K')
    board[i][j].piece = new King('white');
}

board = new Board();
var setupString = 'rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R';
var tmp = setupString.split("/");
console.log(tmp);
for (var i=0; i<tmp.length; i++) {
  var j = 0;
  for (var k=0; k<tmp[0].length; k++) {
    if (!Number.isNaN(parseInt(tmp[i][k]))) {
      console.log('asd');
      j += parseInt(tmp[i][k]);
      continue;
    }
    setupTile(7-i, j, tmp[i][k], board.board);
    j += 1;
  }
}
console.log(board.board);
board.update();
c.addEventListener('click', board.selectTile.bind(board));
