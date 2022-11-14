const properties = {
    mysql: {
        host: 'subscriptions.cgdyvrf3zl4t.us-east-1.rds.amazonaws.com', // e.g. us-east-2_uXboG5pAb
        port: '3306', // e.g. 25ddkmj4v6hfsfvruhpfi7n4hv
        user: 'admin', // e.g. us-east-2
        password: 'Piyush123.',
        database: 'Subspire'

    },
    s3: {
        accessKeyId: '',
        secretAccessKey: '',
        region: ''
    },
    poolData: {
        UserPoolId: 'us-east-1_ajdX9dHe7',
        ClientId: '53h2pff32r6m0gj4hqtdjf5aqd',
        poolRegion: 'us-east-1'
    },

    api: {
        ianvokeUrl: 'https://hn45jqsf22.execute-api.us-west-2.amazonaws.com/prod' // e.g. https://rc7nyt4tql.execute-api.us-west-2.amazonaws.com/prod',
    }
};
const jwkUrl = `https://cognito-idp.${properties.poolData.poolRegion}.amazonaws.com/${properties.poolData.UserPoolId}/.well-known/jwks.json`;

 module.exports = {properties, jwkUrl}