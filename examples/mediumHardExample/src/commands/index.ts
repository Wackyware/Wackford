import { createSlashCommand, sendInteractionResponse } from "@wackford/mod.ts";

const dirname = new URL(".", import.meta.url).pathname;

const helpMessage: string[] = [
    "/help - helps your idiot ass", // we do this manually because fuck you too
];

export default async function initLocalCommands() {
    for await (const file of Deno.readDir(dirname)) {
        if (file.name !== "index.ts") {
            const mod = (await import(dirname + file.name)).default;
            helpMessage.push(`/${mod.name} - ${mod.description}`);
            createSlashCommand(mod);
        }
    }
    createSlashCommand({
        name: "help",
        description: "helps your idiot ass",
        execute: async (bot, interaction) => {
            await sendInteractionResponse(bot, interaction, {
                content: helpMessage.sort((a, b) => a.localeCompare(b)).join("\n"),
                private: true,
            });
        },
    });
}
