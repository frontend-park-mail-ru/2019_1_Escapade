import Bus from '../utils/bus';
import {Net} from '../utils/net';
import bus from '../utils/bus';
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
          if (resp.status === 201) {
            bus.emit('onSuccessUpload', file);
            console.log('Okey photo');
          } else {
            resp.json()
                .then((error) => {
                  Bus.emit('onFailedUpload', error);
                });
          }
        })
        .catch((error) => {
          console.log('Avatar upload error : ', error);
        });
  }

  /**
   *
   * @param {*} w
   * @param {*} h
   */
  _getAvatar(w = 250, h = 250) {
    Net.get({url: '/avatar'})
        .then((resp) => {
          console.log(resp.status);
          if (resp.status === 200) {
            const buffer = resp.blob();
            return buffer;
          } else {
            Bus.emit('onFailedAvatarGet');
            return;
          }
        })
        .then((myBlob) => {
          console.log(myBlob);
          if (myBlob === undefined) {
            Bus.emit('onFailedAvatarGet');
            return;
          }
          Bus.emit('onSuccessAvatarGet', myBlob);
        })
        .catch((error) => {
          console.log('Avatar get error : ', error);
        });
  }
}
