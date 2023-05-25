/**
 * @type {import('fastify').RouteShorthandOptions}
 */
const body_schema = {
    schema: {
  
      body: {
        type: "object",
        properties: {
          to: {
            type: "array",
            items: {
              type: "string"
            },
          },
          subject: {
            type: "string",
          },
          text: {
            type: "string",
          },
          attachments: {
            type: "array",
            items: {
              type: "object",
              properties: {
                filename: {
                  type: "string",
                },
                path: {
                  type: "string",
                },
              },
              required: ["filename", "path"],
            },
          },
        },
        required: ["to", "subject", "text"],
      },
    },
  };

module.exports = body_schema
