function getUser() {
    var user = Discourse.User.current();
    if (!user) {
        user = {
            get(key) {
                switch (key) {
                    case 'navbar_background':
                        return settings.sidebar_userinfo_background_default;
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
                : settings.sidebar_userinfo_background_default));
    }
    return user;
}