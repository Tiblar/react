import React from "react";

function Audio() {

    return (
      <>
          <audio id="messageAudio">
              <source src="./element/media/message.ogg" type="audio/ogg" />
              <source src="./element/media/message.mp3" type="audio/mpeg" />
          </audio>
          <audio id="ringAudio" loop>
              <source src="./element/media/ring.ogg" type="audio/ogg" />
              <source src="./element/media/ring.mp3" type="audio/mpeg" />
          </audio>
          <audio id="ringbackAudio" loop>
              <source src="./element/media/ringback.ogg" type="audio/ogg" />
              <source src="./element/media/ringback.mp3" type="audio/mpeg" />
          </audio>
          <audio id="callendAudio">
              <source src="./element/media/callend.ogg" type="audio/ogg" />
              <source src="./element/media/callend.mp3" type="audio/mpeg" />
          </audio>
          <audio id="busyAudio">
              <source src="./element/media/busy.ogg" type="audio/ogg" />
              <source src="./element/media/busy.mp3" type="audio/mpeg" />
          </audio>
      </>
    );
}

export default Audio;
