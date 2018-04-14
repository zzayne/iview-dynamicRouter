import Vue from 'vue';
import iView from 'iview';
import { router } from './router/index';
import store from './store';
import App from './app.vue';
import util from '@/libs/util.js';
import hasPermission from '@/libs/hasPermission.js';
import 'iview/dist/styles/iview.css';

Vue.use(iView);
Vue.use(hasPermission);

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    mounted () {
        // 调用方法，动态生成路由
        util.initRouter(this);
    }
});
