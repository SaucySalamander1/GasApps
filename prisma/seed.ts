import { PrismaClient } from '@prisma/client';
import { products } from '../src/data/products';
import { services } from '../src/data/services';
import { industries } from '../src/data/industries';
import { projects } from '../src/data/projects';
import { blogPosts } from '../src/data/blog';
import { certifications } from '../src/data/certifications';
import { resources } from '../src/data/resources';
import { jobs } from '../src/data/jobs';
import { faqItems } from '../src/data/faq';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing data (safe for repeated seeding during development)
  await prisma.productSpec.deleteMany();
  await prisma.productDownload.deleteMany();
  await prisma.product.deleteMany();
  await prisma.serviceProcessStep.deleteMany();
  await prisma.service.deleteMany();
  await prisma.industry.deleteMany();
  await prisma.projectResult.deleteMany();
  await prisma.project.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.job.deleteMany();
  await prisma.faqItem.deleteMany();

  // Products
  for (const product of products) {
    await prisma.product.create({
      data: {
        slug: product.slug,
        name: product.name,
        category: product.category,
        description: product.description,
        images: product.images ?? [],
        industries: product.industries ?? [],
        leadTime: product.leadTime,
        warranty: product.warranty,
        certificationCodes: product.certificationCodes ?? [],
        features: product.features ?? [],
        specifications: {
          create: (product.specifications ?? []).map((spec) => ({
            label: spec.label,
            value: spec.value,
          })),
        },
        downloads: {
          create: (product.downloads ?? []).map((d) => ({
            label: d.label,
            fileType: d.fileType,
            fileSize: d.fileSize,
          })),
        },
      },
    });
  }
  console.log(`Seeded ${products.length} products`);

  // Services
  for (const service of services) {
    await prisma.service.create({
      data: {
        slug: service.slug,
        name: service.name,
        summary: service.summary,
        description: service.description,
        features: service.features,
        images: service.images ?? [],
        duration: service.duration,
        coverageArea: service.coverageArea,
        certificationCodes: service.certificationCodes ?? [],
        process: {
          create: (service.process ?? []).map((step, index) => ({
            title: step.title,
            description: step.description,
            order: index,
          })),
        },
      },
    });
  }
  console.log(`Seeded ${services.length} services`);

  // Industries
  for (const industry of industries) {
    await prisma.industry.create({
      data: {
        slug: industry.slug,
        name: industry.name,
        summary: industry.summary,
        description: industry.description,
        applications: industry.applications,
        images: industry.images ?? [],
      },
    });
  }
  console.log(`Seeded ${industries.length} industries`);

  // Projects
  for (const project of projects) {
    await prisma.project.create({
      data: {
        slug: project.slug,
        name: project.name,
        industry: project.industry,
        summary: project.summary,
        challenge: project.challenge,
        solution: project.solution,
        productSlugs: project.productSlugs ?? [],
        images: project.images ?? [],
        results: {
          create: project.results.map((r) => ({
            metric: r.metric,
            value: r.value,
          })),
        },
      },
    });
  }
  console.log(`Seeded ${projects.length} projects`);

  // Blog Posts
  for (const post of blogPosts) {
    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        title: post.title,
        category: post.category,
        date: post.date,
        excerpt: post.excerpt,
        content: post.content,
        images: post.images ?? [],
      },
    });
  }
  console.log(`Seeded ${blogPosts.length} blog posts`);

  // Certifications
  for (const cert of certifications) {
    await prisma.certification.create({
      data: {
        code: cert.code,
        name: cert.name,
        category: cert.category,
        description: cert.description,
      },
    });
  }
  console.log(`Seeded ${certifications.length} certifications`);

  // Resources
  for (const resource of resources) {
    await prisma.resource.create({
      data: {
        slug: resource.slug,
        name: resource.name,
        category: resource.category,
        fileType: resource.fileType,
        fileSize: resource.fileSize,
      },
    });
  }
  console.log(`Seeded ${resources.length} resources`);

  // Jobs (likely empty, that's fine)
  for (const job of jobs) {
    await prisma.job.create({
      data: {
        slug: job.slug,
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
      },
    });
  }
  console.log(`Seeded ${jobs.length} jobs`);

  // FAQ
  for (const faq of faqItems) {
    await prisma.faqItem.create({
      data: {
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
      },
    });
  }
  console.log(`Seeded ${faqItems.length} FAQ items`);

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
