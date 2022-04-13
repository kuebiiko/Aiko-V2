const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('@koenie06/discord.js-music')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Stops currently playing song'),
    async execute(interaction) {
        const isConnected = await music.isConnected({
            interaction: interaction,
        })
        if (!isConnected) {
            return interaction.reply({content: 'There are no songs playing currently.'})
        } else {
            music.pause({
                interaction: interaction,
            })
            interaction.reply('Music paused.')
        }
        
    }
}