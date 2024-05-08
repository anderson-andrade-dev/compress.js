"use strict";

import Compress from "./compress.min.js";

window.onload = (async function () {
  const compressor = new Compress();

  const crop = document.getElementById("crop");
  const maxWidth = document.getElementById("maxWidth");
  const maxHeight = document.getElementById("maxHeight");
  const upload = document.getElementById("upload");
  const before = document.getElementById("before");
  const after = document.getElementById("after");
  const beforeOutput = document.getElementById("before-output");
  const afterOutput = document.getElementById("after-output");

  maxWidth.addEventListener("change", render, false);
  maxHeight.addEventListener("change", render, false);
  crop.addEventListener("change", render, false);

  const byteValueNumberFormatter = Intl.NumberFormat("en", {
    notation: "compact",
    style: "unit",
    unit: "byte",
    unitDisplay: "narrow",
  });

  let state = {};
  upload.addEventListener(
    "change",
    async function (evt) {
      state.file = evt.target.files[0];
      render();
    },
    false
  );

  async function render() {
    const file = state.file;
    before.src = URL.createObjectURL(file);
    before.onload = function () {
      beforeOutput.innerText = `Name: ${file.name}
Size: ${byteValueNumberFormatter.format(file.size)}
Type: ${file.type}
Last Modified: ${new Date(file.lastModified).toLocaleString()}
Shape: ${before.naturalWidth}x${before.naturalHeight}px`;
    };

    const newFile = await compressor.compress(file, {
      quality: 0.95,
      crop: crop.checked,
      maxWidth: maxWidth.valueAsNumber,
      maxHeight: maxHeight.valueAsNumber,
    });

    console.log({ newFile });

    after.src = URL.createObjectURL(newFile);
    after.onload = function () {
      afterOutput.innerText = `Name: ${newFile.name}
Size: ${byteValueNumberFormatter.format(newFile.size)}
Type: ${newFile.type}
Last Modified: ${new Date(newFile.lastModified).toLocaleString()}
Shape: ${after.naturalWidth}x${after.naturalHeight}px`;
    };
  }
})();
