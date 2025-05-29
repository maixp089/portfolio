'use client'
import { useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, Center, Text, Heading } from '@chakra-ui/react'

export default function AddSkillPage() {
  const [name, setName] = useState('')
  const [logo, setLogo] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 仮ユーザーID
  const userId = 1

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('スキル名を入力してください')
      return
    }
    if (!userId) {
      setError('ユーザーIDが見つかりません')
      return
    }
    setLoading(true)
    setError('')

    const formData = new FormData()
    formData.append('name', name)
    formData.append('userId', String(userId))
    if (logo) formData.append('logo', logo) // キー名に注意！

    try {
      const res = await fetch('http://localhost:4000/api/skills', {
        method: 'POST',
        body: formData,
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.message || '登録に失敗しました')
        return
      }
      // 登録成功後、リダイレクトや通知など
    } catch (err: any) {
      setError(err.message || '登録に失敗しました')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Center minH="100vh" bg="gray.50">
      <Box bg="white" p={8} rounded="2xl" shadow="xl" w="full" maxW="md">
        <Heading size="lg" mb={6} textAlign="center">
          スキルを追加
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>スキル名</FormLabel>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="例: React"
              required
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel>ロゴ画像</FormLabel>
            <Input
              type="file"
              name="logo"
              accept="image/*"
              onChange={e => setLogo(e.target.files?.[0] ?? null)}
            />
          </FormControl>
          {error && <Text color="red.500" mb={4} textAlign="center">{error}</Text>}
          <Button
            type="submit"
            colorScheme="teal"
            w="full"
            isLoading={loading}
            loadingText="登録中…"
          >
            登録
          </Button>
        </form>
      </Box>
    </Center>
  )
}
