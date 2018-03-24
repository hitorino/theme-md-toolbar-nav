const GlobalState = Ember.Object.extend({
    currentPath: document.location.pathname,
    currentToolbar: null,
    showSearchbar: false,
    showNavDrawer: false,
    navDrawerIsPermanent: false
});

const globalState = GlobalState.create();


api.onPageChange((url, title)=> {
    globalState.set('currentPath', url)
    const appEvents = api.container.lookup('app-events:main');
    appEvents.trigger('msktheme:page-change')
});

window.MDNavDrawerUpdatePermanent = function() {
    globalState.set('navDrawerIsPermanent', ($(window).width()>1110+300));
}

window.MDNavDrawerIsPermanent = function() {
    return globalState.get('navDrawerIsPermanent');
}

window.MDNavDrawerUpdatePermanent();
if (globalState.get('navDrawerIsPermanent')) {
    globalState.set('showNavDrawer', true);
}