export default () => {
  let mediaRecorder;
  let chunks;
  let blob;
  let resolveWithData;

  const receiveChunk = ({ data }) => {
    console.log('receiveChunk', data.size);
    chunks.push(data);
  };

  const getData = () => {
    return new Promise(resolve => {
      resolveWithData = resolve;
    });
  };

  const processData = () => {
    console.log('process data');
    if (chunks.length === 1) {
      blob = chunks[0];
    } else {
      blob = new Blob(chunks, { type: 'audio/ogg' });
    }

    resolveWithData(blob);
  };

  const start = stream => {
    chunks = [];

    mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorder.start();

    mediaRecorder.addEventListener('stop', processData);
    mediaRecorder.addEventListener('dataavailable', receiveChunk);
  };

  const stop = () => {
    console.log('stop recording', chunks.length);
    mediaRecorder.stop();
  };

  // Request mic access
  navigator.mediaDevices
    .getUserMedia({ audio: true, video: false })
    .then(start);

  return {
    stop,
    getData,
  };
};
