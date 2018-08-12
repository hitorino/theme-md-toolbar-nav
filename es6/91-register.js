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