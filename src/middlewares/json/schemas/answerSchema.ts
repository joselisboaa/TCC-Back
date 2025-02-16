export const answerSchema = {
    title: "answer schema.",
    description: "needs only a text and a question's foreign key",
    type: "object",
    properties: {
        "text": {
            "description": "answer description text",
            "type": "string",
            "format": "regex",
            "pattern": "^.{1,255}$"
        },
        "other": {
            "description": "true if it's a 'other answer' with a auxiliary text",
            "type": "boolean",
        },
        "question_id": {
            "description": "question's foreign key",
            "type": "integer",
        }
    },
    required: ["text", "other", "question_id"]
}
