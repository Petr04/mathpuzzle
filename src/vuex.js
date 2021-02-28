import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import axios from '@/plugins/axios';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        sessionToken: null,
        username: null,
        userData: null,
    },
    plugins: [createPersistedState()],
    getters: {
        isAuthenticated: state => Boolean(state.sessionToken),
    },
    actions: {
        setSessionToken(context, sessionToken) {
            context.commit('setSessionToken', sessionToken);
            axios.defaults.headers.common['Authorization'] = sessionToken;
        },
        async getUserData(context) {
            if (!context.state.username) return;
            const {data} = await axios.get('/userapi/data/'
                + context.state.username);
            context.state.userData = data;
        },
        async login(context, user) {
            const {data} = await axios.post('/userapi/login/', user);
            context.dispatch('setSessionToken', data.token);
            context.commit('setUsername', user.username);
            console.log('logged in');
        },
        register(context, user) {
            axios.post('/userapi/registration/', user).then(({data}) => {
                context.dispatch('setSessionToken', data.token);
                context.commit('setUsername', user.username);
                console.log('registered');
            });
        },
    },
    mutations: {
        setSessionToken(state, sessionToken) {
            state.sessionToken = sessionToken;
        },
        setUsername(state, username) {
            state.username = username;
        },
    },
});

export default store;
