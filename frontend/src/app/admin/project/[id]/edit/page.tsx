'use client'
import { useEffect, useState } from 'react'
import {
  Box, Button, FormControl, FormLabel, Input,
  Textarea, Heading, Center, Text, Spinner
} from '@chakra-ui/react'
import { useParams, useRouter } from 'next/navigation'

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [urlType, setUrlType] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 初期データ取得
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/portfolios/${id}`)
        const data = await res.json()
        setTitle(data.title)
        setDescription(data.description || '')
        setUrl(data.url || '')
        setUrlType(data.urlType || '')
      } catch (err) {
        setError('データ取得に失敗しました')
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProject()
  }, [id])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('url', url)
    formData.append('urlType', urlType)
    if (image) formData.append('image', image)

    try {
      const res = await fetch(`http://localhost:4000/api/portfolios/${id}`, {
        method: 'PUT',
        body: formData,
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.message || '更新に失敗しました')
        return
      }
      router.push('/admin')
    } catch (err) {
      setError('更新に失敗しました')
    }
  }

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    )
  }

  return (
    <Center minH="100vh" bg="gray.50">
      <Box bg="white" p={8} rounded="2xl" shadow="xl" w="full" maxW="md">
        <Heading size="lg" mb={6} textAlign="center">実績を編集</Heading>
        <form onSubmit={handleUpdate}>
          <FormControl mb={4}>
            <FormLabel>タイトル</FormLabel>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>説明</FormLabel>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>リンクの種類</FormLabel>
            <select value={urlType} onChange={(e) => setUrlType(e.target.value)} style={{ padding: '8px', borderRadius: '6px', width: '100%' }}>
              <option value="">選択してください</option>
              <option value="demo">デモ動画</option>
              <option value="site">サイト</option>
            </select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>URL</FormLabel>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel>画像（変更する場合のみ選択）</FormLabel>
            <Input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
          </FormControl>
          {error && <Text color="red.500" mb={4} textAlign="center">{error}</Text>}
          <Button type="submit" colorScheme="blue" w="full" isLoading={loading} loadingText="更新中…">更新</Button>
        </form>
      </Box>
    </Center>
  )
}
