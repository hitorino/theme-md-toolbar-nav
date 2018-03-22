api.createWidget('md-toolbar-topic-list', _.extend({}, {
    tagName: 'div.for-topic-list.mdmaintoolbar.md-title.left',
    
    html(attr, state) {
        return [
                api.h('span', getTitle())
        ];
    }
}, MainToolbarTemplate));