import type { Event, TeamMember, Project, Testimonial, Stats, SocialLinks } from '@/types';

// Social Media Links - Official Coding Council JMI
export const socialLinks: SocialLinks = {
    linkedin: 'https://www.linkedin.com/company/coding-council/',
    instagram: 'https://www.instagram.com/codingcounciljmi?igsh=MXcwNWtuamV3MDg4eg==',
    github: 'https://github.com/codingcounciljmi/',
    email: 'coding.council.jmi@gmail.com',
    whatsapp: 'https://chat.whatsapp.com/IKPUGagDzlQ5SRLbWGbVyY',
};

// Community Stats
export const stats: Stats = {
    members: 100,
    events: 15,
    workshops: 5,
    projects: 62,
};

// Past Events
export const pastEvents: Event[] = [
    {
        id: '1',
        title: 'HackAI Hackathon 2025',
        description: 'A 48-hour intensive hackathon focused on Artificial Intelligence and Machine Learning. Teams competed to build innovative AI solutions for real-world problems. The event featured mentorship from industry experts, workshops on cutting-edge AI technologies, and prizes worth ₹1,0,000.',
        shortDescription: '48-hour AI/ML hackathon with participants building innovative solutions',
        date: '2026-01-01',
        time: '09:00 AM',
        mode: 'Online',
        location: 'Online',
        category: 'Hackathon',
        status: 'Completed',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        participants: 32,
        participantsInfo: '32 Participants (8 Teams)',
        tags: ['AI', 'ML', 'Deep Learning', 'NLP', 'Computer Vision'],
        featured: true,
        winners: [
            {
                name: 'Team Shadow',
                prize: '🥇 Winner',
                description: 'NovaMind: Creative CLI AI Chatbot',
                githubUrl: 'https://github.com/codingcounciljmi/HackAI-hackathon/tree/main/Winner'
            },
            {
                name: 'Team Phantom',
                prize: '🥈 Runner Up',
                description: 'Handyware AI Hub: Multi-Agent Platform',
                githubUrl: 'https://github.com/codingcounciljmi/HackAI-hackathon/tree/main/Runner-Up'
            },
            {
                name: 'Team AIMA',
                prize: '🥉 Third Place',
                description: 'AIMA ChatBot: Hybrid Intelligent Agent',
                githubUrl: 'https://github.com/codingcounciljmi/HackAI-hackathon/tree/main/Second%20Runner%20Up'
            },
        ],
    },
    {
        id: '2',
        title: 'Python Sprint 2025',
        description: 'An intensive 15 Days Program focused on building real-world applications. Participants learned advanced Python concepts, worked on collaborative projects, and received mentorship from senior developers.',
        shortDescription: '15 Days Python Program with hands-on project development',
        date: '2025-12-10',
        endDate: '2025-12-25',
        time: '10:00 AM',
        mode: 'Online',
        location: 'Online',
        category: 'Sprint',
        status: 'Completed',
        image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800',
        participants: 30,
        participantsInfo: '30+ Participants',
        tags: ['Python', 'Django', 'FastAPI', 'Data Science'],
        featured: true,
        externalLink: 'https://python-sprint-jmi.netlify.app/',
    },
];

// Upcoming Events
export const upcomingEvents: Event[] = [
    {
        id: 'upcoming-1',
        title: 'Codex Meetup',
        description: 'An in-person developer networking meetup focused on collaboration, learning, and open-source discussions.',
        shortDescription: 'An in-person developer networking meetup focused on collaboration, learning, and open-source discussions.',
        date: '2026-04-15',
        time: '11:00 AM',
        mode: 'Offline',
        location: 'JMI Campus',
        category: 'Meetup',
        status: 'Upcoming',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
        tags: ['Offline Meetup', 'Networking', 'Open Source'],
        featured: true,
        registrationLink: '#',
    },
    {
        id: '4',
        title: 'Cloud Computing Bootcamp 2026',
        description: 'Master cloud technologies with hands-on experience in AWS, Azure, and GCP. Learn about cloud architecture, deployment strategies, and best practices from industry experts.',
        shortDescription: 'Comprehensive cloud computing bootcamp covering AWS, Azure & GCP',
        date: '2026-02-15',
        endDate: '2026-02-17',
        time: '09:00 AM',
        mode: 'Hybrid',
        location: 'Innovation Center, JMI',
        category: 'Workshop',
        status: 'Upcoming',
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
        maxParticipants: 100,
        tags: ['AWS', 'Azure', 'GCP', 'DevOps', 'Cloud Architecture'],
        featured: false,
        registrationLink: '#register',
    },
];

