import { sendInteractionResponse } from "./src/helpers.ts";
import { Intents } from "./discordeno.ts";
import * as commands from "./src/commands.ts";
import { initCommands } from "./src/commands.ts";
import BotEmitter from "./src/bot.ts";

commands.createTextCommand({
    name: "hello",
    description: "does some helloing",
    execute: (_, __) => "Hello, world!",
    options: {
        prefix: "!",
    },
});

commands.createSlashCommand({
    name: "hello",
    description: "does some helloing",
    execute: async (bot, interaction) => {
        await sendInteractionResponse(bot, interaction, {
            content: "Hello, World!",
        });
    },
});

initCommands(); // needs to be ran *before* we call start so event handlers can be registered

await BotEmitter.emit("start", {
    token: Deno.env.get("TOKEN") ?? (() => {
        console.log("Test bot's token is expected to go in $TOKEN");
        Deno.exit(1);
    })(),
    intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
});
