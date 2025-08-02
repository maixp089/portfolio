// main自己紹介
import { Box, Flex, Heading, Text, Image } from '@chakra-ui/react';

export default function HeroSection() {
  return (
    <Flex
      direction="row"
      align="center"
      justify="center"
      minH="80vh"
      px={{ base: 4, md: 8 }}
      py={10}
      bg="white"
      position="relative"
      overflow="hidden"
    >
      {/* キャッチコピー＋紹介文（左） */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        pr={{ base: 2, md: 10 }}
        zIndex={2}
      >
        <Heading
          as="h1"
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="bold"
          color="gray.800"
          mb={4}
          sx={{
            fontFamily: "'Zen Maru Gothic', 'M PLUS Rounded 1c', sans-serif",
          }}
        >
          「一歩ずつ、前へ」
        </Heading>
        <Text
          fontSize={{ base: 'md', md: 'xl' }}
          color="gray.700"
          mb={2}
          textAlign="center" // ←ここをcenterに！
          fontFamily="'Zen Maru Gothic', 'M PLUS Rounded 1c', sans-serif"
        >
          好奇心を武器に、
          <br />
          新しいことに挑戦し続ける
          <br />
          エンジニアを目指します。
        </Text>
      </Box>

      {/* 画像（右） */}
      <Box
        ml={{ base: 2, md: 10 }}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={1}
      >
        {/* ラフな背景影 */}
          <Box
          w={{ base: "320px", md: "540px" }}
          h={{ base: "220px", md: "410px" }}
          bg="gray.300"
          borderRadius="44% 56% 63% 37% / 54% 46% 63% 47%"
          position="absolute"
          right={-10}
          top={15}
          zIndex={0}
          filter="blur(20px)"
        />

        <Image
          src="/mountain.jpg"
          alt="山登りの画像"
          w={{ base: '320px', md: '540px' }}
          h={{ base: '220px', md: '410px' }}
          objectFit="cover"
          borderRadius="44% 56% 63% 37% / 54% 46% 63% 47%"
          boxShadow="xl"
          position="relative"
          zIndex={1}
          style={{
            clipPath: 'ellipse(80% 64% at 50% 50%)',
          }}
        />
      </Box>
    </Flex>
  );
}
