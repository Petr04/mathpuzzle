import Vue from 'vue';
import Router from 'vue-router';

import Tasks from '@/views/Tasks';
import Account from '@/views/Account';
import LoginRegister from '@/views/LoginRegister';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Tasks,
            title: 'Задания',
        },
        {
            path: '/account/',
            component: Account,
            title: 'Аккаунт',
        },
        {
            path: '/account/:action/', // login or register
            component: LoginRegister,
        },
    ],
});
