'use strict';

require('../config/config.js');
require('../jmap-client-wrapper/jmap-client-wrapper.service.js');
require('../custom-role-mailbox/custom-role-mailbox.service.js');

angular.module('esn.inbox.libs')
  .service('jmapClientProvider', function($q, inboxConfig, jmapDraft, dollarHttpTransport, dollarQPromiseProvider, tokenAPI, inboxCustomRoleMailboxService) {
    let jmapClient;

    return {
      get
    };

    /////

    function _initializeJmapClient() {
      return $q.all([
        tokenAPI.getWebToken(),
        inboxConfig('api'),
        inboxConfig('downloadUrl')
      ]).then(function([{ data: jwt }, apiUrl, downloadUrl]) {
        jmapClient = new jmapDraft.Client(dollarHttpTransport, dollarQPromiseProvider)
          .withAPIUrl(apiUrl)
          .withDownloadUrl(downloadUrl)
          .withAuthenticationToken(`Bearer ${jwt}`)
          .withCustomMailboxRoles(inboxCustomRoleMailboxService.getAllRoles())
          .withJmapVersionHeader();

        return jmapClient;
      });
    }

    function get() {
      if (jmapClient) {
        return tokenAPI.getWebToken().then(({ data: jwt }) => jmapClient.withAuthenticationToken(`Bearer ${jwt}`));
      }

      return _initializeJmapClient();
    }
  });
