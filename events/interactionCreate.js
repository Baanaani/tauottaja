const { Events } = require("discord.js")

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction) {
        if (interaction.isButton()){
            const button = interaction.customId;

            if (!button) {
                return interaction.reply({
                    content: ":x: | An error occurred",
                    ephemeral: true, });
            }

            await interaction.deferReply({ ephemeral: true });
            await button.execute(interaction);
        }

        if (interaction.isChatInputCommand()){
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) {
                console.log(`No command matching ${interaction.commandName} found`)
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.log(`Error executing ${interaction.commandName}`)
                console.log(error)
            }
        }
    },
};
