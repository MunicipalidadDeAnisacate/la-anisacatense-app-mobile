import { useState, useEffect, useCallback } from 'react'
import debounce from 'lodash.debounce'
import { verify } from '@/api/petitions'

export type FieldName = 'email' | 'telefono' | 'dni'

export function useExistsCheck(value: string, field: FieldName) {
  const [isExists, setIsExists] = useState<boolean | null>(null)

  const debouncedCheck = useCallback(
    debounce(async (val: string) => {
      try {
        const exists = await verify(field, field === "email" ? val.toLowerCase() : val)

        setIsExists(exists)
      } catch {
        setIsExists(null)
      }
    }, 500),
    [field, verify]
  )

  useEffect(() => {
    if (!value) {
      setIsExists(null)
      return
    }
    debouncedCheck(value.trim())
    return () => debouncedCheck.cancel()
  }, [value, debouncedCheck])

  return { isExists }
}