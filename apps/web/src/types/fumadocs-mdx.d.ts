declare module 'fumadocs-mdx:collections/server' {
  import type { Source, SourceConfig } from 'fumadocs-core/source';

  interface DocsCollection {
    toFumadocsSource(): Source<SourceConfig>;
  }

  export const docs: DocsCollection;
}
