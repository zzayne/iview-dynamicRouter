import { otherRouter } from '@/router/router';
import { router } from '@/router/index';
import Util from '@/libs/util';

const app = {
    state: {
        cachePage: [],
        pageOpenedList: [{
            title: '首页',
            path: '/',
            name: 'home_index'
        }],
        currentPageName: '',
        openedSubmenuArr: [], // 要展开的菜单数组

        currentPath: [
            {
                title: '首页',
                path: '/',
                name: 'home_index'
            }
        ],
        tagsList: [],
        menuList: [],
        routers: [
            otherRouter
        ],
        dontCache: []
    },
    mutations: {
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
        },
        // 设置打开过的标签页
        setTagsList (state, list) {
            state.tagsList.push(...list);
        },
        // 删除标签
        removeTag (state, name) {
            state.pageOpenedList.map((item, index) => {
                if (item.name === name) {
                    state.pageOpenedList.splice(index, 1);
                }
            });
        },
        // 已打开页面缓存
        pageOpenedList (state, get) {
            let openedPage = state.pageOpenedList[get.index];
            if (get.argu) {
                openedPage.argu = get.argu;
            }
            if (get.query) {
                openedPage.query = get.query;
            }
            state.pageOpenedList.splice(get.index, 1, openedPage);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        // 关闭所有标签
        clearAllTags (state) {
            state.pageOpenedList.splice(1);
            state.cachePage.length = 0;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        // 关闭此页面外标签
        clearOtherTags (state, vm) {
            let currentName = vm.$route.name;
            let currentIndex = 0;
            state.pageOpenedList.forEach((item, index) => {
                if (item.name === currentName) {
                    currentIndex = index;
                }
            });
            if (currentIndex === 0) {
                state.pageOpenedList.splice(1);
            } else {
                state.pageOpenedList.splice(currentIndex + 1);
                state.pageOpenedList.splice(1, currentIndex - 1);
            }
            let newCachepage = state.cachePage.filter(item => {
                return item === currentName;
            });
            state.cachePage = newCachepage;
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        },
        // 设置打开默认页面
        setOpenedList (state) {
            state.pageOpenedList = localStorage.pageOpenedList ? JSON.parse(localStorage.pageOpenedList) : [otherRouter.children[0]];
        },
        // 设置当前路径
        setCurrentPath (state, pathArr) {
            state.currentPath = pathArr;
        },
        // 设置当前页面名
        setCurrentPageName (state, name) {
            state.currentPageName = name;
        },
        // 关闭页面
        closePage (state, name) {
            state.cachePage.forEach((item, index) => {
                if (item === name) {
                    state.cachePage.splice(index, 1);
                }
            });
        },
        addOpenSubmenu (state, name) {
            let hasThisName = false;
            let isEmpty = false;
            if (name.length === 0) {
                isEmpty = true;
            }
            if (state.openedSubmenuArr.indexOf(name) > -1) {
                hasThisName = true;
            }
            if (!hasThisName && !isEmpty) {
                state.openedSubmenuArr.push(name);
            }
        },
        increateTag (state, tagObj) {
            if (!Util.oneOf(tagObj.name, state.dontCache)) {
                state.cachePage.push(tagObj.name);
                localStorage.cachePage = JSON.stringify(state.cachePage);
            }
            state.pageOpenedList.push(tagObj);
            localStorage.pageOpenedList = JSON.stringify(state.pageOpenedList);
        }
    }
};

export default app;
