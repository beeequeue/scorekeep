import React, {
  SelectHTMLAttributes,
  useCallback,
  useState,
  useEffect,
} from 'react'
import styled from 'styled-components'
import { Input } from '@/components/input'
import { Select } from '@/components/select'
import { InputFieldContainer } from '@/components/input-fields'

const FieldContainer = styled(InputFieldContainer)`
  flex: 1;

  &:last-of-type {
    margin-left: 16px;
  }
`

export enum PropertyType {
  NUMBER = 'Number',
  // BOOLEAN = 'Boolean',
  STRING = 'String',
}

export const SelectTypeInput = (
  props: SelectHTMLAttributes<HTMLSelectElement>,
) => {
  return (
    <Select name="Field Type" {...props}>
      {Object.keys(PropertyType).map(type => (
        <option key={type} value={type}>
          {type}
        </option>
      ))}
    </Select>
  )
}

export type Property = {
  type: PropertyType
  name: string
}

const Container = styled.div`
  display: flex;
  padding: 8px 0px 16px;
  align-items: center;
`

const Close = styled.button`
  margin-left: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  width: 32px;
  border: solid 1px;
  border-radius: 50% 50%;
  padding: 0;
  background: transparent;
  color: #21e6c1;
  line-height: 16px;
  font-size: 16px;

  &:hover {
    color: #91f3e1;
  }

  &:disabled {
    color: #d0d0d0;
  }
`

export const ResultProperty = ({
  onChange,
  removable,
  name,
  onDelete,
}: {
  removable?: boolean
  name: string
  onChange: (name: string, prop: Property) => void
  onDelete: (name: string) => void
}) => {
  const [property, setProperty] = useState<Property>({
    type: PropertyType.NUMBER,
    name: '',
  })
  useEffect(() => {
    onChange(name, property)
  }, [property, name])

  const onSelect = useCallback(
    e => {
      setProperty({ type: e.target.value, name: property.name })
    },
    [setProperty, property],
  )

  const onNameChange = useCallback(
    e => {
      setProperty({ name: e.target.value, type: property.type })
    },
    [setProperty, property],
  )

  return (
    <Container>
      <FieldContainer>
        <Input
          placeholder="Property Name"
          onChange={onNameChange}
          type="text"
          value={property.name}
        />
      </FieldContainer>
      <FieldContainer>
        <SelectTypeInput defaultValue={property.type} onChange={onSelect} />
      </FieldContainer>
      <Close disabled={!removable} onClick={() => onDelete(name)}>
        X
      </Close>
    </Container>
  )
}
