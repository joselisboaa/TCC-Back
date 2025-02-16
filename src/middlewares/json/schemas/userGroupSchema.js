"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGroupSchema = void 0;
exports.userGroupSchema = {
    title: "group schema.",
    description: "needs only a text (group name)",
    type: "object",
    properties: {
        "text": {
            "description": "group name",
            "type": "string",
            "format": "regex",
            "pattern": "^.{1,255}$"
        }
    },
    required: ["text"]
};
