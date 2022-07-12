import React from 'react'

function PageFooter({pageNumber, maxPages}) {
  return (
	<div style={{border: '2px solid red', height: '40px', width: '100%'}}>
		<p>Page {pageNumber} of {maxPages}</p>
	</div>
  )
}

export default PageFooter