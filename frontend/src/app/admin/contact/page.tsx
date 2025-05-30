"use client";
import { useEffect, useState } from "react";
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Spinner, Text,
} from "@chakra-ui/react";

type Contact = {
  id: number;
  email: string;
  message: string;
  // 必要ならname, createdAtなど他のフィールドも追加
};

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/contacts");
        const data = await res.json();
        setContacts(data);
      } catch (err) {
        // 必要に応じてエラー処理
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  return (
    <Box maxW="800px" mx="auto" py={12} px={4}>
      <Heading size="lg" mb={8}>お問い合わせ一覧</Heading>
      {loading ? (
        <Spinner size="lg" />
      ) : contacts.length === 0 ? (
        <Text>お問い合わせはまだありません。</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>メールアドレス</Th>
              <Th>メッセージ</Th>
              {/* <Th>名前</Th> 追加項目があればここに */}
            </Tr>
          </Thead>
          <Tbody>
            {contacts.map((c) => (
              <Tr key={c.id}>
                <Td>{c.id}</Td>
                <Td>{c.email}</Td>
                <Td>{c.message}</Td>
                {/* <Td>{c.name}</Td> */}
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
