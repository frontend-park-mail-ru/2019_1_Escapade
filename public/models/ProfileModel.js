import Bus from '../utils/bus';
import {Net} from '../utils/net';
/**
 *
 */
export default class ProfileModel {
  /**
   *
   */
  constructor() {
    Bus.on('getAvatar', this._getAvatar.bind(this));
    Bus.on('changeProfile', this._changeProfile.bind(this));
    Bus.on('uploadAvatar', this._uploadAvatar.bind(this));
  }

  /**
   *
   * @param {*} data
   */
  _changeProfile(data) {
    console.log(data);
    Net.put({url: '/user', body: data})
        .then((resp) => {
          console.log(resp.status);
          if (resp.status === 200) {
            Bus.emit('onSuccessChange', data);
          } else {
            resp.json()
                .then((error) => {
                  Bus.emit('onFailedChange', error);
                });
          }
        })
        .catch((error) => {
          console.log('Profile change failed : ', error);
        });
  }

  /**
   *
   * @param {*} file
   */
  _uploadAvatar(file) {
    const formData = new FormData();
    formData.append('file', file);
    console.log('upload photo');
    Net.postPhoto({url: '/avatar', body: formData})
        .then((resp) => {
          if (resp.status === 200) {
            console.log('Okey photo');
            return resp.json();
          } else {
            resp.json()
                .then((error) => {
                  console.log(error);
                  Bus.emit('onFailedUpload', error);
                });
          }
        })
        .then((url) => {
          console.log(url.url);
          Bus.emit('onSuccessUpload', url.url);
        })
        .catch((error) => {
          Bus.emit('onFailedUpload', error);
          console.log('Avatar upload error : ', error);
        });
  }


  /**
   *
   * @param {*} name
   */
  _getAvatar(name) {
    Net.get({url: `/avatar/${name}`})
        .then((resp) => {
          console.log(resp.status);
          if (resp.status === 200) {
            return resp.json();
          } else {
            Bus.emit('onFailedAvatarGet');
          }
        })
        .then((url) => {
          console.log(url.url);
          if (url.url === undefined) {
            Bus.emit('onFailedAvatarGet');
            return;
          }
          Bus.emit('onSuccessAvatarGet', url.url);
        })
        .catch((error) => {
          console.log('Avatar get error : ', error);
        });
  }
}
