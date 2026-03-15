const pdfParse = require('pdf-parse');
const fs = require('fs');

/**
 * Extract text from PDF file path
 */
const extractTextFromPDF = async (filePath) => {
    try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text.trim();
    } catch (error) {
        throw new Error(`Failed to extract text: ${error.message}`);
    }
};

/**
 * Extract text from PDF buffer (memory storage)
 */
const extractTextFromBuffer = async (buffer) => {
    try {
        const data = await pdfParse(buffer);
        return data.text.trim();
    } catch (error) {
        throw new Error(`Failed to extract text from buffer: ${error.message}`);
    }
};

/**
 * Clean extracted text
 */
const cleanText = (text) => {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\n+/g, '\n')
        .replace(/[^\x00-\x7F]/g, '')
        .trim();
};

module.exports = { extractTextFromPDF, extractTextFromBuffer, cleanText };