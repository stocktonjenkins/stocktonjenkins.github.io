import React, { CSSProperties, useEffect, useState } from 'react'
import { ReactComponent as UWCrest } from './uw-crest.svg'

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const C = {
  bg:          '#f2f1ed',
  bgAlt:       '#ebeae5',
  bgCard:      '#e6e5e0',
  bgCardHover: '#dddcd7',
  text:        '#26251e',
  textSec:     'rgba(38,37,30,0.55)',
  textMuted:   'rgba(38,37,30,0.38)',
  accent:      '#f54e00',
  accentHover: '#cf2d56',
  border:      'rgba(38,37,30,0.10)',
  borderMed:   'rgba(38,37,30,0.20)',
} as const

const F = {
  display: `'Barlow Condensed', system-ui, sans-serif`,
  body:    `'Crimson Pro', Georgia, serif`,
  mono:    `'IBM Plex Mono', ui-monospace, monospace`,
} as const

// ─── CONTENT ──────────────────────────────────────────────────────────────────

const BIO = {
  name:        'Stockton Jenkins',
  title:       'PhD Student in Computer Science',
  institution: 'University of Wisconsin–Madison',
  advisor:     'TODO: Advisor Name',
  email:       'jsjenkins4@wisc.edu',
  github:      'https://github.com/stocktonjenkins',
  scholar:     'https://scholar.google.com/citations?user=HkFXl3YAAAAJ&hl=en',
  cv:          'https://docs.google.com/document/d/1RCcup9fRClSFGOgjWqmuRjTbuTkHoBnNBmkDRerFb3o/export?format=pdf',
  photo:       'stockton.jpg',
  bio: [
    `I am a PhD student in Computer Science at the University of Wisconsin–Madison,
     advised by <a href="https://junjiehu.github.io/" target="_blank" rel="noopener noreferrer">Prof. Junjie Hu</a> in the HuLab.
     My research focuses on LLM agents — specifically agentic retrieval and search,
     agent memory, and building systems that reason efficiently over large knowledge sources.`,
    `Prior to my PhD, I received my B.S. in Computer Science <em>Summa Cum Laude</em>
     (4.0 GPA) from Brigham Young University, where I was a member of the
     <strong>METAL Lab</strong> working on 3D computer vision. I have also spent several
     years as a full-stack and ML engineer at <strong>Delicious AI</strong>, building
     3D sales intelligence and vision-language systems for retail.`,
  ],
}

const RESEARCH_INTERESTS = [
  {
    icon: '◈',
    title: 'LLM Agents',
    desc:  'Designing autonomous agent systems that plan, reason, and act across multi-step tasks — with a focus on correctness, efficiency, and scalability.',
  },
  {
    icon: '⬡',
    title: 'Agentic Retrieval & Search',
    desc:  'Building retrieval systems where agents iteratively decompose queries, traverse structured knowledge, and accumulate evidence for complex multi-hop questions.',
  },
  {
    icon: '◻',
    title: 'Agent Memory',
    desc:  'Developing memory architectures that let agents retain, index, and recall information across interactions — bridging short-term context with long-horizon knowledge.',
  },
  {
    icon: '◇',
    title: 'Efficient Agentic Systems',
    desc:  'Reducing the token cost of agentic reasoning without sacrificing accuracy, enabling practical deployment of multi-agent pipelines at scale.',
  },
]

