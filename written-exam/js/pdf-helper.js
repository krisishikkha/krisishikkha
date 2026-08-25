// written-exam/js/pdf-helper.js
// html2canvas দিয়ে বানানো ছবিকে multi-page PDF-এ বসানোর common helper

async function canvasToMultiPagePdf(canvas, doc, marginPt = 20) {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const imgWidth = pageWidth - marginPt * 2;
    const pxPerPt = canvas.width / imgWidth;
    const pageHeightPx = (pageHeight - marginPt * 2) * pxPerPt;

    let renderedPx = 0;
    let first = true;

    while (renderedPx < canvas.height) {
        const sliceHeightPx = Math.min(pageHeightPx, canvas.height - renderedPx);

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = sliceHeightPx;
        pageCanvas.getContext('2d').drawImage(
            canvas, 0, renderedPx, canvas.width, sliceHeightPx,
            0, 0, canvas.width, sliceHeightPx
        );

        const imgData = pageCanvas.toDataURL('image/jpeg', 0.92);
        const sliceHeightPt = sliceHeightPx / pxPerPt;

        if (!first) doc.addPage();
        doc.addImage(imgData, 'JPEG', marginPt, marginPt, imgWidth, sliceHeightPt);

        renderedPx += sliceHeightPx;
        first = false;
    }
}