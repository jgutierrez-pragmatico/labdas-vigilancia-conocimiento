export const successResponse = <T>(body: T) => {
  return {
    statusCode: 200,
    body: JSON.stringify(body),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true,
    },
  };
};
