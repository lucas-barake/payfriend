import { type CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    // CMS - Hygraph
    "src/generated/cms/types.ts": {
      schema: "hygraph-schema.graphql",
      documents: ["src/**/hygraph-*.{gql,graphql}"],
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
    },
    "src/generated/cms/schema.json": {
      schema: "hygraph-schema.graphql",
      plugins: ["introspection"],
    },
  },
};

export default config;
