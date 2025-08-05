'use client';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function ContactFormPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast({
        title: '入力エラー',
        description: 'すべての項目をご記入ください。',
        status: 'error',
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        throw new Error('送信に失敗しました');
      }

      setSubmitted(true);
      toast({
        title: '送信完了',
        description: 'お問い合わせいただきありがとうございます！できるだけ早くご返信いたします。',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error: unknown) {
      let message = '何らかのエラーが発生しました';
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: '送信エラー',
        description: message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" py={12} px={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={2}>
        お問い合わせフォーム
      </Text>
      <Text mb={6} color="gray.600">
        ポートフォリオをご覧いただきありがとうございます。
        ご質問など、ご自由にご記入ください！
      </Text>
      {submitted ? (
        <Box bg="green.50" p={6} rounded="md" textAlign="center">
          <Text color="green.600" fontWeight="bold" mb={2}>
            お問い合わせありがとうございました！
          </Text>
          <Text color="gray.700">
            内容を確認のうえ、できるだけ早くご返信いたします。
          </Text>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>お名前</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例）山田 太郎"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>メールアドレス</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="例）your@email.com"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>お問い合わせ内容</FormLabel>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="お仕事の相談やご質問などご自由にご記入ください"
                rows={5}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={loading}
              loadingText="送信中..."
            >
              送信する
            </Button>
            {loading && <Spinner />}
          </VStack>
        </form>
      )}
    </Box>
  );
}
