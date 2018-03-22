const GlobalState = Ember.Object.extend({
    currentPath: document.location.pathname,
    currentToolbar: null,
    showSearchbar: false,
    showNavDrawer: false
});

const globalState = GlobalState.create();


api.onPageChange((url, title)=> {
    globalState.set('currentPath', url)
    const appEvents = api.container.lookup('app-events:main');
    appEvents.trigger('msktheme:page-change')
});
