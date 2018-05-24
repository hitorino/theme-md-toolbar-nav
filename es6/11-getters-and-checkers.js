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