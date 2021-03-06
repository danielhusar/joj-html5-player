(function (window, document) {
  'use strict';

  // config
  var baseUrl = 'http://b.static.joj.sk/uploads/tx_media/archiv/';
  var proxy = 'http://darkland.sk/proxy/includes/process.php?action=update';
  var proxyInput = 'u';
  // 360|540|720
  var defaultQuality = '360';
  var playerHolder = document.querySelector('.player');

  /**
   * Get the stream
   * @param  {Function} cb
   * @return {void}
   */
  function getStream(cb) {
    var poster = playerHolder.dataset.poster;
    var pageid = playerHolder.dataset.pageid;
    var id = playerHolder.dataset.id;
    var url = window.location.origin + '/services/Video.php?clip=' + id + '&pageId=' + pageid;

    request('GET', url, '', function (xml) {
      var videoUrl = parseXml(xml);
      if (videoUrl) {
        cb(videoUrl, poster);
      } else {
        // request('POST', proxy, proxyInput + '=' + url, function (xml) {
        //   var videoUrl = parseXml(xml);
        //   if (videoUrl) {
        //     cb(videoUrl, poster);
        //   }
        // });
      }
    });
  }

  /**
   * Simple xhr request abstraction
   * @param  {string}   type   GET|POST
   * @param  {string}   url
   * @param  {string}   params
   * @param  {Function} cb
   * @return {void}
   */
  function request(type, url, params, cb) {
    var xhr = new window.XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        cb(xhr.responseText);
      } else {
        cb(null);
      }
    };
    xhr.send(params);
  }

  /**
   * Parse the xml and find stream
   * @param  {string} xml
   * @return {string}
   */
  function parseXml(xml) {
    xml = (new window.DOMParser()).parseFromString(xml, 'text/xml');
    var videoUrl = xml.querySelector('[label="' + defaultQuality + 'p"]');
    return videoUrl ? baseUrl + videoUrl.getAttribute('path').replace(/^dat\/joj\/archiv\//, '') : false;
  }

  // init
  getStream(function (stream, poster) {
    playerHolder.removeChild(document.querySelector('.well'));
    playerHolder.style.background = 'transparent';

    var player = document.createElement('video');
    player.width = '640';
    player.height = '330';
    player.style.width = '100%';
    player.style.height = '100%';
    player.poster = poster;
    player.controls = 'controls';

    var source = document.createElement('source');
    source.src = stream;
    source.type = 'video/mp4';
    player.appendChild(source);

    playerHolder.appendChild(player);
  });
})(this, this.document);
