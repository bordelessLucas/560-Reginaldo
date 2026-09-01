import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

export function getCollectionRef(collectionName) {
  return collection(db, collectionName)
}

export function getDocumentRef(collectionName, documentId) {
  return doc(db, collectionName, documentId)
}

export async function getDocument(collectionName, documentId) {
  const snapshot = await getDoc(getDocumentRef(collectionName, documentId))
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() }
}

export async function getCollection(collectionName, constraints = []) {
  const collectionQuery = constraints.length
    ? query(getCollectionRef(collectionName), ...constraints)
    : getCollectionRef(collectionName)

  const snapshot = await getDocs(collectionQuery)
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
}

export async function createDocument(collectionName, data) {
  const docRef = await addDoc(getCollectionRef(collectionName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return docRef.id
}

export async function setDocument(collectionName, documentId, data, merge = true) {
  await setDoc(
    getDocumentRef(collectionName, documentId),
    {
      ...data,
      updatedAt: serverTimestamp(),
      ...(merge ? {} : { createdAt: serverTimestamp() }),
    },
    { merge },
  )
}

export async function updateDocument(collectionName, documentId, data) {
  await updateDoc(getDocumentRef(collectionName, documentId), {
    ...data,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteDocument(collectionName, documentId) {
  await deleteDoc(getDocumentRef(collectionName, documentId))
}

export function subscribeToCollection(collectionName, callback, constraints = []) {
  const collectionQuery = constraints.length
    ? query(getCollectionRef(collectionName), ...constraints)
    : getCollectionRef(collectionName)

  return onSnapshot(collectionQuery, (snapshot) => {
    const data = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
    callback(data)
  })
}

export function subscribeToDocument(collectionName, documentId, callback) {
  return onSnapshot(getDocumentRef(collectionName, documentId), (snapshot) => {
    if (!snapshot.exists()) {
      callback(null)
      return
    }
    callback({ id: snapshot.id, ...snapshot.data() })
  })
}

export { orderBy, query, serverTimestamp, where }
