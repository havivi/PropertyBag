(function () {
  'use strict';

  // define factory
  angular.module('common').factory('logger',
    ['$log', 'config', logger]);

  // create factory
  function logger($log, config) {
    var service = {
      log: log,
      logError: logError,
      logSuccess: logSuccess,
      logWarning: logWarning
    };

    return service;

    // #region public members
    function log(message, data, source, showNotification) {
      writeLog(message, data, source, showNotification, "info");
    }

    function logError(message, data, source, showNotification) {
      writeLog(message, data, source, showNotification, "error");
    }

    function logSuccess(message, data, source, showNotification) {
      writeLog(message, data, source, showNotification, "success");
    }

    function logWarning(message, data, source, showNotification) {
      writeLog(message, data, source, showNotification, "warning");
    }
    // #endregion

    // #region private members
    // universal method for writing notifications
    function writeLog(message, data, source, showNotification, notificationType) {
      var iconUrl, notiTitle;
      showNotification = showNotification !== undefined
        ? showNotification
        : true;

      // write to angular log, & specify error if it is an error
      var write = (notificationType === 'error') ? $log.error : $log.log;
      source = source ? '[' + source + '] ' : '';
      write(source, message, data);

      if (showNotification) {
        if (notificationType === 'info') {
          // if informational messages not specified to be shown, stop
          if (!config.showDebugNotiSetting) {
            return;
          } else {
            iconUrl = "images/info.png";
            notiTitle = "Property Bag: DEBUG LOG";
          }
        } else if (notificationType === 'error') {
          iconUrl = "images/error.png";
          notiTitle = "Property Bag: ERROR";
        } else if (notificationType === 'warning') {
          iconUrl = "images/warning.png";
          notiTitle = "Property Bag: WARNING";
        } else if (notificationType === 'success') {
          iconUrl = "images/success.png";
          notiTitle = "Property Bag";
        }

        // create sharepoint notification
        var notificationData = new SPStatusNotificationData("", STSHtmlEncode(message), iconUrl, null);
        var notification = new SPNotification(SPNotifications.ContainerID.Status, STSHtmlEncode(notiTitle), false, null, null, notificationData);

        // show sharepoint notification tile
        notification.Show(false);
      }
    }
    // #endregion
  }
})();