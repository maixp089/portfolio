import { Button, Flex } from '@chakra-ui/react';

type EditButtonProps = {
  onClick: () => void;
  label?: string;
  colorScheme?: string;
  size?: string;
};

export default function EditButton({
  onClick,
  label = '編集',
  colorScheme = 'teal', // ← デフォルト色
  size = 'lg',
}: EditButtonProps) {
  return (
    <Flex justify="center" mb={4}>
      <Button
        size={size}
        colorScheme={colorScheme}
        variant="solid"
        borderRadius="full"
        fontWeight="bold"
        onClick={onClick}
        boxShadow="lg"
      >
        {label}
      </Button>
    </Flex>
  );
}
