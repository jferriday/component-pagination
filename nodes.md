# Preparing React components for print

The logic in this project does the following:
- Receives an array of React components
- Renders them in the DOM
- Measures the height of each component in the DOM
- Generates an array of objects, each containing a component and its height
- Takes this array and splits it into an array of page objects, each containing the maximum number of components that will fit

It handles the following cases:
- If a page doesn't have sufficient space for the next component, it will  be pushed onto the next page
- The logic will continue rendering components from this point onward


What we need to get this working:
- An array of components we want to render and split into pages
- A prop on components to indicate whether they represent a row component or a row header. For example:
```
<RowHeaderComponent isRowComponent={true} isRowHeader={true} />
// or...
<DataRow isRowComponent={true} />
```

Row headers *must* have the property `isRowComponent={true}`.

In the scope of the parent component, we'll need an array of components to render. This is represented by:
`const components = heights.map((height, index) => <ContentBlock id={index} key={index} height={height} width={500} />)`
*The components need to be given an ID of their index in the array, this is used to  locate  them later on*

## How we generate pages
The main function `groupIntoPages()` contains the following variables:
- `maxPageHeight` - the maximum height we want components on the page to occupy. This can be altered to take into account headers and footers.
- `pages []` an array of page objects, each containing a `remainingHeight` and `components` array:
```
const pages = [{
			remainingHeight: maxPageHeight,
			components: []
		}]
```
- A variable to track the current page we're working on, `pageIndex` (starting at 0)

To start, we loop over the components in the DOM and find their heights. We package them up into a `componentsAndHeights` object using `measureAndPutIntoObject`. Each looks like this:
```
{
	component: <Reactcomponent />,
	height: 250
}
```

Now we can loop over this array of components and their heights using `Array.forEach()`
```
componentsAndHeights.forEach(componentAndHeightObject => {
			if(componentAndHeightObject.component.props.isRowComponent) {
				if(componentAndHeightObject.component.props.isRowHeader) currentRowComponentHeader = componentAndHeightObject
				const newIndex = addRowComponentToPagesAndUpdateIndex(componentAndHeightObject, pages, pageIndex, maxPageHeight, currentRowHeader)
			} else {
				const newIndex = addToPagesAndUpdateIndex(componentAndHeightObject, pages, pageIndex, maxPageHeight)
				pageIndex = newIndex
			}		
		})
```
There are two paths to follow - one for row components and another for regular components (which exist in isolation).

For regular components, we run `addToPagesAndUpdateIndex()`, passing in the `componentAndHeightObject`, the current array of pages, the current pageIndex and the max page height.
```
const newIndex = addToPagesAndUpdateIndex(componentAndHeightObject, pages, pageIndex, maxPageHeight)
pageIndex = newIndex

```
This function will return the new index that we should be working on.

What it does:
- Gets the object height and compares it to the remaining height on the page
- If there is space, adds it to the `components` array on the page object.
- If not, creates a new page object, adds the component to it and updates the pageIndex
- Returns the pageIndex (whether this has changed or not)



