import Vue from 'vue';
import Router from 'vue-router';

import Tasks from '@/views/Tasks';
import Task from '@/views/Task';
import Account from '@/views/Account';
import LoginRegistration from '@/views/LoginRegistration';
import CreateTask from '@/views/CreateTask';

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
            path: '/task/:id/',
            component: Task,
        },
        {
            path: '/account/',
            component: Account,
            title: 'Аккаунт',
        },
        {
            path: '/account/:action/', // login or registration
            component: LoginRegistration,
        },
        {
            path: '/create/task',
            component: CreateTask,
        }
    ],
});
