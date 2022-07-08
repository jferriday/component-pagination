import React, {useState, useEffect} from 'react'
import ContentBlock from '../ContentBlock'

function MeasurePage() {
	// Generate an array of components
	const heights = [200, 600, 340, 190, 240, 333, 25, 150, 80, 230, 20, 70]
	const components = heights.map((height, index) => <ContentBlock id={index} key={index} height={height} width={500} />)

	function measureAndPutIntoObject() {
		let measurements = []
		components.forEach((comp, index) => {
			const renderedComponent = document.getElementById(`${index}`)
			const height = renderedComponent.offsetHeight
			measurements.push({
				component: comp,
				height: height
			})
		})
		return measurements
	}

	function addToPagesAndUpdateIndex(object, pages, pageIndex, maxPageHeight) {
		// Object is the current object we are adding
		// pages is the page array
		// pageIndex is the current page index we're working on
		const objectHeight = object.height
		const remainingHeight = pages[pageIndex].remainingHeight
		let currentPageIndex = pageIndex

		
		// If there is space for a component, add it to the page
		if(remainingHeight >= objectHeight) {
			pages[pageIndex].components.push(object.component)
			pages[pageIndex].remainingHeight = remainingHeight - objectHeight

		} else {
			// otherwise, create a new page with the component inside it
			pages.push({
				remainingHeight:  maxPageHeight - objectHeight,
				components: [object.component]
			})
			// Increment the index of the page we are working on
			currentPageIndex += 1
		}
		// Return this so we can update it in the calling function
		return currentPageIndex
	}

	function addRowComponentToPagesAndUpdateIndex(object, pages, pageIndex, maxPageHeight, currentRowHeader) {
		const objectHeight = object.height
		const remainingHeight = pages[pageIndex].remainingHeight
		let currentPageIndex = pageIndex

		// If there is space for a component, add it to the page
		if(remainingHeight >= objectHeight) {
			pages[pageIndex].components.push(object.component)
			pages[pageIndex].remainingHeight = remainingHeight - objectHeight

		} else {
			// otherwise, create a new page with the component inside it
			// If we're putting down a row header, we just want one, so start a new page and just put the current component down
			if(object.component.props.isRowHeader) {
				pages.push({
					remainingHeight:  maxPageHeight - objectHeight,
					components: [object.component]
				})
			} else {
				const rowHeaderHeight = currentRowHeader.height
				pages.push({
					remainingHeight:  maxPageHeight - objectHeight - rowHeaderHeight,
					components: [currentRowHeader.component, object.component]
				})
				
			}
			// Increment the index of the page we are working on
			currentPageIndex += 1
		
		// Return this so we can update it in the calling function
		return currentPageIndex
	}}

	function groupIntoPages() {
		// Page setup
		const maxPageHeight = 780
		// Initialise first page in the pages array
		const pages = [{
			remainingHeight: maxPageHeight,
			components: []
		}]
		let pageIndex = 0

		// Maintain a copy of the latest row component header to be reused if needed
		let currentRowComponentHeader

		const componentsAndHeights = measureAndPutIntoObject()
		console.log(componentsAndHeights)

		componentsAndHeights.forEach(componentAndHeightObject => {
			if(componentAndHeightObject.component.props.isRowComponent) {
				if(componentAndHeightObject.component.props.isRowHeader) currentRowComponentHeader = componentAndHeightObject
				const newIndex = addRowComponentToPagesAndUpdateIndex(componentAndHeightObject, pages, pageIndex, maxPageHeight, currentRowComponentHeader)
			} else {
				const newIndex = addToPagesAndUpdateIndex(componentAndHeightObject, pages, pageIndex, maxPageHeight)
				pageIndex = newIndex
			}		
		})
		console.log(pages)



	}


  return (
	<>
		<button onClick={groupIntoPages}>Measure</button>
	{heights.map((height, index) => <ContentBlock id={index} key={index} height={height} width={400} />)}
	</>
  )
}

export default MeasurePage