import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://erudite-tome-279803.uc.r.appspot.com/graphql/',
  documents: 'src/graphql/**',
  generates: {
    'src/graphql/__generated__/': {
      preset: 'client',
      plugins: [],
    },
  },
}

export default config
