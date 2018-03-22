// mdmenu/mdnavbar here
api.createWidget('md-nav-drawer', {
    tagName: 'div.md-nav-drawer',
    buildClasses() {
        if (!globalState.get('showNavDrawer')) {
            return ['inactive']
        }
    },
    userInfo() {
        const user = this.user;
        const userAvatar = api.h('a.user-avatar', {
            href: `/u/${user.get('username')}`,
            'data-auto-route': 'true'
        }, [
            api.h('img', {
                src: user.get('avatar_template').replace(
                    "{size}", "96")
            })
        ]);
        const userNames = api.h('a.user-names', {
            href: `/u/${user.get('username')}`,
            'data-auto-route': 'true'
        }, [
            user.get('username'),
            api.h('br'),
            user.get('name')
        ]);
        return api.h('div.md-user-info', {
            style: `background-image: url(${user.get('navbar_background')})`
        }, [
            userAvatar,
            userNames,
            api.h('span.user-title', user.get('title'))
        ])
    },

    account() {
        if (!Discourse.User.current()) {
            return api.h('div.account', [
                api.h('span.subheader', '账户'),
                mdEntry('/login', 'account', '登录账户')
            ])
        }
        const user = this.user;
        let insider = undefined;
        if (!!user.groups && user.groups.filter(function(g) {
                return g.name === "hitorino-insider";
            }).length == 0) {
            insider = mdEntry('https://insider.hitorino.moe/', 'account-multiple-plus', 'insider 申请', 0, false);
        }

        let admin = undefined;
        if (!!user.admin) {
            admin = mdEntry('/admin', 'key', '后台管理');
        }
        return api.h('div.account', [
            api.h('span.subheader', '账户'),
            admin,
            mdEntry(`/u/${user.get('username')}/preferences`,
                'settings', '偏好设置'),
            api.h('a#logout.md-entry.initial', [
                mdIcon('power'),
                api.h('span', '登出账户')
            ]),
            insider
        ]);
    },

    misc() {
        const user = this.user;
        return api.h('div.misc', [
            api.h('span.subheader', '更多'),
            mdEntry('https://hitorino.moe/', 'home',
                'hitorino × 猫娘领域 首页', 0, false),
            mdEntry('https://m.hitorino.moe/', 'account-multiple',
                'hitorino × Mastodon 实例', 0, false),
            mdEntry('/faq', 'information', 'hitorino 社区介绍'),
            mdEntry('/tos', 'book', 'hitorino 服务条款'),
            this.attach('mdnavbar-switchview')
        ]);
    },

    html() {
        globalState.addObserver('showNavDrawer', ()=>{
            this.scheduleRerender();
        });
        this.user = getUser();
        window.onMDNavDrawerToggled || window.onMDNavDrawerToggled(globalState.get('showNavDrawer'));

        if (!globalState.get('showNavDrawer')) {
            return [];
        } else if (!Discourse.User.current()) {
            return [
                this.userInfo(),
                this.account(),
                this.misc()
            ];
        } else {
            return [
                this.userInfo(),
                this.attach('mdmenu-tabs'),
                this.attach('mdnavbar-categories'),
                this.account(),
                this.misc()
            ];
        }
    },
    click(e) {
        if (!aClickHandler(e)) {
            return false;
        } else if (e.target.id === 'logout') {
            e.preventDefault();
            //api.container.lookup("controller:application").send("logout");
            logout();
            return false
        } else {
            return false;
        }
    }
});
