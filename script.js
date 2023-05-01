const table = document.getElementById("table");
const thead = document.getElementById("table-head");
const tbody = document.querySelector("tbody");
const heading = document.querySelector("#heading");
const boldBtn = document.getElementById("bold-btn");
const underLineBtn = document.getElementById("underline-btn");
const italicsBtn = document.getElementById("italics-btn");
const textColorBtn = document.getElementById("text-color");
const backColorBtn = document.getElementById("back-color");
const leftBtn = document.getElementById("left-align");
const centreBtn = document.getElementById("centre");
const rigthBtn = document.getElementById("right-align");
const fontSize = document.getElementById("font-size");
const fontStyle = document.getElementById("font-style");
const cutBtn = document.getElementById("cut");
const pasteBtn = document.getElementById("paste");
const copyBtn = document.getElementById("copy");
const sheetContainer = document.querySelector(".add-sheets-container");
const addSheetBtn = document.querySelector(".add-sheet-btn");

var cutval = {};

const rows = 100;
const columns = 26;
var currCell;

let matrix = new Array(rows);
let numSheets = 1;
let arrMatrix = [matrix];
let currSheetNum = 1;

// arrMatric = [matrix1,matrix2,matrix3]

// 100X26

for (let i = 0; i < rows; i++) {
  matrix[i] = new Array(columns);
  for (let j = 0; j < columns; j++) {
    matrix[i][j] = {};
  }
}

for (let i = 0; i < columns; i++) {
  var th = document.createElement("th");
  th.innerText = String.fromCharCode(65 + i);
  thead.appendChild(th);
}

for (let row = 0; row < rows; row++) {
  var tr = document.createElement("tr");
  var th = document.createElement("th");
  th.innerText = row + 1;
  tr.appendChild(th);

  for (let col = 0; col < columns; col++) {
    var td = document.createElement("td");
    td.setAttribute("contentEditable", true);
    td.setAttribute("id", `${String.fromCharCode(65 + col)}${row + 1}`);
    td.addEventListener("focus", (event) => onFocusFnc(event));
    td.addEventListener("input", (event) => onInputFnc(event));
    tr.appendChild(td);
  }
  tbody.appendChild(tr);
}

function onInputFnc(event) {
  updateJson(event.target);
}

function onFocusFnc(event) {
  console.log("In Focus-", event.target.id);
  currCell = event.target;
  heading.value = event.target.id;
  console.log(getComputedStyle(currCell).color);
  fontSize.value = getComputedStyle(currCell).fontSize;
  fontStyle.value = getComputedStyle(currCell).fontFamily;
}

boldBtn.addEventListener("click", () => {
  if (currCell.style.fontWeight == "bold") {
    currCell.style.fontWeight = "normal";
  } else {
    currCell.style.fontWeight = "bold";
  }
  updateJson(currCell);
});

italicsBtn.addEventListener("click", () => {
  if (currCell.style.fontStyle == "italic") {
    currCell.style.fontStyle = "normal";
  } else {
    currCell.style.fontStyle = "italic";
  }
  updateJson(currCell);
});

underLineBtn.addEventListener("click", () => {
  if (currCell.style.textDecoration == "underline") {
    currCell.style.textDecoration = "none";
  } else {
    currCell.style.textDecoration = "underline";
  }
  updateJson(currCell);
});

textColorBtn.addEventListener("input", () => {
  currCell.style.color = textColorBtn.value;
  updateJson(currCell);
});

backColorBtn.addEventListener("input", () => {
  currCell.style.backgroundColor = backColorBtn.value;
  updateJson(currCell);
});

leftBtn.addEventListener("click", () => {
  currCell.style.textAlign = "left";
  updateJson(currCell);
});

rigthBtn.addEventListener("click", () => {
  currCell.style.textAlign = "right";
  updateJson(currCell);
});

centreBtn.addEventListener("click", () => {
  currCell.style.textAlign = "center";
  updateJson(currCell);
});

fontSize.addEventListener("change", () => {
  currCell.style.fontSize = fontSize.value;
  updateJson(currCell);
});

fontStyle.addEventListener("change", () => {
  currCell.style.fontFamily = fontStyle.value;
  updateJson(currCell);
});

