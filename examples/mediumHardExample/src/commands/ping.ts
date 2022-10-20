import { sendInteractionResponse, SlashCommandOptions, snowflakeToTimestamp } from "@wackford/mod.ts";

export default {
    name: "ping",
    description: "how much time does it take me to respond",
    execute: async (bot, interaction) => {
        const ping = Date.now() - snowflakeToTimestamp(interaction.id);
        await sendInteractionResponse(bot, interaction, {
            content: `🏓 Pong! ${ping}ms`,
        });
    },
} as SlashCommandOptions;
