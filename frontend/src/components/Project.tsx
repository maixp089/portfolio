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
  Link,
} from '@chakra-ui/react';
import EditButton from './EditButton';

type Project = {
  id: number;
  title: string;
  description?: string;
  url?: string;
  urlType?: 'demo' | 'site';
  imageUrl?: string;
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
        const res = await fetch('/api/portfolios');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || '取得に失敗しました');
        setProjects(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('取得に失敗しました');
        }
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
  const handleDelete = async (id: number) => {
    if (!window.confirm('本当に削除しますか？')) return;

    try {
      const res = await fetch(`/api/portfolios/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('削除リクエストに失敗しました');
      }

      alert(`削除しました！`);

      // 再取得する or state更新
      // 例）ポートフォリオ一覧を再取得する関数があるなら呼ぶ
      // await fetchPortfolios();

      // もしくは手軽にページ再読み込み
      window.location.reload();
    } catch (err) {
      console.error('削除エラー:', err);
      alert('削除に失敗しました');
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
      {/* ★ 変更: columns をレスポンシブに、間隔も可変に */}
      <SimpleGrid
        columns={{ base: 1, sm: 2, lg: 3 }} // ← スマホ1列 / タブレット2列 / PC3列
        spacing={{ base: 6, md: 10 }}
        mb={10}
        justifyItems="center"
        w="100%"
      >
        {projects.map((project) => (
          <Box
            key={project.id}
            // ★ 変更: 固定幅をやめ、親に追従
            w="100%"
            maxW={{ base: '100%', sm: '320px', md: '360px' }} // ← 最大幅を段階的に制御
            h="auto"
            border="2px solid #aaa"
            borderRadius="xl"
            p={{ base: 4, md: 6 }} // ← スマホは少し余白を小さく
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
            {project.imageUrl && (
              <Image
                src={project.imageUrl}
                alt={project.title}
                // ★ 変更: 固定pxをやめて可変に
                w="100%"
                h={{ base: '160px', sm: '180px', md: '200px' }}
                objectFit="cover" // ← contain → cover に変更して枠いっぱいに表示
                borderRadius="lg"
                mb={4}
                bg="white"
                boxShadow="sm"
              />
            )}
            <Text
              fontSize={{ base: 'lg', md: 'xl' }} // ← スマホで少し小さめ
              fontWeight="bold"
              noOfLines={1} // ← タイトルが長すぎる場合折返し制御
            >
              {project.title}
            </Text>
            <Text
              color="gray.500"
              mt={1}
              fontSize={{ base: 'sm', md: 'md' }}
              noOfLines={3} // ← 長文で崩れないよう最大行数を制御
            >
              {project.description}
            </Text>
            {project.url && project.urlType && (
              <Link
                href={project.url}
                isExternal
                color="blue.500"
                mt={2}
                fontWeight="medium"
                fontSize={{ base: 'sm', md: 'md' }}
                _hover={{ textDecoration: 'underline' }}
              >
                ▶{' '}
                {project.urlType === 'demo' ? 'デモ動画を見る' : 'サイトを見る'}
              </Link>
            )}

            {/* 変更・削除ボタン（管理者のみ表示） */}
            {isAdmin && (
              <Flex gap={2} mt={2} justify="center">
                <EditButton
                  onClick={() => handleEdit(project.id)}
                  label="変更"
                  colorScheme="blue"
                  size="sm"
                />
                <EditButton
                  onClick={() => handleDelete(project.id)}
                  label="削除"
                  colorScheme="red"
                  size="sm"
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
