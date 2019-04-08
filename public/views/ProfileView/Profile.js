import ProfileTemplate from './Profile.pug';
import {User} from '../../utils/user.js';
import BaseView from '../BaseView';
import Bus from '../../utils/bus';
/**
 *
 */
export default class ProfileView extends BaseView {
  /**
   *
   * @param {*} parent
   */
  constructor(parent) {
    super(parent, ProfileTemplate);

    Bus.on('onSuccessUpload', this._onSuccessUpload.bind(this));
    Bus.on('onFailedUpload', (error) => {
      this._showWarning(this._warnings.email, error.message);
    });
    Bus.on('onSuccessAvatarGet', this._onSuccessAvatarGet.bind(this));
    Bus.on('onFailedAvatarGet', this._onFailedAvatarGet.bind(this));
  }

  /** */
  render() {
    this.data = User;
    super.render();

    Bus.emit('getAvatar');
    document.getElementById('file')
        .addEventListener('change', this._handleFileSelect.bind(this), false);
  }


  /**
   *
   * @param {*} warning
   * @param {*} message
   */
  _showWarning(warning, message) {
    warning.classList.remove('hidden');
    warning.innerHTML = '';
    warning.innerHTML += message;
  }
  /**
   *
   * @param {*} warning
   */
  _hideWarning(warning) {
    warning.classList.add('hidden');
    warning.innerHTML = '';
  }

  /**
   *
   * @param {*} evt
   * @param {*} h
   * @param {*} w
   */
  _handleFileSelect(evt, h = 250, w = 250) {
    const file = evt.target.files; // FileList object
    const f = file[0];
    // Only process image files.
    if (!f.type.match('image.*')) {
      alert('Image only please....');
      return;
    }
    Bus.emit('uploadAvatar', f);
  }

  /**
   * @param {*} img
   */
  _onSuccessUpload(img) {
    const reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = ((theFile) => {
      return function(e) {
        // Render thumbnail.
        document.getElementById('output').innerHTML =
          `<img class="thumb" title=${escape(theFile.name)}
           src= ${e.target.result} />`;
      };
    })(img);
    // Read in the image file as a data URL.
    reader.readAsDataURL(img);
  }

  /**
   *
   */
  _onFailedAvatarGet() {
    console.log('Failed to get avatar');
    document.getElementById('output')
        .innerHTML = `<div class=profile__default_avatar></div>`;
  }

  /**
   *
   * @param {*} blob
   */
  _onSuccessAvatarGet(blob) {
    const objectURL = URL.createObjectURL(blob);
    console.log('_getAvatar' + objectURL);
    document.getElementById('output')
        .innerHTML = `<img class="thumb" src=${objectURL}/>`;
  }
}
