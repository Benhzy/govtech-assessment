export const config = {
    port: process.env.PORT || 5000,
    jwtSecret: process.env.JWT_SECRET || '',
    govaaApiUrl: process.env.GOVAA_API_URL || 'http://localhost:5001',
  };