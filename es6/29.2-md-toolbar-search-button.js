{
    api.createWidget('md-toolbar-search-button', {
        tagName: 'div#search-button.md-button.right',
        buildClasses() {
            if (globalState.get('showSearchbar')) {
                return ['active'];
            } else {
                return [];
            }
        },
        html() {
            globalState.addObserver('showSearchbar', ()=>{
                this.scheduleRerender();
            });
            if (!globalState.get('showSearchbar')) {
                return mdIcon('magnify');
            } else {
                return mdIcon('close');
            }
        },

        click: clickActionHandler,
        clickAction(e) {
            if (globalState.get('showSearchbar')) {
                $('.md-toolbar form.md-search').fadeOut(250, ()=> {
                    globalState.set('showSearchbar', false);
                });
            } else {
                globalState.set('showSearchbar', true);
            }
            return false;
        }
    });
}