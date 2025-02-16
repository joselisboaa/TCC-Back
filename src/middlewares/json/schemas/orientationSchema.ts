export const orientationSchema = {
    title: "orientation schema.",
    description: "needs a text, a numeric value and answer's foreign key",
    type: "object",
    properties: {
        "text": {
            "description": "orientation description text",
            "type": "string",
            "format": "regex",
            "pattern": "^.{1,255}$"
        },
        "value": {
            "description": "orientation value to calculate the position against the thresholds.",
            "type": "integer",
        },
        "answer_id": {
            "description": "answer's foreign key",
            "type": "integer",
        }
    },
    required: ["text", "value", "answer_id"]
}
