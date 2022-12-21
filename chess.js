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
    this.img = new Image();
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
      this.img.onload = function(){
        ctx.drawImage(this.img, 100*this.x, 100*this.y, 100, 100);
      }.bind(this);
      this.img.src = this.piece.getStr();
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
    ctx.fillStyle = this.dotColors[this.color];
    if (this.piece == null) {
      ctx.beginPath();
      ctx.arc(100*this.x+50, 100*this.y+50, 15, 0, 2*Math.PI);
      ctx.fill();
    }
    else {
      const key = [1, -1];
      for (var i=0; i<=1; i++)
        for (var j=0; j<=1; j++) {
          ctx.beginPath();
          ctx.moveTo(100*(this.x+i), 100*(this.y+j));
          ctx.lineTo(100*(this.x+i)+(30*key[i]), 100*(this.y+j));
          ctx.lineTo(100*(this.x+i), 100*(this.y+j)+(30*key[j]));
          ctx.fill();
        }

    }
  }
}

class Piece {
  constructor(color) {
    this.color = color;
  }

  insertMove(i, j, board, moves) {
    if (i < 0 || i >= board.length || j < 0 || j >= board.length)
      return false;
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
      if (i == 1 && board[i+1][j].piece == null && board[i+2][j].piece == null)
        moves.push(board[i+2][j]);
      if (board[i+1][j].piece == null)
        moves.push(board[i+1][j]);
      if (j+1 < board.length && board[i+1][j+1].piece != null && board[i+1][j+1].piece.color == 'black')
        moves.push(board[i+1][j+1]);
      if (j-1 >= 0 && board[i+1][j-1].piece != null && board[i+1][j-1].piece.color == 'black')
        moves.push(board[i+1][j-1]);
    }
    else {
      if (i == 6 && board[i-1][j].piece == null && board[i-2][j].piece == null)
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
    if (this.color == 'white')
      return 'chess_pieces/wP.svg';
    else
      return 'chess_pieces/bP.svg';
  }
}

class Queen extends Piece {
  constructor(color) {
    super(color);
  }

  getStr() {
    if (this.color == 'white')
      return 'chess_pieces/wQ.svg';
    else
      return 'chess_pieces/bQ.svg';
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
    if (this.color == 'white')
      return 'chess_pieces/wB.svg';
    else
      return 'chess_pieces/bB.svg';
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
    if (this.color == 'white')
      return 'chess_pieces/wR.svg';
    else
      return 'chess_pieces/bR.svg';
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
    if (this.color == 'white')
      return 'chess_pieces/wN.svg';
    else
      return 'chess_pieces/bN.svg';
  }

  getMoves(i, j, board) {
    var moves = [];
    this.insertMove(i+2, j+1, board, moves);
    this.insertMove(i+2, j-1, board, moves);
    this.insertMove(i+1, j+2, board, moves);
    this.insertMove(i+1, j-2, board, moves);
    this.insertMove(i-1, j+2, board, moves);
    this.insertMove(i-1, j-2, board, moves);
    this.insertMove(i-2, j+1, board, moves);
    this.insertMove(i-2, j-1, board, moves);
    return moves;
  }
}

class King extends Piece {
  constructor(color) {
    super(color);
    this.hasMoved = false;
  }

  getStr() {
    if (this.color == 'white')
      return 'chess_pieces/wK.svg';
    else
      return 'chess_pieces/bK.svg';
  }

  move() {
    this.hasMoved = true;
  }

  getMoves(i, j, board) {
    var moves = [];
    for (var y=-1; y<=1; y++)
      for (var x=-1; x<=1; x++)
        this.insertMove(i+y, j+x, board, moves);
    return moves;
  }
}


class Board {
  constructor(setup) {
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
    this.whitePieces = new Set();
    this.blackPieces = new Set();
    this.setupBoard(setup);
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
    if (t1.piece.color == 'white') {
      this.whitePieces.delete(t1);
      this.whitePieces.add(t2);
      if (t2.piece != null)
        this.blackPieces.delete(t2);
    }
    else {
      this.blackPieces.delete(t1);
      this.blackPieces.add(t2);
      if (t2.piece != null)
        this.whitePieces.delete(t2);
    }
    t2.piece = t1.piece;
    t1.piece = null;
    t1.draw();
    t2.draw();
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

  setupTile(i, j, s) {
    if (s == s.toUpperCase())
      this.whitePieces.add(this.board[i][j]);
    else
      this.blackPieces.add(this.board[i][j]);
    if (s == 'p')
      this.board[i][j].piece = new Pawn('black');
    else if (s == 'P')
      this.board[i][j].piece = new Pawn('white');
    else if (s == 'n')
      this.board[i][j].piece = new Knight('black');
    else if (s == 'N')
      this.board[i][j].piece = new Knight('white');
    else if (s == 'b')
      this.board[i][j].piece = new Bishop('black');
    else if (s=='B')
      this.board[i][j].piece = new Bishop('white');
    else if (s == 'r')
      this.board[i][j].piece = new Rook('black');
    else if (s == 'R')
      this.board[i][j].piece = new Rook('white');
    else if (s == 'q')
      this.board[i][j].piece = new Queen('black');
    else if (s == 'Q')
      this.board[i][j].piece = new Queen('white')
    else if (s == 'k')
      this.board[i][j].piece = new King('black')
    else if (s == 'K')
      this.board[i][j].piece = new King('white');
  }

  setupBoard(setup) {
    var tmp = setup.split("/");
    for (var i=0; i<tmp.length; i++) {
      var j = 0;
      for (var k=0; k<tmp[i].length; k++) {
        if (!Number.isNaN(parseInt(tmp[i][k]))) {
          j += parseInt(tmp[i][k]);
          continue;
        }
        this.setupTile(7-i, j, tmp[i][k]);
        j += 1;
      }
    }
    this.update();
    c.addEventListener('click', this.selectTile.bind(this));
  }
}

class Game {
  constructor(setup) {
    this.board = new Board(setup);
  }
}

var setupString = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
game = new Game(setupString);
