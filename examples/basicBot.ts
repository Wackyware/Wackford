import * as wackford from "../mod.ts";
import { Intents } from "../discordeno.ts";

wackford.createSlashCommand({
    name: "hello",
    description: "hey all scott here",
    execute: async (bot, interaction): Promise<void> => {
        await wackford.sendInteractionResponse(bot, interaction, {
            content: "Hello, world!",
        });
    },
});

wackford.createTextCommand({
    name: "hello",
    description: "hey all scott here",
    options: {
        prefix: "!",
    },
    execute: (bot, message) => {
        return "Hello, world!";
    },
});

wackford.initCommands();

await wackford.BotEmitter.emit("start", {
    token: Deno.env.get("TOKEN") ?? (() => {
        throw new Error("No token?");
    })(),
    intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
});
