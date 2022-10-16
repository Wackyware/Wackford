import {
    CreateMessage,
    Interaction,
    InteractionResponse,
    InteractionResponseTypes,
    Message,
    sendMessage,
} from "../discordeno.ts";
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

export async function replyToMessage(bot: Bot, message: Message, opts: CreateMessage) {
    if (opts.messageReference) {
        return await sendMessage(bot, message.channelId, opts);
    }
    await sendMessage(bot, message.channelId, {
        ...opts,
        messageReference: {
            channelId: message.channelId,
            guildId: message.guildId,
            messageId: message.id,
            failIfNotExists: false,
        },
    });
}
