var c = document.getElementById('mainCanvas');
var ctx = c.getContext('2d');
ctx.font = '20px Arial';

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

  copy() {
    if (this.piece != null)
      return new this.constructor(this.x, this.y, this.piece.copy());
    return new this.constructor(this.x, this.y, null);
  }

  clear() {
    if (this.color >= 2)
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

  getTakingMoves(i, j, board) {
    if (this.constructor.name == 'Pawn')
      return this.getMoves2(i, j, board);
    return this.getMoves(i, j, board);
  }

  copy() {
    return new this.constructor(this.color);
  }

  insertMove(i, j, board, moves) {
    if (i < 0 || i >= board.length || j < 0 || j >= board.length)
      return false;
    if (board[i][j].piece == null) {
      moves.add(board[i][j]);
      return true;
    }
    if (board[i][j].piece.color != this.color)
      moves.add(board[i][j]);
    return false;
  }
}


class Pawn extends Piece {
  constructor(color) {
    super(color);
  }

  getMoves2(i, j, board) {
    var moves = new Set();
    if (this.color == 'black') {
      this.insertMove(i-1, j+1, board, moves);
      this.insertMove(i-1, j-1, board, moves);
    }
    else {
      this.insertMove(i+1, j+1, board, moves);
      this.insertMove(i+1, j-1, board, moves);
    }
    return moves;
  }

  getMoves(i, j, board) {
    var moves = new Set();
    if (this.color == 'white') {
      if (i == 1 && board[i+1][j].piece == null && board[i+2][j].piece == null)
        moves.add(board[i+2][j]);
      if (board[i+1][j].piece == null)
        moves.add(board[i+1][j]);
      if (j+1 < board.length && board[i+1][j+1].piece != null && board[i+1][j+1].piece.color == 'black')
        moves.add(board[i+1][j+1]);
      if (j-1 >= 0 && board[i+1][j-1].piece != null && board[i+1][j-1].piece.color == 'black')
        moves.add(board[i+1][j-1]);
    }
    else {
      if (i == 6 && board[i-1][j].piece == null && board[i-2][j].piece == null)
        moves.add(board[i-2][j]);
      if (board[i-1][j].piece == null)
        moves.add(board[i-1][j]);
      if (j+1 < board.length && board[i-1][j+1].piece != null && board[i-1][j+1].piece.color == 'white')
        moves.add(board[i-1][j+1]);
      if (j-1 >= 0 && board[i-1][j-1].piece != null && board[i-1][j-1].piece.color == 'white')
        moves.add(board[i-1][j-1]);
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
    var moves = new Set();
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
    var moves = new Set();
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
    var moves = new Set();
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
    var moves = new Set();
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
    var moves = new Set();
    for (var y=-1; y<=1; y++)
      for (var x=-1; x<=1; x++)
        this.insertMove(i+y, j+x, board, moves);
    return moves;
  }
}


class Board {
  constructor(setup, simulation) {
    this.board = new Array(8);
    for (var i=0; i<this.board.length; i++) {
      this.board[i] = new Array(8);
      if (!simulation) {
        for (var j=0; j<this.board[i].length; j++) {
          this.board[i][j] = new Tile(j, 7-i, null);
          this.board[i][j].draw();
        }
      }
    }
    this.focused = null;
    this.currentMoves = [];
    this.allMoves = new Array(8);
    for (var i=0; i<this.board.length; i++)
      this.allMoves[i] = new Array(8);
    this.whitePieces = new Set();
    this.blackPieces = new Set();
    this.captureSound = new Audio('sounds/capture.mp3');
    this.moveSound = new Audio('sounds/move.mp3');
    if (!simulation) {
      this.setupBoard(setup);
      this.newBoard = this.copy();
    }
  }

  update() {
    for (var i=0; i<this.board.length; i++) {
      for (var j=0; j<this.board[i].length; j++) {
        this.board[i][j].draw();
      }
    }
  }

  copy() {
    var newBoard = new Board('', true);
    for (var i=0; i<this.board.length; i++) {
      for (var j=0; j<this.board[i].length; j++) {
        newBoard.board[i][j] = this.board[i][j].copy();
        if (this.board[i][j].piece != null) {
          if (this.board[i][j].piece.color == 'white') {
            if (this.board[i][j].piece.constructor.name == 'King')
              newBoard.whiteKing = newBoard.board[i][j];
            newBoard.whitePieces.add(newBoard.board[i][j]);
          }
          else {
            if (this.board[i][j].piece.constructor.name == 'King')
              newBoard.blackKing = newBoard.board[i][j];
            newBoard.blackPieces.add(newBoard.board[i][j]);
          }
        }
      }
    }
    return newBoard;
  }

