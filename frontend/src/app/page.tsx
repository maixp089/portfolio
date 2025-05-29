'use client';
import Header from '../components/Header';
import HeroSection from '../components/Hero';
import ProjectSection from '../components/Project';
import SkillSection from '../components/Skill';
import ContactSection from '../components/Contact'

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSection />
      <ProjectSection />
      <SkillSection />
      <ContactSection />
    </>
  );
}
