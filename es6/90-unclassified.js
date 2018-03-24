

// Widgets

{
    // Tabs
    // # toolbar -> mdmenu/navbar
    // Notifcation - PrivMsg - Bookmark

    const BOOKMARK_TYPE = 3;
    const PRIVATE_MESSAGE_TYPE = 6;

    const GLOBAL_ENTRY_LIMIT = 3;
    const NETWORK_ENTRY_LIMIT = GLOBAL_ENTRY_LIMIT + 1;
    const TAB_NAMES = {
        notifications: '通知',
        privmsgs: '私信',
        bookmarks: '书签'
    };
    const tab_header_tagNames = {
        notifications: 'a#md-tab-header-notifications.subheader.tab-header',
        privmsgs: 'a#md-tab-header-privmsgs.subheader.tab-header',
        bookmarks: 'a#md-tab-header-bookmarks.subheader.tab-header'
    };

    function truncateToLimit(content, limit) {
        if (content && (content.length > limit)) {
            return content.slice(0, limit);
        } else {
            return content;
        }
    }

    api.createWidget('mdmenu-tab-content', {
        tagName: 'div.tab-content.initial',
        buildClasses: (attrs) => `tab-content-${attrs.type} ${attrs.type}`,
        buildKey: (attrs) => `tab-content-${attrs.type}`,
        buildAttributes: (attrs) => attrs.hide ? {style: 'display: none;'} : {},

        defaultState() {
            return {
                entries: [],
                loading: false,
                loaded: false
            };
        },
        
        notificationsChanged() {
            this.refreshNotifications(this.state);
        },

        clearLoadingFlags() {
            this.state.loading = false;
            this.state.loaded = true;
            this.scheduleRerender();
        },

        doFilter(iterable) {
            if (iterable && this.attrs.type === 'privmsgs') {
                return iterable.filter((x) => x.notification_type === PRIVATE_MESSAGE_TYPE);
            } else {
                return iterable;
            }
        },

        loadBookmarks(state) {
            const user = getUser();
            const ajax = require('discourse/lib/ajax').ajax;
            ajax(
                `/user_actions.json?username=${user.get('username')}&filter=${BOOKMARK_TYPE}&offset=0`
            ).then(result => {
                state.entries = truncateToLimit(result.user_actions, NETWORK_ENTRY_LIMIT);
            }).catch((err) => {
                state.entries = [];
            }).finally(() => {
                this.clearLoadingFlags()
            });
            state.loading = true;
        },

        loadNotifications(state) {
            const type = this.attrs.type;
            const stale = this.store.findStale('notification', {
                offset: 0
            }, {
                cacheKey: 'recent-${type}'
            });

            if (stale.hasResults) {
                let content = this.doFilter(stale.results.get('content'));

                // we have to truncate to limit, otherwise we will render too much
                state.entries = truncateToLimit(content, NETWORK_ENTRY_LIMIT);
            } else {
                state.loading = true;
            }

            stale.refresh().then(notifications => {
                if (type === 'notifications') {
                    const unread = notifications.get('content').filter((x)=>!x.read).length;
                    this.currentUser.set('unread_notifications', unread);
                } else if (type === 'privmsgs') {
                    const unread = this.doFilter(notifications.get('content')).filter((x)=>!x.read).length;
                    this.currentUser.set('unread_private_messages', unread);
                }
                state.entries = truncateToLimit(this.doFilter(notifications.get('content')), NETWORK_ENTRY_LIMIT);
            }).catch((err) => {
                state.entries = [];
            }).finally(() => {
                this.clearLoadingFlags();
            });
        },

        refreshNotifications(state) {
            const type = this.attrs.type;

            if (this.loading) {
                return;
            }

            if (type === 'bookmarks') {
                this.loadBookmarks(state);
            } else {
                this.loadNotifications(state);
            }
        },

        html(attr, state) {
            if (attr.hide) {
                return [];
            }
            const type = attr.type;
            const user = getUser();
            if (!state.loaded) {
                this.refreshNotifications(state);
            }

            const result = [];

            if (state.loading) {
                result.push(h('div.spinner-container', api.h('div.spinner')));
            } else if (state.entries.length === 0 || state.entries.length) {
                const notificationItems = truncateToLimit(state.entries, GLOBAL_ENTRY_LIMIT).map(n => {
                    if (type === 'bookmarks') {
                        return this.attach('mdmenu-bookmark-item', n);
                    } else {
                        return this.attach('mdmenu-notification-item', n);
                    }
                });
                result.push(notificationItems);
                
                const linkTarget = {
                    notifications: `/u/${user.get('username')}/notifications`,
                    privmsgs: `/u/${user.get('username')}/messages`,
                    bookmarks: `/u/${user.get('username')}/activity/bookmarks`
                }
                if (state.entries.length <= GLOBAL_ENTRY_LIMIT) {
                    if (false) { //comment
                        result.push(api.h(`a.md-entry.initial.no-more.${type}`, [
                            mdIcon('check'),
                            `没有更多${TAB_NAMES[type]}`
                        ]));
                    }
                    result.push(mdEntry(linkTarget[type], 'check', `没有更多${TAB_NAMES[type]}`));
                } else {
                    result.push(mdEntry(linkTarget[type], 'dots-horizontal', `查看全部${TAB_NAMES[type]}`));
                }
            }

            return result;
        }
    });

    api.createWidget('mdmenu-tabs', {
        tagName: 'div.tabs',
        buildKey: () => 'mdmenu-tabs',
        defaultState() {
            return {
                active: 'notifications',
                'initial-notifications': true,
                'initial-privmsgs': true,
                'initial-bookmarks':true
            };
        },
        html(attr, state) {
            function getUnread(x) {
                const user = getUser();
                if (user.get(x)) {
                    return `（${user.get(x)}）`;
                } else {
                    return '';
                }
            }

            const tab_header_labels = {
                notifications: `${TAB_NAMES['notifications']}${getUnread('unread_notifications')}`,
                privmsgs: `${TAB_NAMES['privmsgs']}${getUnread('unread_private_messages')}`,
                bookmarks: TAB_NAMES['bookmarks']
            }
            let tab_headers = api.h('div.md-tab-headers', [
                'notifications', 'privmsgs', 'bookmarks'
            ].map(function(x) {
                const initial = state[`initial-${x}`]?'.initial':'';
                const active = (state.active === x)?'.active':'';
                return api.h(tab_header_tagNames[x] +
                        active+initial, tab_header_labels[x]
                );
            }));
            return [
                tab_headers,
                ['notifications', 'privmsgs', 'bookmarks'].map((type) => {
                    return this.attach('mdmenu-tab-content', {
                        type: type,
                        hide: type!==state.active
                    })
                })
            ]
        },

        click(e) {
            if (e && e.target.id.startsWith('md-tab-header-')) {
                this.state.active = e.target.id.replace('md-tab-header-', '');
                this.state[`initial-${this.state.active}`] = false;
                return false;
            } else {
                return true;
            }
        }
    });
}

