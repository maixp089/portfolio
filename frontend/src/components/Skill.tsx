import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Flex,
} from '@chakra-ui/react';
import EditButton from './EditButton';

// 仮データ（本番はAPIで取得！）
const skills = [
  {
    name: 'React',
    description: 'UI開発フレームワーク',
    imageUrl: '/images/react-logo.png',
  },
  {
    name: 'TypeScript',
    description: '型安全なJavaScript',
    imageUrl: '/images/typescript-logo.png',
  },
  {
    name: 'Next.js',
    description: 'React製のフレームワーク',
    imageUrl: '/images/nextjs-logo.png',
  },
  {
    name: 'Chakra UI',
    description: 'スタイリング用UIライブラリ',
    imageUrl: '/images/chakra-logo.png',
  },
];

export default function SkillSection({
  isAdmin = false,
}: {
  isAdmin?: boolean;
}) {
  const handleEdit = () => {
    alert('スキル編集画面へ！（ここをモーダルやページ遷移に）');
  };

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
      {/* 編集ボタン（コンポーネント） */}
      {isAdmin && <EditButton onClick={handleEdit} label="編集" />}

      {/* 3〜4つ横並び */}
      <SimpleGrid
        columns={[1, 2, 3, 4]}
        spacing={10}
        mb={10}
        justifyItems="center"
      >
        {skills.map((skill) => (
          <Box
            key={skill.name}
            w="260px"
            h="200px"
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
            <Image
              src={skill.imageUrl}
              alt={skill.name}
              w="72px"
              h="72px"
              objectFit="contain"
              borderRadius="lg"
              mb={3}
              bg="gray.100"
              boxShadow="sm"
            />
            <Text fontSize="lg" fontWeight="bold">
              {skill.name}
            </Text>
            <Text color="gray.500" mt={1}>
              {skill.description}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
      <Text textAlign="center" color="gray.600" fontSize="md">
        習得中＆主な技術スタックです。
      </Text>
    </Box>
  );
}
