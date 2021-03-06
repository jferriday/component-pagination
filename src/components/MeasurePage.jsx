import React, {useState, useEffect} from 'react'
import ContentBlock from '../ContentBlock'
import { RowHeading, RowDataRow } from './RowData'
import PageHeader from './PageHeader'


function MeasurePage({setParentPageState}) {
	// Generate an array of components
	const heights = [200, 600, 340, 190, 240, 333, 25, 150, 80, 230, 20, 70]
	const rowData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
	const heightComponents = [
		...heights.map((height, index) => <ContentBlock key={index} id={`height-${index}`} height={height} width={500} />),
	]
	
	// row data, simulates clinical obs
const rowComponents = [
	<RowHeading id="row-heading" key="row-heading" isRowComponent={true} isRowHeader={true} />,
 	...rowData.map((data, index) => <RowDataRow key={`rowdata-${index}`} id={`rowdata-${index}`} textData={data} isRowComponent={true}/>)]

	// Use spread to combine all components into an array
	const componentsToRender = [
		...heightComponents,
		...rowComponents
	]
	

	function measureAndPutIntoObject() {
		let measurements = []
		console.log(componentsToRender)
		componentsToRender.forEach((comp, index) => {
			const renderedComponent = document.getElementById(comp.props.id)
			const height = renderedComponent.offsetHeight || ''
			measurements.push({
				component: comp,
				height: height
			})
		})
		return measurements
	}

	function addToPagesAndUpdateIndex(object, headerComponent, pages, pageIndex, maxPageHeight) {
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
				components: [headerComponent, object.component]
			})
			// Increment the index of the page we are working on
			currentPageIndex += 1
		}
		// Return this so we can update it in the calling function
		return currentPageIndex
	}

	function addRowComponentToPagesAndUpdateIndex(object, headerComponent, pages, pageIndex, maxPageHeight, currentRowHeader) {
		const objectHeight = object.height
		const remainingHeight = pages[pageIndex].remainingHeight
		let currentPageIndex = pageIndex
		// If there is space for a component, add it to the page
		if( 
			(!object.component.props.isRowHeader && (remainingHeight >= objectHeight))
			||
			(object.component.props.isRowHeader && (remainingHeight >= (objectHeight * 2)))
		) {
			pages[pageIndex].components.push(object.component)
			pages[pageIndex].remainingHeight = (remainingHeight - objectHeight)
			return pageIndex
		} else {
			// otherwise, create a new page with the component inside it
			// If we're putting down a row header, we just want one, so start a new page and just put the current component down
			if(object.component.props.isRowHeader) {
				pages.push({
					remainingHeight:  maxPageHeight - objectHeight,
					components: [headerComponent, object.component]
				})
		
			} else {
				const rowHeaderHeight = currentRowHeader.height
				pages.push({
					remainingHeight:  maxPageHeight - objectHeight - rowHeaderHeight,
					components: [headerComponent, currentRowHeader.component, object.component]
				})
				
			}
			// Increment the index of the page we are working on
			currentPageIndex += 1
		
		// Return this so we can update it in the calling function
		return currentPageIndex
	}}

	function groupIntoPages({headerComponent, headerHeight, footerHeight, pageHeight}) {
		// Page setup
	
		const maxPageHeight = pageHeight - footerHeight - headerHeight

		// Initialise first page in the pages array
		const pages = [{
			remainingHeight: maxPageHeight,
			components: [headerComponent]
		}]
		let pageIndex = 0

		// Maintain a copy of the latest row component header to be reused if needed
		let currentRowComponentHeader

		const componentsAndHeights = measureAndPutIntoObject()
		console.log(componentsAndHeights)

		componentsAndHeights.forEach(componentAndHeightObject => {
			if(componentAndHeightObject.component.props.isRowComponent) {
				if(componentAndHeightObject.component.props.isRowHeader) currentRowComponentHeader = componentAndHeightObject
				const newIndex = addRowComponentToPagesAndUpdateIndex(componentAndHeightObject, headerComponent, pages, pageIndex, maxPageHeight, currentRowComponentHeader)
				pageIndex = newIndex
			} else {
				const newIndex = addToPagesAndUpdateIndex(componentAndHeightObject, headerComponent, pages, pageIndex, maxPageHeight)
				pageIndex = newIndex
			}		
		})

		setParentPageState(pages)
	}

	// Group elements into pages when the component renders.
	useEffect(() => {
		groupIntoPages({
			headerComponent: <PageHeader />,
			footerHeight: 20,
			headerHeight: 60,
			pageHeight: 595
		})
	}, [])

  return (
	<>
		<button onClick={groupIntoPages}>Measure</button>
		{componentsToRender.map((component) => component)}
	</>
  )
}

export default MeasurePage