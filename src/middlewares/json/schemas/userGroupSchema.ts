export const userGroupSchema = {
    title: "group schema.",
    description: "needs only a text (group name)",
    type: "object",
    properties: {
        "text": {
            "description": "group name",
            "type": "string",
            "format": "regex",
            "pattern": "^.{1,255}$"
        },
        "description": {
            "description": "group description",
            "type": "string",
            "format": "regex",
            "pattern": "^.{0,255}$"
        }
    },
    required: ["text"]
}
