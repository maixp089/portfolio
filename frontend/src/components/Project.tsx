import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Image,
  Flex,
} from '@chakra-ui/react';
import EditButton from './EditButton';

// 仮データ（本番はAPIから取得！）
const projects = [
  {
    name: '家計簿アプリ',
    description: '収支管理を簡単にできるシンプルなwebアプリ',
    imageUrl: '/images/kakebo.png',
  },
  {
    name: 'ポートフォリオサイト',
    description: '自身のスキルや実績をまとめたポートフォリオ',
    imageUrl: '/images/portfolio.png',
  },
];

export default function ProjectSection({
  isAdmin = false,
}: {
  isAdmin?: boolean;
}) {
  const handleEdit = () => {
    alert('プロジェクト編集画面へ！（ここをモーダルやページ遷移に）');
  };

  return (
    <Box as="section" id="project" py={16} px={4} maxW="1200px" mx="auto">
      {/* 見出しを中央線付きで */}
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
      {/* 編集ボタン（コンポーネント） */}
      {isAdmin && <EditButton onClick={handleEdit} label="編集" />}

      <SimpleGrid columns={[1, 2]} spacing={10} mb={10} justifyItems="center">
        {projects.map((project) => (
          <Box
            key={project.name}
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
            <Image
              src={project.imageUrl}
              alt={project.name}
              w="100%"
              h="150px"
              objectFit="cover"
              borderRadius="lg"
              mb={4}
              bg="gray.100"
              boxShadow="sm"
            />
            <Text fontSize="xl" fontWeight="bold">
              {project.name}
            </Text>
            <Text color="gray.500" mt={1}>
              {project.description}
            </Text>
          </Box>
        ))}
      </SimpleGrid>
      <Text textAlign="center" color="gray.600" fontSize="md">
        これまでに制作した主なプロジェクトです。
      </Text>
    </Box>
  );
}
