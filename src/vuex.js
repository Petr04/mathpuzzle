import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axios from '@/plugins/axios';
import removeHeaderFromRequest from '@/lib/removeHeaderFromRequest';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        sessionToken: null,
        tokenExpTime: null,
        username: null,
        userData: null,
    },
    plugins: [createPersistedState()],
    getters: {
        isTokenExpired: state =>
            !state.tokenExpTime || Math.floor(state.tokenExpTime / 1000)
                < Math.floor(new Date().getTime() / 1000),
        isAuthenticated: (state, getters) =>
            Boolean(state.sessionToken)
            && Boolean(state.username)
            && !getters.isTokenExpired,
    },
    actions: {
        setSessionToken(context, sessionToken) {
            const expDate = new Date();
            expDate.setDate( expDate.getDate() + 30 );
            context.commit('setTokenExpTime', expDate.getTime());

            context.commit('setSessionToken', sessionToken);
            axios.defaults.headers.common['Authorization'] =
                'Bearer ' + sessionToken;
        },
        async getUserData(context) {
            if (!context.state.username) return;
            const {data} = await axios.get('/userapi/data/'
                + context.state.username);
            context.state.userData = data;
        },
        async setUserData(context, userData) {
            await axios.patch('/userapi/data/' +
                context.state.username, userData);
            context.commit('setUserData', userData);
        },
        async login(context, user) {
            const {data} = await axios.post('/userapi/login/', user, {
                transformRequest: [removeHeaderFromRequest('Authorization')]
            });
            context.dispatch('setSessionToken', data.token);
            context.commit('setUsername', user.get('username'));
            context.dispatch('getUserData');
        },
        async register(context, user) {
            delete axios.defaults.headers.common['Authorization'];
            const {data} = await axios.post('/userapi/registration/', user, {
                transformRequest: [removeHeaderFromRequest('Authorization')]
            });
            context.dispatch('setSessionToken', data.token);
            context.commit('setUsername', user.get('username'));
            context.dispatch('getUserData');
        },
        logout(context) {
            context.commit('setUsername', null);
        },
    },
    mutations: {
        // Без этого сохранение в localStorage не работает
        setSessionToken(state, sessionToken) {
            state.sessionToken = sessionToken;
        },
        setTokenExpTime(state, tokenExpTime) {
            state.tokenExpTime = tokenExpTime;
        },
        setUsername(state, username) {
            state.username = username;
        },
        setUserData(state, userData) {
            state.userData = userData;
        },
    },
});

export default store;
