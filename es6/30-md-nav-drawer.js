api.reopenWidget('hamburger-category', {
    buildClasses() {
        return ['md-entry']
    }
});

const hamburgerMenu = require('discourse/widgets/hamburger-menu').default.prototype;
const listCategories = hamburgerMenu.listCategories;
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
    tagName: 'div.md-nav-drawer',
    buildKey: ()=> 'md-nav-drawer',
    buildAttributes() {
        if (!window.MDGlobalState.get('navDrawerIsOpen')) {
            return {
                style: 'display: none;'
            };
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
        return api.h('div.md-user-info', (
            user.get('profile_background')
                ? { style: {'background-image': `url(${user.get('profile_background')})` } }
                : {}
        ), [
            userAvatar,
            userNames,
            api.h('span.user-title', user.get('title'))
        ])
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

        if (!Discourse.User.current()) {
            return [
                this.account(),
                this.misc()
            ];
        } else {
            return [
                this.userInfo(),
                this.listCategories(),
                this.account(),
                this.misc()
            ];
        }
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
