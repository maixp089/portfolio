'use client';
import {
  Box,
  Flex,
  Text,
  Link,
  Button,
  Image,
  IconButton,      // ← 追加
  HStack,          // ← 追加
  Drawer,          // ← 追加
  DrawerOverlay,   // ← 追加
  DrawerContent,   // ← 追加
  DrawerHeader,    // ← 追加
  DrawerBody,      // ← 追加
  DrawerCloseButton, // ← 追加
  Stack,           // ← 追加
  useDisclosure,   // ← 追加
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons'; // ← 追加
import { getAuth, signOut } from 'firebase/auth';
import { app } from '../utils/firebase'; // ← initializeApp済みfirebase

// isAdmin をpropsで受け取る
export default function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  const { isOpen, onOpen, onClose } = useDisclosure(); // ← 追加

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

        {/* 右：デスクトップ用ナビ */}
        <HStack
          as="nav"
          spacing={5}
          alignItems="flex-end"
          height="40px"
          display={{ base: 'none', md: 'flex' }} // ← モバイルでは非表示
        >
          <Link href="#" fontSize="lg">Home</Link>
          <Link href="#project" fontSize="lg">Project</Link>
          <Link href="#skill" fontSize="lg">Skill</Link>
          <Link
            href="/contactform"
            fontSize="lg"
            _hover={{ color: 'blue.600', textDecoration: 'underline' }}
          >
            Contact
          </Link>
          {isAdmin ? (
            <Button
              size="md"
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
              fontSize="lg"
              _hover={{ color: 'blue.600', textDecoration: 'underline' }}
            >
              Login
            </Link>
          )}
        </HStack>

        {/* モバイル用ハンバーガー */}
        <IconButton
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          display={{ base: 'inline-flex', md: 'none' }} // ← スマホのみ表示
          variant="ghost"
          onClick={onOpen}
        />
      </Flex>

      {/* Drawerメニュー */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <Stack spacing={4} as="nav" onClick={onClose}>
              <Link href="#" fontSize="lg">Home</Link>
              <Link href="#project" fontSize="lg">Project</Link>
              <Link href="#skill" fontSize="lg">Skill</Link>
              <Link
                href="/contactform"
                fontSize="lg"
                _hover={{ color: 'blue.600', textDecoration: 'underline' }}
              >
                Contact
              </Link>
              {isAdmin ? (
                <Button
                  size="md"
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
                  fontSize="lg"
                  _hover={{ color: 'blue.600', textDecoration: 'underline' }}
                >
                  Login
                </Link>
              )}
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}