const NEWS: { date: string; text: string }[] = [
  { date: 'Apr 2026', text: '<strong>GRASP</strong> submitted to <strong>COLM 2026</strong> — under review. Graph agentic retrieval achieving 40–50% fewer tokens than IRCoT+HippoRAG2 on multi-hop QA.' },
  { date: 'Jan 2026', text: 'Joined the <strong>HuLab</strong> (advised by Prof. Junjie Hu) at UW–Madison.' },
  { date: 'Sep 2025', text: 'Joined <a href="https://r2i.cs.wisc.edu/" target="_blank" rel="noopener noreferrer"><strong>R2I</strong></a> — a UW–Madison student organization dedicated to manifesting research into impactful products.' },
  { date: 'Jul 2025', text: 'My wife Katherine and I welcomed our first baby boy into the world. 🎉' },
  { date: 'Aug 2024', text: 'Started PhD in Computer Science at <strong>University of Wisconsin–Madison</strong>.' },
  { date: 'Aug 2024', text: 'Paper accepted at <strong>KDD 2024</strong>: EdgeRec3D, a real-time 3D retail recommendation system.' },
  { date: 'Jan 2023', text: 'Paper accepted at <strong>WACV 2023</strong>: CountNet3D, 3D counting under extreme occlusion.' },
  { date: 'Nov 2022', text: 'Married the love of my life, Katherine.' },
  { date: 'Jun 2022', text: 'Paper accepted at <strong>AAAI 2022</strong>: Bayesian offline RL for product allocation.' },
  { date: 'Apr 2022', text: 'B.S. Computer Science, BYU — Summa Cum Laude, 4.0 GPA.' },
  { date: 'Jun 2021', text: 'Paper accepted at <strong>AAAI 2021</strong>: Neural Utility Functions.' },
]

interface Paper {
  title:       string
  authors:     string[]        // use '*' suffix to bold (your name)
  venue:       string
  year:        string
  abstract?:   string
  links:       { label: string; href: string }[]
  underReview: boolean
}

const ME = 'J. Stockton Jenkins'

const PUBLICATIONS: Paper[] = [
  {
    title:   'GRASP: Graph Agentic Search over Propositions for Multihop Question Answering',
    authors: [ME, 'Junjie Hu', 'Ramya Vinayak'],
    venue:   'COLM',
    year:    '2026',
    abstract: 'GRASP is an agentic retrieval system that jointly optimizes accuracy and token efficiency for multi-hop QA. It decomposes queries into dependency-aware plans, scales sub-agents to question complexity, and retrieves via a novel three-layer hierarchical graph of entities, propositions, and passages. GRASP achieves highest QA accuracy on MuSiQue and 2WikiMultihopQA while using 40–50% fewer tokens than IRCoT+HippoRAG2.',
    links: [
      { label: 'OpenReview', href: '#' },
    ],
    underReview: true,
  },
  {
    title:   'Personalized Product Assortment with Real-time 3D Perception and Bayesian Payoff Estimation',
    authors: ['Porter Jenkins', 'Michael Selander', ME, 'Andrew Merrill', 'Kyle Armstrong'],
    venue:   'KDD',
    year:    '2024',
    abstract: 'We introduce EdgeRec3D, a real-time recommendation system that uses 3D computer vision for automatic, fine-grained sales estimation running on the edge. A Bayesian model manages LiDAR uncertainty, and a graph-based algorithm handles combinatorial assortment selection. Retail trials demonstrate sales increases of 27–35%, with sustained 9.4% growth over 28 weeks.',
    links: [
      { label: 'PDF',  href: 'https://arxiv.org/pdf/2406.07769' },
      { label: 'arXiv', href: 'https://arxiv.org/abs/2406.07769' },
      { label: 'ACM',  href: 'https://doi.org/10.1145/3637528.3671518' },
    ],
    underReview: false,
  },
  {
    title:   'CountNet3D: A 3D Computer Vision Approach to Infer Counts of Occluded Objects',
    authors: ['Porter Jenkins', 'Kyle Armstrong', 'Stephen Nelson', 'Siddhesh Gotad', ME, 'Wade Wilkey', 'Tanner Watts'],
    venue:   'WACV',
    year:    '2023',
    abstract: 'We study the problem of inferring 3D counts from densely packed, heavily occluded scenes with heterogeneous objects. CountNet3D fuses 2D object detectors for fine-grained classification with a PointNet backbone for geometric embedding, learning counts end-to-end from images and point clouds. Regression-based 3D counting systematically outperforms detection-based methods under extreme occlusion.',
    links: [
      { label: 'PDF',  href: 'https://openaccess.thecvf.com/content/WACV2023/papers/Jenkins_CountNet3D_A_3D_Computer_Vision_Approach_To_Infer_Counts_of_WACV_2023_paper.pdf' },
      { label: 'IEEE', href: 'https://ieeexplore.ieee.org/document/10030990' },
    ],
    underReview: false,
  },
  {
    title:   'Bayesian Model-Based Offline Reinforcement Learning for Product Allocation',
    authors: ['Porter Jenkins', 'Hua Wei', ME, 'Zhenhui Li'],
    venue:   'AAAI',
    year:    '2022',
    abstract: 'We address retail product placement optimization with offline RL. Identifying limitations in model-based approaches for discrete state spaces, we propose PPOPO (Posterior Penalized Offline Policy Optimization), which uses Bayesian posterior predictive distributions to estimate environment dynamics and drive uncertainty-aware exploration. PPOPO outperforms alternative offline methods on both simulated and real-world retail data.',
    links: [
      { label: 'PDF',  href: 'https://ojs.aaai.org/index.php/AAAI/article/view/21523/21272' },
      { label: 'AAAI', href: 'https://ojs.aaai.org/index.php/AAAI/article/view/21523' },
    ],
    underReview: false,
  },
  {
    title:   'Neural Utility Functions',
    authors: ['Porter Jenkins', 'Ahmad Farag', ME, 'Huaxiu Yao', 'Suhang Wang', 'Zhenhui Li'],
    venue:   'AAAI',
    year:    '2021',
    abstract: 'Standard neural networks have no mechanism for explicitly reasoning about item trade-offs. We incorporate principles from economic utility theory into neural architectures, optimizing gradients for consistency with utility axioms. The approach improves theoretical recovery of item relationships and enhances recommendation performance over standard baselines.',
    links: [
      { label: 'PDF',  href: 'https://ojs.aaai.org/index.php/AAAI/article/view/16966/16773' },
      { label: 'AAAI', href: 'https://ojs.aaai.org/index.php/AAAI/article/view/16966' },
    ],
    underReview: false,
  },
]

