// main自己紹介
import { Box, Flex, Heading, Text, Image } from '@chakra-ui/react';

export default function HeroSection() {
  return (
    <Flex
      as="section" // ★ 追加: セクション識別子（任意）
      // ★ 変更: スマホは縦積み、md以上で横並び
      direction={{ base: 'column', md: 'row' }}
      // ★ 変更: 縦積み時は中央寄せ、md以上で中央揃え
      align={{ base: 'center', md: 'center' }}
      justify="center"
      minH="80vh"
      // ★ 変更: 端の余白をもう少し広めに（スマホで詰まり防止）
      px={{ base: 4, md: 8 }}
      py={{ base: 8, md: 10 }}
      bg="white"
      position="relative"
      overflow="hidden"
      // ★ 追加: 縦積み時の要素間スペース
      gap={{ base: 8, md: 10 }}
    >
      {/* キャッチコピー＋紹介文（左 → 縦積み時は上） */}
      <Box
        // ★ 変更: 縦積み時は中央、md以上は右寄せ（元のデザインを踏襲）
        display="flex"
        flexDirection="column"
        alignItems={{ base: 'center', md: 'flex-end' }}
        // ★ 変更: 余白はブレークポイントで調整
        pr={{ base: 0, md: 10 }}
        textAlign={{ base: 'center', md: 'right' }}
        zIndex={2}
        // ★ 追加: 横幅が狭い端末での折返しのための最大幅
        maxW={{ base: '24rem', sm: '28rem', md: '32rem' }}
        w="100%"
      >
        <Heading
          as="h1"
          fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }}
          fontWeight="bold"
          color="gray.800"
          mb={4}
          fontFamily="'Zen Maru Gothic', 'M PLUS Rounded 1c', sans-serif"
          fontStyle="italic"
          // ★ 追加: 行間をやや詰めて改行時の見た目を安定
          lineHeight={1.2}
        >
          「一歩ずつ、前へ」
        </Heading>
        <Text
          fontSize={{ base: 'md', md: 'xl' }}
          color="gray.700"
          mb={2}
          fontFamily="'Zen Maru Gothic', 'M PLUS Rounded 1c', sans-serif"
          // ★ 追加: 長文折返しの安定化（英数字が続く場合などの保険）
          wordBreak="break-word"
        >
          好奇心を武器に、
          <br />
          新しいことに挑戦し続ける
          <br />
          エンジニアを目指します。
        </Text>
      </Box>

      {/* 画像（右 → 縦積み時は下） */}
      <Box
        // ★ 変更: 縦積み時は左右マージンなし、md以上で左余白
        ml={{ base: 0, md: 10 }}
        position="relative"
        display="flex"
        alignItems="center"
        justifyContent="center"
        zIndex={1}
        // ★ 追加: 親幅に対してはみ出さないよう調整
        w="100%"
        maxW={{ base: '24rem', sm: '28rem', md: '34rem' }}
      >
        {/* ラフな背景影 */}
        <Box
          // ★ 変更: 固定pxをやめ、親に追従する相対指定
          w="100%"
          // ★ 追加: 画像のアスペクト比に近い比率で高さを出す
          h={{ base: '220px', sm: '260px', md: '410px' }}
          bg="gray.300"
          borderRadius="44% 56% 63% 37% / 54% 46% 63% 47%"
          position="absolute"
          // ★ 変更: 右にはみ出しにくいよう調整
          right={{ base: -4, md: -10 }}
          top={{ base: 8, md: 15 }}
          zIndex={0}
          filter="blur(20px)"
        />

        <Image
          src="/mountain.jpg"
          alt="山登りの画像"
          // ★ 変更: 固定pxをやめ、可変 + 最大幅制御
          w="100%"
          h={{ base: '220px', sm: '260px', md: '410px' }}
          objectFit="cover"
          borderRadius="44% 56% 63% 37% / 54% 46% 63% 47%"
          boxShadow="xl"
          position="relative"
          zIndex={1}
          // ★ 変更: クリップ形状は維持
          style={{ clipPath: 'ellipse(80% 64% at 50% 50%)' }}
        />
      </Box>
    </Flex>
  );
}
