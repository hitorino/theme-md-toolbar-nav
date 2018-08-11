

// Widgets

{
    api.createWidget('mdnavbar-switchview', {
        tagName: 'a#switch-view.md-entry.initial',
        html() {
            const site = Discourse.Site.current();
            var sv = {};
            if (site.mobileView == true) {
                sv = {
                    mode: 0,
                    icon: "laptop",
                    title: I18n.t('desktop_view')
                };
            } else {
                sv = {
                    mode: 1,
                    icon: "cellphone",
                    title: I18n.t('mobile_view')
                };
            }
            return [
                mdIcon(sv.icon),
                api.h('span', sv.title)
            ];
        },
        click(e) {
            const Mobile = require('discourse/lib/mobile').default;
            e.stopPropagation();
            e.preventDefault();
            Mobile.toggleMobileView();
            return false
        }
    });
}

