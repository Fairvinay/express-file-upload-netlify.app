/*
 * Copyright 2024 Adobe
 * All Rights Reserved.
 *
 * NOTICE: Adobe permits you to use, modify, and distribute this file in
 * accordance with the terms of the Adobe license agreement accompanying
 * it. If you have received this file from a source other than Adobe,
 * then your use, modification, or distribution of it requires the prior
 * written permission of Adobe.
 */

const {
    ServicePrincipalCredentials,
    PDFServices,
    MimeType,
    ExportPDFParams,
    ExportPDFTargetFormat,
    ExportOCRLocale,
    ExportPDFJob,
    ExportPDFResult,
    SDKError,
    ServiceUsageError,
    ServiceApiError
} = require("@adobe/pdfservices-node-sdk");
const fs = require("fs");

/**
 * This sample illustrates how to export a PDF file to a Word (DOCX) file.
 * The OCR processing is also performed on the input PDF file to extract text from images in the document.
 * <p>
 * Refer to README.md for instructions on how to run the samples.
 */
(async () => {
    let readStream;
    try {
        // Initial setup, create credentials instance
        const credentials = new ServicePrincipalCredentials({
          //  clientId: process.env.PDF_SERVICES_CLIENT_ID,
            clientId: 'e1555b23dc6a4161a48bac59773e7d12',
          //  clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET
             clientSecret: 'p8e-vv35CAoV8zua9DlEJ3yzD0S35B7BrE3r'
        });

        // Creates a PDF Services instance
        const pdfServices = new PDFServices({credentials});

        // Creates an asset(s) from source file(s) and upload
        readStream = fs.createReadStream("resources/pdf_text_editing_walkthrough.pdf");
        const inputAsset = await pdfServices.upload({
            readStream,
            mimeType: MimeType.PDF
        });

        // Create parameters for the job
        const params = new ExportPDFParams({
            targetFormat: ExportPDFTargetFormat.DOCX,
            ocrLocale: ExportOCRLocale.EN_US
        });

        // Creates a new job instance
        const job = new ExportPDFJob({inputAsset, params});

        // Submit the job and get the job result
        const pollingURL = await pdfServices.submit({job});
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: ExportPDFResult
        });

        // Get content from the resulting asset(s)
        const resultAsset = pdfServicesResponse.result.asset;
        const streamAsset = await pdfServices.getContent({asset: resultAsset});

        // Creates an output stream and copy stream asset's content to it
        const outputFilePath = createOutputFilePath();
        console.log(`Saving asset at ${outputFilePath}`);

        const outputStream = fs.createWriteStream(outputFilePath);
        streamAsset.readStream.pipe(outputStream);
    } catch (err) {
        if (err instanceof SDKError || err instanceof ServiceUsageError || err instanceof ServiceApiError) {
            console.log("Exception encountered while executing operation", err);
        } else {
            console.log("Exception encountered while executing operation", err);
        }
    }
}) 


let exportPDFUtil  = 

(async ( userPDF  ) => {
    let readStream;
    try {
        // Initial setup, create credentials instance
        const credentials = new ServicePrincipalCredentials({
          //  clientId: process.env.PDF_SERVICES_CLIENT_ID,
            clientId: 'e1555b23dc6a4161a48bac59773e7d12',
          //  clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET
             clientSecret: 'p8e-vv35CAoV8zua9DlEJ3yzD0S35B7BrE3r'
        });

        // Creates a PDF Services instance
        const pdfServices = new PDFServices({credentials});

        // Creates an asset(s) from source file(s) and upload
        readStream = fs.createReadStream(`uploads/${userPDF}`);
        const inputAsset = await pdfServices.upload({
            readStream,
            mimeType: MimeType.PDF
        });

        // Create parameters for the job
        const params = new ExportPDFParams({
            targetFormat: ExportPDFTargetFormat.DOCX,
            ocrLocale: ExportOCRLocale.EN_US
        });

        // Creates a new job instance
        const job = new ExportPDFJob({inputAsset, params});

        // Submit the job and get the job result
        const pollingURL = await pdfServices.submit({job});
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: ExportPDFResult
        });

        // Get content from the resulting asset(s)
        const resultAsset = pdfServicesResponse.result.asset;
        const streamAsset = await pdfServices.getContent({asset: resultAsset});

        // Creates an output stream and copy stream asset's content to it
        const outputFilePath = createOutputFilePath();
        console.log(`Saving asset at ${outputFilePath}`);

        const outputStream = fs.createWriteStream(outputFilePath);
        streamAsset.readStream.pipe(outputStream);
        return outputFilePath;
    } catch (err) {
        if (err instanceof SDKError || err instanceof ServiceUsageError || err instanceof ServiceApiError) {
            console.log("Exception encountered while executing operation", err);
        } else {
            console.log("Exception encountered while executing operation", err);
        }
    }
}) ;

// Generates a string containing a directory structure and file name for the output file
function createOutputFilePath() {
    const filePath = "output/ExportPDFToDOCXWithOCROptions/";
    const date = new Date();
    const dateString = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" +
        ("0" + date.getDate()).slice(-2) + "T" + ("0" + date.getHours()).slice(-2) + "-" +
        ("0" + date.getMinutes()).slice(-2) + "-" + ("0" + date.getSeconds()).slice(-2);
    fs.mkdirSync(filePath, {recursive: true});
    return (`${filePath}export${dateString}.docx`);
}
module.exports =  exportPDFUtil;