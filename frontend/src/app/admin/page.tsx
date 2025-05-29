'use client';
import Header from '../../components/Header';
import ProjectSection from '../../components/Project';
import SkillSection from '../../components/Skill';
// Heroは省略OK（管理者は不要なら外す）
// import HeroSection from '../../components/HeroSection';
import ContactSection from '../../components/Contact';

export default function AdminPage() {
  return (
    <>
      <Header isAdmin />
      {/* 管理者用はHeroセクション抜くのがオススメ */}
      <ProjectSection isAdmin />
      <SkillSection isAdmin />
      <ContactSection isAdmin />
    </>
  );
}
