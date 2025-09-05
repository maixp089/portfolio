'use client';
import { useRouter } from 'next/navigation';
import { Box, Flex, Heading, Text, Button } from '@chakra-ui/react';
import EditButton from './EditButton';

export default function ContactSection({
  isAdmin = false,
}: {
  isAdmin?: boolean;
}) {
  // 管理者の「確認」ボタン用
  const router = useRouter();
  const handleConfirm = () => {
    router.push('/admin/contact');
  };

  return (
    <Box
      as="section"
      id="contact"
      py={{ base: 16, md: 24 }}      // ★ スマホでは余白を少し小さめに
      px={{ base: 4, md: 6 }}        // ★ スマホで左右に余白を確保
      maxW="container.md"            // ★ 固定800px → Chakraのレスポンシブ幅に変更
      mx="auto"
      textAlign="center"
    >
      {/* 中央線付き見出し */}
      <Flex align="center" justify="center" mb={6}>
        <Box flex="1" h="1.5px" bg="gray.300" />
        <Heading
          as="h2"
          fontSize={{ base: 'xl', md: '2xl' }} // ★ 見出しもレスポンシブ
          mx={4}
          letterSpacing={4}
          fontFamily="'Zen Maru Gothic', 'M PLUS Rounded 1c', sans-serif"
        >
          Contact
        </Heading>
        <Box flex="1" h="1.5px" bg="gray.300" />
      </Flex>

      <Text
        color="gray.600"
        mb={10}
        fontSize={{ base: 'sm', md: 'lg' }}   // ★ スマホでは少し小さめ
        lineHeight={1.8}                      // ★ 行間を広めにして読みやすく
      >
        ポートフォリオをご覧いただきありがとうございます。
        <br />
        どんなことでもお気軽にご連絡いただけると嬉しいです！
        <br />
        いただいた内容にはできるだけ早くお返事いたします。
      </Text>

      <Flex justify="center">
        {isAdmin ? (
          <EditButton onClick={handleConfirm} label="確認" />
        ) : (
          <Button
            as="a"
            href="/contactform"
            size={{ base: 'md', md: 'lg' }}        // ★ スマホで小さめ
            colorScheme="gray"
            variant="solid"
            borderRadius="full"
            px={{ base: 6, md: 10 }}               // ★ ボタン左右の余白を調整
            fontWeight="bold"
            fontFamily="'Zen Maru Gothic', 'M PLUS Rounded 1c', sans-serif"
            boxShadow="md"
            _hover={{
              boxShadow: 'lg',
              opacity: 0.92,
              bg: 'gray.400',
              color: 'white',
            }}
          >
            お問い合わせフォームへ
          </Button>
        )}
      </Flex>
    </Box>
  );
}
