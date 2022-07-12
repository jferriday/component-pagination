import React, { useCallback, useEffect, useState } from 'react'
import MeasurePage from './MeasurePage'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

function PrintPage() {
  const [pagesToPrint, setPagesToPrint] = useState([])

  function generateCanvasArray() {
    let canvasArray = []
    const options = {
      height: 794,
      width: 1123,
      scale: 2
    }
    return new Promise((res, rej) => {
      console.log(pagesToPrint)
      pagesToPrint.forEach((page, index) => {
        const pageToCapture = document.getElementById(`page-${index}`)
        html2canvas(pageToCapture, options)
        .then(canvas => {
          canvasArray.push(canvas.toDataURL("image/jpeg"));
          if(canvasArray.length === pagesToPrint.length) {
            //createPDF(canvasArray)
            return res(canvasArray)
          }
        })
  
      })
     

    })
  }
  async function createPDF(canvasArray) {
    const doc = new jsPDF({
      unit: 'px',
      orientation: 'landscape',
      hotfixes: ["px_scaling"]
    })
    for(let i = 0; i < canvasArray.length; i++) {
      const image = canvasArray[i]
      doc.addImage(image, 'JPEG', 0, 0, 1123, 794)
      doc.setFontSize(11)
      doc.text(`Page ${i+1} of ${canvasArray.length}`, 1000, 774, {})
      if(canvasArray.indexOf(image) < (canvasArray.length - 1)) {
        // Don't add the page if we're at the end of the canvas array
        doc.addPage('a4','landscape')
      }
    }
    doc.save()
  }
  

  const generatePDF = useCallback( async () => {
    const canvasArray = await generateCanvasArray()
    console.log(canvasArray)
    createPDF(canvasArray)
  })

  // When pages to print are generated, generate the PDF
  useEffect(() => {
    if(pagesToPrint.length > 0) {
      console.log('printing')
      console.log(document.getElementById('print-element'))
      generatePDF()
    }
  }, [pagesToPrint])



  return (
  <>
  {pagesToPrint.length === 0 ?
  <MeasurePage setParentPageState={setPagesToPrint} />
  :
	<div id="print-element">
    {pagesToPrint.map((page, index) => (<div id={`page-${index}`} key={index} className='break-after'> {page.components} </div>))}
  </div>
  }
  </>
  )
}

export default PrintPage