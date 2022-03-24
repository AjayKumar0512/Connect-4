//global variables declaration

var player1Sprite;
var player2Sprite;
var GameInitialised = false;
var Player1Trn = true;
var markLoc = 0;
var ValidClick = false;
var owner;
var size;
var SpriteBoard;
var player1MarkSprite;
var player2MarkSprite;
var FirstColoumnLocation;
var ColoumnOffset;
var MarkmoveTo;
var RedBallAction;
var BlueBallAction;
var RedBallEase;
var BlueballEase;
var BlueCoinSprite;
var RedCoinSprite;
var StartRowLocation = 50;
var GridControllerInstance;
var SoundControllerInstance;
var Colvalue = 0;
var GameFinished = false;
var numCoinPlaced = 0;
var CoinArray;
var spineTest;
var WinEffect = false;
///initialises the player1 turn sprites
InitialisePlayerSprites = function () {
  player1Sprite = new cc.Sprite.create(res.PlayerBlue_png);
  player2Sprite = new cc.Sprite.create(res.PlayerRed_png);
  player1Sprite.setPosition(cc.p(size.width / 2, size.height - 40));
  player2Sprite.setPosition(cc.p(size.width / 2, size.height - 40));
  player1Sprite.setTag(11);
  player2Sprite.setTag(22);
  owner.addChild(player1Sprite);
};

//to initialise main board on the scene
InitialisemainBoard = function () {
  SpriteBoard = new cc.Sprite.create(res.ConnectBoard_png);

  SpriteBoard.setPosition(cc.p(size.width / 2, size.height / 2));
  owner.addChild(SpriteBoard, 0);
};

//to initialise mark sprites

InitialiseMarkSprites = function () {
  debugger;
  player1MarkSprite = new cc.Sprite.create(res.PlayerMarkBlue_png);
  player2MarkSprite = new cc.Sprite.create(res.PlayerMarkRed_png);

  player1MarkSprite.setPosition(cc.p(FirstColoumnLocation, size.height - 145));
  player2MarkSprite.setPosition(cc.p(FirstColoumnLocation, size.height - 145));

  player1MarkSprite.setTag(1);
  player2MarkSprite.setTag(2);

  //scaling the sprites as they are big to the scene
  player1MarkSprite.setScale(0.5, 0.5);
  player2MarkSprite.setScale(0.5, 0.5);

  owner.addChild(player1MarkSprite);
  markLoc = player1MarkSprite.getPositionX();
};
validateXY = function (x, y) {
  if (
    y < SpriteBoard.getPositionY() + SpriteBoard.getContentSize().height / 2 &&
    y > SpriteBoard.getPositionY() - SpriteBoard.getContentSize().height / 2 &&
    x > SpriteBoard.getPositionX() - SpriteBoard.getContentSize().width / 2 &&
    x < SpriteBoard.getPositionX() + SpriteBoard.getContentSize().width / 2
  )
    return true;
  else return false;
};

AssignPlayer1Turn = function (VacancyVal) {
  //removing player1 sprite and keeping player 2 sprite
  numCoinPlaced++;
  if (
    numCoinPlaced ==
    GridControllerInstance.rows * GridControllerInstance.coloumns
  )
    GameFinished = true;
  owner.removeChildByTag(11, true);
  owner.addChild(player2Sprite);
  owner.removeChildByTag(1, true);
  owner.addChild(player2MarkSprite);
  player2MarkSprite.setPositionX(markLoc);
  Player1Trn = false;
  DropBlueball(VacancyVal);
};
AssignPlayer2Turn = function (VacancyVal) {
  numCoinPlaced++;
  if (
    numCoinPlaced ==
    GridControllerInstance.rows * GridControllerInstance.coloumns
  )
    GameFinished = true;
  owner.removeChildByTag(22, true);
  owner.addChild(player1Sprite);
  owner.removeChildByTag(2, true);
  owner.addChild(player1MarkSprite);
  player1MarkSprite.setPositionX(markLoc);
  Player1Trn = true;
  DropRedball(VacancyVal);
};

//this function drops blue ball at top to given position

