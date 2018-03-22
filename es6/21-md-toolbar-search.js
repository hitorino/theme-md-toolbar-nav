
api.createWidget('md-toolbar-search', _.extend({}, {
    tagName: 'form.md-search.mdmaintoolbar.center',
    buildAttributes() {
        return {
            action: '/search',
            method: 'GET'
        }
    },
    html(attr, state) {
        if (!globalState.get('showSearchbar')) {
            return false
        }
        return [
            api.h('input#input-box.toolbar-title.center', {
                name: 'q',
                type: 'text',
                placeholder: '搜索 hitorino'
            }, [])
        ];
    },
}, MainToolbarTemplate));