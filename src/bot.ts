import EventEmitter from "https://deno.land/x/eventemitter@1.2.4/mod.ts";
import { Bot, createBot, CreateBotOptions, DISCORDENO_VERSION, startBot } from "../discordeno.ts";
import { getBotUser } from "./helpers.ts";
import { VERSION } from "../mod.ts";

let bot: Bot;

type Plugin = (bot: Bot) => Bot;

const BotEmitter = new EventEmitter<{
    start(bot: CreateBotOptions, plugins?: Plugin[]): void;
    ready(bot: Bot): void;
    message: typeof bot.events.messageCreate;
    interactionCreate: typeof bot.events.interactionCreate;
}>();

// listen for startup event
BotEmitter.on("start", async (opts: CreateBotOptions, plugins?: Plugin[]) => {
    bot = createBot(opts);

    //TODO: allow for plugin options without `(bot) => whateverPlugin(bot, opts)` jank
    if (plugins) {
        plugins.forEach((plug) => {
            bot = plug(bot);
        });
    }

    // setup emitters
    bot.events.ready = (bot) => {
        BotEmitter.emitSync("ready", bot);
    };

    bot.events.messageCreate = (bot, message) => {
        BotEmitter.emitSync("message", bot, message);
    };

    bot.events.interactionCreate = (bot, interaction) => {
        BotEmitter.emitSync("interactionCreate", bot, interaction);
    };

    await startBot(bot);
});

BotEmitter.on("ready", async (bot) => {
    const user = await getBotUser(bot);
    // the best part
    const banner =
        `\x1b[31m__        __         _     __               _ \x1b[0m | \x1b[1;31mWackford\x1b[0m v${VERSION}
\x1b[31m\\ \\      / /_ _  ___| | __/ _| ___  _ __ __| |\x1b[0m | Logged in as ${user.username}#${user.discriminator}
 \x1b[31m\\ \\ /\\ / / _\` |/ __| |/ / |_ / _ \\| '__/ _\` |\x1b[0m |
  \x1b[31m\\ V  V / (_| | (__|   <|  _| (_) | | | (_| |\x1b[0m | Discordeno v${DISCORDENO_VERSION}
   \x1b[31m\\_/\\_/ \\__,_|\\___|_|\\_\\_|  \\___/|_|  \\__,_|\x1b[0m | Deno v${Deno.version.deno}\n`;

    console.log(banner);
});

export { BotEmitter };

export default BotEmitter;
