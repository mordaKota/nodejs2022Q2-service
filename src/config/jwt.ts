export default () => {
  return {
    jwt: {
      JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'secret123123',
      TOKEN_EXPIRE_TIME: process.env.TOKEN_EXPIRE_TIME || '1h',
    },
  };
};
