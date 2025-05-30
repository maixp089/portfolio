'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 管理者ページに遷移
import { Box, Heading, Input, Button, VStack, Text } from '@chakra-ui/react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../utils/firebase'; // ← firebase.tsでinitializeAppしたものをexport

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      // ログイン成功時に管理者ページに
      router.push('/admin');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('予期せぬエラーが発生しました');
      }
    }
    setLoading(false);
  };

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt={20}
      p={8}
      boxShadow="lg"
      borderRadius="xl"
      bg="white"
    >
      <Heading as="h1" mb={8} fontSize="2xl" textAlign="center">
        管理者ログイン
      </Heading>
      <form onSubmit={handleLogin}>
        <VStack spacing={6}>
          <Input
            placeholder="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="パスワード"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            colorScheme="gray"
            size="lg"
            w="100%"
            borderRadius="full"
            isLoading={loading}
          >
            ログイン
          </Button>
        </VStack>
      </form>
      {error && (
        <Text color="red.500" mt={6} textAlign="center">
          {error}
        </Text>
      )}
    </Box>
  );
}
