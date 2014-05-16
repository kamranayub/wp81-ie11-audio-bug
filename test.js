
(function () {

   var audioElements = [];
   var loadedAudio;
   var path = "jump.mp3";
   var index = 0;
   var lastlog = 0;

   function log() {
      var args = Array.prototype.slice.call(arguments),
          now = new Date().getTime();

      args.push("+" + (now - lastlog).toString() + "ms");

      var el = document.createElement('div');
      el.innerHTML = args.join(" ");
      document.getElementById('log').appendChild(el);
      document.getElementById('log').scrollTop = document.getElementById('log').scrollHeight;
      lastlog = now;
   }

   function load() {

      for (var i = 0; i < 5; i++) {
         //create track
         audioElements.push(new Audio());
      }

      var request = new XMLHttpRequest();
      request.open("GET", path, true);
      request.responseType = 'blob';
      request.onload = function (e) {
         if (request.status !== 200) {
            console.log("Failed to load audio resource ", path, " server responded with error code", request.status);
            return;
         }

         loadedAudio = URL.createObjectURL(request.response);
         audioElements.forEach(function (a, i) {
            a.actualIndex = i;
            a.addEventListener('loadstart', function () {
               log("[loadstart] track", this.actualIndex);
            });
            a.addEventListener('loadeddata', function () {
               log("[loadeddata] track", this.actualIndex);
            });
            a.addEventListener('loadedmetadata', function () {
               log("[loadedmetadata] track", this.actualIndex);
            });
            a.addEventListener('play', function () {
               log("[play] track", this.actualIndex);
            });
            a.addEventListener('playing', function () {
               log("[playing] track", this.actualIndex);
            });
            a.addEventListener('ended', function () {
               log("[ended] track", this.actualIndex);
            });
            a.addEventListener('pause', function () {
               log("[pause] track", this.actualIndex);
            });
            a.preload = 'auto';
            a.src = loadedAudio;
            a.load();
         });
         document.getElementById('play').disabled = false;
      };
      request.send();
   }

   function play() {
      var audioElement = audioElements[index];

      log("Calling load on track", audioElement.actualIndex);
      audioElement.load();
      log("Calling play on track", audioElement.actualIndex);
      audioElement.play();

      index = (index + 1) % audioElements.length;
   }

   document.getElementById('load').addEventListener('click', load);
   document.getElementById('play').addEventListener('click', play);
})();
