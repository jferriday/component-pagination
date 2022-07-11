import React from 'react';


export const RowHeading = ({id}) => {
	return (
		<div id={id} style={{backgroundColor: 'lightblue', height: '50px', width: '400px'}}>
			<h2>Row Header</h2>
		</div>
	);
}

export const RowDataRow = ({textData, id}) => {
	return (
	<div id={id} style={{height: '40px', width: '400px'}}>
		<p>{textData}</p>
	</div>
	)
}


