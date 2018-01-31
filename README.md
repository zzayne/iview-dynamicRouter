>github上关于vue动态添加路由的例子很多，本项目参考了部分项目后，在iview框架基础上完成了动态路由的动态添加和菜单刷新。为了帮助其他需要的朋友，现分享出实现逻辑，欢迎一起交流学习。

# iview-dynamicRouter
基于iview框架下的动态路由实现


### 实现目标
前端从后端拿到路由数据后，刷新项目的路由和菜单列表。

### 项目基础
 iview组件库官方模板项目 `iview-admin` 的template分支项目，此项目为`iview-admin`的基础框架代码。项目地址:[iview-admin](https://github.com/iview/iview-admin)
 
### 实现思路 

iview-admin项目将路由分为三种：
1. 不作为Main组件的子页面展示的页面路由，例如login、404、403等错误页面路由；
2. 作为Main组件的子页面展示但是不在左侧菜单显示的路由（otherRouter），比如首页路由；
3. 作为Main组件的子页面展示并且在左侧菜单显示的路由（appRouter）;

为了实现目的，主要是对appRouter进行动态添加和缓存，其中动态添加时不区分路由类型，但是因为iview-admin的页面标签和面包屑导航的实现，需要遍历appRouter来匹配生成，所以我们需要将实际的appRouter缓存进state，以便全局访问。（页面标签和面包屑实现原理如此，在这里暂时不进行实例展示）

另外路由跳转处理时，因为页面加载顺序，如果404页面为静态路由，那么第一次进入页面时，动态路由还未加载，找不到路由地址会跳转到404错误页，所以404路由需要和从后台拿到的动态路由一起加载。

### 核心代码（代码逻辑解释见注释）


数据请求及路由节点生成
```
//util.js

//生成路由
util.initRouter = function (vm) {
    const constRoutes = [];
    const otherRoutes = [];

    // 404路由需要和动态路由一起注入
    const otherRouter = [{
        path: '/*',
        name: 'error-404',
        meta: {
            title: '404-页面不存在'
        },
        component: 'error-page/404'
    }];
    // 模拟异步请求
    util.ajax('menu.json').then(res => {
        var menuData = res.data;
        util.initRouterNode(constRoutes, menuData);
        util.initRouterNode(otherRoutes, otherRouter);
        // 添加主界面路由
        vm.$store.commit('updateAppRouter', constRoutes.filter(item => item.children.length > 0));
        // 添加全局路由
        vm.$store.commit('updateDefaultRouter', otherRoutes);
        // 刷新界面菜单
        vm.$store.commit('updateMenulist', constRoutes.filter(item => item.children.length > 0));
    });
};

//生成路由节点
util.initRouterNode = function (routers, data) {
    for (var item of data) {
        let menu = Object.assign({}, item);
        menu.component = lazyLoading(menu.component);

        if (item.children && item.children.length > 0) {
            menu.children = [];
            util.initRouterNode(menu.children, item.children);
        }
        // 给页面添加标题
        menu.meta = { title: menu.title };
        routers.push(menu);
    }
};

```
动态加载组件
```
//lazyLoading.js

export default (url) => resolve => { require([`@/views/${url}.vue`], resolve); };
```
Store缓存实现
```
//app.js

 // 动态添加主界面路由，需要缓存
updateAppRouter (state, routes) {
    state.routers.push(...routes);
    router.addRoutes(routes);
},

// 动态添加全局路由，不需要缓存
updateDefaultRouter (state, routes) {
    router.addRoutes(routes);
},
// 接受前台数组，刷新菜单
updateMenulist (state, routes) {
    state.menuList = routes;
}

```
最后在main.js中进行调用

```
//main.js
 mounted () {
    // 调用方法，动态生成路由
    util.initRouter(this);
  }
```

### 与我联系

Email:thezhangwen@outlook.com
