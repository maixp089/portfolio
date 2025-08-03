'use client';
import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
} from '@chakra-ui/react';

type Contact = {
  id: number;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/contacts');
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
      <Heading size="lg" mb={8}>
        お問い合わせ一覧
      </Heading>
      {loading ? (
        <Spinner size="lg" />
      ) : contacts.length === 0 ? (
        <Text>お問い合わせはまだありません。</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>名前</Th>
              <Th>メールアドレス</Th>
              <Th>メッセージ</Th>
              <Th>日時</Th>
            </Tr>
          </Thead>
          <Tbody>
            {contacts.map((c) => (
              <Tr key={c.id}>
                <Td>{c.id}</Td>
                <Td>{c.name}</Td>
                <Td>{c.email}</Td>
                <Td>{c.message}</Td>
                <Td>
                  {new Date(c.createdAt).toLocaleString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
}
