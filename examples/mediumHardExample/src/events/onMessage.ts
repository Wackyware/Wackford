import { BotEmitter, replyToMessage } from "@wackford/mod.ts";

export default function init() {
    BotEmitter.on("message", async (bot, message) => {
        if (message.content.includes("wackford")) {
            replyToMessage(bot, message, {
                content: "Hello, world!"
            })
        }
    });
}
