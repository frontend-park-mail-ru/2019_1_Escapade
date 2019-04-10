import Bus from '../utils/bus';
import {Net} from '../utils/net';
import {storage} from '../utils/firebase';
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
    const ref = storage.ref('test/' + file.name);
    ref.put(file)
        .then((snapshot) => {
        // console.log('Uploaded a file!', snapshot);
          snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            Bus.emit('onSuccessUpload', downloadURL);
          });
        })
        .catch((error) => {
          console.log('error during file upload: ', error);
          Bus.emit('onFailedUpload', error);
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
