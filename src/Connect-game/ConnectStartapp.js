var StartInitialised = false;
var SoundControllerInstance;
var ConnectStartLayer = cc.Layer.extend({
  ctor: function () {
    this._super();
    SoundControllerInstance = new SoundController();

    SoundControllerInstance.PlayLobbyMusic();
    SoundControllerInstance.ResumeMusic();
    var NewGameSprite = cc.Sprite.create(res.NewGame_png);
    var size = cc.winSize;
    NewGameSprite.setPosition(cc.p(size.width / 2, size.height - 100));
    this.addChild(NewGameSprite);

    //adding spine animation in the start scene
    var spineTest = new sp.SkeletonAnimation(res.SpineJson, res.SpineAtlas);
    spineTest.setPosition(cc.p(size.width / 2, size.height / 2 - 200));
    spineTest.setAnimation(2, "dance", true);
    //spineTest.setMix("walk", "dance", 0.2);
    this.addChild(spineTest, 2);

    //adding touch event to open game scene

    var l1 = cc.EventListener.create({
      event: cc.EventListener.MOUSE,
      onMouseDown: function (event) {
        if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
          //checking if the respective sprite is been clicked
          if (
            cc.rectContainsPoint(
              NewGameSprite.getBoundingBox(),
              event.getLocation()
            )
          ) {
            var scene = new ConnectScene();
            SoundControllerInstance.StopMusic();
            SoundControllerInstance.PlayGamePlayMusic();
            cc.director.pushScene(scene);
          }
        } else {
          cc.log("Right mouse clicked");
        }
        return true;
      },
    });
    cc.eventManager.addListener(l1, NewGameSprite);

    return true;
  },
});

var ConnectStartScene = cc.Scene.extend({
  onEnter: function () {
    this._super();
    if (StartInitialised == false) {
      StartInitialised = true;
      var layer = new ConnectStartLayer();
      this.addChild(layer);
      //playing lobby music when this layer added
      SoundControllerInstance.PlayLobbyMusic();
    }
  },
});
