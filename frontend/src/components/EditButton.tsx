import { Button, Flex } from "@chakra-ui/react";

type EditButtonProps = {
  onClick: () => void;
  label?: string;
  colorScheme?: string; // ← これを追加！
};

export default function EditButton({
  onClick,
  label = "編集",
  colorScheme = "teal", // ← デフォルト色も指定OK
}: EditButtonProps) {
  return (
    <Flex justify="center" mb={4}>
      <Button
        size="lg"
        colorScheme={colorScheme}
        variant="solid"
        borderRadius="full"
        fontSize="xl"
        fontWeight="bold"
        px={12}
        py={6}
        onClick={onClick}
        boxShadow="lg"
      >
        {label}
      </Button>
    </Flex>
  );
}
