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
}

class Pawn extends Piece {
  constructor(color) {
    super(color);
    this.hasMoved = false;
  }

  getMoves(i, j, board) {
    var moves = [];
    if (this.color == 'white') {
      if (!this.hasMoved && board[i+1][j].piece == null && board[i+2][j].piece == null)
        moves.push(board[i+2][j]);
      if (board[i+1][j].piece == null)
        moves.push(board[i+1][j]);
      if (j+1 < board.length && board[i+1][j+1].piece != null && board[i+1][j+1].piece.color == 'black')
        moves.push(board[i+1][j+1]);
      if (j-1 > 0 && board[i+1][j-1].piece != null && board[i+1][j-1].piece.color == 'black')
        moves.push(board[i+1][j-1]);
    }
    else {
      if (!this.hasMoved && board[i-1][j].piece == null && board[i-2][j].piece == null)
        moves.push(board[i-2][j]);
      if (board[i-1][j].piece == null)
        moves.push(board[i-1][j]);
      if (j+1 < board.length && board[i-1][j+1].piece != null && board[i-1][j+1].piece.color == 'white')
        moves.push(board[i-1][j+1]);
      if (j-1 > 0 && board[i-1][j-1].piece != null && board[i-1][j-1].piece.color == 'white')
        moves.push(board[i-1][j-1]);
    }
    return moves;
  }

  move() {
    this.hasMoved = true;
  }

  getStr() {
    return 'Pawn';
  }
}

class Rook extends Piece {

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

board = new Board();
board.board[1][4].piece = new Pawn('white');
for (var i=0; i<=7; i++)
  board.board[i][i].piece = new Pawn('black');
board.board[0][0].piece = new Pawn('white');
board.update();
c.addEventListener('click', board.selectTile.bind(board));
