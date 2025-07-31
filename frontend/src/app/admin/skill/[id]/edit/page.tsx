'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Center,
  Text,
  Heading,
  Textarea,
  Spinner,
} from '@chakra-ui/react';

export default function EditSkillPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/skills/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setName(data.name);
        setDescription(data.description || '');
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('取得に失敗しました');
        }
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('スキル名を入力してください');
      return;
    }
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('name', name);
    if (description.trim()) formData.append('description', description);
    if (logo) formData.append('logo', logo);

    try {
      const res = await fetch(`http://localhost:4000/api/skills/${id}`, {
        method: 'PUT',
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || '更新に失敗しました');
        return;
      }
      router.push('/admin');
    } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('更新に失敗しました');
        }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <Center minH="100vh">
        <Spinner />
      </Center>
    );
  }

  return (
    <Center minH="100vh" bg="gray.50">
      <Box bg="white" p={8} rounded="2xl" shadow="xl" w="full" maxW="md">
        <Heading size="lg" mb={6} textAlign="center">
          スキルを編集
        </Heading>
        <form onSubmit={handleSubmit}>
          <FormControl mb={4}>
            <FormLabel>スキル名</FormLabel>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: React"
              required
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>コメント（任意）</FormLabel>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="例: 得意な内容や使える技術・アピールポイントなど"
              rows={3}
            />
          </FormControl>
          <FormControl mb={6}>
            <FormLabel>新しいロゴ画像を選択（任意）</FormLabel>
            <Input
              type="file"
              name="logo"
              accept="image/*"
              onChange={(e) => setLogo(e.target.files?.[0] ?? null)}
            />
          </FormControl>
          {error && (
            <Text color="red.500" mb={4} textAlign="center">
              {error}
            </Text>
          )}
          <Button
            type="submit"
            colorScheme="teal"
            w="full"
            isLoading={loading}
            loadingText="更新中…"
          >
            更新する
          </Button>
        </form>
      </Box>
    </Center>
  );
}
