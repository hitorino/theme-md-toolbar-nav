{
    // toolbar -> md-toolbar-nav-drawer-button
    api.createWidget('md-toolbar-nav-drawer-button', $.extend({}, {
        tagName: 'a.nav-drawer-button.md-button.left.initial',
        buildKey(attrs) {
            return 'md-toolbar-nav-drawer-button';
        },
        
        defaultState() {
            return {
                user: getUser()
            };
        },

        makeIcon(name) {
            return mdIcon(name, true);
        },

        html(attrs, state) {
            var contents = [this.makeIcon('menu')];
            const unreadNotifications = state.user.get('unread_notifications');
            this.appEvents.on('notifications:changed', ()=>{
                this.state.user = getUser();
                this.scheduleRerender();
            });
            if (!!unreadNotifications) {
                contents.push(this.attach('link', {
                    action: 'click',
                    className: 'badge-notification unread-notifications',
                    rawLabel: unreadNotifications,
                    omitSpan: true,
                    title: "notifications.tooltip.regular",
                    titleOptions: {
                        count: unreadNotifications
                    }
                }));
            }
            return contents;
        },

        click: clickActionHandler,
        clickAction(e) {
            globalState.set('showNavDrawer', !globalState.get('showNavDrawer'));
        },

        onChildOpen() {
            const centerLeft = $('#toolbar .center').css('left');
            const w1 = $('html').width();
            $('html').css('overflow-y','hidden');
            const w2 = $('html').width();
            $('html').css('margin-right', w2-w1);
            $('#toolbar .right').css('right', 8+w2-w1);
            $('#toolbar .center').css('left', centerLeft);
            $('body').addClass('md-no-selection');
        },
        onChildClose() {
            $('html').css('overflow-y','');
            $('html').css('margin-right', '');
            $('#toolbar .right').css('right', '');
            $('#toolbar .center').css('left', '');
            $('body').removeClass('md-no-selection');
        }
    }));
}