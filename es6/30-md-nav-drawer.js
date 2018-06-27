api.reopenWidget('hamburger-category', {
    buildClasses() {
        return ['md-entry']
    }
});

const hamburgerMenu = require('discourse/widgets/hamburger-menu').default.prototype;
const listCategories = hamburgerMenu.listCategories;

api.createWidget('md-nav-drawer-userinfo', {
    tagName: 'div.md-user-info',
    buildAttributes() {
        this.user = getUser();
        return {
            style: `background-image: url(${this.user.get('navbar_background')});`
        };
    },

    userAvatarUrl() {
        return this.user.get('avatar_template').replace("{size}", "64");
    },

    html() {
        this.user = getUser();
        return [
            this.userAvatar(),
            this.userNames(),
            api.h('span.md-user-title', this.user.get('title'))
        ];
    },

    linkToUser() {
        return {
            href: `/u/${this.user.get('username')}`,
            "data-auto-route": true
        };
    },

    userAvatar() {
        return api.h('a.md-user-avatar', this.linkToUser(), [
            api.h('img', { src: this.userAvatarUrl() })
        ]);
    },

    userNames() {
        return api.h('a.md-user-names', this.linkToUser(), [
            this.user.get('username'),
            api.h('br'),
            this.user.get('name')
        ])
    }
});
// mdmenu/mdnavbar here
api.createWidget('md-nav-drawer', _.extend({}, {
    buildClasses() {
        if (MDNavDrawerIsPermanent()) {
            return ['permanent','md-nav-drawer']
        } else {
            return ['md-nav-drawer']
        }
    },
    listCategories: listCategories,
    tagName: 'div.md-nav-drawer.md-no-selection',
    buildKey: ()=> 'md-nav-drawer',
    buildAttributes() {
        if (!window.MDGlobalState.get('navDrawerIsOpen')) {
            return {
                style: 'display: none;'
            };
        }
    },
    userInfo() {
        return this.attach("md-nav-drawer-userinfo");
    },

    account() {
        if (!Discourse.User.current()) {
            return api.h('div.account', [
                api.h('span.subheader', I18n.t('user.preferences_nav.account')),
                mdEntry('/login', 'sign-in', I18n.t('log_in'))
            ])
        }
        const user = this.user;        
        let admin = undefined;
        if (!!user.admin) {
            admin = mdEntry('/admin', 'key', I18n.t('admin_title'));
        }
        return api.h('div.account', [
            api.h('span.subheader', I18n.t('user.preferences_nav.account')),
            admin,
            mdEntry(`/u/${user.get('username')}/preferences`,
                'settings', I18n.t('user.preferences')),
            api.h('a#logout.md-entry.initial', [
                mdIcon('sign-out'),
                api.h('span', I18n.t('user.log_out'))
            ])
        ]);
    },

    misc() {
        const user = this.user;
        return api.h('div.misc', [
            api.h('span.subheader', I18n.t('more')),
            mdEntry('/faq', 'question', I18n.t('faq')),
            this.attach('mdnavbar-switchview')
        ]);
    },

    html() {
        this.user = Discourse.User.current();

        return [
            this.userInfo(),
            this.listCategories(),
            this.account(),
            this.misc()
        ];
    },
    click(e) {
        if (!aClickHandler(e)) {
            return false;
        } else if ($(e.target).is('a#logout, a#logout *')) {
            e.preventDefault();
            api.container.lookup("controller:application").send("logout");
            return false
        } else {
            return false;
        }
    }
}));
