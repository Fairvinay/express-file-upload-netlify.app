const cors = require("cors");
const express = require("express");
const multer = require('multer');
const app = express();
const fs = require('fs');
const path = require('path');
const exportPDFUtil = require('./src/exportpdf/export-pdf-to-docx-with-ocr-options')
global.__basedir = __dirname;

var corsOptions = {
  origin: "https://frabjous-truffle-675e06.netlify.app"
  //origin: "http://192.168.1.7:4233"
 // origin: "http://localhost:4233"
};

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const initRoutes = require("./src/routes");
// Middleware to parse raw binary data
// Limit the payload size as needed (e.g., 10MB)
app.use(express.raw({ type: 'application/octet-stream', limit: '10mb' })); 
let generateFilename = () => {		
			  const now = new Date();
			  const pad = (n) => String(n).padStart(2, '0');

			  const year = now.getFullYear();
			  const month = pad(now.getMonth() + 1); // Months are 0-based
			  const day = pad(now.getDate());
			  const hours = pad(now.getHours());
			  const minutes = pad(now.getMinutes());
			  const seconds = pad(now.getSeconds());

			  return `${year}${month}${day}_${hours}${minutes}${seconds}.pdf`;
			};
app.post('/upload-binary',upload.single('file'),async (req, res) => {
  /*if (!req.body) {
    return res.status(400).send('No data provided in the request body.');
  }*/
 if (!req.file) {
    return res.status(400).send('No file received');
  }
    console.log('Received file:', req.file.originalname);
  console.log('Received name:', req.body.name);
  
  const filename = req.body.name || req.file.originalname;

  // Define the path where the file will be saved
  const fileName =  generateFilename(); // 'uploaded_binary_file.pdf'; // You might generate a unique name
  const filePath = path.join(__dirname, 'uploads', fileName);

  // Ensure the 'uploads' directory exists
  if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
  }

  // Write the raw buffer to a file
 // fs.writeFile(filePath, req.body, async(err) => {
  fs.writeFile(filePath, req.file.buffer, async(err) => {
    if (err) {
      console.error('Error saving file:', err);
      return res.status(500).send('Error saving file.');
    }
    // cinvert to DOCX 
   let outfile = await exportPDFUtil( fileName );
 


    res.status(200).send(`File "${outfile}" uploaded successfully.`);
  });
});

app.get('/dowload-binary/:name', (req, res) => {
  let fileName = req.params.name;
   console.log('Requested file:', fileName);
  let bodyFile = '';
  if ( fileName !==undefined){
      console.log("dowload-binary  request params  found ");

  }
  else {
      bodyFile = req.body.name;
    fileName = bodyFile;
  }
   console.log("dowload-binary file name "+fileName)
  const directoryPath = __basedir + "/output/ExportPDFToDOCXWithOCROptions/";
  const filePath = path.join(directoryPath, fileName);
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    res.sendFile(filePath, (err) => {
      if (err) {
        res.status(500).send({
          message: "Could not send the DOCX file. " + err,
        });
      }
    });

  /*
  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  }); */

  // Define the path where the file will be saved
 /* const fileName = 'uploaded_binary_file.pdf'; // You might generate a unique name
  const filePath = path.join(__dirname, 'uploads', fileName);

  // Ensure the 'uploads' directory exists
  if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
  }

  // Write the raw buffer to a file
  fs.writeFile(filePath, req.body, (err) => {
    if (err) {
      console.error('Error saving file:', err);
      return res.status(500).send('Error saving file.');
    }
    // cinvert to DOCX 
    exportPDFUtil( fileName );
     res.status(200).send(`File "${fileName}" uploaded successfully.`);
  });*/
});


 const hostname = '0.0.0.0'; // Or your specific IP address, e.g., '192.168.1.100'

//app.use(express.urlencoded({ extended: true }));
//initRoutes(app);

let port = 8080;
app.listen(port,hostname, () => {
  console.log(`Running at localhost:${port}`);
});
