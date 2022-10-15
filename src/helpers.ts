import { Interaction, InteractionResponse, InteractionResponseTypes } from "../discordeno.ts";
import { Bot } from "https://deno.land/x/discordeno@17.0.0/bot.ts";

export async function getBotUser(bot: Bot) {
    return await bot.helpers.getUser(bot.id);
}

export function snowflakeToTimestamp(id: bigint) {
    return Number(id / 4194304n + 1420070400000n);
}

interface Options extends InteractionResponse {
    data: InteractionResponse["data"] & {
        private?: boolean;
    };
}

export async function sendInteractionResponse(bot: Bot, interaction: Interaction, data: Options["data"]) {
    if (data.private) data.flags = 64;

    return await bot.helpers.sendInteractionResponse(
        interaction.id,
        interaction.token,
        {
            type: InteractionResponseTypes.ChannelMessageWithSource,
            data,
        },
    );
}
