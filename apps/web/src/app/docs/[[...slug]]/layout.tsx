import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';

export default function Layout(props: {
  children: React.ReactNode;
}) {
  return (
    <DocsLayout tree={source.pageTree} nav={{ title: 'Documentation' }}>
      {props.children}
    </DocsLayout>
  );
}
