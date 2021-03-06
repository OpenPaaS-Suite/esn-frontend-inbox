'use strict';

require('./make-selectable.js');
require('../../services.js');

angular.module('linagora.esn.unifiedinbox')

  .run(function(jmapDraft, inboxMakeSelectable, inboxMailboxesService, emailSendingService) {
    Object.defineProperties(jmapDraft.Message.prototype, {
      isUnread: {
        configurable: true,
        get: function() { return this._isUnread; },
        set: function(isUnread) {
          if (this._isUnread !== isUnread) {
            if (angular.isDefined(this._isUnread)) {
              inboxMailboxesService.flagIsUnreadChanged(this, isUnread);
            }

            this._isUnread = isUnread;
          }
        }
      },
      hasReplyAll: {
        enumerable: true,
        configurable: true,
        get: function() {
          return emailSendingService.showReplyAllButton(this);
        }
      }
    });

    inboxMakeSelectable(jmapDraft.Message.prototype);
  });
