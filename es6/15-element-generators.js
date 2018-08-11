replaceIcon('settings', 'cog');
replaceIcon('cellphone', 'mobile');

function mdIcon (icon, isLight = false) {
    //api.h('i.material-icons.md-24.md-'+(isLight?'light':'dark'), icon)
    //return api.h(`i.material-icons.mdi.mdi-${icon.replace('_','-')}.md-24.md-${(isLight?'light':'dark')}`)
    return renderIcon('node', icon, {
        class: 'material-icons md-24 md-' + (isLight?'light':'dark')
    });
}

function mdEntry (link, icon, text, count = 0, isExternalLink = false) {
    let countSpan = undefined;
    if (count) {
        countSpan = api.h('span.count', `${count}`)
    }
    return api.h('a.md-entry.initial', {
        href: link,
        'data-auto-route': `${!isExternalLink}`
    }, [
        mdIcon(icon),
        api.h('span', text),
        countSpan
    ]);
};
