api.reopenWidget('header', {
    html() {
        return [
            this.attach('md-toolbar'),
            this.attach('md-nav-drawer'),
            this.attach('md-nav-drawer-overlay')
        ];
    }
});
