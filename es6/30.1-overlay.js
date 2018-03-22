api.createWidget('md-nav-drawer-overlay', {
    tagName: '#overlay.md-nav-drawer-overlay',
    buildClasses() {
        globalState.addObserver('showNavDrawer', ()=>{
            this.scheduleRerender();
        });
        return globalState.get('showNavDrawer')?['active']:['inactive'];
    },
    html() {
        return [];
    },
    click: clickActionHandler,
    clickAction(e) {
        globalState.set('showNavDrawer', false);
    }
});
