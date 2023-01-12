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
  constructor(color, master) {
    this.color = color;
    this.master = master;
  }

  getTakingMoves(i, j) {
    if (this.constructor.name == 'Pawn')
      return this.getMoves2(i, j);
    return this.getMoves(i, j);
  }

  moves(i, j) {
    var moves = [];
    if (this.constructor.name == 'King') {
      for (var tiles of this.master.checkCastling(this.color)) {
        moves.push(new Castle(tiles[0], tiles[1], tiles[2], tiles[3], this.master));
      }
    }
    for (var tile of this.getMoves(i, j)) {
      moves.push(new Move(this.master.board[i][j], tile, this.master));
    }
    return moves;
  }

  copy() {
    return new this.constructor(this.color);
  }

  insertMove(i, j, moves) {
    if (i < 0 || i >= this.master.board.length || j < 0 || j >= this.master.board.length)
      return false;
    if (this.master.board[i][j].piece == null) {
      moves.add(this.master.board[i][j]);
      return true;
    }
    if (this.master.board[i][j].piece.color != this.color)
      moves.add(this.master.board[i][j]);
    return false;
  }
}


class Pawn extends Piece {
  constructor(color, master) {
    super(color, master);
  }

  getMoves2(i, j) {
    var moves = new Set();
    if (this.color == 'black') {
      this.insertMove(i-1, j+1, moves);
      this.insertMove(i-1, j-1, moves);
    }
    else {
      this.insertMove(i+1, j+1, moves);
      this.insertMove(i+1, j-1, moves);
    }
    return moves;
  }

