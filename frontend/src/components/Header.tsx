import { Box, Flex, Text, Link, Button, Image } from '@chakra-ui/react';
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../utils/firebase'; // ← initializeApp済みfirebase

// isAdmin をpropsで受け取る
export default function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  const handleLogout = async () => {
    const auth = getAuth(app);
    try {
      await signOut(auth);
      alert('ログアウトしました！');
      window.location.href = '/'; // ← トップページにリダイレクト
    } catch (error) {
      alert('ログアウトに失敗しました');
    }
  };

  return (
    <Box as="header" w="100%" pos="relative" py={4}>
      {/* 横線 */}
      <Box
        position="absolute"
        top="60px"
        left={0}
        w="100%"
        h="2px"
        bg="#222"
        opacity={0.18}
      />
      <Flex
        align="flex-start"
        justify="space-between"
        w="100%"
        px={{ base: 4, md: 10 }}
        position="relative"
        zIndex={2}
      >
        {/* 左：タイトル */}
        <Text
          fontSize={{ base: 'md', md: 'xl' }}
          fontWeight="bold"
          letterSpacing={2}
          fontFamily="'Zen Maru Gothic', 'M PLUS Rounded 1c', sans-serif"
          mt={2}
          display="flex"
          alignItems="center"
        >
          <Image
            src="/sakanalogo.png"
            alt="M logo"
            boxSize="1.5em"
            width="auto"   
            display="inline-block"
            mr="1"
            verticalAlign="middle"
          />
          ai Shimizu Portfolio Site
        </Text>
        {/* 右：メニュー横並び */}
        <Flex align="center" gap={5} mt={1}>
          <Link href="#">Home</Link>
          <Link href="#project">Project</Link>
          <Link href="#skill">Skill</Link>
          <Link
            href="/contactform"
            fontSize="md"
            _hover={{ color: 'blue.600', textDecoration: 'underline' }}
          >
            Contact
          </Link>
          {isAdmin ? (
            <Button
              size="sm"
              colorScheme="gray"
              variant="outline"
              borderRadius="full"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Link
              href="/login"
              fontSize="md"
              _hover={{ color: 'blue.600', textDecoration: 'underline' }}
            >
              Login
            </Link>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}
