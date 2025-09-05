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

type Skill = {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
};

export default function SkillSection({
  isAdmin = false,
}: {
  isAdmin?: boolean;
}) {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/skills');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || '取得に失敗しました');
        setSkills(data);
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
    fetchSkills();
  }, []);
  // 編集遷移
  const handleEdit = (id: number) => {
    router.push(`/admin/skill/${id}/edit`);
  };

  // 削除処理（サンプル）
  const handleDelete = async (id: number) => {
    if (!window.confirm('本当に削除しますか？')) return;

    try {
      const res = await fetch(`/api/skills/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('削除リクエストに失敗しました');
      }

      alert(`削除しました！`);
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
    <Box as="section" id="skill" py={16} px={4} maxW="1200px" mx="auto">
      {/* 見出しを中央線付き */}
      <Flex align="center" justify="center" mb={2}>
        <Box flex="1" h="1.5px" bg="gray.300" />
        <Heading
          as="h2"
          size="lg"
          mx={6}
          letterSpacing={4}
          fontFamily="'Zen Maru Gothic', 'M PLUS Rounded 1c', sans-serif"
        >
          Skill
        </Heading>
        <Box flex="1" h="1.5px" bg="gray.300" />
      </Flex>
      {/* 追加ボタン */}
      {isAdmin && (
        <Flex justify="center" mb={4}>
          <EditButton
            onClick={() => router.push('/admin/skill/new')}
            label="追加"
            colorScheme="teal"
          />
        </Flex>
      )}
      {/* 一覧 */}
      {/* ★ 変更: columns をレスポンシブに、間隔も可変に */}
      <SimpleGrid
        columns={{ base: 2, sm: 3, md: 4 }} // ← スマホ2列 / タブレット3列 / PC4列（Skillsは小粒なので多めが見やすい）
        spacing={{ base: 4, md: 6 }}
        mb={10}
        justifyItems="center"
        w="100%"
      >
        {/* ★ 変更: projects → skills に */}
        {skills.map((skill) => (
          <Box
            key={skill.id}
            // ★ 変更: 固定幅をやめ、親に追従
            w="100%"
            maxW={{ base: '140px', sm: '160px', md: '180px' }} // ← Skillsは小ぶりサイズで統一
            h="auto"
            border="1px solid #ddd" // ← 少し軽めの枠線
            borderRadius="xl"
            p={{ base: 3, md: 4 }} // ← 余白は控えめ
            textAlign="center"
            bg="white"
            fontFamily="'Zen Maru Gothic', 'M PLUS Rounded 1c', sans-serif"
            boxShadow="sm"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="flex-start"
            transition="box-shadow 0.2s, transform 0.1s"
            _hover={{ boxShadow: 'md', transform: 'translateY(-2px)' }}
          >
            {/* ロゴ（あれば表示） */}
            {skill.logoUrl && (
              <Box
                // ロゴ置き場：縦横比がバラついても枠内に収める
                w="100%"
                h={{ base: '64px', sm: '72px', md: '80px' }}
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="white"
                borderRadius="md"
                mb={3}
              >
                <Image
                  src={skill.logoUrl}
                  alt={skill.name}
                  maxW="100%"
                  maxH="100%"
                  objectFit="contain" // ← Skillsは contain が正解（アイコンの比率を保持）
                />
              </Box>
            )}

            {/* スキル名 */}
            <Text
              fontSize={{ base: 'sm', md: 'md' }}
              fontWeight="bold"
              noOfLines={1}
            >
              {skill.name}
            </Text>

            {/* 説明（あれば） */}
            {skill.description && (
              <Text
                color="gray.600"
                mt={1}
                fontSize={{ base: 'xs', md: 'sm' }}
                noOfLines={2} // ← 長文で崩れないよう制限
              >
                {skill.description}
              </Text>
            )}

            {/* 管理者用ボタン（必要なら） */}
            {isAdmin && (
              <Flex gap={2} mt={3} justify="center">
                {/* 既存の編集/削除ハンドラ名に合わせて差し替えてね */}
                {/* ★ 変更: skill.id を渡す */}
                <EditButton
                  onClick={() => handleEdit(skill.id)} // ← projects → skills に合わせる
                  label="変更"
                  colorScheme="blue"
                  size="xs"
                />
                <EditButton
                  onClick={() => handleDelete(skill.id)} // ← projects → skills に合わせる
                  label="削除"
                  colorScheme="red"
                  size="xs"
                />
              </Flex>
            )}
          </Box>
        ))}
      </SimpleGrid>
      <Text textAlign="center" color="gray.600" fontSize="md">
        学習・開発で使用したことのある技術一覧です。
      </Text>
    </Box>
  );
}
