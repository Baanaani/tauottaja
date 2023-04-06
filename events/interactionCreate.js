const { useQueue } = require('discord-player')
const { Events } = require("discord.js")

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isButton()){
            const queue = useQueue(interaction.guild.id);

            if (!queue || !queue.isPlaying()) 
                return interaction.reply({
                content: `botti ei ole soittamassa`,
                ephemeral: true,
                components: [] });
        
                else {
                    switch (interaction.customId) {
                        case "1":
                            if(queue.node.setPaused() === false){
                            queue.node.pause();
                            await interaction.deferUpdate();
                            } else {
                            queue.node.resume();
                            await interaction.deferUpdate();
                            }
                            break;
                        case "2":
                            queue.node.skip();
                            await interaction.deferUpdate();
                            break;
                        case "3":
                            queue.node.stop();
                            await interaction.deferUpdate();
                            break;
                        default:
                            break;
                    }}} 
        
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
        }}};