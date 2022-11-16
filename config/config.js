const properties = {
    mysql: {
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT, 
        user: process.env.MYSQL_USER, 
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE

    },
    poolData: {
        UserPoolId: process.env.COGNITO_USERPOOL_ID,
        ClientId: process.env.COGNITO_CLIENT_ID,
        poolRegion: process.env.COGNITO_POOL_REGION
    },
    lambda: {
        sendEmailLambdaName: process.env.LAMBDA_SEND_EMAIL_NAME,
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: process.env.LAMBDA_REGION

    }
};
const jwkUrl = `https://cognito-idp.${properties.poolData.poolRegion}.amazonaws.com/${properties.poolData.UserPoolId}/.well-known/jwks.json`;

 module.exports = {properties, jwkUrl}