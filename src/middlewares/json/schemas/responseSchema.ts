export const responseSchema = {
    title: "response schema.",
    description: "Needs every attribute.",
    type: "object",
    properties: {
        "answers": {
            "description": "Array of answers objects.",
            "type": "array",
            "items": {
                "type": "object"
            },
            "minItems": 1
        },
        "user_id": {
            "description": "User's foreign key.",
            "type": "integer"
        },
        "other_answers": {
            "description": "Object with answers objects that contains a new orientation written by the user.",
            "type": "object"
        }
    },
    required: ["answers", "user_id"]
}
