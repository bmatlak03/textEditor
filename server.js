const express = require("express");
const port = 3000;
const app = express();
app.set("view engine", "hbs");
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.render("index", { title: "textEditor" });
});

app.post("/saving", (req, res) => {
  const fs = require("fs");
  const data = req.body;
  const fileName = data.fileName;
  delete data.fileName;
  const dirname = "./documents";
  const path = `${dirname}/${fileName}.json`;
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname);
  }
  fs.writeFile(path, JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log("The file was saved!");
  });
  res.json({ message: "Recieved !" });
});
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
