import { Box, Flex, Text, Link } from "@chakra-ui/react";

export default function Header() {
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
          fontSize={{ base: "md", md: "xl" }}
          fontWeight="bold"
          letterSpacing={2}
          fontFamily="'Zen Maru Gothic', 'M PLUS Rounded 1c', sans-serif"
          mt={2}
        >
          Mai Shimizu Portfolio Site
        </Text>
        {/* 右：メニュー横並び */}
        <Flex align="center" gap={5} mt={1}>
          <Text as="span" fontSize="md">Home</Text>
          <Text as="span" fontSize="md">Project</Text>
          <Text as="span" fontSize="md">Skill</Text>
          <Link href="/contact" fontSize="md" _hover={{ color: "blue.600", textDecoration: "underline" }}>
            Contact
          </Link>
          <Link href="/login" fontSize="md" _hover={{ color: "blue.600", textDecoration: "underline" }}>
            Login
          </Link>
        </Flex>
      </Flex>
    </Box>
  );
}