interface Job {
  role:    string
  org:     string
  period:  string
  bullets: string[]
}

const EXPERIENCE: Job[] = [
  {
    role:    'Full-Stack & Machine Learning Engineer',
    org:     'Delicious AI',
    period:  'Feb 2020 – Present',
    bullets: [
      'Built a 3D sales intelligence platform using LiDAR, edge inference, and computer vision to drive real-time retail analytics.',
      'Developed product image classification and vision-language systems for fine-grained retail SKU recognition.',
      'Led full-stack development across Python (PyTorch, Django, FastAPI), TypeScript (React/React Native), and Google Cloud Platform.',
    ],
  },
  {
    role:    'Research Assistant',
    org:     'METAL Lab, Brigham Young University',
    period:  'Aug 2021 – Apr 2022',
    bullets: [
      'Developed and evaluated 3D object detection and semantic segmentation models.',
      'Published CountNet3D (WACV 2023) on 3D counting under extreme occlusion.',
    ],
  },
]

interface Degree {
  degree:   string
  school:   string
  period:   string
  notes:    string[]
}

const EDUCATION: Degree[] = [
  {
    degree: 'Ph.D. in Computer Science',
    school: 'University of Wisconsin–Madison',
    period: 'Aug 2024 – Present',
    notes:  ['Advisor: Junjie Hu · HuLab', 'LLM Agents · Agentic Retrieval · Agent Memory'],
  },
  {
    degree: 'B.S. in Computer Science',
    school: 'Brigham Young University',
    period: 'Aug 2019 – Apr 2022',
    notes:  ['Summa Cum Laude · 4.0 GPA', 'METAL Lab'],
  },
  {
    degree: 'Computational Mathematics',
    school: 'University of Utah',
    period: '2015 – 2016, 2018 – 2019',
    notes:  ['4.0 GPA', 'Computation emphasis'],
  },
]

interface ServiceEntry {
  role:    string
  org:     string
  orgHref: string
  period:  string
  desc:    string
}

const SERVICE: ServiceEntry[] = [
  {
    role:    'Missionary',
    org:     'The Church of Jesus Christ of Latter-day Saints',
    orgHref: 'https://www.churchofjesuschrist.org/?lang=eng',
    period:  '2016 – 2018',
    desc:    'Served a full-time volunteer mission in Costa Rica, dedicating two years to community service, language immersion in Spanish, and leadership development.',
  },
]

// ─── UTILITY HOOKS ────────────────────────────────────────────────────────────