{
    // toolbar -> mdmenu/navbar -> tabs -> bookmarks
    api.createWidget('mdmenu-bookmark-item', {
        tagName: 'a.md-entry.initial',
        buildAttributes(attr) {
            const url = `/t/topic/${attr.topic_id}/${attr.post_number}`
            return {
                href: url,
                'data-auto-route': 'true'
            }
        },
        html(attr) {
            return [mdIcon('bookmark'), attr.title];
        },
        click: aClickHandler
    });
}

{
    // toolbar -> mdmenu/navbar -> tabs -> notifications|privmsgs
    const LIKED_TYPE = 5;
    const INVITED_TYPE = 8;
    const GROUP_SUMMARY_TYPE = 16;

    api.createWidget('mdmenu-notification-item', {
        tagName: 'a.md-entry.initial',

        buildClasses(attrs) {
            const classNames = [];
            if (attrs.get('read')) {
                classNames.push('read');
            }
            if (attrs.is_warning) {
                classNames.push('is-warning');
            }
            return classNames;
        },
        url() {
            const attrs = this.attrs;
            const data = attrs.data;
            const badgeId = data.badge_id;
            if (badgeId) {
                let badgeSlug = data.badge_slug;

                if (!badgeSlug) {
                    const badgeName = data.badge_name;
                    badgeSlug = badgeName.replace(/[^A-Za-z0-9_]+/g,
                        '-').toLowerCase();
                }

                let username = data.username;
                username = username ? "?username=" + username.toLowerCase() :
                    "";
                return Discourse.getURL('/badges/' + badgeId + '/' +
                    badgeSlug + username);
            }

            const topicId = attrs.topic_id;

            if (topicId) {
                return postUrl(attrs.slug, topicId, attrs.post_number);
            }

            if (attrs.notification_type === INVITED_TYPE) {
                return userPath(data.display_username);
            }

            if (data.group_id) {
                return userPath(data.username + '/messages/group/' +
                    data.group_name);
            }
        },

        description() {
            const data = this.attrs.data;
            const badgeName = data.badge_name;
            if (badgeName) {
                return escapeExpression(badgeName);
            }

            if (this.attrs.fancy_title) {
                return this.attrs.fancy_title;
            }

            const title = data.topic_title;
            return Ember.isEmpty(title) ? "" : escapeExpression(title);
        },

        text(notificationType, notName) {
            const {
                attrs
            } = this;
            const data = attrs.data;
            const scope = (notName === 'custom') ? data.message :
                `notifications.${notName}`;

            if (notificationType === GROUP_SUMMARY_TYPE) {
                const count = data.inbox_count;
                const group_name = data.group_name;
                return I18n.t(scope, {
                    count,
                    group_name
                });
            }

            const username = formatUsername(data.display_username);
            const description = this.description();
            if (notificationType === LIKED_TYPE && data.count > 1) {
                const count = data.count - 2;
                const username2 = formatUsername(data.username2);
                if (count === 0) {
                    return I18n.t('notifications.liked_2', {
                        description,
                        username,
                        username2
                    });
                } else {
                    return I18n.t('notifications.liked_many', {
                        description,
                        username,
                        username2,
                        count
                    });
                }
            }
            return I18n.t(scope, {
                description,
                username
            });
        },

        info(attrs) {
            const notificationType = attrs.notification_type;
            const lookup = this.site.get('notificationLookup');
            const notName = lookup[notificationType];
            let {
                data
            } = attrs;
            let infoKey = notName === 'custom' ? data.message : notName;
            let text = emojiUnescape(this.text(notificationType,
                notName));
            let title = I18n.t(`notifications.alt.${infoKey}`);
            return {
                infoKey,
                notName,
                text,
                title
            }
        },

        buildAttributes(attrs) {
            const info = this.info(attrs);
            const href = this.url();
            return href ? {
                href: href,
                title: info.title,
                'data-auto-route': 'true'
            } : {};
        },
        html(attrs) {
            const info = this.info(attrs);
            // TODO: find replacements for 'at' and 'hand-pointing-right'
            const REPLACEMENTS = {
                'mentioned': "at",
                'group_mentioned': "at",
                'quoted': "format-quote-close",
                'replied': "reply",
                'posted': "reply",
                'edited': "pencil",
                'liked': "heart",
                'liked_2': "heart",
                'liked_many': "heart",
                'private_message': "email",
                'invited_to_private_message': "email",
                'invited_to_topic': "hand-pointing-right",
                'invitee_accepted': "account",
                'moved_post': "logout",
                'linked': "link",
                'granted_badge': "certificate",
                'topic_reminder': "hand-pointing-right",
                'watching_first_post': "radiobox-marked",
                'group_message_summary': "account-multiple"
            };
            const r = function(dname) {
                if (REPLACEMENTS[dname]) {
                    return REPLACEMENTS[dname];
                } else {
                    return dname;
                }
            }
            //const icon = api.h('i.material-icons.md-24.md-dark', {
            //    title: info.title
            //}, r(info.infoKey));
            const icon = mdIcon(r(info.infoKey))
            // We can use a `<p>` tag here once other languages have fixed their HTML
            // translations.
            let html = new RawHtml({
                html: `<span>${info.text}</span>`
            });

            return [icon, html];
        },
        
        click(e) {
            const id = this.attrs.id;
            const ajax = require('discourse/lib/ajax').ajax;
            ajax('/notifications/mark-read', { method: 'PUT', data: { id: id } }).then(()=>{
                this.sendWidgetAction('notificationsChanged');
            });
            this.attrs.set('read', true);
            setTransientHeader("Discourse-Clear-Notifications", id);
            if (document && document.cookie) {
                document.cookie =
                    `cn=${id}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
            }
            
            
            if (wantsNewWindow(e)) {
                return;
            }
            e.preventDefault();
            this.sendWidgetEvent('linkClicked');
            DiscourseURL.routeTo(this.url());
        }
    });
}


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
                    title: "桌面设备页面"
                };
            } else {
                sv = {
                    mode: 1,
                    icon: "cellphone",
                    title: "移动设备页面"
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

api.createWidget('mdnavbar-categories', {
    tagName: 'div#categories',
    categories() {
        const site = this.site;
        let result = [];
        // add category entries
		for (var i = 0; i < site.categories.length - 1; i++) {
		    result.push(api.h('a.md-entry.initial', {
		        href: site.categories[i].get('url'),
		        'data-auto-route': 'true'
		    }, [
		        api.h('div.list-icon', {
                    style: {
                        'background-color': `#${site.categories[i].get('color')}`
                    }
                }),
		        api.h('span', site.categories[i].get('name'))
            ]));
		}
		return result;
    },
    html() {
        return [
            api.h('span.subheader', '分区'),
            this.categories()
        ];
    },
    click: aClickHandler
});
