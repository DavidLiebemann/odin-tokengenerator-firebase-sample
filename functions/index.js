/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const {defineString} = require("firebase-functions/params");
const {onInit} = require("firebase-functions");

const {TokenGenerator} = require("@4players/odin-tokens");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const accessKey = defineString("ACCESS_KEY");
let generator;

onInit(() => {
  const accessKeyString = accessKey.value();
  logger.info(`Using access key ${accessKeyString} to generate tokens.`, {
    structuredData: true,
  });
  generator = new TokenGenerator(accessKeyString);
});

/**
 * Generates an Odin Token
 * @param {string} roomId The room for which we are generating a token
 * @param {string} userId The user id for which we are generating a token
 * @return {string} Generated token
 */
function generateToken(roomId, userId) {
  return generator.createToken(roomId, userId);
}

exports.generateToken = onRequest(
    {cors: true, region: "europe-west3"},
    (request, response) => {
      const roomId = request.body.roomId;
      const userId = request.body.userId;

      const token = generateToken(roomId, userId);
      logger.info(`Room: ${roomId}, User: ${userId}, Returning token ${token}`,
          {
            structuredData: true,
          });
      response.status(200).send({token});
    },
);

