/* eslint-disable no-underscore-dangle */

export default class Model {
  constructor() {
    this._hardMode = false;
    this._musicOn = false;
    this._bgMusicPlaying = false;
  }

  set musicOn(value) {
    this._musicOn = value;
  }

  get musicOn() {
    return this._musicOn;
  }

  set hardMode(value) {
    this._hardMode = value;
  }

  get hardMode() {
    return this._hardMode;
  }

  set bgMusicPlaying(value) {
    this._bgMusicPlaying = value;
  }

  get bgMusicPlaying() {
    return this._bgMusicPlaying;
  }
}