function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [ids])
  return active
}

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{
    display:        'inline-block',
    fontFamily:     F.mono,
    fontSize:       '11px',
    fontWeight:     500,
    letterSpacing:  '0.04em',
    padding:        '2px 8px',
    borderRadius:   '9999px',
    border:         `1px solid ${C.border}`,
    background:     C.bgCard,
    color:          C.textSec,
  }}>
    {children}
  </span>
)

const Tag: React.FC<{ label: string; href: string }> = ({ label, href }) => {
  const [hov, setHov] = useState(false)
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily:    F.mono,
        fontSize:      '11px',
        fontWeight:    500,
        letterSpacing: '0.05em',
        padding:       '3px 10px',
        borderRadius:  '4px',
        border:        `1px solid ${hov ? C.borderMed : C.border}`,
        background:    hov ? C.bgCard : C.bgAlt,
        color:         hov ? C.accent : C.textSec,
        transition:    'all 0.15s ease',
        whiteSpace:    'nowrap' as const,
      }}
    >
      {label}
    </a>
  )
}

const Divider: React.FC = () => (
  <hr style={{ border: 'none', borderTop: `1px solid ${C.border}`, margin: '0' }} />
)

// ─── SECTIONS ─────────────────────────────────────────────────────────────────

const NavBar: React.FC<{ active: string }> = ({ active }) => {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const links = [
    { id: 'research',     label: 'Research'      },
    { id: 'news',         label: 'News'          },
    { id: 'publications', label: 'Publications'  },
    { id: 'experience',   label: 'Experience'    },
    { id: 'education',    label: 'Education'     },
    { id: 'service',      label: 'Service'       },
  ]

  return (
    <nav style={{
      position:        'sticky',
      top:             0,
      zIndex:          100,
      background:      scrolled ? 'rgba(242,241,237,0.88)' : C.bg,
      backdropFilter:  scrolled ? 'blur(12px)' : 'none',
      borderBottom:    `1px solid ${scrolled ? C.border : 'transparent'}`,
      transition:      'all 0.2s ease',
    }}>
      <div style={{
        maxWidth:       '820px',
        margin:         '0 auto',
        padding:        '0 24px',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        height:         '56px',
      }}>
        {/* Name / logo */}
        <a href="#bio" style={{
          display:        'flex',
          alignItems:     'center',
          gap:            '10px',
          fontFamily:     F.display,
          fontSize:       '17px',
          fontWeight:     600,
          letterSpacing:  '0.02em',
          color:          C.text,
          textDecoration: 'none',
        }}>
          <UWCrest style={{ height: '28px', width: 'auto', fill: C.text, flexShrink: 0 }} />
          Stockton Jenkins
        </a>

        {/* Nav links — hidden on small screens */}
        <div className="nav-links" style={{ display: 'flex', gap: '28px', alignItems: 'center' }}>
          {links.map(l => (
            <a
              key={l.id}
              href={`#${l.id}`}
              style={{
                fontFamily:    F.display,
                fontSize:      '14px',
                fontWeight:    500,
                letterSpacing: '0.04em',
                color:         active === l.id ? C.accent : C.textSec,
                textDecoration:'none',
                transition:    'color 0.15s ease',
              }}
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}

const BioSection: React.FC = () => (
  <section id="bio" style={{ padding: '72px 24px 64px' }}>
    <div className="bio-grid" style={{
      maxWidth: '820px',
      margin:   '0 auto',
      display:  'grid',
      gridTemplateColumns: 'minmax(0,1fr) 220px',
      gap:      '64px',
      alignItems: 'start',
    }}>
      {/* Text */}
      <div>
        <h1 style={{
          fontFamily:    F.display,
          fontSize:      'clamp(42px, 7vw, 64px)',
          fontWeight:    400,
          letterSpacing: '-1.5px',
          lineHeight:    1.05,
          color:         C.text,
          marginBottom:  '6px',
        }}>
          {BIO.name}
        </h1>
        <p style={{
          fontFamily:   F.display,
          fontSize:     '18px',
          fontWeight:   400,
          letterSpacing:'0.01em',
          color:        C.textSec,
          marginBottom: '4px',
        }}>
          {BIO.title}
        </p>
        <p style={{
          fontFamily:   F.display,
          fontSize:     '15px',
          color:        C.textMuted,
          marginBottom: '32px',
        }}>
          {BIO.institution}
        </p>

        {/* Links */}
        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '10px', marginBottom: '36px' }}>
          <Tag label="✉ Email"          href={`mailto:${BIO.email}`} />
          <Tag label="GitHub"           href={BIO.github} />
          <Tag label="Google Scholar"   href={BIO.scholar} />
          <Tag label="CV / Résumé"      href={BIO.cv} />
        </div>

        {/* Bio paragraphs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {BIO.bio.map((p, i) => (
            <p
              key={i}
              dangerouslySetInnerHTML={{ __html: p.replace(/\s+/g, ' ').trim() }}
              style={{
                fontFamily: F.body,
                fontSize:   '18px',
                lineHeight: 1.65,
                color:      C.text,
              }}
            />
          ))}
        </div>
      </div>

      {/* Photo */}
      <div className="bio-photo" style={{
        borderRadius: '8px',
        overflow:     'hidden',
        border:       `1px solid ${C.border}`,
        boxShadow:    `rgba(0,0,0,0.08) 0px 8px 24px`,
      }}>
        <img
          src={BIO.photo}
          alt={BIO.name}
          style={{ width: '100%', display: 'block' }}
        />
      </div>
    </div>
  </section>
)

const ResearchSection: React.FC = () => (
  <section id="research" style={{ padding: '64px 24px', background: C.bgAlt }}>
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <SectionHeading label="Research Interests" />
      <div className="research-grid" style={{
        display:               'grid',
        gridTemplateColumns:   'repeat(auto-fill, minmax(340px, 1fr))',
        gap:                   '16px',
        marginTop:             '32px',
      }}>
        {RESEARCH_INTERESTS.map(r => (
          <div key={r.title} style={{
            background:   C.bg,
            border:       `1px solid ${C.border}`,
            borderRadius: '8px',
            padding:      '24px',
          }}>
            <div style={{
              fontFamily:   F.display,
              fontSize:     '26px',
              color:        C.accent,
              marginBottom: '10px',
              lineHeight:   1,
            }}>
              {r.icon}
            </div>
            <h3 style={{
              fontFamily:    F.display,
              fontSize:      '19px',
              fontWeight:    600,
              letterSpacing: '-0.1px',
              color:         C.text,
              marginBottom:  '8px',
            }}>
              {r.title}
            </h3>
            <p style={{
              fontFamily: F.body,
              fontSize:   '16px',
              lineHeight: 1.6,
              color:      C.textSec,
            }}>
              {r.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

const NewsSection: React.FC = () => (
  <section id="news" style={{ padding: '64px 24px' }}>
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <SectionHeading label="News" />
      <div style={{ marginTop: '28px', display: 'flex', flexDirection: 'column', gap: '0' }}>
        {NEWS.map((item, i) => (
          <React.Fragment key={i}>
            <div className="news-row" style={{
              display:   'grid',
              gridTemplateColumns: '96px 1fr',
              gap:       '24px',
              padding:   '16px 0',
              alignItems:'baseline',
            }}>
              <span style={{
                fontFamily:   F.mono,
                fontSize:     '12px',
                color:        C.textMuted,
                paddingTop:   '2px',
                whiteSpace:   'nowrap' as const,
              }}>
                {item.date}
              </span>
              <p
                dangerouslySetInnerHTML={{ __html: item.text }}
                style={{
                  fontFamily: F.body,
                  fontSize:   '17px',
                  lineHeight: 1.55,
                  color:      C.text,
                }}
              />
            </div>
            {i < NEWS.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
)

const PublicationsSection: React.FC = () => (
  <section id="publications" style={{ padding: '64px 24px', background: C.bgAlt }}>
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <SectionHeading label="Publications" />
      <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {PUBLICATIONS.map((p, i) => (
          <PaperCard key={i} paper={p} />
        ))}
      </div>
    </div>
  </section>
)

const PaperCard: React.FC<{ paper: Paper }> = ({ paper }) => (
  <div className="paper-card" style={{
    background:   C.bg,
    border:       `1px solid ${C.border}`,
    borderRadius: '8px',
    padding:      '20px 24px',
  }}>
    {/* Venue + year pill */}
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
      <Pill>{paper.venue} {paper.year}</Pill>
      {paper.underReview && (
        <Pill>Under Review</Pill>
      )}
    </div>

    {/* Title */}
    <h3 style={{
      fontFamily:    F.display,
      fontSize:      '20px',
      fontWeight:    500,
      letterSpacing: '-0.1px',
      lineHeight:    1.25,
      color:         C.text,
      marginBottom:  '8px',
    }}>
      {paper.title}
    </h3>

    {/* Authors */}
    <p style={{
      fontFamily: F.body,
      fontSize:   '15px',
      color:      C.textSec,
      marginBottom: paper.abstract ? '10px' : '14px',
      lineHeight: 1.4,
    }}>
      {paper.authors.map((a, i) => (
        <React.Fragment key={a}>
          {a === ME
            ? <strong style={{ color: C.text }}>{a}</strong>
            : a}
          {i < paper.authors.length - 1 ? ', ' : ''}
        </React.Fragment>
      ))}
    </p>

    {/* Abstract */}
    {paper.abstract && (
      <p style={{
        fontFamily:   F.body,
        fontSize:     '16px',
        lineHeight:   1.55,
        color:        C.textSec,
        marginBottom: '14px',
      }}>
        {paper.abstract}
      </p>
    )}

    {/* Links */}
    {paper.links.length > 0 && (
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' as const }}>
        {paper.links.map(l => (
          <Tag key={l.label} label={l.label} href={l.href} />
        ))}
      </div>
    )}
  </div>
)

const ExperienceSection: React.FC = () => (
  <section id="experience" style={{ padding: '64px 24px' }}>
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <SectionHeading label="Work Experience" />
      <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '0' }}>
        {EXPERIENCE.map((job, i) => (
          <React.Fragment key={i}>
            <JobRow job={job} />
            {i < EXPERIENCE.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
)

const JobRow: React.FC<{ job: Job }> = ({ job }) => (
  <div style={{ padding: '28px 0', display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' as const, gap: '8px' }}>
      <div>
        <span style={{
          fontFamily:   F.display,
          fontSize:     '19px',
          fontWeight:   600,
          letterSpacing:'-0.1px',
          color:        C.text,
        }}>
          {job.role}
        </span>
        <span style={{
          fontFamily: F.display,
          fontSize:   '16px',
          color:      C.textSec,
          marginLeft: '10px',
        }}>
          — {job.org}
        </span>
      </div>
      <span style={{
        fontFamily: F.mono,
        fontSize:   '12px',
        color:      C.textMuted,
      }}>
        {job.period}
      </span>
    </div>
    <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {job.bullets.map((b, i) => (
        <li key={i} style={{
          fontFamily: F.body,
          fontSize:   '17px',
          lineHeight: 1.55,
          color:      C.textSec,
        }}>
          {b}
        </li>
      ))}
    </ul>
  </div>
)

const EducationSection: React.FC = () => (
  <section id="education" style={{ padding: '64px 24px', background: C.bgAlt }}>
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <SectionHeading label="Education" />
      <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '0' }}>
        {EDUCATION.map((d, i) => (
          <React.Fragment key={i}>
            <DegreeRow degree={d} />
            {i < EDUCATION.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
)

const DegreeRow: React.FC<{ degree: Degree }> = ({ degree }) => (
  <div style={{ padding: '28px 0' }}>
    <div style={{
      display:         'flex',
      justifyContent:  'space-between',
      alignItems:      'baseline',
      flexWrap:        'wrap' as const,
      gap:             '8px',
      marginBottom:    '8px',
    }}>
      <span style={{
        fontFamily:    F.display,
        fontSize:      '20px',
        fontWeight:    600,
        letterSpacing: '-0.1px',
        color:         C.text,
      }}>
        {degree.degree}
      </span>
      <span style={{
        fontFamily: F.mono,
        fontSize:   '12px',
        color:      C.textMuted,
      }}>
        {degree.period}
      </span>
    </div>
    <p style={{
      fontFamily:   F.display,
      fontSize:     '16px',
      fontWeight:   500,
      color:        C.textSec,
      marginBottom: '10px',
    }}>
      {degree.school}
    </p>
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '8px' }}>
      {degree.notes.map(n => <Pill key={n}>{n}</Pill>)}
    </div>
  </div>
)

const ServiceSection: React.FC = () => (
  <section id="service" style={{ padding: '64px 24px' }}>
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <SectionHeading label="Service" />
      <div style={{ marginTop: '32px' }}>
        {SERVICE.map((s, i) => (
          <React.Fragment key={i}>
            <div style={{ padding: '28px 0' }}>
              <div style={{
                display:        'flex',
                justifyContent: 'space-between',
                alignItems:     'baseline',
                flexWrap:       'wrap' as const,
                gap:            '8px',
                marginBottom:   '10px',
              }}>
                <div>
                  <span style={{
                    fontFamily:    F.display,
                    fontSize:      '19px',
                    fontWeight:    600,
                    letterSpacing: '-0.1px',
                    color:         C.text,
                  }}>
                    {s.role}
                  </span>
                  <span style={{ fontFamily: F.display, fontSize: '16px', color: C.textSec, marginLeft: '10px' }}>
                    —{' '}
                    <a href={s.orgHref} target="_blank" rel="noopener noreferrer" style={{ color: C.textSec }}>
                      {s.org}
                    </a>
                  </span>
                </div>
                <span style={{ fontFamily: F.mono, fontSize: '12px', color: C.textMuted }}>
                  {s.period}
                </span>
              </div>
              <p style={{ fontFamily: F.body, fontSize: '17px', lineHeight: 1.6, color: C.textSec }}>
                {s.desc}
              </p>
            </div>
            {i < SERVICE.length - 1 && <Divider />}
          </React.Fragment>
        ))}
      </div>
    </div>
  </section>
)

const Footer: React.FC = () => (
  <footer style={{
    padding:      '40px 24px',
    borderTop:    `1px solid ${C.border}`,
    textAlign:    'center',
  }}>
    <p style={{
      fontFamily: F.mono,
      fontSize:   '12px',
      color:      C.textMuted,
    }}>
      © {new Date().getFullYear()} Stockton Jenkins ·{' '}
      <a href={`mailto:${BIO.email}`} style={{ color: C.textMuted }}>
        {BIO.email}
      </a>
    </p>
  </footer>
)

// ─── SHARED ───────────────────────────────────────────────────────────────────

const SectionHeading: React.FC<{ label: string }> = ({ label }) => (
  <h2 style={{
    fontFamily:    F.display,
    fontSize:      'clamp(28px, 5vw, 36px)',
    fontWeight:    400,
    letterSpacing: '-0.72px',
    lineHeight:    1.15,
    color:         C.text,
    borderBottom:  `1px solid ${C.border}`,
    paddingBottom: '12px',
  }}>
    {label}
  </h2>
)

// ─── RESPONSIVE STYLES ────────────────────────────────────────────────────────

const ResponsiveStyle = () => (
  <style>{`
    @media (max-width: 640px) {
      /* Nav: hide section links, just show name */
      .nav-links { display: none !important; }

      /* Bio: single column, photo above text and constrained */
      .bio-grid {
        grid-template-columns: 1fr !important;
        gap: 28px !important;
      }
      .bio-photo {
        order: -1;
        width: 150px;
        justify-self: center;
      }
      #bio { padding: 40px 16px 48px !important; }

      /* Research cards: force single column */
      .research-grid {
        grid-template-columns: 1fr !important;
      }

      /* News: stack date above text */
      .news-row {
        grid-template-columns: 1fr !important;
        gap: 4px !important;
      }

      /* Section padding: tighter on mobile */
      #research, #news, #publications, #experience, #education, #service {
        padding: 48px 16px !important;
      }

      /* Paper cards: tighter padding */
      #publications .paper-card {
        padding: 16px !important;
      }
    }
  `}</style>
)

// ─── APP ──────────────────────────────────────────────────────────────────────

const SECTION_IDS = ['bio', 'research', 'news', 'publications', 'experience', 'education', 'service']

const App: React.FC = () => {
  const active = useScrollSpy(SECTION_IDS)

  return (
    <>
      <ResponsiveStyle />
      <NavBar active={active} />
      <main>
        <BioSection />
        <ResearchSection />
        <NewsSection />
        <PublicationsSection />
        <ExperienceSection />
        <EducationSection />
        <ServiceSection />
      </main>
      <Footer />
    </>
  )
}

export default App