DropBlueball = function (VacancyVal) {
  //creating blue ball sprite
  BlueCoinSprite = new cc.Sprite.create(res.BlueCoin_png);
  BlueCoinSprite.setScale(0.25, 0.25);
  BlueCoinSprite.setPosition(
    cc.p(player1MarkSprite.getPositionX(), player1MarkSprite.getPositionY())
  );
  owner.addChild(BlueCoinSprite, -1);
  //playing respective sound
  SoundControllerInstance.PlayCoinEffect();

  spineTest.setAnimation(1, "jump", true);

  //make the ball fall down
  BlueBallAction = cc.MoveTo.create(
    1,
    cc.p(
      BlueCoinSprite.getPositionX(),
      SpriteBoard.getPositionY() -
        SpriteBoard.getContentSize().height / 2 +
        StartRowLocation +
        VacancyVal * ColoumnOffset
    )
  );
  BlueballEase = cc.EaseBounceOut.create(BlueBallAction);
  BlueCoinSprite.runAction(BlueballEase);
  CoinArray[5 - VacancyVal][Colvalue] = BlueCoinSprite;
  if (numCoinPlaced >= 7) {
    var win = GridControllerInstance.CheckForWin(5 - VacancyVal, Colvalue, 1);
    if (win) {
      GameFinished = true;
      var helloLabel = new cc.LabelTTF("Blue player win", "Arial", 18);
      // position the label on the center of the screen
      helloLabel.x = 100;
      helloLabel.y = size.height - 150;
      // add the label as a child to this layer
      owner.addChild(helloLabel, 5);
      //some effect to show which are set
      owner.schedule(EndWinEffect, 1, 6, 1);
      //playing respective sound
      SoundControllerInstance.StopMusic();
      SoundControllerInstance.PlayWinEffect();
      spineTest.setAnimation(1, "dance", true);
    }
    if (GameFinished && !win) {
      var helloLabel = new cc.LabelTTF("Game Over", "Arial", 18);
      // position the label on the center of the screen
      helloLabel.x = 100;
      helloLabel.y = size.height - 150;
      // add the label as a child to this layer
      owner.addChild(helloLabel, 5);
      //playing respective sound
      SoundControllerInstance.StopMusic();
      SoundControllerInstance.PlayGameOverEffect();
      spineTest.setAnimation(1, "sleeping", false);
    }
  }
};

DropRedball = function (VacancyVal) {
  //creating blue ball sprite
  RedCoinSprite = new cc.Sprite.create(res.RedCoin_png);
  RedCoinSprite.setScale(0.25, 0.25);
  RedCoinSprite.setPosition(
    cc.p(player2MarkSprite.getPositionX(), player2MarkSprite.getPositionY())
  );
  owner.addChild(RedCoinSprite, -1);
  //playing respective sound
  SoundControllerInstance.PlayCoinEffect();
  //make the ball fall down
  RedBallAction = cc.MoveTo.create(
    1,
    cc.p(
      RedCoinSprite.getPositionX(),
      SpriteBoard.getPositionY() -
        SpriteBoard.getContentSize().height / 2 +
        StartRowLocation +
        VacancyVal * ColoumnOffset
    )
  );

  spineTest.setAnimation(1, "walk", true);

  RedBallEase = cc.EaseBounceOut.create(RedBallAction);
  RedCoinSprite.runAction(RedBallEase);
  CoinArray[5 - VacancyVal][Colvalue] = RedCoinSprite;

  //cc.log((5 - VacancyVal).toString() + " ," + Colvalue.toString() + " for red");
  if (numCoinPlaced >= 7) {
    var win = GridControllerInstance.CheckForWin(5 - VacancyVal, Colvalue, 2);
    if (win) {
      GameFinished = true;
      var helloLabel = new cc.LabelTTF("Red player win", "Arial", 18);
      // position the label on the center of the screen
      helloLabel.x = 100;
      helloLabel.y = size.height - 150;
      // add the label as a child to this layer
      owner.addChild(helloLabel, 5);
      //some effect to show which are set in some time interval
      owner.schedule(EndWinEffect, 1, 6, 1);
      //playing respective sound
      SoundControllerInstance.StopMusic();
      SoundControllerInstance.PlayWinEffect();
      spineTest.setAnimation(1, "dance", true);
    }
    if (GameFinished && !win) {
      var helloLabel = new cc.LabelTTF("Game Over", "Arial", 18);
      // position the label on the center of the screen
      helloLabel.x = 100;
      helloLabel.y = size.height - 150;
      // add the label as a child to this layer
      owner.addChild(helloLabel, 5);
      //playing respective sound
      SoundControllerInstance.StopMusic();
      SoundControllerInstance.PlayGameOverEffect();
      spineTest.setAnimation(1, "sleeping", false);
    }
  }
};
EndWinEffect = function () {
  if (!WinEffect) {
    WinEffect = true;
    for (var i = 0; i < 4; i++) {
      CoinArray[GridControllerInstance.WinSetr[i]][
        GridControllerInstance.WinSetc[i]
      ].setScale(0.1, 0.1);
    }
  } else {
    WinEffect = false;
    for (var i = 0; i < 4; i++) {
      CoinArray[GridControllerInstance.WinSetr[i]][
        GridControllerInstance.WinSetc[i]
      ].setScale(0.25, 0.25);
    }
  }
};

