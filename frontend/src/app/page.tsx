'use client';
import Header from '../components/Header';
import HeroSection from '../components/Hero';
import ProjectSection from '../components/Project';
import SkillSection from '../components/Skill';
import { Box, Button, Heading, Text, Flex } from '@chakra-ui/react';

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <ProjectSection />
      <SkillSection />

      {/* Contactセクション */}
       <Box as="section" id="contact" py={24} px={4} maxW="800px" mx="auto" textAlign="center">
      {/* 中央線付き見出し */}
      <Flex align="center" justify="center" mb={8}>
        <Box flex="1" h="1.5px" bg="gray.300" />
        <Heading
          as="h2"
          size="lg"
          mx={6}
          letterSpacing={4}
          fontFamily="'Zen Maru Gothic', 'M PLUS Rounded 1c', sans-serif"
        >
          Contact
        </Heading>
        <Box flex="1" h="1.5px" bg="gray.300" />
      </Flex>
      <Text color="gray.500" mb={10} fontSize="lg">
        お仕事のご相談・ご連絡は下記よりお気軽にどうぞ！
      </Text>
      <Flex justify="center">
        <Button
          as="a"
          href="/contact"
          size="lg"
          colorScheme="gray"
          variant="solid"
          borderRadius="full"
          px={10}
          fontWeight="bold"
          fontFamily="'Zen Maru Gothic', 'M PLUS Rounded 1c', sans-serif"
          boxShadow="md"
          _hover={{ boxShadow: 'lg', opacity: 0.92, bg: 'gray.400', color: 'white' }}
        >
          お問い合わせはこちら
        </Button>
      </Flex>
    </Box>
    </>
  );
}
