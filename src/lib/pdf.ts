
import { saveAs } from "file-saver";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";

const checkCoordinates: { [key: string]: [number, number] } = {
  naoLiga: [356, 239],
  desligaSozinho: [371, 253],
  ligaDesligaIntermitente: [371, 267],
  semImagem: [371, 281],
  semSom: [371, 295],
  jogFunctionFalha: [342, 308],
  jogFunctionNormal: [429, 308],
  controleFalha: [327, 322],
  controleAusente: [389, 322],
  controleNormal: [434, 322],
  caboForcaFalha: [327, 336],
  caboForcaAusente: [388, 336],
  caboForcaNormal: [434, 336],
  caboOneConnectFalha: [327, 349],
  caboOneConnectAusente: [388, 350],
  caboOneConnectNormal: [434, 350],
  pixelApagado: [345, 367],
  impurezas: [345, 380],
  partesEscuras: [345, 395],
  burnIn: [345, 408],
  linhasHorizontais: [345, 423],
  linhasVerticais: [345, 435],
  hdmi1nok: [329, 451],
  hdmi2nok: [358, 451],
  hdmi3nok: [388, 451],
  hdmi4nok: [418, 451],
  rfFalha: [342, 464],
  rfNormal: [428, 464],
  somIntermitente: [344, 481],
  somDistorcido: [345, 495],
  shdmi1nok: [329, 510],
  shdmi2nok: [358, 510],
  shdmi3nok: [388, 510],
  shdmi4nok: [418, 510],
  srfFalha: [342, 523],
  srfNormal: [428, 523],
  internetCabo: [342, 540],
  internetWifi: [342, 553],
  netflix: [342, 568],
  youtube: [342, 581],
};

const formatarData = (iso: string) => {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
};

const toUpperSafe = (str: string | undefined) => {
    return str ? str.toUpperCase() : '';
}

function wrapText(text: string, maxChars: number) {
  const lines: string[] = [];
  let currentLine = "";
  const words = text.split(" ");
  for (const word of words) {
    if ((currentLine + word).length <= maxChars) {
      currentLine += `${word} `;
    } else {
      lines.push(currentLine.trim());
      currentLine = `${word} `;
    }
  }
  lines.push(currentLine.trim());
  return lines;
}

interface PdfData {
  header: {
    cliente: string;
    modelo: string;
    numeroOS: string;
    numeroSerie: string;
    dataVisita: string;
    versao: string;
    nomeTecnico: string;
  };
  checks: Record<string, boolean>;
  observacoes: string;
  signature?: string;
}

export const generateChecklistPDF = async ({ header, checks, observacoes, signature }: PdfData): Promise<void> => {
 try {
    const url = "/checklist-base.pdf";
    const existingPdfBytes = await fetch(url).then((res) => {
      if (!res.ok) {
        throw new Error(`PDF base não encontrado. Verifique se 'checklist-base.pdf' existe na pasta 'public'.`);
      }
      return res.arrayBuffer();
    });

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { height } = firstPage.getSize();
    const fontSize = 10;
    const textColor = rgb(0, 0, 0);

    // Header
    firstPage.drawText(toUpperSafe(header.cliente), { x: 95, y: height - 80, font, size: fontSize, color: textColor });
    firstPage.drawText(toUpperSafe(header.modelo), { x: 95, y: height - 95, font, size: fontSize, color: textColor });
    firstPage.drawText(toUpperSafe(header.numeroOS), { x: 385, y: height - 66, font, size: fontSize, color: textColor });
    firstPage.drawText(toUpperSafe(header.numeroSerie), { x: 385, y: height - 80, font, size: fontSize, color: textColor });
    firstPage.drawText(formatarData(header.dataVisita), { x: 385, y: height - 95, font, size: fontSize, color: textColor });
    firstPage.drawText(toUpperSafe(header.versao), { x: 270, y: height - 95, font, size: fontSize, color: textColor });
    firstPage.drawText(toUpperSafe(header.nomeTecnico), { x: 120, y: height - 800, font, size: fontSize, color: textColor });
    
    // Checkboxes
    Object.entries(checks).forEach(([key, value]) => {
      if (value && checkCoordinates[key]) {
        const [x, y] = checkCoordinates[key];
        firstPage.drawText("X", { x, y: height - y, font, size: 14, color: textColor });
      }
    });

    // Observations
    if (observacoes) {
      const wrappedLines = wrapText(toUpperSafe(observacoes), 74);
      let yPos = height - 765;
      for (const line of wrappedLines) {
        firstPage.drawText(line, { x: 55, y: yPos, font, size: fontSize, color: textColor });
        yPos -= 15;
      }
    }
    
    // Signature
    if (signature) {
        const pngImage = await pdfDoc.embedPng(signature);
        const pngDims = pngImage.scale(0.25);
        firstPage.drawImage(pngImage, {
            x: 380,
            y: height - 825,
            width: pngDims.width,
            height: pngDims.height,
        });
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, `${header.cliente || "checklist"}-${header.numeroOS}.pdf`);

  } catch (error) {
    console.error("Erro detalhado ao gerar PDF:", error);
    const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido ao gerar o PDF.";
    throw new Error(errorMessage);
  }
};

