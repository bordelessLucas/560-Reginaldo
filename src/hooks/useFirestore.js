import { useEffect, useState } from 'react'
import { subscribeToCollection, subscribeToDocument } from '../services/firestore'

export function useCollection(collectionName, constraints = []) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const unsubscribe = subscribeToCollection(
      collectionName,
      (items) => {
        setData(items)
        setLoading(false)
      },
      constraints,
    )

    return () => unsubscribe()
  }, [collectionName, JSON.stringify(constraints)])

  return { data, loading, error, setError }
}

export function useDocument(collectionName, documentId) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!documentId) {
      setData(null)
      setLoading(false)
      return undefined
    }

    setLoading(true)
    setError(null)

    const unsubscribe = subscribeToDocument(collectionName, documentId, (item) => {
      setData(item)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [collectionName, documentId])

  return { data, loading, error, setError }
}
