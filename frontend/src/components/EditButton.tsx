import { Button, Flex } from "@chakra-ui/react";

type EditButtonProps = {
  onClick: () => void;
  label?: string;
};

export default function EditButton({ onClick, label = "編集" }: EditButtonProps) {
  return (
    <Flex justify="center" mb={4}>
      <Button
        size="lg"
        colorScheme="red"
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
