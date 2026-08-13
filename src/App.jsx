import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import './App.css';

const BrowserFrame = ({ image, title, size = 'large' }) => (
  <div className={`browser-frame browser-frame--${size}`}>
    <div className="browser-frame-bar">
      <div className="browser-frame-dots">
        <span />
        <span />
        <span />
      </div>
    </div>
    <div className="browser-frame-body">
      <img src={image} alt={title} />
    </div>
  </div>
);

const ImageCarousel = ({ images, altPrefix, onImageClick }) => {
  const scrollRef = useRef(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });

  const handleWheel = (e) => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    e.preventDefault();
    scrollRef.current.scrollLeft += e.deltaY;
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    hasDragged.current = false;
    dragStart.current = { x: e.pageX, scrollLeft: scrollRef.current.scrollLeft };
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const dx = e.pageX - dragStart.current.x;
    if (Math.abs(dx) > 5) hasDragged.current = true;
    scrollRef.current.scrollLeft = dragStart.current.scrollLeft - dx;
  };

  const stopDragging = () => {
    isDragging.current = false;
  };

  const scrollByAmount = (dir) => {
    scrollRef.current.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div className="carousel-wrapper">
      <button
        type="button"
        className="carousel-arrow carousel-arrow-left"
        onClick={() => scrollByAmount(-1)}
        aria-label="이전 이미지"
      >
        <ChevronLeft size={20} />
      </button>

      <div
        className="detail-image-list"
        ref={scrollRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
      >
        {images.map((image, imageIndex) => (
          <div
            key={imageIndex}
            className="detail-image-item"
            onClick={() => {
              if (!hasDragged.current) onImageClick(imageIndex);
            }}
          >
            <img src={image} alt={`${altPrefix} ${imageIndex + 1}`} draggable={false} />
          </div>
        ))}
      </div>

      <button
        type="button"
        className="carousel-arrow carousel-arrow-right"
        onClick={() => scrollByAmount(1)}
        aria-label="다음 이미지"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

const Portfolio = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState({});
  const [lightbox, setLightbox] = useState(null); // { images, index, sectionTitle }

  const closeLightbox = () => setLightbox(null);
  const showPrev = () =>
    setLightbox((prev) =>
      prev ? { ...prev, index: (prev.index - 1 + prev.images.length) % prev.images.length } : prev
    );
  const showNext = () =>
    setLightbox((prev) =>
      prev ? { ...prev, index: (prev.index + 1) % prev.images.length } : prev
    );

  useEffect(() => {
    if (!lightbox) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true,
            }));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id^="section-"]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentPage]);

  const projects = [
    {
      id: 1,
      number: '01',
      title: '끼역띠귿',
      subtitleEn: 'Korean Language Learning Platform',
      subtitle: '외국인을 위한 메타버스 기반 한국어 학습 LMS',
      role: 'Frontend · Backend · UI/UX',
      stack: ['HTML', 'CSS', 'JavaScript', 'Java', 'Spring Boot', 'MariaDB', 'Thymeleaf'],
      stackDetail: [
        { tech: 'HTML · CSS · JavaScript', usage: '학습 콘텐츠 탐색 화면과 인터랙션 구현' },
        { tech: 'Java · Spring Boot', usage: '회원, 학습 진도 데이터를 다루는 API 구현' },
        { tech: 'MariaDB', usage: '학습 이력 및 회원 정보 데이터베이스 설계' },
        { tech: 'Thymeleaf', usage: '서버 사이드 렌더링 화면 구성' },
      ],
      year: '2026',
      description:
        'K-Culture와 메타버스를 활용해 외국인이 실제 상황처럼 한국어를 학습할 수 있도록 설계한 LMS입니다.',
      problem:
        '외국인 학습자가 흥미를 잃지 않고 꾸준히 한국어를 학습할 수 있는 콘텐츠와 흐름이 부족했습니다.',
      keyPoint:
        '사용자가 학습 콘텐츠를 쉽게 탐색하고 게임형 요소를 통해 자연스럽게 학습을 이어갈 수 있도록 UI와 흐름을 설계했습니다.',
      image: '/images/kkiyeok/hero.png',
      detailSections: [
  {
    title: 'MAIN',
    description: '서비스의 주요 콘텐츠를 한눈에 확인하고 원하는 학습 영역으로 이동할 수 있도록 구성했습니다.',
    images: [
      '/images/kkiyeok/category_main.png',
      '/images/kkiyeok/practice_main.png',
    ],
  },

  {
    title: 'LEARNING',
    description: '학습 콘텐츠 탐색부터 문제 풀이, 모의고사와 결과 확인까지 하나의 학습 흐름으로 구성했습니다.',
    images: [
      '/images/kkiyeok/category_list.png',
      '/images/kkiyeok/category_list_lock.png',
      '/images/kkiyeok/content_quiz.png',
      '/images/kkiyeok/content_quiz_lock.png',
      '/images/kkiyeok/quiz_list.png',
      '/images/kkiyeok/quiz_view.png',
      '/images/kkiyeok/mock_list.png',
      '/images/kkiyeok/mock_view.png',
      '/images/kkiyeok/mock_result.png',
      '/images/kkiyeok/wrong_notes.png',
    ],
  },

  {
    title: 'COMMUNITY',
    description: '공지사항, FAQ, Q&A 등 학습자에게 필요한 정보를 쉽게 찾을 수 있도록 구성했습니다.',
    images: [
      '/images/kkiyeok/community.png',
      '/images/kkiyeok/qna_main.png',
      '/images/kkiyeok/faq.png',
      '/images/kkiyeok/notice_list.png',
      '/images/kkiyeok/notice_view.png',
    ],
  },

  {
    title: 'USER EXPERIENCE',
    description: '마이페이지와 결제 과정을 사용자가 이해하기 쉬운 단계로 구성했습니다.',
    images: [
      '/images/kkiyeok/mypage.png',
      '/images/kkiyeok/orderpay.png',
      '/images/kkiyeok/orderpay_com.png',
    ],
  },

  {
    title: 'INTERACTION',
    description: '사용자의 행동에 반응하는 인터랙션과 학습 보조 기능을 구현했습니다.',
    images: [
      '/images/kkiyeok/drag.png',
      '/images/kkiyeok/game.png',
      '/images/kkiyeok/kki.png',
      '/images/kkiyeok/ddi.png',
    ],
  },

  {
    title: 'ADMIN',
    description: '관리자가 학습 콘텐츠와 서비스 데이터를 관리할 수 있도록 관리자 화면을 구성했습니다.',
    images: [
      '/images/kkiyeok/admin_main.png',
      '/images/kkiyeok/admin_dasi.png',
    ],
  },
  ], // detailSections 끝

}, // ⭐ 끼역띠귿 project 끝
    
    {
      id: 2,
      number: '02',
      title: '마실 학습터',
      subtitleEn: 'Senior Education LMS',
      subtitle: '시니어를 위한 디지털 교육 LMS',
      role: 'Frontend · Backend · UI/UX',
      stack: ['HTML', 'CSS', 'JavaScript', 'Java', 'Spring Boot', 'MariaDB', 'Thymeleaf'],
      stackDetail: [
        { tech: 'HTML · CSS · JavaScript', usage: '큰 글씨, 단순한 흐름 위주의 학습 화면 구현' },
        { tech: 'Java · Spring Boot', usage: '강좌, 회원, 진도 관리 기능 구현' },
        { tech: 'MariaDB', usage: '강좌 및 회원 데이터베이스 설계' },
        { tech: 'Thymeleaf', usage: '서버 사이드 렌더링 화면 구성' },
      ],
      year: '2026',
      description:
        '키오스크, 스마트폰, 컴퓨터 등 시니어에게 필요한 디지털 교육 콘텐츠를 제공하는 학습 플랫폼입니다.',
      problem:
        '디지털 기기에 익숙하지 않은 시니어 사용자가 온라인 학습에 부담을 느끼고 쉽게 이탈했습니다.',
      keyPoint:
        '시니어 사용자의 특성을 고려해 복잡하지 않고 직관적인 학습 UI를 설계해 부담 없이 방문할 수 있는 공간을 만들었습니다.',
      image: '/images/masil/hero.png',
      detailSections: [
        {
          title: 'MAIN',
          description: '로그인부터 홈 화면까지, 시니어 사용자가 한눈에 학습 상황을 확인할 수 있도록 구성했습니다.',
          images: [
            '/images/masil/main.png',
            '/images/masil/user_main.png',
          ],
        },

        {
          title: 'LEARNING',
          description: '키오스크·스마트폰·컴퓨터 등 학습 카테고리 선택부터 강의 시청, 진도율 확인까지의 흐름을 구성했습니다.',
          images: [
            '/images/masil/user_category_list.png',
            '/images/masil/user_content_list.png',
            '/images/masil/user_content_view.png',
          ],
        },

        {
          title: 'COMMUNITY',
          description: '자유게시판과 FAQ, 마실봇 챗봇을 통해 학습자가 궁금한 점을 쉽게 해결할 수 있도록 구성했습니다.',
          images: [
            '/images/masil/user_community.png',
            '/images/masil/user_faq.png',
            '/images/masil/user_bot.png',
          ],
        },

        {
          title: 'USER EXPERIENCE',
          description: '나의 공부방에서 수강 내역, 진도율, 출석 현황을 확인하고 결제까지 진행할 수 있도록 구성했습니다.',
          images: [
            '/images/masil/user_mypage.png',
            '/images/masil/user_orderpay_list.png',
            '/images/masil/user_content_list_mo.png',
          ],
        },

        {
          title: 'TEACHER',
          description: '강사가 수강생의 학습 현황을 확인하고 퀴즈를 등록·관리할 수 있는 강사 전용 화면을 구성했습니다.',
          images: [
            '/images/masil/teacher_main.png',
            '/images/masil/teacher_mypage.png',
            '/images/masil/teacher_quiz_list.png',
            '/images/masil/teacher_quiz_chuga.png',
          ],
        },

        {
          title: 'ADMIN',
          description: '관리자가 센터 현황을 파악하고 강의 카테고리와 콘텐츠를 등록·관리할 수 있도록 구성했습니다.',
          images: [
            '/images/masil/admin_main.png',
            '/images/masil/admin_dashboard.png',
            '/images/masil/admin_category_chuga.png',
            '/images/masil/admin_content_chuga.png',
          ],
        },
      ],
    },
  ];

  const problems = [
    {
      number: '01',
      title: 'Spring Security 로그인 권한 설정 문제',
      problem: '로그인 후 특정 페이지 접근이 제한되거나 잘못된 경로로 리다이렉트되는 문제가 발생했습니다.',
      cause: 'SecurityFilterChain에 등록된 URL 매핑의 우선순위가 의도한 순서와 다르게 적용되고 있었습니다.',
      solution: 'URL 패턴별 접근 권한 규칙의 순서를 재정리하고, 인증 성공 후 이동 경로를 명확히 지정했습니다.',
      result: '로그인 이후 사용자 권한에 맞는 페이지로 정상적으로 접근할 수 있게 되었습니다.',
    },
    {
      number: '02',
      title: '회원 탈퇴 시 외래키 참조 무결성 문제',
      problem: '회원 삭제 과정에서 연관된 데이터로 인해 삭제가 정상적으로 이루어지지 않는 문제가 발생했습니다.',
      cause: '탈퇴 대상 회원을 참조하는 자식 테이블의 데이터가 먼저 정리되지 않은 채로 삭제를 시도하고 있었습니다.',
      solution: '연관 데이터를 참조 순서에 맞게 먼저 처리한 뒤 회원 데이터를 삭제하도록 로직 순서를 조정했습니다.',
      result: '오류 없이 회원 탈퇴가 정상적으로 처리되도록 개선했습니다.',
    },
  ];

  const navigation = [
    { label: 'WORKS', href: '#works' },
    { label: 'ABOUT', href: '#about' },
    { label: 'PROCESS', href: '#process' },
    { label: 'SKILLS', href: '#skills' },
    { label: 'CONTACT', href: '#contact' },
  ];

  const isVisible = (id) => !!visibleSections[id];

  if (currentPage === 'home') {
    return (
      <div className="portfolio-container">
        {/* Header */}
        <header className={`header ${scrollY > 50 ? 'scrolled' : ''}`}>
          <nav className="nav-bar">
            <div className="logo">KIM YOONHEE</div>

            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="nav-links">
              {navigation.map((item, i) => (
                <a key={i} href={item.href} className="nav-link">
                  {item.label}
                </a>
              ))}
            </div>
          </nav>

          {mobileMenuOpen && (
            <div className="mobile-menu">
              {navigation.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  className="mobile-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="hero" id="section-hero">
          <div className="hero-inner">
            <div
              className="hero-copy"
              style={{ opacity: isVisible('section-hero') ? 1 : 0, transition: 'opacity 0.8s ease 0.2s' }}
            >
              <div className="hero-eyebrow">FRONTEND DEVELOPER</div>
              <h1 className="hero-title">
                디자인을 이해하고,
                <br />
                <span className="accent">서비스를 구현하는</span> 개발자입니다.
              </h1>
              <p className="hero-tagline">
                사용자 경험을 고민하고
                <br />
                실제 동작하는 서비스로 구현합니다.
              </p>
              <div className="hero-meta">UI/UX · FRONTEND · PROBLEM SOLVING</div>
            </div>

            <div
              className="hero-visual"
              style={{ opacity: isVisible('section-hero') ? 1 : 0, transition: 'opacity 0.8s ease 0.4s' }}
            >
              <div className="hero-visual-stack">
                <BrowserFrame image="/images/masil/hero.png" title="마실 학습터" size="hero-back" />
                <BrowserFrame image="/images/kkiyeok/hero.png" title="끼역띠귿" size="hero-front" />
              </div>
            </div>
          </div>

          <a href="#works" className="scroll-indicator">
            <span>SCROLL TO EXPLORE</span>
            <ChevronDown size={18} />
          </a>
        </section>

        {/* Selected Works */}
        <section
          className="works-section"
          id="section-works"
          style={{ opacity: isVisible('section-works') ? 1 : 0, transition: 'opacity 0.8s ease' }}
        >
          <div id="works" className="anchor-offset" />
          <div className="section-label">01 / SELECTED WORKS</div>
          <h2>
            팀으로 기획한 프로젝트에서 프론트엔드를 중심으로
            <br />
            화면부터 API 연동까지 직접 구현했습니다.
          </h2>

          {projects.map((project, idx) => (
            <div key={idx} className="project">
              <div className="project-info">
                <div className="project-number">{project.number}</div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-subtitle-en">{project.subtitleEn}</p>
                <p className="project-subtitle">{project.subtitle}</p>

                <div className="project-meta">
                  <div className="meta-label">ROLE</div>
                  <div className="meta-content">{project.role}</div>
                </div>

                <div className="project-meta">
                  <div className="meta-label">STACK</div>
                  <div className="stack-tags">
                    {project.stack.map((tech, i) => (
                      <span key={i} className="tag">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="project-meta">
                  <div className="meta-label">YEAR</div>
                  <div className="meta-content">{project.year}</div>
                </div>

                <p className="project-desc">{project.keyPoint}</p>

                <button className="project-btn" onClick={() => setCurrentPage(`project-${project.id}`)}>
                  VIEW PROJECT →
                </button>
              </div>

              <div className="project-visual">
                <BrowserFrame image={project.image} title={project.title} size="large" />
              </div>
            </div>
          ))}
        </section>

        {/* Problem Solving */}
        <section
          className="problem-section"
          id="section-problem"
          style={{ opacity: isVisible('section-problem') ? 1 : 0, transition: 'opacity 0.8s ease' }}
        >
          <div className="section-label">02 / PROBLEM SOLVING</div>
          <h2>
            문제를 발견하고
            <br />
            원인을 분석해 해결합니다.
          </h2>
          <p className="section-intro">
            개발 과정에서 실제로 마주했던 문제와, 원인을 분석해 해결한 과정입니다.
          </p>

          <div className="problem-list">
            {problems.map((p, i) => (
              <div key={i} className="problem-card">
                <div className="problem-card-head">
                  <div className="problem-number">PROBLEM {p.number}</div>
                  <h3>{p.title}</h3>
                </div>
                <div className="problem-grid">
                  <div className="problem-step">
                    <div className="problem-step-label">PROBLEM</div>
                    <p>{p.problem}</p>
                  </div>
                  <div className="problem-step">
                    <div className="problem-step-label">CAUSE</div>
                    <p>{p.cause}</p>
                  </div>
                  <div className="problem-step">
                    <div className="problem-step-label">SOLUTION</div>
                    <p>{p.solution}</p>
                  </div>
                  <div className="problem-step">
                    <div className="problem-step-label">RESULT</div>
                    <p>{p.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* About */}
        <section
          className="about-section"
          id="section-about"
          style={{ opacity: isVisible('section-about') ? 1 : 0, transition: 'opacity 0.8s ease' }}
        >
          <div id="about" className="anchor-offset" />
          <div className="section-label">03 / ABOUT</div>
          <h2>사용자 경험부터 생각합니다.</h2>

          <div className="about-text">
            <p>
              편집디자인과 데이터 관련 업무를 경험하며 정보를 효과적으로 전달하고 사용자의 관점에서
              화면을 바라보는 방법을 배웠습니다.
            </p>
            <p>
              이후 웹 개발을 배우며 디자인 경험을 개발에 연결하고, 보기 좋은 화면을 넘어 실제로
              사용하기 편한 서비스를 만드는 것을 고민하고 있습니다.
            </p>
          </div>

          <div className="about-grid">
            {[
              {
                num: '01',
                title: 'USER EXPERIENCE',
                desc: '사용자가 쉽게 이해할 수 있는 화면과 흐름을 설계합니다.',
              },
              {
                num: '02',
                title: 'DEVELOPMENT',
                desc: '설계한 UI를 실제 동작하는 서비스로 구현합니다.',
              },
              {
                num: '03',
                title: 'PROBLEM SOLVING',
                desc: '개발 과정에서 발생하는 문제의 원인을 찾고 해결합니다.',
              },
            ].map((item, i) => (
              <div key={i} className="about-item">
                <div className="about-item-num">{item.num}</div>
                <div className="about-item-title">{item.title}</div>
                <div className="about-item-desc">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section
          className="process-section"
          id="section-process"
          style={{ opacity: isVisible('section-process') ? 1 : 0, transition: 'opacity 0.8s ease' }}
        >
          <div id="process" className="anchor-offset" />
          <div className="section-label">04 / PROCESS</div>
          <h2>이런 순서로 작업합니다.</h2>

          <div className="process-flow">
            {[
              { num: '01', title: 'DISCOVER', desc: '문제와 사용자 니즈를 파악합니다.' },
              { num: '02', title: 'DESIGN', desc: 'UI/UX와 사용자 흐름을 설계합니다.' },
              { num: '03', title: 'DEVELOP', desc: 'React와 Backend를 활용해 구현합니다.' },
              { num: '04', title: 'SOLVE', desc: '개발 과정의 오류와 문제를 해결합니다.' },
              { num: '05', title: 'IMPROVE', desc: '사용자 경험과 기능을 개선합니다.' },
            ].map((step, i, arr) => (
              <React.Fragment key={i}>
                <div className="process-step">
                  <div className="process-num">{step.num}</div>
                  <div className="process-title">{step.title}</div>
                  <div className="process-desc">{step.desc}</div>
                </div>
                {i < arr.length - 1 && <div className="process-arrow">→</div>}
              </React.Fragment>
            ))}
          </div>
        </section>

        {/* Philosophy */}
        <section
          className="philosophy"
          id="section-philosophy"
          style={{ opacity: isVisible('section-philosophy') ? 1 : 0, transition: 'opacity 0.8s ease' }}
        >
          <h2>
            좋은 서비스는
            <br />
            사용자가 <span className="accent">이해하기 쉬워야</span>
            <br />
            한다고 생각합니다.
          </h2>
          <p className="philosophy-text">디자인에서 끝나는 것이 아니라</p>
          <p className="philosophy-detail">실제 동작하는 서비스까지 구현합니다.</p>
        </section>

        {/* Skills */}
        <section
          className="skills-section"
          id="section-skills"
          style={{ opacity: isVisible('section-skills') ? 1 : 0, transition: 'opacity 0.8s ease' }}
        >
          <div id="skills" className="anchor-offset" />
          <div className="section-label">05 / SKILLS</div>
          <h2>서비스를 만드는 데 사용하는 기술입니다.</h2>

          <div className="skill-categories">
            {[
              {
                title: 'FRONTEND',
                note: '화면과 인터랙션을 구현합니다.',
                skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Thymeleaf', 'Responsive Web'],
              },
              {
                title: 'BACKEND',
                note: '데이터와 인증 로직을 구현합니다.',
                skills: ['Java', 'Spring Boot', 'Spring Security', 'JPA'],
              },
              {
                title: 'DATABASE',
                note: '서비스 데이터를 설계하고 관리합니다.',
                skills: ['MariaDB', 'SQL'],
              },
              {
                title: 'TOOLS',
                note: '설계부터 협업, 배포까지 사용합니다.',
                skills: ['Git', 'GitHub', 'Figma', 'IntelliJ IDEA', 'VS Code'],
              },
            ].map((category, i) => (
              <div key={i} className="skill-category">
                <h3>{category.title}</h3>
                <p className="skill-note">{category.note}</p>
                <div className="skill-tags">
                  {category.skills.map((skill, j) => (
                    <span key={j} className="skill-tag">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section
          className="contact"
          id="section-contact"
          style={{ opacity: isVisible('section-contact') ? 1 : 0, transition: 'opacity 0.8s ease' }}
        >
          <div id="contact" className="anchor-offset" />
          <div className="section-label">06 / CONTACT</div>
          <h2>함께 서비스를 만들어보고 싶습니다.</h2>
          <p className="contact-name">KIM YOONHEE</p>
          <p className="contact-role">Frontend Developer</p>
          <div className="contact-buttons">
            <a className="btn-primary" href="mailto:hello@example.com">
              EMAIL →
            </a>
            <a className="btn-secondary" href="https://github.com/" target="_blank" rel="noreferrer">
              GITHUB →
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer>
          <div className="footer-content">
            <div className="footer-logo">KIM YOONHEE</div>
            <div>Frontend Developer · 2026</div>
            <div>© 2026 Yoonhee Kim. Designed &amp; Developed with curiosity.</div>
          </div>
        </footer>
      </div>
    );
  }

  // Project Detail Page
  if (currentPage.startsWith('project-')) {
    const projectId = parseInt(currentPage.split('-')[1], 10);
    const project = projects.find((p) => p.id === projectId);

    return (
      <>
      <div className="portfolio-container">
        <header className="detail-header">
          <nav className="detail-nav">
            <div className="logo">KIM YOONHEE</div>
            <button className="back-btn" onClick={() => setCurrentPage('home')}>
              ← BACK TO HOME
            </button>
          </nav>
        </header>

        <section className="project-detail-hero">
          <div className="section-label">{project.number} / PROJECT OVERVIEW</div>
          <h1>{project.title}</h1>
          <p className="detail-subtitle-en">{project.subtitleEn}</p>
          <p>{project.subtitle}</p>

          <div className="project-detail-visual">
            <BrowserFrame image={project.image} title={project.title} size="detail" />
          </div>
        </section>

        <section className="project-detail-content">
          <div className="detail-section">
            <h2>OVERVIEW</h2>
            <p>{project.description}</p>
          </div>

          <div className="detail-section">
            <h2>PROBLEM</h2>
            <p>{project.problem}</p>
          </div>

          <div className="detail-section">
            <h2>SOLUTION</h2>
            <p>{project.keyPoint}</p>
          </div>

          

          <div className="detail-section">
            <h2>DEVELOPMENT</h2>
            <p className="detail-role-line">
              <strong>ROLE</strong> — {project.role}
            </p>

            {project.detailSections?.map((section, sectionIndex) => (
              <section key={sectionIndex} className="detail-image-section">

                <div className="detail-section-header">
                  <span className="detail-section-number">
                    {String(sectionIndex + 1).padStart(2, '0')}
                  </span>

                  <div>
                    <h2>{section.title}</h2>
                    <p>{section.description}</p>
                  </div>
                </div>

                <ImageCarousel
                  images={section.images}
                  altPrefix={`${project.title} ${section.title}`}
                  onImageClick={(imageIndex) =>
                    setLightbox({
                      images: section.images,
                      index: imageIndex,
                      sectionTitle: section.title,
                    })
                  }
                />

              </section>
            ))}

            <div className="detail-stack-list">
              {project.stackDetail.map((s, i) => (
                <div key={i} className="detail-stack-item">
                  <div className="detail-stack-tech">{s.tech}</div>
                  <div className="detail-stack-usage">{s.usage}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="back-section">
          <button className="back-home-btn" onClick={() => setCurrentPage('home')}>
            ← BACK TO HOME
          </button>
        </section>

        <footer>
          <div className="footer-content">
            <div className="footer-logo">KIM YOONHEE</div>
            <div>Frontend Developer · 2026</div>
            <div>© 2026 Yoonhee Kim. Designed &amp; Developed with curiosity.</div>
          </div>
        </footer>
      </div>

      {lightbox && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="닫기">
            <X size={26} />
          </button>

          <button
            className="lightbox-nav lightbox-prev"
            onClick={(e) => {
              e.stopPropagation();
              showPrev();
            }}
            aria-label="이전 이미지"
          >
            <ChevronLeft size={28} />
          </button>

          <img
            src={lightbox.images[lightbox.index]}
            alt={`${lightbox.sectionTitle} ${lightbox.index + 1}`}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="lightbox-nav lightbox-next"
            onClick={(e) => {
              e.stopPropagation();
              showNext();
            }}
            aria-label="다음 이미지"
          >
            <ChevronRight size={28} />
          </button>

          <div className="lightbox-counter">
            {lightbox.sectionTitle} · {lightbox.index + 1} / {lightbox.images.length}
          </div>
        </div>
      )}
      </>
    );
  }

  return null;
};

export default Portfolio;
