import dts from 'rollup-plugin-dts'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import alias from '@rollup/plugin-alias'
import typescript from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import hashbang from 'rollup-plugin-hashbang'

const entries = ['src/command.ts', 'src/index.ts']

const plugins = [
  babel({
    babelrc: false,
    babelHelpers: 'bundled',
    presets: [
      [
        'env',
        {
          modules: false
        }
      ]
    ]
  }),
  resolve({
    preferBuiltins: true
  }),
  alias(),
  json(),
  typescript(),
  hashbang.default(),
  commonjs()
]

export default [
  ...entries.map((input) => ({
    input,
    output: [
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.mjs'),
        format: 'esm'
      },
      {
        file: input.replace('src/', 'dist/').replace('.ts', '.cjs'),
        format: 'cjs'
      }
    ],
    external: [],
    plugins
  })),
  ...entries.slice(1).map((input) => ({
    input,
    output: {
      file: input.replace('src/', '').replace('.ts', '.d.ts'),
      format: 'esm'
    },
    external: [],
    plugins: [
      dts({
        respectExternal: true
      })
    ]
  }))
]
