{
    window.MDGlobalState = Ember.Object.extend({
        navDrawerIsPermanent: false,
        navDrawerIsOpen: false
    }).create();
    window.MDNavDrawerUpdatePermanent = function() {
        window.MDGlobalState.set('navDrawerIsPermanent', $(window).width()>1126+270);
    };

    window.MDNavDrawerIsPermanent = function() {
        return window.MDGlobalState.get('navDrawerIsPermanent');
    };

    window.MDNavDrawerUpdatePermanent();
};