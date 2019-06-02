import Bus from '../utils/bus';
import { Net } from '../utils/net';
import { WebSocketInterface } from '../utils/webSocket';
import * as dataAddress from './../../netconfig.json';

/**
 *
 */
export default class ProfileModel {
  wsAdress: string;
  ws: any;
  curPath: string;
  /**
   *
   */
  constructor() {
    this.wsAdress = dataAddress.profileWsAddress;

    Bus.on('currentPath', this._currentPathSignalFunc.bind(this), 'profileModel');
    Bus.on('changeProfile', this._changeProfile.bind(this), 'profileModel');
  }

  _busAllOn() {
    Bus.on('getAvatar', this._getAvatar.bind(this), 'profileModel');
    Bus.on('uploadAvatar', this._uploadAvatar.bind(this), 'profileModel');
    Bus.on('getInfoFromWS', this._getInfo.bind(this), 'profileModel');
  }

  _busAllOff() {
    Bus.off('getAvatar', this._getAvatar.bind(this), 'profileModel');
    Bus.off('uploadAvatar', this._uploadAvatar.bind(this), 'profileModel');
    Bus.off('getInfoFromWS', this._getInfo.bind(this), 'profileModel');
  }

  _currentPathSignalFunc(path: string) {
    if (path === '/profile') {
      this.curPath = path;
      this._busAllOn();
      this.ws = new WebSocketInterface(this.wsAdress);
    } else {
      if (this.curPath === '/profile') {
        this.ws.closeConnection();
        this._busAllOff();
        this.curPath = '';
      }
    }
  }

  _getInfo(data: any) {
    //console.log('_getInfo ', data)
    switch (data.type) {
      case 'Lobby':
        console.log('updateProfileGames')
        Bus.emit('updateProfileGames', data.value);
        break;
    }
  }

  /**
   *
   * @param {*} data
   */
  _changeProfile(data: object) {
    console.log(data);
    Net.put(data, '/api/user')
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
  _uploadAvatar(file: string | Blob) {
    const formData = new FormData();
    formData.append('file', file);
    console.log('upload photo');
    Net.postPhoto(formData)
      .then((resp: Response) => {
        if (resp.status === 200) {
          console.log('Okey photo');
          return resp.json();
        } else {
          resp.json()
            .then((error: { message: string; }) => {
              console.log(error);
              Bus.emit('onFailedUpload', error);
            });
        }
      })
      .then((url: { url: string; }) => {
        console.log(url.url);
        Bus.emit('onSuccessUpload', url.url);
      })
      .catch((error: string) => {
        Bus.emit('onFailedUpload', error);
        console.log('Avatar upload error : ', error);
      });
  }


  /**
   *
   * @param {*} name
   */
  _getAvatar(name: string) {
    Net.get(`/api/avatar/${name}`)
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
