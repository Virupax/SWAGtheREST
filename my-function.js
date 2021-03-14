exports.handler = async (event,keyword) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify('Virupax Gouda says '+ event.queryStringParameters.keyword),
    };
    return response;
};