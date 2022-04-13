const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('@koenie06/discord.js-music')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('Stops currently playing song'),
    async execute(interaction) {
        const isConnected = await music.isConnected({
            interaction: interaction,
        })
        if (!isConnected) {
            return interaction.reply({content: 'not connected'})
        } else {
            music.stop({
                interaction: interaction,
            })
            interaction.reply('Music stopped.')
        }
        
    }
}