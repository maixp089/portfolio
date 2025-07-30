'use client';
import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  Center,
  Text,
} from '@chakra-ui/react';

export default function AddProjectPage() {
  // 仮ユーザーID（本番は認証情報などから取得！）
  const userId = 1;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [urlType, setUrlType] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // バリデーション（タイトル、画像、ユーザーID必須）
    if (!title.trim()) {
      setError('タイトルを入力してください');
      return;
    }
    if (!image) {
      setError('画像を選択してください');
      return;
    }
    if (!userId) {
      setError('ユーザーIDが見つかりません');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('url', url);
    formData.append('urlType', urlType); // ←これ追加！
    formData.append('userId', String(userId)); // 必ず文字列で渡す

    try {
      const res = await fetch('http://localhost:4000/api/portfolios', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        // サーバーからの詳細エラーも表示
        setError(json.message || '登録に失敗しました');
        return;
      }
      window.location.href = '/admin';
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('登録に失敗しました');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center minH="100vh" bg="gray.50">
      <Box bg="white" p={8} rounded="2xl" shadow="xl" w="full" maxW="md">
        <Heading size="lg" mb={6} textAlign="center">
          実績を追加
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>タイトル</FormLabel>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: ポートフォリオサイト"
              required
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>説明</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="どんな内容かを入力"
              rows={3}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>リンクの種類</FormLabel>
            <select
              value={urlType}
              onChange={(e) => setUrlType(e.target.value)}
              style={{ padding: '8px', borderRadius: '6px', width: '100%' }}
            >
              <option value="">選択してください</option>
              <option value="demo">デモ動画</option>
              <option value="site">サイト</option>
            </select>
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>URL</FormLabel>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel>画像</FormLabel>
            <Input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              required
            />
          </FormControl>
          {error && (
            <Text color="red.500" mb={4} textAlign="center">
              {error}
            </Text>
          )}
          <Button
            type="submit"
            colorScheme="blue"
            w="full"
            isLoading={loading}
            loadingText="登録中…"
          >
            登録
          </Button>
        </form>
      </Box>
    </Center>
  );
}
