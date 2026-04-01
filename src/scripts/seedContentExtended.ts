/**
 * Extended Content Seed (Optional)
 * This script adds MORE premium content for a richer experience
 * Run: npx ts-node -O '{"module":"commonjs"}' src/scripts/seedContentExtended.ts
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Article from '@/models/Article';
import StudyMaterial from '@/models/StudyMaterial';
import User from '@/models/User';
import dbConnect from '@/lib/db/connect';

dotenv.config({ path: '.env.local' });

const EXTENDED_ARTICLES = [
  {
    title: 'Understanding Async/Await in JavaScript',
    slug: 'understanding-async-await-javascript',
    excerpt: 'Master asynchronous JavaScript programming with async/await syntax. Learn error handling and best practices.',
    content: `<h2>Async/Await Mastery</h2>
<p>Async/await is syntactic sugar built on top of Promises that makes asynchronous code easier to read and write.</p>
<h3>Promises vs Async/Await</h3>
<p>While Promises can be powerful, async/await provides a cleaner syntax.</p>
<h3>Error Handling with Try/Catch</h3>
<p>Use try/catch blocks to handle errors in async functions.</p>
<h3>Concurrent Requests</h3>
<p>Use Promise.all() to handle multiple async operations concurrently.</p>`,
    author: 'JS Expert',
    category: 'Tutorial',
    tags: ['JavaScript', 'Async', 'Promises', 'Frontend'],
    featured: false,
    published: true,
    publishedAt: new Date('2024-02-10'),
    viewCount: 850,
  },
  {
    title: 'CSS Grid vs Flexbox: When to Use Each',
    slug: 'css-grid-vs-flexbox-when-to-use',
    excerpt: 'Comprehensive comparison between CSS Grid and Flexbox. Learn when to use each layout method for optimal results.',
    content: `<h2>Grid vs Flexbox</h2>
<p>Both CSS Grid and Flexbox are powerful layout tools. Understanding when to use each is crucial.</p>
<h3>Flexbox</h3>
<p>One-dimensional layout system. Best for rows or columns of items.</p>
<h3>CSS Grid</h3>
<p>Two-dimensional layout system. Perfect for complex page layouts.</p>
<h3>Combining Both</h3>
<p>You can use both together for ultimate layout control.</p>`,
    author: 'CSS Master',
    category: 'Tutorial',
    tags: ['CSS', 'Layout', 'Frontend', 'Design'],
    featured: false,
    published: true,
    publishedAt: new Date('2024-02-12'),
    viewCount: 1100,
  },
  {
    title: 'RESTful API Design Principles',
    slug: 'restful-api-design-principles',
    excerpt: 'Learn best practices for designing RESTful APIs that are scalable, maintainable, and easy to use.',
    content: `<h2>Building REST APIs</h2>
<h3>HTTP Methods</h3>
<p>Proper use of GET, POST, PUT, DELETE methods.</p>
<h3>Status Codes</h3>
<p>Correct HTTP status codes for different scenarios.</p>
<h3>Request/Response Format</h3>
<p>Consistent JSON structure for your APIs.</p>
<h3>Versioning</h3>
<p>Strategies for API versioning and backward compatibility.</p>`,
    author: 'Backend Pro',
    category: 'Tutorial',
    tags: ['API', 'Backend', 'REST', 'Design Pattern'],
    featured: false,
    published: true,
    publishedAt: new Date('2024-02-15'),
    viewCount: 920,
  },
  {
    title: 'Git Workflow for Teams',
    slug: 'git-workflow-for-teams',
    excerpt: 'Best practices for collaborative development using Git. Learn branching strategies and code review processes.',
    content: `<h2>Team Git Workflows</h2>
<h3>Feature Branches</h3>
<p>Create separate branches for each feature.</p>
<h3>Pull Requests</h3>
<p>Code review process before merging to main.</p>
<h3>Commit Messages</h3>
<p>Write clear, descriptive commit messages.</p>
<h3>Merge Strategies</h3>
<p>Choose appropriate merge or rebase strategies.</p>`,
    author: 'DevOps Master',
    category: 'Tips',
    tags: ['Git', 'DevOps', 'TeamWork', 'Development'],
    featured: false,
    published: true,
    publishedAt: new Date('2024-02-18'),
    viewCount: 670,
  },
  {
    title: 'Machine Learning for Beginners',
    slug: 'machine-learning-for-beginners',
    excerpt: 'Introduction to machine learning concepts, algorithms, and practical implementation with Python.',
    content: `<h2>Getting Started with ML</h2>
<h3>Supervised Learning</h3>
<p>Learning from labeled data.</p>
<h3>Unsupervised Learning</h3>
<p>Learning patterns from unlabeled data.</p>
<h3>Popular Algorithms</h3>
<p>Linear Regression, Decision Trees, K-Means, Neural Networks.</p>
<h3>Tools & Libraries</h3>
<p>Scikit-learn, TensorFlow, PyTorch.</p>`,
    author: 'ML Engineer',
    category: 'Education',
    tags: ['ML', 'Python', 'AI', 'Data Science'],
    featured: false,
    published: true,
    publishedAt: new Date('2024-02-20'),
    viewCount: 1650,
  },
];

const EXTENDED_MATERIALS = [
  {
    title: 'Complete TypeScript Guide',
    slug: 'complete-typescript-guide',
    description: 'Master TypeScript for type-safe JavaScript development. Includes interfaces, generics, and advanced types.',
    category: 'guide',
    subject: 'TypeScript',
    skillPath: 'Web Development',
    difficulty: 'intermediate',
    content: `<h2>TypeScript Essentials</h2>
<h3>Basic Types</h3>
<p>Strings, numbers, booleans, arrays, and tuples.</p>
<h3>Interfaces</h3>
<p>Define contracts for objects.</p>
<h3>Generics</h3>
<p>Write reusable components with generic types.</p>
<h3>Advanced Types</h3>
<p>Union types, intersection types, and conditional types.</p>`,
    keyPoints: [
      'Type annotations and inference',
      'Interfaces and type aliases',
      'Generics for reusability',
      'Advanced type manipulation',
      'Module system',
    ],
    tags: ['TypeScript', 'JavaScript', 'Frontend', 'Type Safety'],
    published: true,
  },
  {
    title: 'MongoDB Advanced Patterns',
    slug: 'mongodb-advanced-patterns',
    description: 'Advanced MongoDB design patterns, indexing strategies, and optimization techniques.',
    category: 'resource',
    subject: 'MongoDB',
    difficulty: 'advanced',
    content: `<h2>MongoDB Patterns</h2>
<h3>Indexing Strategies</h3>
<p>Single, compound, and text indexes.</p>
<h3>Aggregation Pipeline</h3>
<p>Complex data transformations using aggregation.</p>
<h3>Transactions</h3>
<p>ACID transactions in MongoDB replica sets.</p>
<h3>Sharding</h3>
<p>Horizontal scaling with sharding.</p>`,
    keyPoints: [
      'Index types and optimization',
      'Aggregation pipeline stages',
      'Performance tuning',
      'Replication',
      'Sharding strategies',
    ],
    tags: ['MongoDB', 'Database', 'NoSQL', 'Backend'],
    published: true,
  },
  {
    title: 'Git Deep Dive - Advanced Commands',
    slug: 'git-deep-dive-advanced-commands',
    description: 'Master advanced Git commands and workflows for professional development.',
    category: 'notes',
    subject: 'Git & Version Control',
    difficulty: 'advanced',
    content: `<h2>Advanced Git Techniques</h2>
<h3>Rebasing</h3>
<p>Rewrite commit history with rebase.</p>
<h3>Cherry-pick</h3>
<p>Apply specific commits to different branches.</p>
<h3>Stashing</h3>
<p>Temporarily save work in progress.</p>
<h3>Bisect</h3>
<p>Find the commit that introduced a bug.</p>`,
    keyPoints: [
      'Interactive rebase workflows',
      'Cherry-pick use cases',
      'Stash management',
      'Bisect for debugging',
      'Reflog for recovery',
    ],
    tags: ['Git', 'DevOps', 'Advanced', 'Version Control'],
    published: true,
  },
  {
    title: 'System Design Fundamentals',
    slug: 'system-design-fundamentals',
    description: 'Learn core concepts of system design including scalability, reliability, and maintainability.',
    category: 'guide',
    subject: 'System Architecture',
    difficulty: 'advanced',
    content: `<h2>System Design Basics</h2>
<h3>Scalability</h3>
<p>Horizontal and vertical scaling strategies.</p>
<h3>Load Balancing</h3>
<p>Distribute traffic across servers.</p>
<h3>Caching</h3>
<p>In-memory caching with Redis, Memcached.</p>
<h3>Databases</h3>
<p>SQL vs NoSQL trade-offs.</p>`,
    keyPoints: [
      'Scalability patterns',
      'Load balancing algorithms',
      'Caching strategies',
      'Database design',
      'Microservices architecture',
    ],
    tags: ['System Design', 'Architecture', 'Backend', 'Interview'],
    published: true,
  },
  {
    title: 'Web Security Best Practices',
    slug: 'web-security-best-practices',
    description: 'Comprehensive guide to web application security. Cover common vulnerabilities and protection strategies.',
    category: 'resource',
    subject: 'Security',
    difficulty: 'intermediate',
    content: `<h2>Web Security Guide</h2>
<h3>XSS (Cross-Site Scripting)</h3>
<p>Prevention and mitigation strategies.</p>
<h3>SQL Injection</h3>
<p>Parameterized queries and prepared statements.</p>
<h3>CSRF (Cross-Site Request Forgery)</h3>
<p>Tokens and SameSite cookie attributes.</p>
<h3>Authentication & Authorization</h3>
<p>OAuth, JWT, and session management.</p>`,
    keyPoints: [
      'OWASP Top 10 vulnerabilities',
      'Input validation and sanitization',
      'Secure authentication',
      'HTTPS and encryption',
      'Security headers',
    ],
    tags: ['Security', 'Web', 'Cybersecurity', 'Best Practices'],
    published: true,
  },
];

async function seedExtendedContent() {
  try {
    await dbConnect();
    console.log('🔗 Connected to MongoDB');

    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('⚠️  Admin user not found. Run basic seed first!');
      process.exit(1);
    }

    // Seed Extended Articles
    console.log('📝 Adding extended articles...');
    const articlesWithAuthor = EXTENDED_ARTICLES.map((article) => ({
      ...article,
      author: adminUser._id,
    }));
    await Article.insertMany(articlesWithAuthor);
    console.log(`✅ Added ${EXTENDED_ARTICLES.length} articles`);

    // Seed Extended Materials
    console.log('📚 Adding extended study materials...');
    const materialsWithAuthor = EXTENDED_MATERIALS.map((material) => ({
      ...material,
      author: adminUser._id,
    }));
    await StudyMaterial.insertMany(materialsWithAuthor);
    console.log(`✅ Added ${EXTENDED_MATERIALS.length} study materials`);

    console.log('\n🚀 Extended content seeding completed!');
    console.log('📊 Updated Summary:');
    console.log(`   - Total Articles: ${await Article.countDocuments()}`);
    console.log(`   - Total Study Materials: ${await StudyMaterial.countDocuments()}`);
    console.log('\n✨ Your platform now has even richer content!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding content:', error);
    process.exit(1);
  }
}

seedExtendedContent();
