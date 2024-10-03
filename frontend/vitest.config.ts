import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        reporters: ['junit', 'verbose'],
        outputFile: {
            junit: './dist/junit-report.xml',
        },
        coverage: {
            provider: 'v8',
            reporter: ['clover'],
            reportsDirectory: './dist/coverage',
        },
        watch: false
    },
})