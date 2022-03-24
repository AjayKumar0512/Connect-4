//this class mainly deals with the logic that the 2d array contains
//it mainly tells where to place the coin whether vacancy is there or not
//it continously checks whther the four match has been happened or not in the game
//new comment for new branch--main

//git test 11-11
//git test 1222
//git test 2
class GridController {
  constructor(rows, coloumns, Grid, WinSetr, WinSetc) {
    this.rows = rows;
    this.coloumns = coloumns;
    this.Grid = new Array(this.rows);
    this.WinSetr = new Array(4);
    this.WinSetc = new Array(4);
    for (var i = 0; i < this.rows; i++) this.Grid[i] = new Array(this.coloumns);
    this.InitArray();
  }

  InitArray = function () {
    //initialising with -1 initially to the array
    for (var i = 0; i < this.rows; i++) {
      for (var j = 0; j < this.coloumns; j++) {
        this.Grid[i][j] = -1;
      }
    }
  };

  Clear = function () {
    for (var i = 0; i < 4; i++) {
      this.WinSetr[i] = 0;
      this.WinSetc[i] = 0;
    }
  };
  //function that checks at each mose click whether
  //that particular player has any four consecutive row setup
  //row and col value are places where the current ball went
  CheckForWin = function (rowVal, colVal, turn) {
    //turn 1 indicates player 1 and 2 indicates player 2
    //clearing array at initial to fit new values for given click

    var q = 0;
    this.Clear();

    //from present placed position we need to check in all possible directions whether it match

    var FirstStreak = 0;
    var SecondStreak = 0;
    //checking in right left combination
    //first in left direction from given placed position and returning the streak

    var GoOn = true;
    var o = 0;
    var p = colVal;
    while (GoOn && FirstStreak <= 4) {
      if (p >= 0) {
        if (this.Grid[rowVal][p] == turn) {
          FirstStreak++;
          this.WinSetr[q] = rowVal;
          this.WinSetc[q++] = p;
        } else GoOn = false;
      } else GoOn = false;
      p--;
    }

    if (FirstStreak >= 4) return true;
    //now checking in right direction
    GoOn = true;

    p = colVal;
    while (GoOn && SecondStreak <= 4) {
      p++;
      if (p <= this.coloumns - 1) {
        if (this.Grid[rowVal][p] == turn) {
          SecondStreak++;
          this.WinSetr[q] = rowVal;
          this.WinSetc[q++] = p;
        } else GoOn = false;
      } else GoOn = false;
    }
    if (FirstStreak + SecondStreak >= 4) return true;

    //for  down verification
    var q = 0;
    this.Clear();
    FirstStreak = 0;
    SecondStreak = 0;
    var GoOn = true;

    var p = rowVal;
    while (GoOn && FirstStreak <= 4) {
      if (p <= this.rows - 1) {
        if (this.Grid[p][colVal] == turn) {
          FirstStreak++;
          this.WinSetr[q] = p;
          this.WinSetc[q++] = colVal;
        } else GoOn = false;
      } else GoOn = false;
      p++;
    }
    if (FirstStreak >= 4) return true;
    //for diagonal verification
    var q = 0;
    this.Clear();
    FirstStreak = 0;
    SecondStreak = 0;
    var GoOn = true;
    o = rowVal;
    p = colVal;
    while (GoOn && FirstStreak <= 4) {
      if (o <= this.rows - 1 && p <= this.coloumns - 1) {
        if (this.Grid[o][p] == turn) {
          FirstStreak++;
          this.WinSetr[q] = o;
          this.WinSetc[q++] = p;
        } else GoOn = false;
      } else GoOn = false;
      p++;
      o++;
    }
    if (FirstStreak >= 4) return true;

    o = rowVal;
    p = colVal;
    GoOn = true;
    while (GoOn && SecondStreak <= 4) {
      p--;
      o--;
      if (p >= 0 && o >= 0) {
        if (this.Grid[o][p] == turn) {
          SecondStreak++;
          this.WinSetr[q] = o;
          this.WinSetc[q++] = p;
        } else GoOn = false;
      } else GoOn = false;
    }
    if (FirstStreak + SecondStreak >= 4) return true;

    //to check backward diagonal

    var q = 0;
    this.Clear();
    FirstStreak = 0;
    SecondStreak = 0;
    var GoOn = true;
    o = rowVal;
    p = colVal;
    while (GoOn && FirstStreak <= 4) {
      if (o <= this.rows - 1 && p >= 0) {
        if (this.Grid[o][p] == turn) {
          FirstStreak++;
          this.WinSetr[q] = o;
          this.WinSetc[q++] = p;
        } else GoOn = false;
      } else GoOn = false;
      p--;
      o++;
    }
    if (FirstStreak >= 4) return true;

    o = rowVal;
    p = colVal;
    GoOn = true;
    while (GoOn && SecondStreak <= 4) {
      p++;
      o--;
      if (p <= this.coloumns - 1 && o >= 0) {
        if (this.Grid[o][p] == turn) {
          SecondStreak++;
          this.WinSetr[q] = o;
          this.WinSetc[q++] = p;
        } else GoOn = false;
      } else GoOn = false;
    }
    if (FirstStreak + SecondStreak >= 4) return true;
  };

  //col value is in which coloumn user wants to keep the value
  //turnis whetehr blue-1 or red-2
  VacancyPosition = function (colValue, turn) {
    var vacancy = 0;
    for (var i = this.rows - 1; i >= 0; i--) {
      //we only need to iterate the given coloumn
      if (this.Grid[i][colValue] == -1) {
        switch (turn) {
          case 1:
            this.Grid[i][colValue] = turn;
            break;
          case 2:
            this.Grid[i][colValue] = turn;
            break;
        }
        return vacancy;
      } else vacancy++;
    }
    return -1; //means no space in that coloumn
  };
}
