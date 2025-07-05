module.exports = {
  eslint: {
    ignoreDuringBuilds: true, // Only use temporarily
  },
  // or for specific rules:
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn', // Change error to warning
    'react-hooks/exhaustive-deps': 'warn',
  }
}