import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Includes data-saver and slow-connection hints so animation never delays those users.
 */
const useSafeReducedMotion = () => {
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  const [saveData, setSaveData] = useState(false)

  useEffect(() => {
    const connection = navigator.connection
    const updateSaveData = () => {
      setSaveData(Boolean(connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType)))
    }

    updateSaveData()
    connection?.addEventListener?.('change', updateSaveData)
    setMounted(true)
    return () => connection?.removeEventListener?.('change', updateSaveData)
  }, [])

  return mounted && (!!reduce || saveData)
}

export default useSafeReducedMotion
