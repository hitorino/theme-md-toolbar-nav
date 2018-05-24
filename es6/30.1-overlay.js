api.createWidget('md-nav-drawer-overlay', {
    tagName: '#overlay.md-nav-drawer-overlay',
    buildClasses() {
        window.MDGlobalState.addObserver('navDrawerIsOpen', ()=>{
            this.scheduleRerender();
        });
        return window.MDGlobalState.get('navDrawerIsOpen')?['active']:['inactive'];
    },
    html() {
        return [];
    },
    click: clickActionHandler,
    clickAction(e) {
        window.MDGlobalState.set('navDrawerIsOpen', false);
    }
});
