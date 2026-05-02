import { useContext } from 'react'
import { NegocioContext } from './NegocioContext'

export function useNegocio() {
  return useContext(NegocioContext)
}