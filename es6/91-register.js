api.createWidget('md-header-dropdown-hamburger', {
    tagName: 'ul.icons.d-header-icons.d-header-left',
    html(attrs, state) {
        this.user = Discourse.User.current();
        return this.attach((this.user ? 'user-dropdown' :'header-dropdown'), {
            title: 'hamburger_menu',
            icon: 'bars',
            iconId: 'toggle-nav-drawer',
            active: false, // Keep active false in order to allow NavDrawer-closing.
            action: 'toggleHamburgerActive',
            user: this.user,
            contents() {
                if (!attrs.flagCount) {
                    return;
                }
                return api.h('div.badge-notification.flagged-posts', {
                    attributes: {
                        title: I18n.t('notifications.total_flagged')
                    }
                }, attrs.flagCount);
            }
        })
    }
});

api.decorateWidget('header-contents:before', dec => {
    return [
        dec.attach('md-header-dropdown-hamburger', dec.attrs)
    ];
})

api.reopenWidget('header', {
    toggleHamburgerActive() {
        window.MDGlobalState.set('navDrawerIsOpen', !window.MDGlobalState.get('navDrawerIsOpen'));
        this.scheduleRerender();
    }
});

api.decorateWidget('header:before', dec => {
    return (window.MDGlobalState.get('navDrawerIsOpen') ? [
        dec.h('div.md-nav-drawer-wrapper', [dec.attach('md-nav-drawer')]),
        dec.attach('md-nav-drawer-overlay')
    ] : [])
})

api.createWidget('md-topbar-menu', {
    tagName: 'a.md-topbar-link',
    buildKey: ()=>'md-topbar-menu',
    defaultState() {
        return {
            isOpen: false
        }
    },
    html() {
        const handler = '关于社区'
        if (this.state.isOpen) {
            const links = settings.sidebar_extra_links.split('|').map((link)=>{
                const info = link.split(',');
                return {
                    name: info[0],
                    url: info[1],
                    icon: info[2]
                }
            }).map((linkInfo)=>api.h('a.md-topbar-link', {'data-auto-route':"true",href: linkInfo.url}, linkInfo.name))
            return [
                handler,
                api.h('div.md-topbar-menu', links)
            ]
        } else {
            return handler
        }
    },

    click() {
        this.state.isOpen = !this.state.isOpen;
    },

    clickOutside(e) {
        this.state.isOpen = false;
        this.scheduleRerender();
    }
})

{
    const oldLogo = require('discourse/widgets/home-logo')
                        .default.prototype.logo

    api.reopenWidget('home-logo', {
        logo() {
            const mobileView = this.site.mobileView
            const logoSmallUrl = this.siteSettings.logo_small_url || ""
            if (!mobileView && this.attrs.minimized && logoSmallUrl.length) {
                return h("img#site-logo.logo-small", {
                    key: "logo-small",
                    attributes: {
                        src: Discourse.getURL(logoSmallUrl),
                        width: 36,
                        alt: title
                    }
                })
            } else {
                return oldLogo.apply(this, arguments)
            }
        }
    })

    api.decorateWidget('home-logo:after', dec => {
        return [
            dec.h('a.md-topbar-link', {href: 'https://hitorino.moe'}, '首页'),
            dec.h('a.md-topbar-link', {href: 'https://m.hitorino.moe'}, '微博客'),
            dec.attach('md-topbar-menu')
        ]
    })
}
