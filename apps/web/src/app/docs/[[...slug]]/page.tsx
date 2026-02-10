import { source } from '@/lib/source';
import type { TOCItemType } from 'fumadocs-core/toc';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/page';
import type { MDXComponents } from 'mdx/types';
import { notFound } from 'next/navigation';

// Type definition for Fumadocs page data
interface FumadocsPageData {
  title: string;
  description?: string;
  toc: TOCItemType[];
  full?: boolean;
  body: React.ComponentType<{ components?: MDXComponents }>;
}

export default async function Page(props: { params: Promise<{ slug?: string[] }> }) {
  const params = await props.params;
  const slug = params.slug || [];
  const page = source.getPage(slug);

  if (!page) notFound();

  // Type assertion for page.data since TypeScript doesn't infer Fumadocs types correctly
  const pageData = page.data as unknown as FumadocsPageData;
  const MDX = pageData.body;

  return (
    <DocsPage toc={pageData.toc} full={pageData.full}>
      <DocsTitle>{pageData.title}</DocsTitle>
      <DocsDescription>{pageData.description}</DocsDescription>
      <DocsBody>
        <MDX components={defaultMdxComponents} />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}
