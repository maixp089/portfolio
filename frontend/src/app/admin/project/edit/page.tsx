'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, Heading, Input, Textarea, Button, Image, Flex } from "@chakra-ui/react";

const projectId = 1; // 仮：動的対応するなら params などで受け取って！

export default function ProjectEditPage() {
  const router = useRouter();
  // 新規の場合は { name: "", description: "", imageUrl: "" }
  const [project, setProject] = useState({ name: "", description: "", imageUrl: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isNew, setIsNew] = useState(false); // 新規追加かどうか

  // 既存データ取得
  useEffect(() => {
    // 新規追加ページなら取得せず
    if (!isNew) {
      fetch(`/api/projects/${projectId}`)
        .then(res => res.json())
        .then(data => {
          setProject({ name: data.name, description: data.description, imageUrl: data.imageUrl || "" });
        });
    }
  }, [isNew]);

  // フォーム変更
  const handleChange = (e: any) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: any) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // 追加または更新
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("name", project.name);
    formData.append("description", project.description);
    if (imageFile) formData.append("image", imageFile);

    if (isNew) {
      // 追加
      await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });
      alert("追加しました！");
    } else {
      // 変更
      await fetch(`/api/projects/${projectId}`, {
        method: "PUT",
        body: formData,
      });
      alert("変更しました！");
    }
    router.push("/admin");
  };

  // 削除
  const handleDelete = async () => {
    if (!window.confirm("本当に削除しますか？")) return;
    await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });
    alert("削除しました！");
    router.push("/admin");
  };

  return (
    <Box maxW="600px" mx="auto" mt={10}>
      <Heading mb={8}>{isNew ? "プロジェクト追加" : "プロジェクト編集"}</Heading>
      <Input
        name="name"
        placeholder="プロジェクト名"
        value={project.name}
        onChange={handleChange}
        mb={4}
      />
      <Textarea
        name="description"
        placeholder="説明"
        value={project.description}
        onChange={handleChange}
        mb={4}
      />
      {/* 画像プレビュー */}
      {project.imageUrl && (
        <Image src={project.imageUrl} alt="project" boxSize="200px" mb={4} />
      )}
      {/* 新しい画像選択 */}
      <Input type="file" accept="image/*" onChange={handleImageChange} mb={4} />
      <Flex gap={4}>
        {/* 追加 or 変更ボタン */}
        <Button colorScheme="teal" size="lg" onClick={handleSave}>
          {isNew ? "追加" : "変更"}
        </Button>
        {/* 削除ボタン（新規のときは非表示） */}
        {!isNew && (
          <Button colorScheme="red" size="lg" onClick={handleDelete}>
            削除
          </Button>
        )}
        {/* 新規追加への切り替え（サンプル） */}
        {!isNew && (
          <Button colorScheme="gray" variant="outline" onClick={() => setIsNew(true)}>
            新規追加
          </Button>
        )}
      </Flex>
    </Box>
  );
}
