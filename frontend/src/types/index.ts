// Event Types
export interface Event {
    id: string;
    title: string;
    description: string;
    shortDescription: string;
    date: string;
    endDate?: string;
    time: string;
    mode: 'Online' | 'Offline' | 'Hybrid';
    location?: string;
    category: 'Hackathon' | 'Workshop' | 'Sprint' | 'Meetup' | 'Competition';
    status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
    image: string;
    registrationLink?: string;
    externalLink?: string;
    participants?: number;
    participantsInfo?: string;
    maxParticipants?: number;
    tags: string[];
    winners?: Winner[];
    gallery?: string[];
    featured?: boolean;
}

export interface Winner {
    name: string;
    prize: string;
    description?: string;
    image?: string;
    githubUrl?: string;
}

// Team Member Types
export interface TeamMember {
    id: string;
    name: string;
    role: string;
    bio: string;
    image: string;
    year?: string;
    social: {
        linkedin?: string;
        github?: string;
        email?: string;
    };
    order: number;
}

// Project Types
export interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    tags: string[];
    githubUrl?: string;
    liveUrl?: string;
    creator: {
        name: string;
        avatar: string;
    };
    stars: number;
    featured?: boolean;
}

// Blog Types
export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    tags: string[];
    author: {
        name: string;
        avatar: string;
    };
    publishedAt: string;
    readTime: number;
    featured?: boolean;
}

// Registration Types
export interface EventRegistration {
    id: string;
    eventId: string;
    name: string;
    email: string;
    phone: string;
    college?: string;
    linkedinUrl?: string;
    foodPreference?: 'Veg' | 'Non-Veg';
    status: 'Pending' | 'Confirmed' | 'Cancelled';
    registeredAt: string;
}

// Contact Form Types
export interface ContactForm {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

// Testimonial Types
export interface Testimonial {
    id: string;
    name: string;
    role: string;
    company?: string;
    image: string;
    content: string;
    rating: number;
}

// Stats Types
export interface Stats {
    members: number;
    events: number;
    workshops: number;
    projects: number;
}

// Navigation Types
export interface NavItem {
    label: string;
    href: string;
    children?: NavItem[];
}

// Social Links
export interface SocialLinks {
    linkedin: string;
    instagram: string;
    github: string;
    email: string;
    whatsapp: string;
}