GetCoinPlacedColumnValue = function (turn) {
  var EdgeOffset = 35;
  switch (turn) {
    case 1:
      x = player1MarkSprite.getPositionX();
      break;
    case 2:
      x = player2MarkSprite.getPositionX();
      break;
  }
  //adjusting between coloumns
  if (x < FirstColoumnLocation + (ColoumnOffset - EdgeOffset)) {
    return 0;
  } else if (
    x > FirstColoumnLocation + (ColoumnOffset - EdgeOffset) &&
    x < FirstColoumnLocation + 2 * ColoumnOffset - EdgeOffset
  ) {
    return 1;
  } else if (
    x > FirstColoumnLocation + (2 * ColoumnOffset - EdgeOffset) &&
    x < FirstColoumnLocation + 3 * ColoumnOffset - EdgeOffset
  ) {
    return 2;
  } else if (
    x > FirstColoumnLocation + (3 * ColoumnOffset - EdgeOffset) &&
    x < FirstColoumnLocation + 4 * ColoumnOffset - EdgeOffset
  ) {
    return 3;
  } else if (
    x > FirstColoumnLocation + (4 * ColoumnOffset - EdgeOffset) &&
    x < FirstColoumnLocation + 5 * ColoumnOffset - EdgeOffset
  ) {
    return 4;
  } else if (
    x > FirstColoumnLocation + (5 * ColoumnOffset - EdgeOffset) &&
    x < FirstColoumnLocation + 6 * ColoumnOffset - EdgeOffset
  ) {
    return 5;
  } else if (x > FirstColoumnLocation + (6 * ColoumnOffset - EdgeOffset)) {
    return 6;
  }
};
///function return x such that marker always place exactly a top of coloumn in the board
GetXbasedOnBoardColumn = function (x) {
  var EdgeOffset = 35;
  //edge validation
  //there are total 7 coloumns

  //adjusting between coloumns
  if (x < FirstColoumnLocation + (ColoumnOffset - EdgeOffset)) {
    x = FirstColoumnLocation;
  } else if (
    x > FirstColoumnLocation + (ColoumnOffset - EdgeOffset) &&
    x < FirstColoumnLocation + 2 * ColoumnOffset - EdgeOffset
  ) {
    x = FirstColoumnLocation + ColoumnOffset;
    //Colvalue = 1;
  } else if (
    x > FirstColoumnLocation + (2 * ColoumnOffset - EdgeOffset) &&
    x < FirstColoumnLocation + 3 * ColoumnOffset - EdgeOffset
  ) {
    x = FirstColoumnLocation + 2 * ColoumnOffset;
    //Colvalue = 2;
  } else if (
    x > FirstColoumnLocation + (3 * ColoumnOffset - EdgeOffset) &&
    x < FirstColoumnLocation + 4 * ColoumnOffset - EdgeOffset
  ) {
    x = FirstColoumnLocation + 3 * ColoumnOffset;
    //Colvalue = 3;
  } else if (
    x > FirstColoumnLocation + (4 * ColoumnOffset - EdgeOffset) &&
    x < FirstColoumnLocation + 5 * ColoumnOffset - EdgeOffset
  ) {
    x = FirstColoumnLocation + 4 * ColoumnOffset;
    //Colvalue = 4;
  } else if (
    x > FirstColoumnLocation + (5 * ColoumnOffset - EdgeOffset) &&
    x < FirstColoumnLocation + 6 * ColoumnOffset - EdgeOffset
  ) {
    x = FirstColoumnLocation + 5 * ColoumnOffset;
    //Colvalue = 5;
  } else if (x > FirstColoumnLocation + (6 * ColoumnOffset - EdgeOffset)) {
    x = FirstColoumnLocation + 6 * ColoumnOffset;
    //Colvalue = 6;
  }

  return x;
};
InitialiseCoinArray = function () {
  CoinArray = new Array(GridControllerInstance.rows);
  for (var i = 0; i < GridControllerInstance.rows; i++)
    CoinArray[i] = new Array(GridControllerInstance.coloumns);
};

