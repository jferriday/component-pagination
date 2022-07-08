import React from 'react'
import styled from 'styled-components'

function ContentBlock({height, width, id}) {
	const hue = Math.floor(Math.random()*200)+10
  return (
	<Content id={id} height={`${height}px`} width={`${width}px`} hue={hue}><p>{`height: ${height}, width ${width}`}</p></Content>
  )
}

export default ContentBlock

const Content = styled.div`
display: flex;
justify-content: center;
align-items: center;
border: 2px solid black;
height: ${props => props.height};
width: ${props => props.width}

	
`