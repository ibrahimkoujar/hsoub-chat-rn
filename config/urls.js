const SOCKET = 'ws://192.168.0.102:3001';
const API = 'http://192.168.0.102:3001';
const urls = {
    SOCKET: SOCKET,
    API: API,
    AUTH: API + '/api/auth',
    REGISTER: API + '/api/auth/register',
    UPDATE_PROFILE: API + '/api/account',
    CHANGE_PASSWORD: API + '/api/account/password',
    AVATARS: API + '/uploads/'
};
export default urls;