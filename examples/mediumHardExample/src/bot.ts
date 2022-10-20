import { BotEmitter, initCommands } from "@wackford/mod.ts";
import { Intents } from "@wackford/discordeno.ts";
import initLocalCommands from "./commands/index.ts";
import initOnMessage from "./events/onMessage.ts";

export class GoofyAhhException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "GoofyAhhException";
    }
}

initOnMessage();
initLocalCommands();
initCommands();

await BotEmitter.emit("start", {
    token: Deno.env.get("TOKEN") ?? (() => {
        throw new GoofyAhhException("No token?");
    })(),
    intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent, 
});
