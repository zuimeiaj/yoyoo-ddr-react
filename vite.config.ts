import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { babel } from '@rollup/plugin-babel'
import ts from '@rollup/plugin-typescript'
import { resolve } from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/components/ddr/index.tsx',
      name: 'ddr-react',
      fileName: (name) => `ddr-react.${name}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'react',
          'react-dmo': 'react-dom',
        },
      },
      plugins: [
        ts({
          target: 'es2015', // 这里指定编译到的版本，
          rootDir: 'src/components/ddr/',
          declaration: true,
          declarationDir: resolve(__dirname, 'dist'),
          exclude: resolve(__dirname, 'node_modules/**'),
          allowSyntheticDefaultImports: true,
        }),
        babel({
          babelHelpers: 'runtime',
          extensions: ['.tsx', '.ts'],
          plugins: ['@babel/plugin-transform-runtime'],
          presets: [
            [
              '@babel/preset-env',
              {
                useBuiltIns: false,
                targets: {
                  browsers: ['last 2 versions', '> 1%', 'not ie <= 11'],
                },
              },
            ],
          ],
        }),
      ],
    },
  },
})
