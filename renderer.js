const { ipcRenderer } = require('electron');

navigator.getUserMedia({video: false, audio: true}, (localMediaStream) => {
    const audioContext = new AudioContext(); // NEW!!
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(localMediaStream);
    const processor = audioContext.createScriptProcessor(2048, 1, 1);

    analyser.smoothingTimeConstant = 0.3;
    analyser.fftSize = 1024;

    microphone.connect(analyser);
    analyser.connect(processor);
    processor.connect(audioContext.destination);

    processor.onaudioprocess = () => {
        const array =  new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);

        let values = 0;
        const length = array.length;
        for (let i = 0; i < length; i++) {
            values += array[i];
        }

        const average = values / length;
        
        ipcRenderer.send('visualizer', average / 128);
    };
  }, () => {});