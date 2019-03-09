import ProfileTemplate from './Profile.pug';
import {Net} from '../../utils/net.js';
/**
 *
 */
export class ProfileComponent {
  /**
   *
   * @param {*} param0
   */
  constructor({
    el = document.body,
  } = {}) {
    this._el = el;
    this.template = ProfileTemplate;
  }

  /**
   * @param {*} d
  */
  set data(d = []) {
    this._data = d;
  }

  /** */
  render() {
    this._el.innerHTML = this.template({data: this._data});
    this._getAvatar();
    document.getElementById('file')
        .addEventListener('change', this._handleFileSelect.bind(this), false);
  }

  /**
   *
   * @param {*} file
   */
  _uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);
    console.log('upload photo');
    Net.postPhoto({url: '/playerAvatar', body: formData})
        .then((resp) => {
          if (resp.status === 201) {
            resp
                .json()
                .then((json) => {
                  console.log('Okey photo');
                });
          } else {
            resp
                .json()
                .then((error) => {
                  this._showWarning(this._warnings.email, error.error);
                });
          }
        });
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
    }
    this._uploadAvatar(f);
    const reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = ((theFile) => {
      return function(e) {
        // Render thumbnail.
        document.getElementById('output').innerHTML = ['<img class="thumb" title="', escape(theFile.name), '" src="', e.target.result, '" width="' + w + '" height="' + h + '"  />'].join('');
      };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsDataURL(f);

  }


  /**
   *
   * @param {*} w
   * @param {*} h
   */
  _getAvatar(w = 250, h = 250) {
    Net.get({url: '/playerAvatar'})
        .then((resp) => {
          console.log(resp.status);
          if (resp.status === 200) {
            console.log('_getAvatar1121212');
            const buffer = resp.blob();
            return buffer;
          } else {
            console.log('Heeeelpppp2323');
            document.getElementById('output')
                .innerHTML = ['<img class="thumb" ', '" src="./img/qrosh.png"' + ' width="' + w + '" height="' + h + '"  />'].join('');
            resp
                .json()
                .then((error) => {
                  this._showWarning(this._warnings.email, error.error);
                });
          }
        })
        .then((myBlob) => {
          const objectURL = URL.createObjectURL(myBlob);
          console.log('_getAvatar112' + objectURL);
          document.getElementById('output')
              .innerHTML = ['<img class="thumb" ', '" src="', objectURL +'"  />'].join('');
        });
  }

}
