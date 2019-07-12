import { AsyncStorage } from 'react-native';

const Auth = {

    /**
     * Set user
     * @param user
     */
    setUser: async (user) => await AsyncStorage.setItem('user', JSON.stringify(user)),

    /**
     * Get user
     */
    getUser: async () => {
        let user = await AsyncStorage.getItem('user');
        return JSON.parse(user);
    },

    /**
     * Delete user data.
     */
    logout: async () => await AsyncStorage.removeItem('user'),

    /**
     * Is user authenticated.
     * @returns {boolean}
     */
    auth: async () => await AsyncStorage.getItem('user') !== null,

    /**
     * Get user token.
     * @returns {string}
     */
    getToken: async () => {
        let user = JSON.parse(await AsyncStorage.getItem('user'));
        return user !== null ? user.token : '';
    },

    /**
     * Update user profile
     * @param newProfile
     */
    updateProfile: async (newProfile) => {
        let user = JSON.parse( await AsyncStorage.getItem('user'));
        newProfile.token = user.token;
        await AsyncStorage.setItem('user', JSON.stringify(newProfile));
    },

};

export default Auth;