"use client";
import { useRouter } from "next/navigation";
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
} from "@chakra-ui/react";
import { useState } from "react";

export default function ContactFormPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // バリデーション（必要なら追加OK）
    if (!name || !email || !message) {
      toast({
        title: "エラー",
        description: "すべて入力してください！",
        status: "error",
        duration: 2500,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        throw new Error("送信に失敗しました");
      }

      setSubmitted(true);
      toast({
        title: "送信完了",
        description: "お問い合わせを送信しました。ありがとうございました！",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    // 2秒くらい待ってからトップへ
      setTimeout(() => {
        router.push("/");
      }, 2000);
   
    } catch (error: any) {
      toast({
        title: "送信エラー",
        description: error.message || "何らかのエラーが発生しました",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" py={12} px={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>
        お問い合わせフォーム
      </Text>
      {submitted ? (
        <Box bg="green.50" p={6} rounded="md" textAlign="center">
          <Text color="green.600" fontWeight="bold">
            送信ありがとうございました！
          </Text>
        </Box>
      ) : (
        <form onSubmit={handleSubmit}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>名前</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="お名前を入力"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>メールアドレス</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>メッセージ</FormLabel>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="ご用件をご記入ください"
                rows={5}
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={loading}
              loadingText="送信中..."
            >
              送信
            </Button>
            {loading && <Spinner />}
          </VStack>
        </form>
      )}
    </Box>
  );
}
