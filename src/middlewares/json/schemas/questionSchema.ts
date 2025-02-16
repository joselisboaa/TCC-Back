export const questionSchema = {
    title: "question schema.",
    description: "needs only a text and a group's foreign key",
    type: "object",
    properties: {
        "text": {
            "description": "question description text",
            "type": "string",
            "format": "regex",
            "pattern": "^.{1,255}$"
        },
        "user_group_id": {
            "description": "group's foreign key",
            "type": "integer",
        }
    },
    required: ["text", "user_group_id"]
}