// Team Members
export const teamMembers: TeamMember[] = [
    {
        id: '1',
        name: 'Arshad Ali',
        role: 'President',
        bio: 'Leading Coding Council initiatives with a focus on quality work, flawless execution, and real-world learnings.',
        image: '/Assets/Arshad Ali.png',
        social: {
            linkedin: 'https://www.linkedin.com/in/arshad-ali-6a1250361',
            github: 'https://github.com/arshadali-coder',
            email: 'arshadali.coder@gmail.com',
        },
        order: 1,
    },
    {
        id: '2',
        name: 'Areeb Khalid',
        role: 'Vice President & Operation Head',
        bio: 'CS & DS | Python & Web Dev | Java DSA | Engaging Orator & Driven Leader. Striving for Excellence.',
        image: '/Assets/Areeb Khalid.png',
        social: {
            linkedin: 'https://www.linkedin.com/in/areeb-khalid-960262379/',
            github: 'https://github.com/Areeb-coder',
            email: 'areebkhalid2401@gmail.com',
        },
        order: 2,
    },
    {
        id: '3',
        name: 'Zaid Rehman',
        role: 'Graphics Head',
        bio: 'Creative designer bringing visual excellence to the Coding Council brand.',
        image: '/Assets/Zaid Rehman.jpeg',
        social: {},
        order: 3,
    },
    {
        id: '4',
        name: 'Kashif Ansari',
        role: 'SMM Head',
        bio: 'Managing and growing the Coding Council social media presence.',
        image: '/Assets/Kashif Ansari.jpeg',
        social: {
            linkedin: 'https://www.linkedin.com/in/kashif-ansari-b85578267/',
        },
        order: 4,
    },
    {
        id: '5',
        name: 'Arman Ahmad',
        role: 'AI/ML Head',
        bio: 'Python Developer specializing in Machine Learning and Backend development.',
        image: '/Assets/Arman Ahmad.jpeg',
        social: {
            linkedin: 'https://www.linkedin.com/in/armanahmad16',
            github: 'https://github.com/4rrmann',
            email: 'kunzairen@gmail.com',
        },
        order: 5,
    },
    {
        id: '9',
        name: 'Jasrah Aftab',
        role: 'Deputy Graphics Head',
        bio: 'CSE undergraduate | Learning DSA in C++ | Exploring Python & Web Development | Graphic Designer | Combining technology with creativity.',
        image: '/Assets/Jasrah Aftab.jpeg',
        social: {
            linkedin: 'https://www.linkedin.com/in/jasrah-aftab-62a747383',
            github: 'https://github.com/jasrahaftab',
            email: 'jasrahaftab06@gmail.com',
        },
        order: 6,
    },
    {
        id: '7',
        name: 'Sadiya Parveen',
        role: 'Associate Graphics Head',
        bio: 'VLSI student | Exploring digital design, IC technology & the future of semiconductors.',
        image: '/Assets/Saadiya Parveen.jpeg',
        social: {
            linkedin: 'https://www.linkedin.com/in/sadiya-parveen-b442a7298',
            github: 'https://github.com/sadiyaparveen1107',
            email: 'sadiyaparveen636@gmail.com',
        },
        order: 7,
    },
    {
        id: '8',
        name: 'Aamina Siraj',
        role: 'HR Head',
        bio: 'Bringing together AI and empathetic leadership to make a difference.',
        image: '/Assets/Aamina Siraj.jpeg',
        social: {
            linkedin: 'https://www.linkedin.com/in/aaminasiraj23',
            email: 'aaminasiraj23@gmail.com',
        },
        order: 8,
    },
    {
        id: '6',
        name: 'Azkiya Faiz',
        role: 'Content Head',
        bio: 'VLSI Student finding her way through chips, logic and code.',
        image: '/Assets/Azkiya Faiz.jpeg',
        social: {
            linkedin: 'https://www.linkedin.com/in/azkiya-faiz-a43364379',
            email: 'azkiyafaizkhan@gmail.com',
        },
        order: 9,
    },
];