InitialiseSpineAnimation = function () {
  //adding spine animation in the start scene
  spineTest = new sp.SkeletonAnimation(res.SpineJson, res.SpineAtlas);
  spineTest.setPosition(cc.p(100, size.height / 2 - 200));
  spineTest.setAnchorPoint(cc.p(0, 0));

  spineTest.setAnimation(1, "walk", true);
  //spineTest.setSkin("pony");

  owner.addChild(spineTest, 2);
};
//to create connect game layer that have required sprites and labels to show game action
var ConnectLayer = cc.Layer.extend({
  ctor: function () {
    this._super();
    owner = this;
    size = cc.winSize;
    GridControllerInstance = new GridController(6, 7);
    SoundControllerInstance = new SoundController();
    InitialiseSpineAnimation();
    InitialiseCoinArray();
    cc.log(CoinArray);
    InitialisemainBoard();
    FirstColoumnLocation = 290;
    ColoumnOffset = 80;
    //display player 1 or player 2 turn
    InitialisePlayerSprites();

    //adding player mark to the scene
    InitialiseMarkSprites();

    //mouse events
    if (cc.sys.capabilities.hasOwnProperty("mouse")) {
      cc.eventManager.addListener(
        {
          event: cc.EventListener.MOUSE,
          onMouseDown: function (event) {
            if (event.getButton() == cc.EventMouse.BUTTON_RIGHT) {
              //removing this scene
              GameInitialised = false;
              cc.director.popScene();
              SoundControllerInstance.StopMusic();
              SoundControllerInstance.PlayLobbyMusic();
            } else {
              if (ValidClick && !GameFinished) {
                if (
                  Player1Trn &&
                  (RedBallEase == undefined || RedBallEase.isDone())
                ) {
                  Colvalue = GetCoinPlacedColumnValue(1);
                  var VacancyVal = GridControllerInstance.VacancyPosition(
                    Colvalue,
                    1
                  );
                  if (VacancyVal != -1) AssignPlayer1Turn(VacancyVal);
                } else if (
                  !Player1Trn &&
                  (BlueballEase == undefined || BlueballEase.isDone())
                ) {
                  Colvalue = GetCoinPlacedColumnValue(2);
                  var VacancyVal = GridControllerInstance.VacancyPosition(
                    Colvalue,
                    2
                  );
                  if (VacancyVal != -1) AssignPlayer2Turn(VacancyVal);
                }
              }
            }
            return true;
          },
          onMouseMove: function (event) {
            //checking y boundary if it lies beyond board then only updating the value
            var y = event.getLocationY();
            var x = event.getLocationX();

            if (validateXY(x, y)) {
              ValidClick = true;

              if (
                x >
                SpriteBoard.getPositionX() +
                  SpriteBoard.getContentSize().width / 2
              )
                x =
                  SpriteBoard.getPositionX() +
                  SpriteBoard.getContentSize().width / 2;
              else if (
                x <
                SpriteBoard.getPositionX() -
                  SpriteBoard.getContentSize().width / 2
              )
                x =
                  SpriteBoard.getPositionX() -
                  SpriteBoard.getContentSize().width / 2;
              x = GetXbasedOnBoardColumn(x);

              if (Player1Trn) {
                if (MarkmoveTo == undefined || MarkmoveTo.isDone()) {
                  MarkmoveTo = cc.MoveTo.create(
                    0.1,
                    cc.p(x, player1MarkSprite.getPositionY())
                  );

                  player1MarkSprite.runAction(MarkmoveTo);
                }
                // player1MarkSprite.setPosition(cc.p(x,player1MarkSprite.getPositionY()));
              } else {
                if (MarkmoveTo == undefined || MarkmoveTo.isDone()) {
                  MarkmoveTo = cc.MoveTo.create(
                    0.1,
                    cc.p(x, player2MarkSprite.getPositionY())
                  );

                  player2MarkSprite.runAction(MarkmoveTo);
                }
              }
              markLoc = x;
            } else ValidClick = false;
          },
        },
        this
      );
    }
    return true;
  },
});

//to create a game scene and adding game layer to the scene
var ConnectScene = cc.Scene.extend({
  onEnter: function () {
    this._super();
    GameFinished = false;
    numCoinPlaced = 0;
    if (GameInitialised == false) {
      GameInitialised = true;
      Player1Trn = true;
      var layer = new ConnectLayer();
      this.addChild(layer);
    }
  },
});
