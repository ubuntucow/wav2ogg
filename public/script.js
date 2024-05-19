const { createFFmpeg, fetchFile } = FFmpeg;
const ffmpeg = createFFmpeg({ log: true });
const upload = document.getElementById("upload");
const dropContainer = document.getElementById("dropContainer");
const wavRegex = /^\S+\.wav$/;
dropContainer.ondragover = dropContainer.ondragenter = function (evt) {
  evt.preventDefault();
};

dropContainer.ondrop = function (evt) {
  evt.preventDefault();
  // const thefile = ;
  // console.log(thefile);
  const myFile = evt.dataTransfer.files.item(0);
  // console.log(myFile);
  if (!wavRegex.test(myFile.name)) {
    return alert("Must upload a single .WAV file!");
  }
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(myFile);
  upload.files = dataTransfer.files;

  // If you want to use some of the dropped files
  // const dT = new DataTransfer();
  // dT.items.add(evt.dataTransfer.files[0]);
  // dT.items.add(evt.dataTransfer.files[3]);
  // fileInput.files = dT.files;
};

document.getElementById("convert").addEventListener("click", async () => {
  if (upload.files.length === 0) {
    alert("Please upload a WAV file first.");
    return;
  }

  const file = upload.files[0];

  // Load ffmpeg.wasm
  await ffmpeg.load();

  // Write the file to the virtual file system
  ffmpeg.FS("writeFile", "input.wav", await fetchFile(file));

  // Run the ffmpeg command to convert the file
  await ffmpeg.run("-i", "input.wav", "output.ogg");

  // Read the result
  const data = ffmpeg.FS("readFile", "output.ogg");

  // Create a Blob from the output data
  const blob = new Blob([data.buffer], { type: "audio/ogg" });
  const url = URL.createObjectURL(blob);

  // Create a download link
  const downloadLink = document.getElementById("download");
  downloadLink.href = url;
  downloadLink.download = "output.ogg";
  downloadLink.style.display = "block";
  downloadLink.textContent = "Download OGG";
  downloadLink.click();
});

upload.onchange = () => {
  // alert("ASDDDDDDDDDD");
  const name = upload.value.replace(/.*[\/\\]/, "");
  // alert(name);
  if (!wavRegex.test(name)) {
    upload.value = "";
    return alert("Must upload a .WAV file!");
  }
  document.getElementById("state").innerText = name;
};

dropContainer.onclick = () => upload.click();
