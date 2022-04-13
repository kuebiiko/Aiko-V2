const { SlashCommandBuilder } = require('@discordjs/builders');
const music = require('@koenie06/discord.js-music')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips current song.'),       
    async execute(interaction) {
        const isConnected = await music.isConnected({
            interaction: interaction,
        })
        if (!isConnected) {
            return interaction.reply({content: 'There are no songs playing currently.'})
        } else {
            music.skip({
                interaction: interaction,
            })
            interaction.reply('Music stopped.')
        }
        
    }
}