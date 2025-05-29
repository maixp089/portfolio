'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Flex,
  Center,
  Spinner,
} from '@chakra-ui/react';
import EditButton from './EditButton';

type Project = {
  id: number;
  title: string;
  description?: string;
  images?: { url: string }[];
};

export default function ProjectSection({
  isAdmin = false,
}: {
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/portfolios');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || '取得に失敗しました');
        setProjects(data);
      } catch (err: any) {
        setError(err.message || '取得に失敗しました');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // 編集遷移
  const handleEdit = (id: number) => {
    router.push(`/admin/project/${id}/edit`);
  };

  // 削除処理（サンプル）
  const handleDelete = (id: number) => {
    if (window.confirm('本当に削除しますか？')) {
      alert(`${id} を削除しました！（本番はAPIで削除）`);
      // 実際はAPIでDELETEリクエストを送信し、リロードや再取得も必要
    }
  };

  if (loading) {
    return (
      <Center minH="70vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="70vh">
        <Text color="red.500">{error}</Text>
      </Center>
    );
  }

  return (
    <Box as="section" id="project" py={16} px={4} maxW="1200px" mx="auto">
      {/* 見出し */}
      <Flex align="center" justify="center" mb={2}>
        <Box flex="1" h="1.5px" bg="gray.300" />
        <Heading
          as="h2"
          size="lg"
          mx={6}
          letterSpacing={4}
          fontFamily="'Zen Maru Gothic', 'M PLUS Rounded 1c', sans-serif"
        >
          Project
        </Heading>
        <Box flex="1" h="1.5px" bg="gray.300" />
      </Flex>

      {/* 追加ボタン */}
      {isAdmin && (
        <Flex justify="center" mb={4}>
          <EditButton
            onClick={() => router.push('/admin/project/new')}
            label="追加"
            colorScheme="teal"
          />
        </Flex>
      )}

      {/* 一覧 */}
      <SimpleGrid columns={[1, 2]} spacing={10} mb={10} justifyItems="center">
        {projects.map((project) => (
          <Box
            key={project.id}
            w="500px"
            h="300px"
            border="2px solid #aaa"
            borderRadius="xl"
            p={6}
            textAlign="center"
            bg="white"
            fontFamily="'Zen Maru Gothic', 'M PLUS Rounded 1c', sans-serif"
            boxShadow="md"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            transition="box-shadow 0.2s"
            _hover={{ boxShadow: 'xl', borderColor: '#888' }}
          >
            {/* 画像がある場合だけ表示 */}
            {project.images && project.images[0]?.url && (
              <Image
                src={`http://localhost:4000/${project.images[0].url.replace(/^\/?/, '')}`}
                alt={project.title}
                w="400px"
                h="200px"
                objectFit="contain"
                borderRadius="lg"
                mb={4}
                bg="white"
                boxShadow="sm"
              />
            )}
            <Text fontSize="xl" fontWeight="bold">
              {project.title}
            </Text>
            <Text color="gray.500" mt={1}>
              {project.description}
            </Text>
            {/* 変更・削除ボタン（管理者のみ表示） */}
            {isAdmin && (
              <Flex gap={2} mt={2} justify="center">
                <EditButton
                  onClick={() => handleEdit(project.id)}
                  label="変更"
                  colorScheme="blue"
                />
                <EditButton
                  onClick={() => handleDelete(project.id)}
                  label="削除"
                  colorScheme="red"
                />
              </Flex>
            )}
          </Box>
        ))}
      </SimpleGrid>
      <Text textAlign="center" color="gray.600" fontSize="md">
        これまでに制作した主なプロジェクトです。
      </Text>
    </Box>
  );
}
