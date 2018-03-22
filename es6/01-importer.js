const avatarImg = require('discourse/widgets/post').avatarImg;
const DiscourseURL = require('discourse/lib/url').default;
const userPath = require('discourse/lib/url').userPath;
const wantsNewWindow = require('discourse/lib/intercept-click').wantsNewWindow;
const h = api.h;
const logout = require('discourse/lib/logout').default;

// notification
const RawHtml = require('discourse/widgets/raw-html').default;
const emojiUnescape = require('discourse/lib/text').emojiUnescape;
const postUrl = require('discourse/lib/utilities').postUrl;
const escapeExpression = require('discourse/lib/utilities').escapeExpression;
const formatUsername = require('discourse/lib/utilities').formatUsername;
const setTransientHeader = require('discourse/lib/ajax').setTransientHeader;
const iconNode = require('discourse-common/lib/icon-library').iconNode;

const loadTopicView = require('discourse/models/topic').loadTopicView;
const renderTag = require('discourse/lib/render-tag').default;
const renderTags = require('discourse/lib/render-tags').default;

