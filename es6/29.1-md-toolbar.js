{
    api.createWidget('md-toolbar', {
        tagName: 'div#toolbar.md-toolbar',
        buildKey: () => 'mdtoolbar',
        defaultState() {
            return {
                hide: false,
                path: globalState.currentPath
            };
        },
        html(attr, state) {
            this.appEvents.off('msktheme:page-change');
            this.appEvents.on('msktheme:page-change', ()=>{
                state.path = getCurrentPath();
                this.scheduleRerender();
            });
            let currentMainToolBar = globalState.get('currentToolbar') || getCurrentToolbar()
            if (currentMainToolBar) {
                currentMainToolBar = this.attach(`md-toolbar-${currentMainToolBar}`)
            } else {
                currentMainToolBar = []
            }
            return [
                this.attach('md-toolbar-nav-drawer-button', {
                    openChild: false
                }),
                h('a#logo.toolbar-title.left', {
                    'data-auto-route': 'true',
                    href: '/'
                }, [
                    h('img', {
                        id: 'md-site-logo',
                        src: window.HITORINO_SITE_LOGO || Discourse.SiteSettings.logo_url,
                        alt: 'hitorino*'
                    })
                ]),
                currentMainToolBar,
                this.attach('md-toolbar-search-button')
            ];
        },
        click(e) {
            if (e.type === 'click' && e.button === 0 && e.target.id ===
                'md-site-logo') {
                e.preventDefault();
                DiscourseURL.routeTo('/');
                return false;
            } else {
                return true;
            }
        }
    });
}