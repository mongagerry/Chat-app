const sanitizeHTML = require('sanitize-html')

function sanitizeUserInput(input) {
    return sanitizeHTML(input, {
        allowedTags: [], // No tags allowed
        allowedAttributes: {} // No attributes allowed
    });
}

module.exports = sanitizeUserInput