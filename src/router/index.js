import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        name: 'mymap',
        path: 'map',
        component: () => import('../views/Map.vue'),
      },
      {
        name: 'mylist',
        path: 'list',
        component: () => import('../views/List.vue'),
      },
      {
        name: 'mypoints',
        path: 'points',
        component: () => import('../views/Points.vue'),
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
