import { useState } from 'react'
import { NodeProps } from '../types'
import { Handle, useUpdateNodeInternals } from 'reactflow'
import styled from 'styled-components'
import { HoverOptions, Rotate } from '../BaseNode/styled'
import { Edge } from '../BaseNode/types'
import { getEdgeIndex, positions } from '../utils'

type SocketOnlyProps = {
  id: string
  data: {
    rotation?: 0 | 1 | 2 | 3
  }
  defaultRotation?: 0 | 1 | 2 | 3
  label: string,
  socket: {
    id: string
    type: 'source' | 'target'
    offset: number
  }
}


export function SocketOnly({ id, data, defaultRotation = 0, label, socket }: SocketOnlyProps) {
  const [active, setActive] = useState(false)
  const [rotation, setRotation] = useState<0 | 1 | 2 | 3>(data.rotation ?? defaultRotation)
  const updateNodeInternals = useUpdateNodeInternals()

  function handleRotate() {
    setRotation(state => (state + 1) % 4 as any)
    updateNodeInternals(id)
  }

  return (
    <div
      onPointerOver={() => setActive(true)}
      onPointerOut={() => setActive(false)} 
    >
      <Wrapper>
        {active && <HoverOptions>
          <RotateWrapper>
            <Rotate onClick={handleRotate}  />
          </RotateWrapper>
        </HoverOptions>}
        <Label rotation={rotation}>{label}</Label>
        <CircleHandle 
          rotation={rotation} 
          position={positions[rotation][2]}
          {...socket} 
        />
      </Wrapper>
    </div>
  )
}

const Wrapper = styled.div`
display: grid;
place-items: center;
margin: 0;
`

const RotateWrapper = styled.div`
display: flex;
position: relative;
bottom: 30px;
right: 25px;
padding: 5px;
`

const Label = styled.span<{ rotation: 0 | 1 | 2 | 3 }>`
display: grid;
padding: 5px;
place-items: center;
  position: absolute;
  ${({ rotation }) => {
  switch (rotation) {
    case 0: return `left: -50px;
    top: -12px;`
    case 1:
    case 2:
    case 3: return `left: 6px;
    top: -12px;`
  }
}}
  white-space: nowrap;
  font-size: 12px;
`
export const CircleHandle = styled(Handle)<{ rotation: 0 | 1 | 2 | 3 }>`
display: grid;
place-items: center;
width: 2px;
height: 2px;
background-color: transparent !important;
min-width: 0;
min-height: 0;
position: relative;
right: auto !important;
bottom: auto !important;

${({ rotation }) => {
  switch (rotation) {
    case 0: return `top: 0px;
    left: -7px;`
    case 1: return `top: -7px;
    left: 0px;`
    case 2: return `top: 0px;
    left: 3px;`
    case 3: return `top: 3px;
    left: 0px;`
  }
}}

&:before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background-color: #fff;
  border: 1px solid #000;
  position: absolute;

  ${({ rotation }) => {
    switch (rotation) {
      case 0: return `left: 1px;
      bottom: -4px;`
      case 1: return `bottom: -9px;
      left: -4px;`
      case 2: return `bottom: -4px;
      left: -9px;`
      case 3: return `top: -9px;
      left: -4px;`
    }
  }}
}
`

const Title = styled.div`
display: flex;
gap: 5px;
align-items: center;
`