cutBtn.addEventListener("click", () => {
  cutval = {
    style: currCell.style.cssText,
    text: currCell.innerText,
  };
  currCell.style.cssText = null;
  currCell.innerText = null;
  updateJson(currCell);
});

copyBtn.addEventListener("click", () => {
  cutval = {
    style: currCell.style.cssText,
    text: currCell.innerText,
  };
});

pasteBtn.addEventListener("click", () => {
  if (cutval.text == null) {
    return;
  }
  currCell.style.cssText = cutval.style;
  currCell.innerText = cutval.text;
  updateJson(currCell);
});

function updateJson(cell) {
  var json = {
    style: cell.style.cssText,
    text: cell.innerText,
    id: cell.id,
  };
  // update this json in my matrix
  var id = cell.id.split(""); //A1,A2,A3,A4

  var i = id[1] - 1;
  var j = id[0].charCodeAt(0) - 65;

  matrix[i][j] = json;
  const matrix2 = matrix;

  console.log("ArrMatrix", arrMatrix, currSheetNum);
}

function downloadJson() {
  // Define your JSON data

  // Convert JSON data to a string
  const jsonString = JSON.stringify(matrix);

  // Create a Blob with the JSON data and set its MIME type to application/json
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create an anchor element and set its href attribute to the Blob URL
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "data.json"; // Set the desired file name

  // Append the link to the document, click it to start the download, and remove it afterward
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

document.getElementById("jsonFile").addEventListener("change", readJsonFile);

function readJsonFile(event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const fileContent = e.target.result;

      // {id,style,text}
      // Parse the JSON file content and process the data
      try {
        const jsonData = JSON.parse(fileContent);
        console.log("matrix2", jsonData);
        matrix = jsonData;
        jsonData.forEach((row) => {
          row.forEach((cell) => {
            if (cell.id) {
              var myCell = document.getElementById(cell.id);
              myCell.innerText = cell.text;
              myCell.style.cssText = cell.style;
            }
          });
        });
        // Process the JSON data as needed
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      }
    };

    reader.readAsText(file);
  }
}



function addSheet() {
  console.log("hello");

  if (numSheets == 1) {
    var myArr = [matrix];
    localStorage.setItem("ArrMatrix", JSON.stringify(myArr));
    console.log(myArr);
    // sheetContainer.innerHTML += `
    // <div style="text-decoration: underline;" onclick='sheetSelect(0)'>Sheet1</div>
  
    // `;
    numSheets++;
    currSheetNum = numSheets;
    return;
  } else {
    console.log('sheets',numSheets);
    var localStorageArr = JSON.parse(localStorage.getItem("ArrMatrix"));
    var myArr = [...localStorageArr, matrix];
    localStorage.setItem("ArrMatrix", JSON.stringify(myArr));
    sheetContainer.innerHTML += `
    <div style="text-decoration: underline; cursor: pointer;" onclick='sheetSelect(${numSheets-1})'>Sheet${numSheets}</div>
  
    `;
  }


  numSheets++;
  currSheetNum = numSheets;
  // Emptying our matrix
  for (let i = 0; i < rows; i++) {
    matrix[i] = new Array(columns);
    for (let j = 0; j < columns; j++) {
      matrix[i][j] = {};
    }
  }

  // Emptying body and creating table again
  tbody.innerHTML = ``;
  for (let row = 0; row < rows; row++) {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    th.innerText = row + 1;
    tr.appendChild(th);

    for (let col = 0; col < columns; col++) {
      let td = document.createElement("td");
      td.setAttribute("contenteditable", "true");
      td.setAttribute("spellcheck", "false");
      td.setAttribute("id", `${String.fromCharCode(65 + col)}${row + 1}`);
      td.addEventListener("focus", (event) => onFocusFnc(event));
      td.addEventListener("input", (event) => onInputFnc(event));
      tr.appendChild(td);
    }
    //append the row into the bodyw
    tbody.appendChild(tr);
  }
}


function sheetSelect(num){
    var myArr = JSON.parse(localStorage.getItem("ArrMatrix"));
    let tableData = myArr[num];
    matrix = tableData;
    tableData.forEach((row) => {
      row.forEach((cell) => {
        if (cell.id) {
          var myCell = document.getElementById(cell.id);
          myCell.innerText = cell.text;
          myCell.style.cssText = cell.style;
        }
      });
    });
  }