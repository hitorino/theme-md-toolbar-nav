api.createWidget('md-toolbar-topic', _.extend({}, {
    tagName: 'div.for-topic.mdmaintoolbar.left.md-title',
    
    html(attr, state) {
        const controller = this.register.lookup('controller:topic')
        const model = controller.get('model')
        const title = model.get('unicode_title') || model.get('title')
        const tags = model.tags;
        const isPrivateMessage = model.get('isPrivateMessage');
        const tagsHtml = tags.map((tag) => {
            return new RawHtml({
                html: renderTag(tag, { isPrivateMessage })
            })
        })
        return [
                api.h('span', title),
                tagsHtml
        ];
    }
}, MainToolbarTemplate));
