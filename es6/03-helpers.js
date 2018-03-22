function extendWidget(superName, subName, opts) {
    return api.createWidget(subName, _.extends({}, opts, api.reopenWidget(superName, {})));
}


function aClickHandler(e) {
    if (!e) {
        return true;
    }
    
    if (e.target.tagName === 'a' && e.target.getAttribute('data-auto-route') ===
        'true') {
        e.preventDefault();
        DiscourseURL.routeTo(e.target.getAttribute('href'));
        return false;
    }
    return true;
}

function clickActionHandler(e) {
    if (!e) {
        return true;
    } else if ($(e.target).is(`${this.tagName}, ${this.tagName} *`)) {
        e.preventDefault();
        return this.clickAction(e);
    } else {
        return aClickHandler(e);
    }
}

if (Discourse.User.current()) {
    Discourse.User.current().findDetails();
}


window.onMDNavDrawerToggled = function(isOpen) {};