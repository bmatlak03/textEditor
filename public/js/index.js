const toolBtns = document.querySelectorAll("button.tool");
const saveBtn = document.querySelector("button.save");
const removeBtn = document.querySelector("button.remove");
const uploadFileInput = document.querySelector("input.file");
const editor = document.querySelector("div.editor");
const label = document.querySelector("label.option");
const toolbar = document.querySelector("div.toolbar");
const fileInfo = document.querySelector("p.fileInfo");

const formatText = (command, button) => {
  editor.focus();
  button.classList.toggle("active");
  document.execCommand(command, false, null);
};

const saveFile = async (e) => {
  e.preventDefault();
  const fileName = window.prompt("Filename: ", "document");
  if (fileName) {
    const content = editor.innerHTML;
    const data = {
      content,
      fileName,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    await fetch("/saving", options).then((response) => {
      response.json();
      if (response.status < 400) {
        alert("File successfully written!");
      } else {
        alert("Something went wrong!");
      }
    });
  } else {
    alert("Name the file !");
  }
};
const openFile = () => {
  if (uploadFileInput.files.length > 0) {
    const reader = new FileReader();
    console.log();
    const fileName = uploadFileInput.files[0].name;
    fileInfo.textContent = `Opened file: ${fileName}`;
    reader.addEventListener("load", function () {
      const result = JSON.parse(reader.result);
      label.classList.add("disabled");
      editor.innerHTML = result.content;
      uploadFileInput.disabled = true;
    });

    reader.readAsText(uploadFileInput.files[0]);
  }
};
const checkStyles = () => {
  const isBold = document.queryCommandState("bold");
  const isItalic = document.queryCommandState("italic");
  const isList = document.queryCommandState("insertUnOrderedList");
  document.designMode = "on";
  for (let button of toolBtns) {
    const command = button.dataset["command"];
    if (isBold && isItalic && command != "insertUnOrderedList") {
      button.classList.add("active");
    } else if (isBold && command == "bold") {
      button.classList.add("active");
    } else if (isItalic && command == "italic") {
      button.classList.add("active");
    } else if (isList && command == "insertUnOrderedList") {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
    if (editor.innerHTML == "") {
      console.log("cleaning editor");
      button.classList.remove("active");
      document.execCommand("removeFormat", false, null);
    }
  }

  document.designMode = "off";
};

const clear = () => {
  uploadFileInput.value = "";
  editor.innerHTML = "";
  fileInfo.textContent = "";
  uploadFileInput.disabled = false;
  label.classList.remove("disabled");
  for (let button of toolBtns) {
    button.classList.remove("active");
  }
};

for (let button of toolBtns) {
  const command = button.dataset["command"];
  button.addEventListener("click", () => formatText(command, button));
}
removeBtn.addEventListener("click", clear);
saveBtn.addEventListener("click", saveFile);
uploadFileInput.addEventListener("change", openFile);
editor.onmouseup = checkStyles;
editor.onkeyup = checkStyles;
