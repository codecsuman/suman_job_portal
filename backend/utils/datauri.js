import DataUriParser from "datauri/parser.js";
import path from "path";

// ===========================
// Convert Uploaded File to Data URI
// ===========================
const getDataUri = (file) => {
  // Check if file exists
  if (!file) {
    return null;
  }

  // Create Data URI parser
  const parser = new DataUriParser();

  // Get file extension
  const extName = path.extname(file.originalname).toString();

  // Convert buffer to Data URI
  return parser.format(extName, file.buffer);
};

export default getDataUri;
