import {
    ApplicationCommandOption,
    ApplicationCommandTypes,
    Bot,
    CreateApplicationCommand,
    DiscordInteractionDataOption,
    Interaction,
    MakeRequired,
    Message,
} from "../discordeno.ts";
import BotEmitter from "./bot.ts";

export interface TextCommandOptions {
    name: string;
    description?: string;

    execute: (bot: Bot, message: Message) => string | void;
    options: {
        prefix: string;
    };
}

export interface SlashCommandOptions {
    name: string;
    description?: string;

    execute: (bot: Bot, interaction: Interaction, args: Record<string, DiscordInteractionDataOption>) => unknown;
    options?: ApplicationCommandOption[];
}

const slashCommands: Record<string, SlashCommandOptions> = {};
const textCommands: Record<string, TextCommandOptions> = {};

export function createSlashCommand(opts: SlashCommandOptions) {
    slashCommands[opts.name] = opts;
}

export function createTextCommand(opts: TextCommandOptions) {
    textCommands[opts.name] = opts;
}

export function initCommands() {
    //#region Slash Commands
    BotEmitter.on("ready", async (bot) => {
        const commands: MakeRequired<CreateApplicationCommand, "name">[] = [];
        for (const cmd in slashCommands) {
            const command = slashCommands[cmd];

            commands.push({
                name: command.name,
                description: command.description ?? "No description",
                type: ApplicationCommandTypes.ChatInput,
                options: command.options ?? undefined,
            });
        }
        await bot.helpers.upsertGlobalApplicationCommands(commands);
    });

    BotEmitter.on("interactionCreate", (bot, interaction) => {
        if (interaction.data?.name) {
            const command = slashCommands[interaction.data.name];
            const args: Record<string, DiscordInteractionDataOption> = {};

            for (const option of <DiscordInteractionDataOption[]> interaction.data?.options ?? []) {
                args[option.name] = option;
            }

            command.execute(bot, interaction, args);
        }
    });
    //#endregion

    //#region Text Commands
    BotEmitter.on("message", (bot, message) => {
        const commandsArr = Object.values(textCommands);
        commandsArr.forEach(async (cmd) => {
            if (message.content.replace(cmd.options.prefix, "").startsWith(cmd.name)) {
                const res = cmd.execute(bot, message);
                if (!res) {
                    return;
                } else {
                    await bot.helpers.sendMessage(message.channelId, {
                        content: res,
                        messageReference: {
                            ...message,
                            messageId: message.id,
                            failIfNotExists: false,
                        },
                    });
                }
            }
        });
    });
    //#endregion
}