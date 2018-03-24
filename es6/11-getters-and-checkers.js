function getCurrentPath() {
    return globalState.get('currentPath')
}

function isSpecialTopicList() {
    const path = getCurrentPath()
    if (path === '/') return true
    return !!_.find(Discourse.Site.current().get('top_menu_items'),
        (item)=>(`/${item}` === path))
}

function isTopicList() {    
    const path = getCurrentPath()
    return isSpecialTopicList() || path.startsWith('/c/')||path.startsWith('/tags/')
}

function isTopic() {
    const path = getCurrentPath()
    return !!path.startsWith('/t/')
}

function getCurrentToolbar() {
    if (globalState.get('showSearchbar')) {
        return 'search'
    } else if (isTopicList()) {
        return 'topic-list'
    } else if (isTopic()) {
        return 'topic'
    }
}

globalState.set('currentToolbar',getCurrentToolbar())
globalState.addObserver('currentPath', function() {
    globalState.set('currentToolbar', getCurrentToolbar())
})
globalState.addObserver('showSearchbar', function() {
    globalState.set('currentToolbar', getCurrentToolbar())
})


function getCategoryNameBySlug(slug) {
    const site = Discourse.Site.current()
    try {
        return _.find(site.categories, function(c) {
            return (c.get('slug') && c.get('slug') === slug)
        }).get('name')
    } catch (e) {
        return '未命名'
    }
}

function getTitle() {    
    let path = getCurrentPath()
    if (isSpecialTopicList()) {
        if (path === '/') {
            path = '/latest'
        }
        return I18n.t(`filters${path.replace('/','.')}.title`)
    }
    const regexpCategory = /^\/c\/([^\/]+)/
    const regexpCategoryTag = /^\/tags\/c\/([^\/]+)\/([^\/]+)/
    const regexpTag = /^\/tags\/([^\/]+)/
    let mo = path.match(regexpCategoryTag)
    if (!!mo) {
        return `${getCategoryNameBySlug(mo[1])} - ${mo[2]}`
    }
    mo = path.match(regexpCategory)
    if (!!mo) {
        return getCategoryNameBySlug(mo[1]);
    } else {
        console.log(mo);
    }
    mo = path.match(regexpTag)
    if (!!mo) {
        return mo[1];
    }
    return undefined
}

function getUser() {
    var user = Discourse.User.current();
    const navbar_background_default = "https://forum.hitorino.moe/uploads/default/original/1X/6e3efd0a3b368ef708e1b70c550359f01f701f50.png";
    if (!user) {
        user = {
            get(key) {
                switch (key) {
                    case 'navbar_background':
                        return navbar_background_default;
                    case 'username':
                        return 'hitorino';
                    case 'name':
                        return '未登录';
                    case 'unread_notifications':
                    case 'unread_private_messages':
                        return 0;
                    case 'anonymous?':
                        return true;
                    default:
                        return '';
                }
            }
        }
    } else {
        user.set('navbar_background',
            (user.get('profile_background')
                ? user.get('profile_background')
                : navbar_background_default));
    }
    return user;
}