  getMoves(i, j) {
    var moves = new Set();
    if (this.color == 'white') {
      if (i == 1 && this.master.board[i+1][j].piece == null && this.master.board[i+2][j].piece == null)
        moves.add(this.master.board[i+2][j]);
      if (this.master.board[i+1][j].piece == null)
        moves.add(this.master.board[i+1][j]);
      if (j+1 < this.master.board.length && this.master.board[i+1][j+1].piece != null && this.master.board[i+1][j+1].piece.color == 'black')
        moves.add(this.master.board[i+1][j+1]);
      if (j-1 >= 0 && this.master.board[i+1][j-1].piece != null && this.master.board[i+1][j-1].piece.color == 'black')
        moves.add(this.master.board[i+1][j-1]);
    }
    else {
      if (i == 6 && this.master.board[i-1][j].piece == null && this.master.board[i-2][j].piece == null)
        moves.add(this.master.board[i-2][j]);
      if (this.master.board[i-1][j].piece == null)
        moves.add(this.master.board[i-1][j]);
      if (j+1 < this.master.board.length && this.master.board[i-1][j+1].piece != null && this.master.board[i-1][j+1].piece.color == 'white')
        moves.add(this.master.board[i-1][j+1]);
      if (j-1 >= 0 && this.master.board[i-1][j-1].piece != null && this.master.board[i-1][j-1].piece.color == 'white')
        moves.add(this.master.board[i-1][j-1]);
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
  constructor(color, master) {
    super(color, master);
  }

  getStr() {
    if (this.color == 'white')
      return 'chess_pieces/wQ.svg';
    else
      return 'chess_pieces/bQ.svg';
  }

  getMoves(i, j) {
    var moves = new Set();
    for (var k=1; i+k<this.master.board.length&&j+k<this.master.board.length;k++)
      if (!this.insertMove(i+k, j+k, moves))
        break;
    for (var k=1; i+k<this.master.board.length&&j-k>=0;k++)
      if (!this.insertMove(i+k, j-k, moves))
        break;
    for (var k=1; i-k>=0&&j+k<this.master.board.length;k++)
      if (!this.insertMove(i-k, j+k, moves))
        break;
    for (var k=1; i-k>=0&&j-k>=0;k++)
      if (!this.insertMove(i-k, j-k, moves))
        break;
    for (var k=i+1; k<this.master.board.length; k++)
      if (!this.insertMove(k, j, moves))
        break;
    for (var k=i-1; k>=0; k--)
      if (!this.insertMove(k, j, moves))
        break;
    for (var k=j+1; k<this.master.board.length; k++)
      if (!this.insertMove(i, k, moves))
        break;
    for (var k=j-1; k>=0; k--)
      if (!this.insertMove(i, k, moves))
        break;
    return moves;
  }

  move() {
    return;
  }
}


class Bishop extends Piece {
  constructor(color, master) {
    super(color, master);
  }

  getStr() {
    if (this.color == 'white')
      return 'chess_pieces/wB.svg';
    else
      return 'chess_pieces/bB.svg';
  }

  getMoves(i, j) {
    var moves = new Set();
    for (var k=1; i+k<this.master.board.length&&j+k<this.master.board.length;k++)
      if (!this.insertMove(i+k, j+k, moves))
        break;
    for (var k=1; i+k<this.master.board.length&&j-k>=0;k++)
      if (!this.insertMove(i+k, j-k, moves))
        break;
    for (var k=1; i-k>=0&&j+k<this.master.board.length;k++)
      if (!this.insertMove(i-k, j+k, moves))
        break;
    for (var k=1; i-k>=0&&j-k>=0;k++)
      if (!this.insertMove(i-k, j-k, moves))
        break;
    return moves;
  }

  move() {
    return;
  }
}


class Rook extends Piece {
  constructor(color, master) {
    super(color, master);
    this.hasMoved = false;
  }

  getStr() {
    if (this.color == 'white')
      return 'chess_pieces/wR.svg';
    else
      return 'chess_pieces/bR.svg';
  }

  getMoves(i, j) {
    var moves = new Set();
    for (var k=i+1; k<this.master.board.length; k++)
      if (!this.insertMove(k, j, moves))
        break;
    for (var k=i-1; k>=0; k--)
      if (!this.insertMove(k, j, moves))
        break;
    for (var k=j+1; k<this.master.board.length; k++)
      if (!this.insertMove(i, k, moves))
        break;
    for (var k=j-1; k>=0; k--)
      if (!this.insertMove(i, k, moves))
        break;
    return moves;
  }

  move() {
    this.hasMoved = true;
  }

}


class Knight extends Piece {
  constructor(color, master) {
    super(color, master);
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

  getMoves(i, j) {
    var moves = new Set();
    this.insertMove(i+2, j+1, moves);
    this.insertMove(i+2, j-1, moves);
    this.insertMove(i+1, j+2, moves);
    this.insertMove(i+1, j-2, moves);
    this.insertMove(i-1, j+2, moves);
    this.insertMove(i-1, j-2, moves);
    this.insertMove(i-2, j+1, moves);
    this.insertMove(i-2, j-1, moves);
    return moves;
  }
}


class King extends Piece {
  constructor(color, master) {
    super(color, master);
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

  getMoves(i, j) {
    var moves = new Set();
    for (var y=-1; y<=1; y++)
      for (var x=-1; x<=1; x++)
        this.insertMove(i+y, j+x, moves);
    return moves;
  }
}


class Move {

  constructor(t1, t2, master) {
    this.t1 = t1;
    this.t2 = t2;
    this.master = master;
  }

  makeMove(isSimulation) {
    var t1 = this.t1;
    var t2 = this.t2
    var board = this.master;
    if (!isSimulation) {
      t1.piece.move();
      if (t2.piece != null)
        board.captureSound.play();
      else
        board.moveSound.play();
    }
    if (t1.piece.color == 'white') {
      board.whitePieces.delete(t1);
      board.whitePieces.add(t2);
      if (t2.piece != null)
        board.blackPieces.delete(t2);
      if (t1.piece.constructor.name == 'King')
        board.whiteKing = t2;
    }
    else {
      board.blackPieces.delete(t1);
      board.blackPieces.add(t2);
      if (t2.piece != null)
        board.whitePieces.delete(t2);
      if (t1.piece.constructor.name == 'King')
        board.blackKing = t2;
    }
    t2.piece = t1.piece;
    t1.piece = null;
    if (!isSimulation) {
      board.checkPromotion();
      t1.draw();
      t2.draw();
    }
  }

  unmakeMove(lastPiece) {
    var t1 = this.t1;
    var t2 = this.t2
    var board = this.master;
    if (t2.piece.color == 'white') {
      board.whitePieces.delete(t2);
      board.whitePieces.add(t1);
      if (lastPiece != null)
        board.blackPieces.add(t2);
      if (t2.piece.constructor.name == 'King')
        board.whiteKing = t1;
    }
    else {
      board.blackPieces.delete(t2);
      board.blackPieces.add(t1);
      if (lastPiece != null)
        board.whitePieces.add(t2);
      if (t2.piece.constructor.name == 'King')
        board.blackKing = t1;
    }
    t1.piece = t2.piece;
    t2.piece = lastPiece;
  }
}


class Castle extends Move {
  constructor(t1, t2, t3, t4, master) {
    super(t1, t2, master);
    this.t3 = t3;
    this.t4 = t4;
    this.master = master
    this.kingMove = new Move(this.t1, this.t2, this.master);
    this.rookMove = new Move(this.t3, this.t4, this.master);
  }

  makeMove(isSimulation) {
    this.kingMove.makeMove(isSimulation);
    this.rookMove.makeMove(isSimulation);
  }

  unmakeMove(lastPiece) {
    this.kingMove.unmakeMove(null);
    this.rookMove.unmakeMove(null);
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
    this.allMoves = new Array(8);
    for (var i=0; i<this.board.length; i++)
      this.allMoves[i] = new Array(8);
    this.whitePieces = new Set();
    this.blackPieces = new Set();
    this.captureSound = new Audio('sounds/capture.mp3');
    this.moveSound = new Audio('sounds/move.mp3');
    this.setupBoard(setup);
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

  simulate(move)  {
    this.t2Piece = move.t2.piece
    move.makeMove(true);
  }

  callback(move) {
    move.unmakeMove(this.t2Piece);
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

  promote(tile) {
    tile.piece = new Queen(tile.piece.color, this);
  }

  checkPromotion() {
    for (var i=0; i<this.board[0].length; i++) {
      if (this.board[0][i].piece != null && this.board[0][i].piece.constructor.name == 'Pawn') {
        this.promote(this.board[0][i]);
        return;
      }
      if (this.board[this.board.length-1][i].piece != null && this.board[this.board.length-1][i].piece.constructor.name == 'Pawn') {
        this.promote(this.board[this.board.length-1][i]);
        return;
      }
    }
  }

  checkCastling(color) {
    if (color == 'white') {
      var index = 0;
      var moves = this.getAllMoves('black');
    }
    else {
      var index = this.board.length-1;
      var moves = this.getAllMoves('white');
    }
    var res = [];
    var t1 = this.board[index][4];
    var t2 = this.board[index][0];
    var t3 = this.board[index][this.board[index].length-1];
    if (t1.piece != null && t1.piece.constructor.name == 'King' && !t1.piece.hasMoved) {
      if (t2.piece != null && t2.piece.constructor.name == 'Rook'&& !t2.piece.hasMoved) {
        var valid = !(moves.has(this.board[index][4]));
        for (var j=2; j<4; j++) {
          if (this.board[index][j].piece != null || moves.has(this.board[index][j])) {
            valid = false;
          }
        }
        if (valid)
          res.push([this.board[index][4], this.board[index][2], this.board[index][0], this.board[index][3]]);
      }
      if (t3.piece != null && t3.piece.constructor.name == 'Rook' && !t3.piece.hasMoved) {
        var valid = !(moves.has(this.board[index][4]));
        for (var j=5; j<=6; j++) {
          if (this.board[index][j].piece != null || moves.has(this.board[index][j]))
            valid = false;
        }
        if (valid)
          res.push([this.board[index][4], this.board[index][6], this.board[index][this.board.length-1], this.board[index][5]]);
        }
      }
      return res;
  }

  selectTile(e) {
    const i = 7-Math.floor(e.clientY / 100);
    const j = Math.floor(e.clientX / 100);
    var moved = false
    for (var move of this.currentMoves) {
      if (!moved && this.board[i][j] == move.t2) {
        move.makeMove(false);
        var moved = true;
      }
      move.t2.clear();
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

      this.currentMoves = this.focused.piece.moves(i, j);
      var tmp = new Set();
      for (var move of this.currentMoves) {
        let color = this.focused.piece.color
        this.simulate(move);
        let valid = this.validKing(color);
        this.callback(move);
        if (valid) {
          move.t2.showMove();
          tmp.add(move);
        }
      }
      this.currentMoves = tmp;
    }
  }

  setupTile(i, j, s) {
    if (s == s.toUpperCase())
      this.whitePieces.add(this.board[i][j]);
    else
      this.blackPieces.add(this.board[i][j]);
    if (s == 'p')
      this.board[i][j].piece = new Pawn('black', this);
    else if (s == 'P')
      this.board[i][j].piece = new Pawn('white', this);
    else if (s == 'n')
      this.board[i][j].piece = new Knight('black', this);
    else if (s == 'N')
      this.board[i][j].piece = new Knight('white', this);
    else if (s == 'b')
      this.board[i][j].piece = new Bishop('black', this);
    else if (s=='B')
      this.board[i][j].piece = new Bishop('white', this);
    else if (s == 'r')
      this.board[i][j].piece = new Rook('black', this);
    else if (s == 'R')
      this.board[i][j].piece = new Rook('white', this);
    else if (s == 'q')
      this.board[i][j].piece = new Queen('black', this);
    else if (s == 'Q')
      this.board[i][j].piece = new Queen('white', this);
    else if (s == 'k') {
      this.blackKing = this.board[i][j];
      this.board[i][j].piece = new King('black', this);
    }
    else if (s == 'K') {
      this.whiteKing = this.board[i][j];
      this.board[i][j].piece = new King('white', this);
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
    this.board = new Board(setup);
  }
}

var setupString = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR';
game = new Game(setupString);
