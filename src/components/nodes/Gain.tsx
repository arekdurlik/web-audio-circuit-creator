import { NodeProps } from './types'
import { ChangeEvent, useEffect, useState } from 'react'
import { Parameter } from './BaseNode/styled'
import { Node } from './BaseNode'
import { Socket } from './BaseNode/types'
import { useNodeStore } from '../../stores/nodeStore'
import { audio } from '../../main'
import { FlexContainer } from '../../styled'
import { RangeInput } from '../inputs/RangeInput'
import { NumberInput } from '../inputs/NumberInput'

export function Gain({ id, data }: NodeProps) {
  const [gain, setGain] = useState(1)
  const [max, setMax] = useState<string | number>(2)
  const [min, setMin] = useState<string | number>(-2)
  const audioId = `${id}-audio`
  const controlVoltageId = `${id}-cv`
  const [instance] = useState(new GainNode(audio.context))
  const setInstance = useNodeStore(state => state.setInstance)
  const sockets: Socket[] = [
    {
      id: audioId,
      label: '',
      type: 'target',
      edge: 'left',
      offset: 24
    },
    {
      id: controlVoltageId,
      label: 'g',
      visual: 'triangle',
      type: 'target',
      edge: 'top',
      offset: 48
    },
    {
      id: audioId,
      type: 'source',
      edge: 'right',
      offset: 24
    }
  ]

  useEffect(() => {
    instance.gain.value = gain
    setInstance(audioId, instance)
    setInstance(controlVoltageId, instance.gain)
  }, [])

  useEffect(() => {
    if (gain === undefined || Number.isNaN(gain)) return

    instance.gain.setValueAtTime(instance.gain.value, audio.context.currentTime)
    instance.gain.linearRampToValueAtTime(gain, audio.context.currentTime + 0.03)
  }, [gain])

  function handleGain(event: ChangeEvent<HTMLInputElement>) {
    const value = parseFloat(event.target.value)
    setGain(value)
  }

  const Parameters = <FlexContainer direction='column' gap={8}>
    <div>
    Gain:
    <FlexContainer
      direction='column'
      gap={8}
    >
      <Parameter>
        <RangeInput
          min={min}
          max={max}
          onChange={handleGain} 
          defaultValue={gain}
          value={gain}
          />
        <NumberInput 
          onChange={handleGain} 
          value={gain}
          />
      </Parameter>
      <FlexContainer
        justify='flex-end'
        gap={8}
      >
      <FlexContainer gap={2}>
        min:
        <NumberInput 
          width={50}
          onChange={(e) => setMin(e.target.value)} 
          value={min}
        />
      </FlexContainer>
      <FlexContainer gap={2}>
        max:
        <NumberInput 
          width={50}
          onChange={(e) => setMax(e.target.value)} 
          value={max}
        />
      </FlexContainer>
      </FlexContainer>
    </FlexContainer>
    </div>
  </FlexContainer>

  return (
    <Node 
      id={id}
      name='Gain'
      value={gain}
      data={data}
      sockets={sockets}
      parameterPositions={['bottom', 'left', 'top', 'right']}
      parameters={Parameters}
    />
  )
}


