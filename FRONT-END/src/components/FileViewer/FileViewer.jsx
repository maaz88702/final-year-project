// src/components/FileViewer.jsx

import React, { useState } from "react";

import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

import { Document, Page, pdfjs } from "react-pdf";

import * as XLSX from "xlsx";

// IMPORTANT
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const FileViewer = ({ fileUrl }) => {
  const [numPages, setNumPages] =
    useState(null);

  const [excelData, setExcelData] =
    useState([]);

  if (!fileUrl) return null;

  const extension = fileUrl
    .split(".")
    .pop()
    .toLowerCase();

  // ================= IMAGE =================
  if (
    ["png", "jpg", "jpeg", "webp"].includes(
      extension
    )
  ) {
    return (
      <Box sx={{ mt: 2 }}>
        <img
          src={fileUrl}
          alt="uploaded"
          style={{
            width: "100%",
            maxHeight: "700px",
            objectFit: "contain",
            borderRadius: "10px",
          }}
        />
      </Box>
    );
  }

  // ================= PDF =================
  if (extension === "pdf") {
    return (
      <Box sx={{ mt: 2 }}>
        <Document
          file={fileUrl}
          loading={<CircularProgress />}
          onLoadSuccess={({
            numPages,
          }) =>
            setNumPages(numPages)
          }
        >
          {Array.from(
            new Array(numPages),
            (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={900}
              />
            )
          )}
        </Document>
      </Box>
    );
  }

  // ================= DOC / DOCX =================
  if (
    extension === "doc" ||
    extension === "docx"
  ) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography mb={2}>
          DOC/DOCX preview is not supported
          directly in browser.
        </Typography>

        <Button
          variant="contained"
          href={fileUrl}
          target="_blank"
        >
          Open Word File
        </Button>
      </Box>
    );
  }

  // ================= PPT / PPTX =================
  if (
    extension === "ppt" ||
    extension === "pptx"
  ) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography mb={2}>
          PowerPoint preview is not supported
          directly in browser.
        </Typography>

        <Button
          variant="contained"
          href={fileUrl}
          target="_blank"
        >
          Open PowerPoint
        </Button>
      </Box>
    );
  }

  // ================= EXCEL =================
  if (
    extension === "xls" ||
    extension === "xlsx"
  ) {
    const loadExcel = async () => {
      const response = await fetch(fileUrl);

      const blob =
        await response.arrayBuffer();

      const workbook = XLSX.read(blob, {
        type: "array",
      });

      const sheetName =
        workbook.SheetNames[0];

      const sheet =
        workbook.Sheets[sheetName];

      const data =
        XLSX.utils.sheet_to_json(sheet, {
          header: 1,
        });

      setExcelData(data);
    };

    if (excelData.length === 0) {
      loadExcel();
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Typography
          variant="h6"
          mb={2}
        >
          Excel Preview
        </Typography>

        <Box
          sx={{
            overflow: "auto",
            border:
              "1px solid #ddd",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse:
                "collapse",
            }}
          >
            <tbody>
              {excelData.map(
                (row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map(
                      (
                        cell,
                        cellIndex
                      ) => (
                        <td
                          key={
                            cellIndex
                          }
                          style={{
                            border:
                              "1px solid #ccc",
                            padding:
                              "8px",
                          }}
                        >
                          {cell}
                        </td>
                      )
                    )}
                  </tr>
                )
              )}
            </tbody>
          </table>
        </Box>
      </Box>
    );
  }

  // ================= DEFAULT =================
  return (
    <Box sx={{ mt: 2 }}>
      <Typography mb={2}>
        Preview not available for this
        file type.
      </Typography>

      <Button
        variant="contained"
        href={fileUrl}
        target="_blank"
      >
        Download File
      </Button>
    </Box>
  );
};

export default FileViewer;