  simulate(i1, j1, i2, j2)  {
    this.t2Piece = this.board[i2][j2].piece
    this.move(this.board[i1][j1], this.board[i2][j2], true);
  }

  callback(i1, j1, i2, j2) {
    if (this.board[i2][j2].piece.color == 'white') {
      this.whitePieces.delete(this.board[i2][j2]);
      this.whitePieces.add(this.board[i1][j1]);
      if (this.t2Piece != null)
        this.blackPieces.add(this.board[i2][j2]);
      if (this.board[i2][j2].piece.constructor.name == 'King')
        this.whiteKing = this.board[i1][j1];
    }
    else {
      this.blackPieces.delete(this.board[i2][j2]);
      this.blackPieces.add(this.board[i1][j1]);
      if (this.t2Piece != null)
        this.whitePieces.add(this.board[i2][j2]);
      if (this.board[i2][j2].piece.constructor.name == 'King')
        this.blackKing = this.board[i1][j1];
    }
    this.board[i1][j1].piece = this.board[i2][j2].piece;
    this.board[i2][j2].piece = this.t2Piece;
  }

  validKing(color) {
    if (color == 'black') {
      var tile = this.blackKing;
      var moves = this.getAllMoves('white');
    }
    else {
      var tile = this.whiteKing;
      var moves = this.getAllMoves('black');
    }
    return (!moves.has(tile));
  }

  getAllMoves(color) {
    if (color == 'white')
      var tiles = this.whitePieces;
    else
      var tiles = this.blackPieces;
    var allMoves = new Set();
    for (var tile of tiles) {
      allMoves = new Set([...allMoves, ...tile.piece.getTakingMoves(7-tile.y, tile.x, this.board)]);
    }
    return allMoves;
  }

  move(t1, t2, isSimulation) {
    t1.piece.move();
    if (t2.piece != null) {
      if (!isSimulation)
        this.captureSound.play();
    }
    else if (!isSimulation)
      this.moveSound.play();
    if (t1.piece.color == 'white') {
      this.whitePieces.delete(t1);
      this.whitePieces.add(t2);
      if (t2.piece != null)
        this.blackPieces.delete(t2);
      if (t1.piece.constructor.name == 'King')
        this.whiteKing = t2;
    }
    else {
      this.blackPieces.delete(t1);
      this.blackPieces.add(t2);
      if (t2.piece != null)
        this.whitePieces.delete(t2);
      if (t1.piece.constructor.name == 'King')
        this.blackKing = t2;
    }
    t2.piece = t1.piece;
    t1.piece = null;
    if (!isSimulation) {
      t1.draw();
      t2.draw();
      this.newBoard.move(this.newBoard.board[7-t1.y][t1.x], this.newBoard.board[7-t2.y][t2.x], true);
    }
  }

  selectTile(e) {
    const i = 7-Math.floor(e.clientY / 100);
    const j = Math.floor(e.clientX / 100);
    var moved = false
    for (var tile of this.currentMoves) {
      if (!moved && this.board[i][j] == tile) {
        this.move(this.focused, this.board[i][j], false);
        var moved = true;
      }
      tile.clear();
    }
    this.currentMoves = [];
    if (moved)
      return;
    if (this.board[i][j].piece == null)
      return;
    if (this.focused  == this.board[i][j]) {
      this.focused.clear();
      this.focused = null;
    }
    else {
      if (this.focused != null)
        this.focused.clear();
      this.board[i][j].highlight();
      this.focused = this.board[i][j];

      this.currentMoves = this.focused.piece.getMoves(i, j, this.board);
      for (var tile of this.currentMoves) {
        this.newBoard.simulate(7-this.focused.y, this.focused.x, 7-tile.y, tile.x);
        if (this.newBoard.validKing(this.focused.piece.color))
          tile.showMove();
        this.newBoard.callback(7-this.focused.y, this.focused.x, 7-tile.y, tile.x);
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
    else if (s == 'k') {
      this.blacKing = this.board[i][j];
      this.board[i][j].piece = new King('black')
    }
    else if (s == 'K') {
      this.whiteKing = this.board[i][j];
      this.board[i][j].piece = new King('white');
    }
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
    this.board = new Board(setup, false);
  }
}

var setupString = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
game = new Game(setupString);
