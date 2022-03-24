//class that controls playing all the sounds
class SoundController {
  constructor() {}
  PlayLobbyMusic = function () {
    cc.audioEngine.playMusic(res.LobbyBG_snd, true);
  };
  PlayGamePlayMusic = function () {
    cc.audioEngine.playMusic(res.GamePlayBG_snd, true);
  };
  StopMusic = function () {
    cc.audioEngine.stopMusic();
  };
  PlayCoinEffect = function () {
    cc.audioEngine.playEffect(res.CoinPlaced_snd);
  };
  PlayWinEffect = function () {
    cc.audioEngine.playEffect(res.Win_snd);
  };
  PlayGameOverEffect = function () {
    cc.audioEngine.playEffect(res.GameOver_snd);
  };
  ResumeMusic = function () {
    cc.audioEngine.resumeMusic();
  };
}
