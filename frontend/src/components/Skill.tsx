"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
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
}

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
        const res = await fetch('http://localhost:4000/api/skills');
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "取得に失敗しました");
        setSkills(data);
      } catch (err: any) {
        setError(err.message || "取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const handleEdit = () => {
    router.push('/admin/skill/new');
  };

  if (loading) {
    return (
      <Center minH="40vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center minH="40vh">
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
      {/* 編集ボタン */}
      {isAdmin && (
        <Flex justify="center" mb={4}>
          <EditButton onClick={handleEdit} label="追加" colorScheme="teal" />
        </Flex>
      )}
      {/* 4つ横並び */}
      <SimpleGrid columns={[1, 2, 3, 4]} spacing={10} mb={10} justifyItems="center">
        {skills.map((skill) => (
          <Box
            key={skill.id}
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
            {skill.logoUrl && (
              <Image
                src={`http://localhost:4000/${skill.logoUrl.replace(/^\/?/, '')}`}
                alt={skill.name}
                w="72px"
                h="72px"
                objectFit="contain"
                borderRadius="lg"
                mb={3}
                bg="gray.100"
                boxShadow="sm"
              />
            )}
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