// Projects
export const projects: Project[] = [
    {
        id: '4',
        title: 'Clinical Data Auditer',
        description: 'A comprehensive CLI-based audit system validating patient clinical data with automatic audit logging and business rule enforcement.',
        image: '/projects/clinical-data-audit.png',
        tags: ['CLI', 'Healthcare', 'Audit System', 'Validation'],
        githubUrl: 'https://github.com/notaadilansari/Clinical-data-audit-system',
        creator: { name: 'Aadil Ansari CE', avatar: 'https://ui-avatars.com/api/?name=Aadil+Ansari&background=random' },
        stars: 45,
        featured: true,
    },
    {
        id: '5',
        title: 'Vault OS',
        description: 'Secure CLI password management system featuring user authentication, persistent JSON storage, and complete CRUD operations.',
        image: '/projects/vault-os.jpg',
        tags: ['Security', 'CLI', 'Password Manager', 'JSON'],
        githubUrl: 'https://github.com/notaadilansari/Vault-lite/tree/main',
        creator: { name: 'Aadil Ansari CE', avatar: 'https://ui-avatars.com/api/?name=Aadil+Ansari&background=random' },
        stars: 52,
        featured: true,
    },
    {
        id: '6',
        title: 'RPS Engine',
        description: 'Interactive Rock Paper Scissors game with user authentication, multi-round gameplay, and automatic score tracking.',
        image: '/projects/rps-engine.jpg',
        tags: ['Game', 'CLI', 'OOP', 'Authentication'],
        githubUrl: 'https://github.com/notaadilansari/Rock-Paper-Scissors-Game',
        creator: { name: 'Aadil Ansari CE', avatar: 'https://ui-avatars.com/api/?name=Aadil+Ansari&background=random' },
        stars: 38,
    },
    {
        id: '7',
        title: 'Student Performance System',
        description: 'Foundational program teaching loops, user input handling, and mathematical calculations for student grade analysis.',
        image: '/projects/student-performance.jpg',
        tags: ['Python', 'Education', 'Loops', 'Logic'],
        githubUrl: 'https://github.com/ifrah669/Python_winter_sprint_foundationtrack_day4',
        creator: { name: 'Ifrah Nafis CE', avatar: 'https://ui-avatars.com/api/?name=Ifrah+Nafis&background=random' },
        stars: 28,
    },
    {
        id: '8',
        title: 'Banking System',
        description: 'Full-featured CLI bank application with account management, transaction processing, and complete audit logging.',
        image: '/projects/banking-system.jpg',
        tags: ['Banking', 'CLI', 'OOP', 'Audit Logs'],
        githubUrl: 'https://github.com/aliafzal20072-afk/Banking-System',
        creator: { name: 'Afzal CE', avatar: 'https://ui-avatars.com/api/?name=Afzal+CE&background=random' },
        stars: 64,
        featured: true,
    },
];

export const testimonials: Testimonial[] = [
    {
        id: '1',
        name: 'Md Ali Jauhar',
        role: 'Participant',
        company: 'Civil Engineering',
        image: 'https://ui-avatars.com/api/?name=Md+Ali+Jauhar&background=0284c7&color=fff',
        content: 'The Python Winter Sprint was a great learning experience. The daily progression from basics to advanced projects helped in understanding Python deeply. Hands-on projects like CLI systems and API integration were very practical and industry-oriented. Overall, the sprint was well planned and very beneficial.',
        rating: 5,
    },
    {
        id: '2',
        name: 'Aadil Ansari',
        role: 'Participant',
        company: 'Computer Engineering',
        image: 'https://ui-avatars.com/api/?name=Aadil+Ansari&background=4f46e5&color=fff',
        content: 'The intention of this sprint was clear and bold: to deliver quality content and move towards the world of tech. The hackathon was on point—I learned how things really work in the corporate world, from API integration to effective teamwork!',
        rating: 5,
    },
    {
        id: '3',
        name: 'Sharmeen Akhtar',
        role: 'Participant',
        company: 'Electrical and Computer Engineering',
        image: 'https://ui-avatars.com/api/?name=Sharmeen+Akhtar&background=059669&color=fff',
        content: 'It was a great experience to work on amazing projects. The levels classified as foundation and core helped me understand my level and grow. These projects give us immense confidence, and I look forward to building more such projects!',
        rating: 5,
    },
];

// Navigation Items
export const navItems = [
    { label: 'Home', href: '#home' },
    { label: 'About', href: '#about' },
    { label: 'Events', href: '#events' },
    { label: 'Team', href: '#team' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
];
